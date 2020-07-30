import { Temporal } from 'proposal-temporal'
import talks from '../content/_data/2020/talks.json'

export function live () {
  console.log(talks)
  const time = document.getElementById('time')
  setInterval(() => {
    time.innerHTML = new Date().toLocaleString()
  }, 80)
}
