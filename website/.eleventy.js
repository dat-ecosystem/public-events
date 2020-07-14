const at = require('lodash.at')

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
  console.log({ index, res, len: input.length })
  return input[res]
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
  eleventyConfig.addFilter('find', (input, path, expected) => {
    for (entry of input) {
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
