const css = require('sheetify')
const choo = require('choo')
const bees = require('./bees').bees

css('tachyons')

const app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  app.use(require('choo-service-worker')())
}
app.use(bees)

app.route('/', require('./views/main'))
require('./2019')(app)
app.route('/*', require('./views/404'))

module.exports = app.mount('body')
