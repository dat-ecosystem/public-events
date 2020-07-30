import { Temporal } from 'proposal-temporal'
import talksRaw from '../content/_data/2020/talks.json'
import { render_duration_human } from './util/index.mjs'

const talks = sortTalks(talksRaw)

function findLastIndex (arr, matcher) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = arr[i]
    if (matcher(item, i)) {
      return i
    }
  }
  return -1
}

function findLast (arr, matcher) {
  const idx = findLastIndex(arr, matcher)
  if (idx !== -1) {
    return arr[idx]
  }
  return undefined
}

function sortTalks (talksRaw) {
  return talksRaw.sort((a, b) => {
    const aTime = Temporal.Absolute.from(a.slot.start)
    const bTime = Temporal.Absolute.from(b.slot.start)
    return Temporal.Absolute.compare(aTime, bTime)
  })
}

function isBefore (a, b) {
  return Temporal.Absolute.compare(a, b) < 0
}
function isBeforeOrAt (a, b) {
  return Temporal.Absolute.compare(a, b) <= 0
}

function getRenderState (time) {
  const currentTalkIndex = talks.findIndex(e => {
    const start = Temporal.Absolute.from(e.slot.start)
    const end = Temporal.Absolute.from(e.slot.end)
    return isBeforeOrAt(start, time) && isBefore(time, end)
  })
  const currentTalk = currentTalkIndex != -1 ? talks[currentTalkIndex] : undefined
  let previousTalk
  let nextTalk
  if (currentTalk) {
    previousTalk = talks[currentTalkIndex - 1]
    nextTalk = talks[currentTalkIndex + 1]
  } else {
    previousTalk = findLast(talks, e => {
      const end = Temporal.Absolute.from(e.slot.end)
      return isBefore(end, time)
    })
    nextTalk = talks.find(e => {
      const start = Temporal.Absolute.from(e.slot.start)
      return isBefore(time, start)
    })
  }
  let state
  if (currentTalk) {
    state = 'session'
  } else if (!!previousTalk) {
    if (!!nextTalk) {
      state = 'break'
    } else {
      state = 'after'
    }
  } else {
    state = 'before'
  }
  const isFirstSession = state === 'session' && !previousTalk
  const isLastSession = state === 'session' && !nextTalk
  return {
    state,
    isInSession: state === 'session',
    isBeforeEvent: state === 'before',
    isFirstSession,
    isLastSession,
    previousTalk,
    currentTalk,
    nextTalk,
    isInBreak: state === 'break',
    isAfterEvent: state === 'after'
  }
}

function renderEvent (event) {
  let byLine = ''
  let otherSpeakers = event.speakers.map(speaker => `<strong>${speaker.name}</strong>`)
  let last = otherSpeakers.pop()
  if (otherSpeakers.length > 0) {
    byLine = otherSpeakers.join(', ') + ' and '
  }
  byLine += last
  return `
    <h2>${event.title}</h2>
    <p>by ${byLine}</p>
  `
}

function render (renderState, time, end) {
  const { isInBreak, nextTalk, isBeforeEvent, isFirstSession, isInSession, currentTalk, previousTalk } = renderState
  if (isBeforeEvent || isFirstSession) {
    let inTime
    let talk
    if (isFirstSession) {
      inTime = '<strong>shortly<strong>'
      talk = currentTalk
    } else {
      inTime = `in <strong>${render_duration_human(Temporal.Absolute.from(nextTalk.slot.start), time, true)}</strong>`
      talk = nextTalk
    }
    return `
      <div class="intro">
        <h1>Welcome to the DAT Conference 2020!</h1>
        <sub>
          We will be starting ${inTime} with
        </sub>
      </div>
      <div class="main">
        ${renderEvent(talk)}
      </div>
    `
  }
  if (end) {
    return `
      <div class="intro">
        <sub>
          Thank you for joining!
        </sub>
      </div>
      <div class="main">
        ${renderEvent(currentTalk || previousTalk)}
      </div>
    `
  }
  if (isInSession) {
    return `
      <div class="intro">
        <sub>
          We will be starting shortly!
        </sub>
      </div>
      <div class="main">
        ${renderEvent(currentTalk)}
      </div>
    `
  }
  if (isInBreak) {
    return `
      <div class="intro">
        <sub>
          Starting in <strong>${render_duration_human(Temporal.Absolute.from(nextTalk.slot.start), time, true)}</strong>:
        </sub>
      </div>
      <div class="main">
        ${renderEvent(nextTalk)}
      </div>
    `
  }
  return `
    <div class="intro">
      <h1>Thank you for joining<br> the Dat Conference 2020!</h1>
    </div>
    <div class="main">
      <h2>We hope to meet you again!</h2>
    </div>
  `
}

export function live (end) {
  const output = document.getElementById('output')

  const timeSecondsBeforeEvent = Temporal.Absolute.from("2020-07-30T16:59:29+02:00")
  const timeBeforeEvent = Temporal.Absolute.from("2020-07-30T16:58:40+02:00")
  const timeDuringFirstSession = Temporal.Absolute.from("2020-07-30T17:01:00+02:00")
  const timeBetweenFirstAndSecondSession = Temporal.Absolute.from("2020-07-30T18:05:00+02:00")
  const timeDuringSecondSession = Temporal.Absolute.from("2020-07-30T18:16:00+02:00")
  const timeDuringLastSession = Temporal.Absolute.from("2020-07-31T21:51:00+02:00")
  const timeAfterEvent = Temporal.Absolute.from("2020-07-31T23:25:00+02:00")

  /*
  // Tests

  const beforeEvent = getRenderState(timeBeforeEvent)
  const duringFirstSession = getRenderState(timeDuringFirstSession)
  const betweenFirstAndSecondSession = getRenderState(timeBetweenFirstAndSecondSession)
  const duringSecondSession = getRenderState(timeDuringSecondSession)
  const afterEvent = getRenderState(timeAfterEvent)
  const duringLastSession = getRenderState(timeDuringLastSession)

  console.log({
    beforeEvent,
    duringFirstSession,
    betweenFirstAndSecondSession,
    duringSecondSession,
    duringLastSession,
    afterEvent
  })
  */

  const start = Temporal.now.absolute()

  const renderNow = () => {
    const now = Temporal.now.absolute()
    // const difference = now.difference(start)
    // const time = timeBeforeEvent.plus(difference)
    const time = now
    output.innerHTML = render(getRenderState(time), time, end)
  }

  setInterval(renderNow, 80)
  renderNow()
}
