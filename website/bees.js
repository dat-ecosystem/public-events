const html = require('choo/html')

const BEE = '🐝'

module.exports = { beeView, bees }

function beeView (state, emit) {
  if (!state.bees) return ''
  return html`<div class="z-1 absolute top-0 left-0 w-100 h-100 overflow-hidden">${state.bees.map((b) => { return b.element })}</div>`
}

function bees (state, emitter) {
  emitter.on(state.events.DOMCONTENTLOADED, () => {
    if (!state.bees || !state.bees.length) {
      state.bees = []

      for (var i = 0; i < 15; i++) {
        var b = document.createElement('div')
        b.classList.add('b')
        b.innerHTML = BEE
        b.style.position = 'absolute'
        b.style.width = '70px'
        b.style.height = '70px'
        b.style.fontSize = '70px'
        b.style.textAlign = 'center'

        state.bees.push({
          element: b,
          position: [Math.random(), Math.random()],
          speed: Math.random(),
          direction: Math.random() * 10,
          angularVelocity: Math.random() - 0.5
        })
      }
      emitter.emit('render')
      animate()
    }
  })

  var t0 = 0

  function animate (t) {
    if (!t0 || !t) {} else {
      t0 = t
    }

    state.bees.forEach(function (b) {
      // update velocity
      b.angularVelocity = clampAngularVelocity(b.angularVelocity + randomWalk() * 1000)
      b.speed += randomWalk()
      b.direction += b.angularVelocity

      // move
      b.speed = clampSpeed(b.speed)
      b.position[0] += Math.cos(b.direction) * b.speed
      b.position[1] += Math.sin(b.direction) * b.speed

      // loop
      b.position[0] = loop(b.position[0])
      b.position[1] = loop(b.position[1])

      // set style
      b.element.style.left = `${b.position[0] * 100}vw`
      b.element.style.top = `${b.position[1] * 100}vh`
      b.element.style.transform = `rotate(${b.direction + Math.PI / 2}rad)`
    })

    window.requestAnimationFrame(animate)
  }

  // helpers
  function clampSpeed (n) {
    return Math.min(0.005, Math.abs(n))
  }
  function clampAngularVelocity (dTheta) {
    return Math.min(Math.max(dTheta, -0.1), 0.1)
  }
  function randomWalk () {
    return (Math.random() - 0.5) * 0.0001
  }
  function loop (n) {
    if (n < -0.1) { return n + 1.2 }
    if (n > 1.1) { return n - 1.2 }
    return n
  }
}
