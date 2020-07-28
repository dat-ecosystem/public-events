const { Temporal } = require('proposal-temporal')

/**
 * 
 * @param {Temporal.Duration} duration 
 */
function temporal_duration_to_human (duration) {
    window.last_duration = duration
    const plural_day = duration.days != 1 ? "s" : ""
    const plural_hour = duration.hour != 1 ? "s" : ""
    const plural_minute = duration.minute != 1 ? "s" : ""
    return `${
        !!duration.days
        ? `${duration.days} day${plural_day}, `
        : ""
    }${
        !!duration.hours
        ? `${duration.hours} hour${plural_hour} and `
        : ""
    }${duration.minutes} minute${plural_minute}`
  }
  

function add_relative_time (domNode) {
    const start = Temporal.Absolute.from(domNode.dataset.start)
    const end = Temporal.Absolute.from(domNode.dataset.end)
    const preStart = domNode.dataset.preStartText
    const preEnd = domNode.dataset.preEndText
    const postEnd = domNode.dataset.postEndText
    const now = Temporal.now.absolute()

    if(Temporal.Absolute.compare(now, start) < 0) {
        // Hasn't started yet
        const diff = start.difference(now, {largestUnit: 'days'})
        domNode.innerHTML = preStart.replace('DURATION', temporal_duration_to_human(diff))
    } else if (Temporal.Absolute.compare(now, end) < 0) {
        // Has started already but hasn't ended
        const diff = now.difference(start, {largestUnit: 'days'})
        domNode.innerHTML = preEnd.replace('DURATION', temporal_duration_to_human(diff))
    } else {
        // Has ended
        const diff = now.difference(end, {largestUnit: 'days'})
        domNode.innerHTML = postEnd.replace('DURATION', temporal_duration_to_human(diff))
    }
}

function update_all_relative_times () {
    Array.from(document.querySelectorAll(".relative-when")).forEach(node => {
        add_relative_time(node)
    })
}
window.update_all_relative_times = update_all_relative_times

document.addEventListener("DOMContentLoaded", update_all_relative_times);
setInterval(update_all_relative_times, 30000);
