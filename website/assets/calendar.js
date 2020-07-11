'use strict';

document.addEventListener('DOMContentLoaded', function(event) { 
    /**
     * @param {NodeList} nodelist the list of nodes to transform into an array
     * @returns {Array<Node>} Array of nodes
     */
    function arrayize(nodelist) {
        return Array.prototype.slice.call(nodelist)
    }

    /**
     * @returns {string} the current timezone name
     */
    function selectedTz() {
        // Return the current tz for this session
        const saved = window.localStorage.getItem('selected-tz')
        if(saved) {
            return saved
        } else {
            return luxon.DateTime.local().zoneName
        }
    }

    // BEGIN OF NOT YET USED
    const getAllTimezones = () => luxon.Info().features.zones

    function saveTz(tzname) {
        const saved = window.localStorage.setItem('selected-tz', tzname)
        computeCalendars()
    }
    // END OF NOT YET USED

    function computeCalendars() {
        // Are there any Cal images?
        const dates = arrayize(document.querySelectorAll('.when-tz'))

        arrayize(document.querySelectorAll('.tzselector-btn')).forEach((elt) => {
            elt.innerHTML = selectedTz()
        })

        dates.innerHTML = ''
        dates.forEach(element => {
            const startDateStr = element.dataset.start
            const endDateStr = element.dataset.end
            const theDateStart = luxon.DateTime.fromISO(startDateStr)
            const theDateEnd = luxon.DateTime.fromISO(endDateStr)
            const theInterval = luxon.Interval.fromDateTimes(theDateStart, theDateEnd)
            const theTimeSpan = document.createElement('div')
            theTimeSpan.className = 'when-timespan'
            theTimeSpan.innerHTML = theInterval.toFormat('HH:mm')
            const theDateSpan = document.createElement('div')
            theDateSpan.className = 'when-datespan'
            theDateSpan.innerHTML = theDateStart.toFormat('MMMM dd')
            element.innerHTML = ''
            element.appendChild(theTimeSpan)
            element.appendChild(theDateSpan)
        });
    }
    computeCalendars()

});