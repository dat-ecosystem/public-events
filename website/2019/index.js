module.exports = (app) => {
  app.route('/2019', require('./views/main'))
  app.route('/2019/rsvp', require('./views/rsvp'))
  app.route('/2019/thanks', require('./views/main'))
}
