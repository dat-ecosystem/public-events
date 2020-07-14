const at = require('lodash.at')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('assets')

  const markdownIt = require("markdown-it")({
    html: true,
    breaks: true,
    linkify: true
  })
  const markdownItAttrs = require("markdown-it-attrs")

  const mdIt = markdownIt.use(markdownItAttrs)
  eleventyConfig.setLibrary("md", mdIt)
  eleventyConfig.addFilter("md", input => markdownIt.render(input))
  eleventyConfig.addFilter("find", (input, path, expected) => {
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
