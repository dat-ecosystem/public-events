import { update_all_relative_times } from './util/index.mjs'

export function automatic () {
  document.addEventListener("DOMContentLoaded", () => update_all_relative_times);
  setInterval(update_all_relative_times, 30000);
  update_all_relative_times();
}
