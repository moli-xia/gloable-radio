#!/usr/bin/env node
// Sync the app version across package.json, Android, and iOS in one shot.
//
// Usage:
//   node scripts/bump-version.mjs 2.0.3            # explicit version
//   node scripts/bump-version.mjs patch            # 2.0.3 -> 2.0.4
//   node scripts/bump-version.mjs minor            # 2.0.3 -> 2.1.0
//   node scripts/bump-version.mjs major            # 2.0.3 -> 3.0.0
//   node scripts/bump-version.mjs 2.0.3 --tag      # also create+push git tag
//
// Files touched:
//   - package.json                              (version)
//   - android/app/build.gradle                  (versionName, versionCode++)
//   - ios/App/App.xcodeproj/project.pbxproj     (MARKETING_VERSION, CURRENT_PROJECT_VERSION++)

import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const PKG = resolve(ROOT, 'package.json')
const ANDROID_GRADLE = resolve(ROOT, 'android/app/build.gradle')
const IOS_PBXPROJ = resolve(ROOT, 'ios/App/App.xcodeproj/project.pbxproj')

function die(msg) {
  console.error(`\x1b[31m✗\x1b[0m ${msg}`)
  process.exit(1)
}

function ok(msg) {
  console.log(`\x1b[32m✓\x1b[0m ${msg}`)
}

function info(msg) {
  console.log(`  ${msg}`)
}

function bumpSemver(current, kind) {
  const m = current.match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!m) die(`Current version "${current}" is not a clean major.minor.patch`)
  let [, maj, min, pat] = m
  maj = Number(maj); min = Number(min); pat = Number(pat)
  if (kind === 'patch') return `${maj}.${min}.${pat + 1}`
  if (kind === 'minor') return `${maj}.${min + 1}.0`
  if (kind === 'major') return `${maj + 1}.0.0`
  die(`Unknown bump kind "${kind}"`)
}

function validateSemver(v) {
  if (!/^\d+\.\d+\.\d+$/.test(v)) die(`"${v}" is not a valid semver (expected major.minor.patch)`)
}

function updatePackageJson(nextVersion) {
  const text = readFileSync(PKG, 'utf-8')
  const pkg = JSON.parse(text)
  const prev = pkg.version
  pkg.version = nextVersion
  const trailingNewline = text.endsWith('\n') ? '\n' : ''
  writeFileSync(PKG, JSON.stringify(pkg, null, 2) + trailingNewline)
  ok(`package.json: ${prev} -> ${nextVersion}`)
  return prev
}

function updateAndroidGradle(nextVersion) {
  let text = readFileSync(ANDROID_GRADLE, 'utf-8')
  const codeMatch = text.match(/versionCode\s+(\d+)/)
  const nameMatch = text.match(/versionName\s+"([^"]+)"/)
  if (!codeMatch || !nameMatch) die(`Could not find versionCode/versionName in ${ANDROID_GRADLE}`)
  const prevCode = Number(codeMatch[1])
  const prevName = nameMatch[1]
  const nextCode = prevCode + 1
  text = text.replace(/versionCode\s+\d+/, `versionCode ${nextCode}`)
  text = text.replace(/versionName\s+"[^"]+"/, `versionName "${nextVersion}"`)
  writeFileSync(ANDROID_GRADLE, text)
  ok(`android/app/build.gradle: versionName ${prevName} -> ${nextVersion}, versionCode ${prevCode} -> ${nextCode}`)
}

function updateIosPbxproj(nextVersion) {
  let text = readFileSync(IOS_PBXPROJ, 'utf-8')
  // Both Debug and Release configs each have one CURRENT_PROJECT_VERSION and one MARKETING_VERSION.
  const projMatches = [...text.matchAll(/CURRENT_PROJECT_VERSION = (\d+);/g)]
  if (projMatches.length === 0) die(`Could not find CURRENT_PROJECT_VERSION in ${IOS_PBXPROJ}`)
  const prevProj = Number(projMatches[0][1])
  const nextProj = prevProj + 1
  text = text.replace(/CURRENT_PROJECT_VERSION = \d+;/g, `CURRENT_PROJECT_VERSION = ${nextProj};`)
  const marketMatches = [...text.matchAll(/MARKETING_VERSION = ([^;]+);/g)]
  if (marketMatches.length === 0) die(`Could not find MARKETING_VERSION in ${IOS_PBXPROJ}`)
  const prevMarket = marketMatches[0][1].trim()
  text = text.replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${nextVersion};`)
  writeFileSync(IOS_PBXPROJ, text)
  ok(`ios/App/App.xcodeproj/project.pbxproj: MARKETING_VERSION ${prevMarket} -> ${nextVersion}, CURRENT_PROJECT_VERSION ${prevProj} -> ${nextProj}`)
}

function maybeGitTag(nextVersion, shouldTag) {
  if (!shouldTag) {
    info(`(skipped git tag; pass --tag to commit + tag + push automatically)`)
    return
  }
  try {
    execSync(`git add package.json android/app/build.gradle ios/App/App.xcodeproj/project.pbxproj`, { stdio: 'inherit' })
    execSync(`git commit -m "chore(release): bump version to ${nextVersion}"`, { stdio: 'inherit' })
    execSync(`git tag -a v${nextVersion} -m "Release v${nextVersion}"`, { stdio: 'inherit' })
    execSync(`git push origin HEAD`, { stdio: 'inherit' })
    execSync(`git push origin v${nextVersion}`, { stdio: 'inherit' })
    ok(`git tag v${nextVersion} pushed; CI will build and publish the release`)
  } catch (e) {
    die(`Git step failed: ${e.message}`)
  }
}

function main() {
  const args = process.argv.slice(2)
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node scripts/bump-version.mjs <version|patch|minor|major> [--tag]`)
    process.exit(args.length === 0 ? 1 : 0)
  }

  const shouldTag = args.includes('--tag')
  const target = args.find(a => a !== '--tag')

  const pkg = JSON.parse(readFileSync(PKG, 'utf-8'))
  const current = pkg.version

  let next
  if (['patch', 'minor', 'major'].includes(target)) {
    next = bumpSemver(current, target)
  } else {
    validateSemver(target)
    next = target
  }

  console.log(`Bumping ${current} -> ${next}\n`)
  updatePackageJson(next)
  updateAndroidGradle(next)
  updateIosPbxproj(next)
  console.log('')
  maybeGitTag(next, shouldTag)
}

main()
