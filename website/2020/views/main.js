const html = require('choo/html')
const raw = require('choo/html/raw')
const beeView = require('../../bees').beeView
var readme = require('../readme.json').content

const TITLE = 'dat events'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="code lh-copy" style="background:repeat url(/assets/dat-logo-small.png);background-size:32px auto;">
      <h1 class="f-title pb2 tc bb mw6 center bg-white">Dat Foundation Event 2020</h1>
      <main class="w-100 flex-ns justify-center">
        <section class="mw7 pv3 ph5-ns ph3 bg-white z-5">
          ${raw(readme)}
        </section>
      </main>
      ${beeView(state, emit)}
    </body>
  `
}
