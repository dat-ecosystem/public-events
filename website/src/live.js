import { Temporal } from 'proposal-temporal'
import talks from '../content/_data/2020/talks.json'
import { findLastIndex } from './util/findlastindex.cjs'
sortTalks(talks)

console.log(findLastIndex)

function sortTalks (talks) {
  talks.sort((a, b) => {
    return a.slot.start < b.slot.start
  })
  return talks
}

function currentTalkIndex (now) {
  return talks.findIndex(e => {
    const dt = Temporal.Absolute.from(e.slot.start)
    return Temporal.Absolute.compare(dt, now) >= 0
  })
}

function displayForTime(now) {
  console.log("----- TIME: ", now.toString())
  const currentIndex = currentTalkIndex(talks, now)
  console.log("Current talk", currentIndex, talks[currentIndex])
}

function getRenderState (time) {
  findLastIndex(talks, e => {
    const end = Temporal.Absolute.from(e.slot.end)
    return Temporal.Absolute.compare(end, now) < 0
  })

  const previousTalk = null || {}
  const currentTalk = null || {}
  const nextTalk = null || {}
  const isInBreak = previousTalk !== null && currentTalk == null && nextTalk !== null
  const isAfterEvent = currentTalk == null && nextTalk == null
  const isBeforeEvent = previousTalk === null && currentTalk == null
  return {
    isBeforeEvent,
    previousTalk,
    currentTalk,
    nextTalk,
    isInBreak,
    isAfterEvent
  }
}


const timeBeforeEvent = Temporal.Absolute.from("2020-07-30T16:20:00+02:00")
const timeDuringFirstSession = Temporal.Absolute.from("2020-07-30T17:01:00+02:00")
const timeBetweenFirstAndSecondSession = Temporal.Absolute.from("2020-07-30T18:05:00+02:00")
const timeDuringSecondSession = Temporal.Absolute.from("2020-07-30T18:16:00+02:00")
const timeAfterEvent = Temporal.Absolute.from("2020-07-31T23:25:00+02:00")

export function live () {
  const output = document.getElementById('output')

  const beforeEvent = getRenderState(timeBeforeEvent)
  const duringFirstSession = getRenderState(timeDuringFirstSession)
  const betweenFirstAndSecondSession = getRenderState(timeBetweenFirstAndSecondSession)
  const duringSecondSession = getRenderState(timeDuringSecondSession)
  const afterEvent = getRenderState(timeAfterEvent)

  setInterval(() => {
    output.innerHTML = `
      ${new Date().toLocaleString()}
    `
  }, 80)
}
