import { Temporal } from 'proposal-temporal'

/**
 * 
 * @param {Temporal.Duration} duration 
 */
export function temporal_duration_to_human (duration, showSeconds) {
    window.last_duration = duration
    let result = []
    const daysRequired = (!duration.hours && !duration.minutes)
    const hoursRequired = (!duration.days && !duration.minutes)
    const minutesRequired = (!duration.days && !duration.hours)
    if (minutesRequired && duration.minutes === 0 && showSeconds) {
        const plural_second = duration.seconds != 1 ? "s" : ""
        return `${duration.seconds} second${plural_second}`
    }
    if (!duration.days && daysRequired) {
        return 'now'
    }
    if (!!duration.days || daysRequired) {
        const plural_day = duration.days != 1 ? "s" : ""
        result.push(`${duration.days} day${plural_day}`)
    }
    if (!!duration.hours || hoursRequired) {
        const plural_hour = duration.hours != 1 ? "s" : ""
        result.push(`${duration.hours} hour${plural_hour}`)
    }
    if (!!duration.minutes || minutesRequired) {
        const plural_minute = duration.minutes != 1 ? "s" : ""
        result.push(`${duration.minutes} minute${plural_minute}`)
    }
    if (result.length > 1) {
        const last = result.pop()
        return `${result.join(', ')} and ${last}`
    }
    return result[0]
}

export function render_duration_human (absA, absB, showSeconds) {
  const diff = absA.difference(absB, {largestUnit: 'days'})
  return temporal_duration_to_human(diff, showSeconds)
}

export function render_relative_time (dataSet, now, showSeconds) {
  const { start: startRaw, end: endRaw, preStartText, preEndText, postEndText } = dataSet
  now = now || Temporal.now.absolute()
  const start = Temporal.Absolute.from(startRaw)
  const end = Temporal.Absolute.from(endRaw)

  let template
  let duration
  if(Temporal.Absolute.compare(now, start) < 0) {
    // Hasn't started yet
    template = preStartText
    duration = render_duration_human(start, now, showSeconds)
  } else if (Temporal.Absolute.compare(now, end) < 0) {
    // Has started already but hasn't ended
    template = preEndText
    duration = render_duration_human(now, start, showSeconds)
  } else {
    // Has ended
    template = postEndText
    duration = render_duration_human(now, end, showSeconds)
  }
  if (!template) {
    return duration
  }
  return template.replace('DURATION', duration)
}

export function add_relative_time (domNode, now) {
  domNode.innerHTML = render_relative_time(domNode.dataset, now)
}

export function update_all_relative_times (now) {
  for (const node of document.querySelectorAll(".relative-when")) {
    add_relative_time(node, now)
  }
}
