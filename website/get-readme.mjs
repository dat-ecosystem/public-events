import smhMarkdowner from 'smh-markdowner'
import { promises as fs } from 'fs'
import path from 'path'

const { markdowner } = smhMarkdowner

;(async () => {
  for (const [md, json] of [
    ['README.md', 'readme.json'],
    ['2019.md', path.join('2019', 'readme.json')],
    ['2020.md', path.join('2020', 'readme.json')]
  ]) {
    const rawReadme = await fs.readFile(path.join(process.cwd(), '..', md))
    const html = await markdowner(rawReadme)
  
    await fs.writeFile(path.join(process.cwd(), json), JSON.stringify(html, null, 2))
  
    console.log(`Updated ${md} → ${json}`)
  }
})().catch(err => {
  console.error(err.stack)
  process.exit(1)
})
