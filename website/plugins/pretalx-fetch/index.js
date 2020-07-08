const runfetch = require('./runfetch')
const getCacheManager = require('./getCacheManager')

module.exports = {
  async onPreBuild ({ inputs, utils }) {
    const base = process.cwd()
    const cacheManager = getCacheManager(base)
    if (await utils.cache.has(cacheManager)) {
      await utils.cache.restore(cacheManager)
    }
    await runfetch(base, inputs)
    await utils.cache.save(cacheManager, { ttl: 60 * 60 * 24 /* store for a day */ })
  }
}
