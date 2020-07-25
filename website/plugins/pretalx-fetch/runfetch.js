const fs = require('fs').promises
const flatten = require('lodash.flatten')
const chalk = require('chalk')
const path = require('path')
const hash = require('./hash')
const getCacheManager = require('./getCacheManager')
const imtype = require('imtype')
const { Temporal } = require('proposal-temporal')

async function fixIcs (base, { domain, event, prefix }, targetDomain) {
  const icsPath = `${base}/assets/${prefix}-schedule.ics`
  let ics = await fs.readFile(icsPath, 'utf-8')
  ics = ics.replace(`PRODID:-//pretalx//${domain}//`, `PRODID:-${targetDomain}`)
  // TODO: sanitize regexp input
  ics = ics.replace(new RegExp(`https://${domain}/${event}/talk/`, 'ig'), `https://${targetDomain}/${prefix}/talk/`)
  ics = ics.replace(new RegExp(domain, 'ig'), targetDomain)
  await fs.writeFile(icsPath, ics)
}

module.exports = async function (base, { conferences, ttl, targetDomain, personPriority }) {
  const _imageMemory = new Map()
  const cacheManager = getCacheManager(base)
  console.log(`Cachedir ${chalk.green(cacheManager)}`)
  const fetch = require('make-fetch-happen').defaults({
    cacheManager
  })

  // TODO: test prefix: may not be javascript value like: "null, undefined, 15, true, ..."
  const entries = flatten(conferences.map(({ prefix, event, domain }) => {
    const apiUrl = `https://${domain}/api/events/${event}`
    const scheduleUrl = `https://${domain}/${event}/schedule/export/schedule`
    return [
      { local: `${base}/content/_data/${prefix}/event.json`, url: `${apiUrl}` },
      { local: `${base}/content/_data/${prefix}/talks.json`, url: `${apiUrl}/talks/?format=json`, paging: true },
      { local: `${base}/content/_data/${prefix}/speakers.json`, url: `${apiUrl}/speakers/?format=json`, paging: true, process: (speakers) => {
        return speakers.filter(speaerk)
      } },
      { local: `${base}/content/_data/${prefix}/rooms.json`, url: `${apiUrl}/rooms/?format=json`, paging: true },
      { local: `${base}/content/_data/${prefix}/schedule.json`, url: `${scheduleUrl}.json` },
      { local: `${base}/assets/${prefix}-schedule.ics`, url: `${scheduleUrl}.ics` }
    ]
  }))

  for (const entry of entries) {
    if (entry.paging) {
      await fetchAndSave(
        entry.local,
        async () => {
          let next = entry.url
          let result = []
          let no = 1
          while (next) {
            console.log(`Fetching page[${no}] for ${chalk.green(entry.local)} from ${chalk.green(next)}`)
            const data = await (await fetch(next)).json()
            result = result.concat(data.results)
            next = data.next
            no++
          }
          return JSON.stringify(result)
        },
        ttl
      )
    } else {
      await fetchFile(entry.local, entry.url)
    }
  }

  for (const conference of conferences) {
    await removeSpeakersWithoutTalks(conference)
    await fixIcs(base, conference, targetDomain)
    await downloadImages(conference)
    await adjustSpeakerOrder(conference, personPriority)
    await writeSimpleTalks(conference, targetDomain)
  }
  return

  function byLine (speakers) {
    if (speakers.length === 0) {
      return '<nobody>'
    }
    if (speakers.length === 1) {
      return speakers[0].name
    }
    let last = speakers.length - 1
    let result = speakers.slice(0, last).map(speaker => speaker.name).join(', ')
    return result + ' and ' + speakers[last].name
  }

  async function adjustSpeakerOrder ({ prefix }, personPriority) {
    const priorityMap = personPriority.reduce(
      (priorityMap, entry) => {
        priorityMap[entry.person] = entry.priority
        return priorityMap
      },
      {}
    )
    const priority = speaker =>
      priorityMap[speaker.code] || 0

    const speakerSort = (speakerA, speakerB) =>
      priority(speakerB) - priority(speakerA)

    await processJSON(prefix, 'schedule.json', schedule => {
      for (const day of schedule.schedule.conference.days) {
        for (const room of Object.values(day.rooms)) {
          for (const talk of room) {
            console.log({ talk })
            talk.persons = talk.persons.sort(speakerSort)
          }
        }
      }
      return schedule
    })
    await processJSON(prefix, 'talks.json', talks => {
      for (const talk of talks) {
        talk.speakers = talk.speakers.sort(speakerSort)
      }
      return talks
    })
  }

  async function writeSimpleTalks ({ prefix }, targetDomain) {
    const { json: { timezone } } = await loadJSON(prefix, 'event.json')
    const { json: talks } = await loadJSON(prefix, 'talks.json')
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
      hour12: false,
      timeZoneName: 'short'
    })
    const simpleTalks = talks.map(talk => {
      return {
        code: talk.code,
        title: talk.title,
        byLine: `by ${byLine(talk.speakers)}`,
        url: `https://${targetDomain}/${prefix}/talk/${talk.code}`,
        time: `${formatter.format(Temporal.DateTime.from(talk.slot.start))} (${timezone})`
      }
    })
    await fs.writeFile(`${base}/content/_data/${prefix}/talks_simple.json`, JSON.stringify(simpleTalks, null, 2))
  }
  
  async function removeSpeakersWithoutTalks ({ prefix }) {
    const { json: talks } = await loadJSON(prefix, 'talks.json')
    await processJSON(prefix, 'speakers.json', (speakers) => {
      return speakers.filter(speaker => {
        const { submissions } = speaker
        const found = talks.find(talk => submissions.includes(talk.code))
        return found !== null && found !== undefined
      })
    })
  }

  async function loadJSON (prefix, file) {
    const jsonPath = `${base}/content/_data/${prefix}/${file}`
    try {
      const raw = await fs.readFile(jsonPath, 'utf-8')
      return {
        jsonPath,
        json: JSON.parse(raw)
      }
    } catch (err) {
      throw new Error(`${err.message}\n while loading ${jsonPath}`)
    }
  }

  async function processJSON (prefix, file, handler) {
    let { jsonPath, json } = await loadJSON(prefix, file)
    json = await handler(json)
    await fs.writeFile(jsonPath, JSON.stringify(json, null, 2))
  }

  async function fetchAndSave (localPath, fallback) {
    const data = await fallback()
    await fs.writeFile(localPath, data)
  }

  async function fetchFile (localPath, url) {
    let contentType
    await fetchAndSave(
      localPath,
      () => {
        console.log(`Fetching file ${chalk.green(localPath)} from ${chalk.green(url)}`)
        return fetch(url)
          .then(res => {
            contentType = res.headers.get('content-type')
            return res.arrayBuffer()
          })
          .then(buffer => new Uint8Array(buffer))
      }
    )
    return contentType
  }

  async function _fetchImage (imageUrl) {
    const urlHash = hash(imageUrl)
    let ext = path.extname(imageUrl).toLowerCase()
    if (ext === '.jpeg') {
      ext = '.jpg'
    }
    let localPath = `assets/pretalx/${urlHash}${ext}`
    const contentType = await fetchFile(`${base}/${localPath}`, imageUrl)
    if (/image\/jpe?g/i.test(contentType)) {
      if (ext !== '.jpg') {
        return await moveFile('jpg')
      }
    }
    if (/image\/gif/i.test(contentType)) {
      if (ext !== '.gif') {
        return await moveFile('gif')
      }
    }
    if (/image\/png/i.test(contentType)) {
      if (ext !== '.png') {
        return await moveFile('png')
      }
    }
    if (/^\s*$/.test(ext)) {
      const buf = await fs.readFile(`${base}/${localPath}`)
      if (imtype.isGIF(buf)) {
        ext = 'gif'
      } else if (imtype.isJPG(buf)) {
        ext = 'jpg'
      } else if (imtype.isPNG(buf)) {
        ext = 'png'
      } else {
        return localPath
      }

      return await moveFile(ext)
    }
    return localPath

    async function moveFile (ext) {
      const newLocalPath = `assets/pretalx/${urlHash}.${ext}`
      console.log(`Rename ${localPath} → ${newLocalPath}`)
      await fs.rename(`${base}/${localPath}`, `${base}/${newLocalPath}`)
      return newLocalPath
    }
  }

  async function fetchImage (imageUrl) {
    let data = _imageMemory.get(imageUrl)
    if (data === undefined) {
      data = _fetchImage(imageUrl)
      _imageMemory.set(imageUrl, data)
    }
    return data
  }

  async function downloadImages ({ prefix, domain }) {
    const replaceImage = async imageUrl => {
      if (!imageUrl) {
        return imageUrl
      }
      if (/^https:\/\/(www\.)?gravatar\.com/.test(imageUrl)) {
        imageUrl = `${imageUrl}?s=512`
      }
      if (imageUrl.charAt(0) === '/') {
        imageUrl = `https://${domain}${imageUrl}`
      }
      return `/${await fetchImage(imageUrl)}`
    }
    await processJSON(prefix, 'schedule.json', async json => {
      for (const day of json.schedule.conference.days) {
        for (const room of Object.values(day.rooms)) {
          for (const slot of room) {
            slot.logo = await replaceImage(slot.logo)
          }
        }
      }
      return json
    })
    await processJSON(prefix, 'speakers.json', async speakers => {
      for (const speaker of speakers) {
        speaker.avatar = await replaceImage(speaker.avatar)
      }
      return speakers
    })
    await processJSON(prefix, 'talks.json', async talks => {
      for (const talk of talks) {
        for (const speaker of talk.speakers) {
          speaker.avatar = await replaceImage(speaker.avatar)
        }
        talk.image = await replaceImage(talk.image)
        if (talk.resources) {
          for (const resource of talk.resources) {
            resource.resource = await replaceImage(resource.resource)
          }
        }
      }
      return talks
    })
  }
}
