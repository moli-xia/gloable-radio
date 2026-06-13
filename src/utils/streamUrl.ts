import type { RadioStation } from '@/types/radio'

export function upgradeToHttpsIfNeeded(url: string): string {
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    url.startsWith('http://')
  ) {
    return `https://${url.slice(7)}`
  }
  return url
}

export function wrapWithStreamProxy(url: string): string {
  const upgraded = upgradeToHttpsIfNeeded(url)
  return `/stream-proxy/?url=${encodeURIComponent(upgraded)}`
}

export function shouldUseStreamProxy(station: RadioStation, url: string): boolean {
  if (isHlsStream(station, url)) {
    return true
  }

  return typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    url.startsWith('http://')
}

export function resolveStreamUrl(station: RadioStation): string {
  const raw = (station.url_resolved || station.url || '').trim()
  const upgraded = upgradeToHttpsIfNeeded(raw)

  if (shouldUseStreamProxy(station, upgraded)) {
    return wrapWithStreamProxy(upgraded)
  }

  return upgraded
}

export function isHlsStream(station: RadioStation, url: string): boolean {
  if (station.hls === 1) {
    return true
  }

  const lower = url.toLowerCase()
  return lower.includes('.m3u8') || lower.includes('.isml')
}

export function supportsNativeHls(audio: HTMLAudioElement): boolean {
  return audio.canPlayType('application/vnd.apple.mpegurl') !== '' ||
    audio.canPlayType('application/x-mpegURL') !== ''
}

export function isProxiedStreamUrl(url: string): boolean {
  return url.startsWith('/stream-proxy/')
}
