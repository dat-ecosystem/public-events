module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('assets')

  const markdownIt = require("markdown-it")({
    html: true,
    breaks: true,
    linkify: true
  })
  const markdownItAttrs = require("markdown-it-attrs")

  eleventyConfig.setLibrary("md", markdownIt.use(markdownItAttrs))

  return {
    dir: {
      input: 'content',
      output: 'dist',
      includes: '../includes'
    }
  }
}
