const at = require('lodash.at')
const shapes = require('./content/_data/shapes.json')
const speakers = require('./content/_data/2020/speakers.json')
const { Temporal } = require('proposal-temporal')

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
          <image href="${ avatar }" x=20 y=24 width=325 height=325 />
          `
        : `
          <rect x=1 y=1 width=358 height=358 fill="url(#speaker-gradient)" />
          `
      }
      <rect width=360 height=360 fill="white" mask="url(#speaker-mask-${ speaker.code })" />
  </svg>
  `
}

function onlyTime (dateTimeStr) {
  return Temporal.Time.from(dateTimeStr).toString()
}

function militaryTime (dateTimeStr) {
  const dt = new Date(dateTimeStr)
  const iso = dt.toISOString()
  return iso.replace(/-|:/g, '').replace(/.\d+Z/, 'Z')
}

function personlist (person_list) {
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

  return list(
    person_list,
    person => person.name,
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
  const markdownItAttrs = require('markdown-it-attrs')

  const mdIt = markdownIt.use(markdownItAttrs)
  eleventyConfig.setLibrary('md', mdIt)
  eleventyConfig.addFilter('md', input => markdownIt.render(input))
  eleventyConfig.addFilter('sort', sort)
  eleventyConfig.addFilter('forIndex', forIndex)
  eleventyConfig.addFilter('onlytime', onlyTime)
  eleventyConfig.addFilter('militarytime', militaryTime)
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
