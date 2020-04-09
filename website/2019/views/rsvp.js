const html = require('choo/html')

const TITLE = 'dat events'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="code lh-copy" style="background:repeat url(/assets/dat-logo-small.png);background-size:32px auto;">
      <h1 class="f-title pb2 tc bb mw6 center bg-white">RSVP - Dat Protocol</h1>
      <main class="w-100 flex-ns justify-center bg-white">
        <section class="mw6 pa3">
          <form name="rsvp-berlin" method="POST" netlify-honeypot="bot-field" data-netlify="true" action="/thanks">
            <input type="hidden" name="form-name" value="rsvp-berlin" />
            <fieldset id="rsvp" class="ba b--transparent ph0 mh0">
              <legend class="ph0 mh0 fw6 clip">RSVP - Dat Berlin</legend>
              <div class="mt3">
                <label class="db fw4 lh-copy f6" for="email-address">Email</label>
                <input class="pa2 input-reset ba bg-transparent w-100 measure" type="email" name="email-address"  id="email-address">
              </div>
              <div class="mt3">
                <label class="db fw4 lh-copy f6" for="name">Name</label>
                <input class="b pa2 input-reset ba bg-transparent" type="text" name="name"  id="name">
              </div>
            </fieldset>
            <small class="f6 black-60">Please only RSVP if you will attend!</small>
            <div class="mt3">
              <input class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6" type="submit" value="I'm There!">
            </div>
            <p class="mt3">
              <label class="db i f7 lh-copy">Robots type stuff here: <input class="pa2 input-reset ba bg-transparent w-0 measure" name="bot-field" /></label>
            </p>
          </form>
        </section>
      </main>
    </body>
  `
}
