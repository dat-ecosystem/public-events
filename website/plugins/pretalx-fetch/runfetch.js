const fs = require('fs').promises
const flatten = require('lodash.flatten')
const fetch = require('node-fetch')
const chalk = require('chalk')
const crypto = require('crypto')
const path = require('path')
const { Encoder } = require('base32.js')

function hash (data) {
  const hash = crypto.createHash('md5')
  hash.update(data)
  const encoder = new Encoder({ type: 'crockford', lc: true })
  return encoder.write(hash.digest()).finalize()
}

async function fixIcs ({ domain, event, prefix }, targetDomain) {
  const icsPath = `assets/${prefix}-schedule.ics`
  let ics = await fs.readFile(icsPath, 'utf-8')
  ics = ics.replace(`PRODID:-//pretalx//${domain}//`, `PRODID:-${targetDomain}`)
  // TODO: sanitize regexp input
  ics = ics.replace(new RegExp(`https://${domain}/${event}/talk/`, 'ig'), `https://${targetDomain}/${prefix}/talk/`)
  ics = ics.replace(new RegExp(domain, 'ig'), targetDomain)
  await fs.writeFile(icsPath, ics)
}

async function processJSON (prefix, file, handler) {
  const jsonPath = `${process.cwd()}/content/_data/${prefix}/${file}`
  let json
  try {
    const raw = await fs.readFile(jsonPath, 'utf-8')
    json = JSON.parse(raw)
  } catch (err) {
    err.message += `\n while loading ${jsonPath}`
    throw err
  }
  json = await handler(json)
  await fs.writeFile(jsonPath, JSON.stringify(json, null, 2))
}

async function fetchCached (cache, localPath, fallback, ttl) {
  if (await cache.has(localPath)) {
    console.log(`Restoring ${chalk.green(localPath)}`)
    await cache.restore(localPath)
  } else {
    const data = await fallback()
    await fs.writeFile(localPath, data)
    await cache.save(localPath, { ttl })
  }
}

async function fetchFile (cache, localPath, url, ttl) {
  return fetchCached(
    cache,
    localPath,
    () => {
      console.log(`Fetching file ${chalk.green(localPath)} from ${chalk.green(url)}`)
      return fetch(url)
        .then(res => res.arrayBuffer())
        .then(buffer => new Uint8Array(buffer))
    },
    ttl
  )
}

async function _fetchImage (cache, imageUrl, ttl) {
  const urlHash = hash(imageUrl)
  const localPath = `assets/pretalx/${urlHash}${path.extname(imageUrl)}`
  await fetchFile(cache, localPath, imageUrl, ttl)
  return localPath
}

const _memory = new Map()
async function fetchImage (cache, imageUrl, ttl) {
  let data = _memory.get(imageUrl)
  if (data === undefined) {
    data = _fetchImage(cache, imageUrl, ttl)
    _memory.set(imageUrl, data)
  }
  return data
}

async function downloadImages ({ prefix, domain }, cache, ttl) {
  const replaceImage = async imageUrl => {
    if (!imageUrl) {
      return imageUrl
    }
    if (imageUrl.charAt(0) === '/') {
      imageUrl = `https://${domain}${imageUrl}`
    }
    return `/${await fetchImage(cache, imageUrl, ttl)}`
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

module.exports = async function ({ conferences, ttl, targetDomain, cache }) {
  // TODO: test prefix: may not be javascript value like: "null, undefined, 15, true, ..."
  const entries = flatten(conferences.map(({ prefix, event, domain }) => {
    const apiUrl = `https://${domain}/api/events/${event}`
    const scheduleUrl = `https://${domain}/${event}/schedule/export/schedule`
    return [
      { name: `content/_data/${prefix}/talks.json`, url: `${apiUrl}/talks/?format=json`, api: true },
      { name: `content/_data/${prefix}/speakers.json`, url: `${apiUrl}/speakers/?format=json`, api: true },
      { name: `content/_data/${prefix}/rooms.json`, url: `${apiUrl}/rooms/?format=json`, api: true },
      { name: `content/_data/${prefix}/schedule.json`, url: `${scheduleUrl}.json` },
      { name: `assets/${prefix}-schedule.ics`, url: `${scheduleUrl}.ics` }
    ]
  }))

  for (const entry of entries) {
    if (entry.api) {
      await fetchCached(
        cache,
        entry.name,
        async () => {
          let next = entry.url
          let result = []
          let no = 1
          while (next) {
            console.log(`Fetching page[${no}] for ${chalk.green(entry.name)} from ${chalk.green(next)}`)
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
      await fetchFile(cache, entry.name, entry.url, ttl)
    }
  }

  for (const conference of conferences) {
    await fixIcs(conference, targetDomain)
    await downloadImages(conference, cache, ttl)
  }
}
