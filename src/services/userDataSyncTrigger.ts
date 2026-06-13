let pushHandler: (() => void) | null = null

export function registerUserDataPushHandler(handler: () => void) {
  pushHandler = handler
}

export function scheduleUserDataPush() {
  pushHandler?.()
}
