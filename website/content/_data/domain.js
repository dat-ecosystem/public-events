module.exports = () => {
  let url = process.env.DEPLOY_DEPLOY_PRIME_URL || process.env.URL || 'http://localhost:8080'
  let image = process.env.NETLIFY_IMAGES_CDN_DOMAIN
  if (image) {
    image = `https://${image}`
  } else {
    image = url
  }
  return { url, image }
}
