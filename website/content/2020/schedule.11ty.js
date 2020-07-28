const { Temporal } = require('proposal-temporal')

function getRange (day, talks, timeZone) {
  let start
  let end
  for (const room of Object.values(day.rooms)) {
    if (room.length === 0) {
      continue
    }
    const firstTalk = talks.find(talk => talk.code === room[0].slug)
    const firstStart = Temporal.Absolute.from(firstTalk.slot.start)
    const lastTalk = talks.find(talk => talk.code === room[room.length - 1].slug)
    const lastEnd = Temporal.Absolute.from(lastTalk.slot.end)
    if (start === undefined || start > firstStart) {
      start = firstStart
    }
    if (end === undefined || end < lastEnd) {
      end = lastEnd
    }
  }
  if (start === undefined) {
    return
  }
  let startTZ = start.inTimeZone(timeZone)
  startTZ = startTZ.minus(Temporal.Duration.from({ minutes: startTZ.minute }))
  let endTZ = end.inTimeZone(timeZone)
  endTZ = endTZ.minus(Temporal.Duration.from({ minutes: endTZ.minute }))
  endTZ = endTZ.plus(onHour)
  const tz = Temporal.TimeZone.from(timeZone)
  return { start: tz.getAbsoluteFor(startTZ), end: tz.getAbsoluteFor(endTZ), timeZone }
}

const onHour = Temporal.Duration.from({ hours: 1 })

function * getHours ({ start, end, timeZone }) {
  let current = Temporal.Absolute.from(start)
  while (current.getEpochSeconds() < end.getEpochSeconds()) {
    yield { hour: current.inTimeZone(timeZone).getTime().toString(), time: current.getEpochSeconds() }
    current = current.plus(onHour)
  }
}

function * getRoomEntries (room) {
  for (const slot of room.slots) {
    yield {
      ...slot,

    }
  }
}

module.exports = class Schedule {
  data () {
    return {
      title: 'Agenda',
      layout: 'layout-2020',
      header_title: '<h1>Agenda</h1>'
    }
  }

  render (input) {
    const { '2020': { talks, event, rooms: roomMeta, schedule: { schedule } }} = input
    const { conference } = schedule
    const { timezone: timeZone } = event
    const { list, md, event: renderEvent } = this

    return `${md(`
[iCal file][ical]

The schedule is not yet fixed, but if you subscribe to [the iCal file][ical]
as a web calendar, it will update whenever there is an update!

[ical]: /assets/2020-schedule.ics
    `)}

    ${list(
      conference.days, 
      day => {
        const rooms = Object.keys(day.rooms).map(roomName => {
          return {
            name: roomName,
            slots: day.rooms[roomName],
            info: roomMeta.find(room => room.name.en === roomName)
          }
        })
        if (rooms.length === 0) {
          return ''
        }
        const dayRange = getRange(day, talks, timeZone)
        return `<h3>Day ${day.index} - ${day.date}</h3>
      <table class="cal-day" id="cal-day-${day.index}" cellspacing=0 cellpadding=0>
        <thead>
          <tr>
            <td></td>
            ${
              list(rooms, ({ name }) => `<th>${name}</th>`)
            }
          </tr>
          <tr>
            <td class="cal-timezone">${timeZone}</td>
            ${
              list(rooms, ({ info }) => {
                return `<td>${this.md(info.description.en)}</td>`
              })
            }
          </tr>
        </thead>
        <tbody>
          ${list(
            getHours(dayRange),
            ({ hour, time }, count) => `
            <tr class="cal-hour">
              <th data-date="${time}">${hour}</th>
              ${
                count === 0
                ? list(
                  rooms,
                  room => `<td><div class="cal-entries">
                    ${list(getRoomEntries(room), entry => {
                      const talk = talks.find(talk => talk.code === entry.slug)
                      return renderEvent(talk, dayRange)
                    })}
                  </td><div>`
                )
                : `<td ${rooms.length > 1 ? `colspan=${rooms.length}` : ''}></td>`
              }
            </tr>
            `
          )}
        </tbody>
      </table>
      `
      }
    )}
    `
  }
}
