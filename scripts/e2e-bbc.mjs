import { firefox } from 'playwright'

async function main() {
  const browser = await firefox.launch({ headless: true })
  const page = await browser.newPage()

  const logs = []
  page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`))
  page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}`))

  const TARGET = process.env.E2E_TARGET || 'https://global-radio.example.com'
  await page.goto(`${TARGET}/`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(2000)

  const searchTab = page.locator('a[href*="search"], button:has-text("搜索"), nav a').filter({ hasText: /搜索|Search/i }).first()
  if (await searchTab.count()) {
    await searchTab.click()
    await page.waitForTimeout(1000)
  } else {
    await page.goto(`${TARGET}/search`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
  }

  const searchInput = page.locator('input').first()
  await searchInput.fill('BBC Radio 1')
  await searchInput.press('Enter')
  await page.waitForTimeout(5000)

  const station = page.locator('text=/BBC Radio 1|BBC RADIO 1/i').first()
  await station.waitFor({ timeout: 15000 })
  await station.click()
  await page.waitForTimeout(1500)

  const playBtn = page.locator('button').filter({ hasText: /播放|Play/i }).first()
  if (await playBtn.count()) {
    await playBtn.click()
  } else {
    const cardPlay = page.locator('button[aria-label*="播放"], button[aria-label*="Play"]').first()
    await cardPlay.click()
  }

  await page.waitForTimeout(8000)

  const result = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      isPlayingUi: /Pause Playing|暂停播放/i.test(text),
      hasPlayError: /播放失败|Play failed/i.test(text),
      bodySnippet: text.slice(0, 500)
    }
  })

  console.log('RESULT', JSON.stringify(result, null, 2))
  console.log('LOGS')
  logs.filter((l) => /error|HLS|播放|fail|BBC|成功/i.test(l)).slice(-30).forEach((l) => console.log(l))

  const ok = result.isPlayingUi && !result.hasPlayError
  await page.screenshot({ path: '/tmp/global-radio-bbc-test.png', fullPage: true }).catch(() => {})
  await browser.close()
  process.exit(ok ? 0 : 1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
