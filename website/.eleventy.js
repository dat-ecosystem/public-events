module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('assets')

  return {
    dir: {
      input: 'content',
      output: 'dist',
      includes: '../includes'
    }
  }
}
