module.exports = () => {
  return {
    url: process.env.DEPLOY_DEPLOY_PRIME_URL || 'http://localhost:8080',
    image: process.env.NETLIFY_IMAGES_CDN_DOMAIN || process.env.DEPLOY_DEPLOY_PRIME_URL  || 'http://localhost:8080'
  }
}
