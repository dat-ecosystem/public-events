const { Temporal } = require('proposal-temporal')

/**
 * 
 * @param {Temporal.Duration} duration 
 */
function temporal_duration_to_human (duration) {
    window.last_duration = duration
    let result = []
    const daysRequired = (!duration.hours && !duration.minutes)
    const hoursRequired = (!duration.days && !duration.minutes)
    const minutesRequired = (!duration.days && !duration.hours)
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

function add_relative_time (domNode) {
    const start = Temporal.Absolute.from(domNode.dataset.start)
    const end = Temporal.Absolute.from(domNode.dataset.end)
    const now = Temporal.now.absolute()

    if(Temporal.Absolute.compare(now, start) < 0) {
        // Hasn't started yet
        const diff = start.difference(now, {largestUnit: 'days'})
        domNode.innerHTML = `in ${temporal_duration_to_human(diff)}`
    } else if (Temporal.Absolute.compare(now, end) < 0) {
        // Has started already but hasn't ended
        const diff = now.difference(start, {largestUnit: 'days'})
        domNode.innerHTML = `live now, started ${temporal_duration_to_human(diff)} ago`
    } else {
        // Has ended
        const diff = now.difference(end, {largestUnit: 'days'})
        domNode.innerHTML = `ended ${temporal_duration_to_human(diff)} ago`
    }
}

function update_all_relative_times () {
    Array.from(document.querySelectorAll(".relative-when")).forEach(node => {
        add_relative_time(node)
    })
}

document.addEventListener("DOMContentLoaded", update_all_relative_times);
setInterval(update_all_relative_times, 30000);
