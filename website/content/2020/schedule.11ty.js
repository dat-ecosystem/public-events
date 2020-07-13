const { Temporal } = require('proposal-temporal')

function getRange (day) {
  let start
  let end
  for (const room of Object.values(day.rooms)) {
    if (room.length === 0) {
      continue
    }
    const firstStart = Temporal.DateTime.from(room[0].date)
    const lastEntry = room[room.length - 1]
    const duration = /(\d{2}):(\d{2})/.exec(lastEntry.duration)
    const lastStart = Temporal.DateTime.from(lastEntry.date)
    const lastEnd = lastStart.plus({ hours: duration[1], minutes: duration[2] })
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
  return { start: Temporal.Time.from({ hour: start.hour, minute: 0 }), end: Temporal.Time.from({ hour: end.hour, minute: 0 }) }
}

function * getHours ({ start: { hour: firstHour }, end }) {
  const { hour: lastHour } = end
  for (let hour = firstHour; hour <= lastHour; hour++) {
    yield { hour: `${hour}:00` }
  }
}

function * getRoomEntries (room) {
  for (const slot of room.slots) {
    yield {
      ...slot,

    }
  }
}

function list (iterable, mapper, sep='', lastSep) {
  if (lastSep === undefined) {
    lastSep = sep
  }
  const entries = Array.from(iterable).map(mapper)
  if (entries.length === 0) {
    return ''
  }
  if (entries.length === 1) {
    return entries[0]
  }
  return `${entries.slice(0, entries.length - 1).join(sep)}${lastSep}${entries[entries.length-1]}`
}

class Schedule {
  data () {
    return {
      layout: 'layout-2020',
      header_title: '<h1>Agenda</h1>'
    }
  }

  render (input) {
    const { '2020': { event, talks, rooms: roomMeta, schedule: { schedule } }} = input
    const { conference } = schedule
    const { timezone: timeZone } = event

    return `${this.md(`
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
        const dayRange = getRange(day)
        return `<h3>Day ${day.index} - ${day.date}</h3>
      <table class="cal-day" id="cal-day-${day.index}" cellspacing=0 cellpadding=0 data-start-hour="${dayRange.start.hour}" data-end-hour="${dayRange.end.hour}">
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
            ({ hour }, count) => `
            <tr class="cal-hour">
              <th>${hour}</th>
              ${
                count === 0
                ? list(
                  rooms,
                  room => `<td><div class="cal-entries">
                    ${list(
                      getRoomEntries(room),
                      entry => {
                        const startTime = Temporal.Time.from(entry.start)
                        const diff = startTime.difference(dayRange.start)
                        const diffMinutes = diff.hours * 60 + diff.minutes
                        const diffP = (diffMinutes / 0.6) | 0
                        const durationTime = Temporal.Time.from(entry.duration)
                        const duration = Temporal.Duration.from({ hours: durationTime.hour, minutes: durationTime.minute })
                        const endTime = startTime.plus(duration)
                        const durationMinutes = duration.hours * 60 + duration.minutes
                        const durationP = (durationMinutes / 0.6) | 0
                        return `
                          <div class="cal-entry cal-entry-${entry.slug}"
                            data-start="${entry.start}" data-duration="${entry.duration}"
                            style="top: ${diffP}%; height: ${durationP}%; min-height: ${durationP}%;">
                            <div class="cal-entry-content">
                              <span class="cal-entry-time">${entry.start}-${endTime.toString()}</span>
                              <span class="cal-entry-text">
                              <a class="cal-entry-talk cal-link-talk" href="/2020/talk/${entry.slug}" title="${entry.subtitle}">${entry.title}</a>
                              <span class="cal-entry-by">by ${list(
                                entry.persons,
                                person => `<a class="cal-entry-person cal-link-person" href="/2020/speaker/${person.code}">${person.public_name}</a>`,
                                ', ', ' and ')}
                              </span>
                              </span>
                            </div>
                          </div>
                        `
                      }
                    )}
                  </td><div>`
                )
                : list(rooms, () => '<td></td>')
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

module.exports = Schedule
