const at = require('lodash.at')
const shapes = require('./content/_data/shapes.json')
const speakers = require('./content/_data/2020/speakers.json')
const { Temporal } = require('proposal-temporal')
const domain = require('./content/_data/domain.js')()

function sort (input, property, desc) {
  if (!Array.isArray(input)) {
    input = Array.from(input)
  }
  if (!property) {
    input = input.sort()
  } else {
    input = input.sort((a, b) => {
      const aVal = a[property]
      const bVal = b[property]
      if (aVal > bVal) {
        return 1
      }
      if (aVal < bVal) {
        return -1
      }
      return 0
    })
  }
  if (desc) {
    input = input.reverse()
  }
  return input
}

function forIndex (input, index) {
  if (!Array.isArray(input)) {
    input = Array.from(input)
  }
  let res = (index - 1) % input.length
  return input[res]
}

function speakerImage (speaker) {
  const index = speakers.findIndex(otherSpeaker => speaker.code === otherSpeaker.code)
  const avatar = speakers[index].avatar
  return `<svg class="speaker-image" viewBox="0 0 360 360">
      <defs>
          <linearGradient id="speaker-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" style="stop-color: #4C5869;"/>
              <stop offset="100%" style="stop-color: #61A76F;"/>
          </linearGradient>
      </defs>
      <mask id="speaker-mask-${ speaker.code }">
          <rect width="360" height="360" fill="white" />
          <path d="${ forIndex(shapes, index + 1 ) }" fill="black" />
      </mask>
      ${
        avatar
        ? `
          <rect x=1 y=1 width=358 height=358 fill="#efefef" />
          <image href="${ domain.image }${ avatar }" x=20 y=24 width=325 height=325 />
          `
        : `
          <rect x=1 y=1 width=358 height=358 fill="url(#speaker-gradient)" />
          `
      }
      <rect width=360 height=360 fill="white" mask="url(#speaker-mask-${ speaker.code })" />
  </svg>
  `
}

const hourFormat = new Intl.DateTimeFormat('en', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
})

const _dayHourFormat = new Intl.DateTimeFormat('en', {
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
})

const _dayOnlyFormat = new Intl.DateTimeFormat('en-SE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour12: false
})


function event (entry, dayRange) {
  const startTime = Temporal.Absolute.from(entry.slot.start)
  const endTime = Temporal.Absolute.from(entry.slot.end) 
  const duration = endTime.difference(startTime)
  const durationMinutes = duration.seconds / 60
  const durationP = (durationMinutes / 0.6) | 0
  let style = `height: ${durationP}%; min-height: ${durationP}%;`
  if (dayRange) {
    const diff = startTime.difference(dayRange.start)
    const diffMinutes = diff.seconds / 60
    const diffP = (diffMinutes / 0.6) | 0
    style = `${style}top: ${diffP}%;`
  }
  return `
    <div class="cal-entry cal-entry-${entry.code}"
      style="${style}">
      <div class="cal-entry-content">
        <span class="cal-entry-time">${hourFormat.format(startTime.toDateTime('Europe/Copenhagen'))}-${hourFormat.format(endTime.toDateTime('Europe/Copenhagen'))}</span>
        <span class="cal-entry-text">
        <a class="cal-entry-talk cal-link-talk" href="/2020/talk/${entry.code}" title="${entry.abstract}">${entry.title}</a>
        <span class="cal-entry-by">by ${personlist(entry.speakers, true)}
        </span>
        </span>
      </div>
    </div>
  `
}

function onlyTime (dateTimeStr) {
  return Temporal.Time.from(dateTimeStr).toString()
}

function dayFormat (dateTimeStr) {
  const date = Temporal.DateTime.from(dateTimeStr)
  return _dayHourFormat.format(date)
}
function to_date (dateTimeStr) {
  const date = Temporal.DateTime.from(dateTimeStr)
  return _dayOnlyFormat.format(date)
}

function duration_to_human (durationStr) {
  let [_, h, m] = durationStr.match('([0-9]+):([0-9]+)')
  h = parseInt(h)
  m = parseInt(m)
  let res = ''
  if (!!h) {
    res = `${h} hour${h != 1 ? 's' : ''}`
  }
  if (!!m) {
    if (res !== '') {
      res += ' and '
    }
    res = `${m} minute${m != 1 ? 's' : ''}`
  }
  return res
}

const secondDay = '2020-07-30T23:30:00+02:00'

function eventStartDateTime (talks) {
  let earliest = talks[0].slot.start
  talks.forEach(talk => {
    if (earliest > talk.slot.start && talk.slot.start > secondDay)
      earliest = talk.slot.start
  })
  return earliest
}

function eventFinishDateTime (talks) {
  let latest = talks[0].slot.end
  talks.forEach(talk => {
    if (latest < talk.slot.end)
      latest = talk.slot.end
  })
  return latest
}

function militaryTime (dateTimeStr) {
  const dt = new Date(dateTimeStr)
  const iso = dt.toISOString()
  return iso.replace(/-|:/g, '').replace(/.\d+Z/, 'Z')
}

function talksForSpeakerCode (talks, speakerCode) {
  return talks.filter(e => e.speakers.filter(s => s.code == speakerCode).length != 0)
}

function speakerSort (speakers) {
  speakers.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
  return speakers
}

function sortBySlotStart (talks) {
  return talks.sort((a, b) => {
    if (a.slot.start < b.slot.start) {
      return -1
    } else if (a.slot.start > b.slot.start) {
      return 1
    } else {
      return 0
    }
  })
}

function list (iterable, mapper, sep='', lastSep) {
  if (lastSep === undefined) {
    lastSep = sep
  }
  const entries = Array.from(iterable).map(mapper)
  if (entries.length === 0) {
    return ''
  }
  if (entries.length === 1) {
    return entries[0]
  }
  return `${entries.slice(0, entries.length - 1).join(sep)}${lastSep}${entries[entries.length-1]}`
}

function personlist (person_list, link=false) {
  return list(
    person_list,
    person => {
      const name = person.public_name || person.name
      if (link) {
        return `<a class="cal-entry-person cal-link-person" href="/2020/person/${person.code}">${name}</a>`
      }
      return name
    },
    ', ',
    ' and '
  )
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('assets')

  const markdownIt = require('markdown-it')({
    html: true,
    breaks: true,
    linkify: true
  })
    .use(require('markdown-it-attrs'))
    .use(require('markdown-it-named-headings'))
    .use(require('markdown-it-emoji/light'))

  eleventyConfig.setLibrary('md', markdownIt)
  eleventyConfig.addFilter('md', input => markdownIt.render(input))
  eleventyConfig.addFilter('sort', sort)
  eleventyConfig.addFilter('forIndex', forIndex)
  eleventyConfig.addFilter('onlytime', onlyTime)
  eleventyConfig.addFilter('dayFormat', dayFormat)
  eleventyConfig.addFilter('talksForSpeakerCode', talksForSpeakerCode)
  eleventyConfig.addFilter('speakerSort', speakerSort)
  eleventyConfig.addFilter('sortBySlotStart', sortBySlotStart)
  eleventyConfig.addFilter('duration_to_human', duration_to_human)
  eleventyConfig.addFilter('to_date', to_date)
  eleventyConfig.addFilter('eventStartDateTime', eventStartDateTime)
  eleventyConfig.addFilter('eventFinishDateTime', eventFinishDateTime)
  eleventyConfig.addFilter('militarytime', militaryTime)
  eleventyConfig.addFilter('list', list)
  eleventyConfig.addFilter('event', event)
  eleventyConfig.addFilter('personlist', personlist)
  eleventyConfig.addFilter('speakerImage', speakerImage.bind(this))
  eleventyConfig.addFilter('find', (input, path, expected) => {
    for (const entry of input) {
      if (at(entry, [path])[0] == expected) return entry
    }
  })

  return {
    dir: {
      input: 'content',
      output: 'dist',
      includes: '../includes'
    }
  }
}
