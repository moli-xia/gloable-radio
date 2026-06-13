import { app, BrowserWindow, Menu, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getDesktopMenuLabels } from './i18n.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHELL_PAGE = path.join(__dirname, '../shell/index.html')
const SHELL_URL = `file://${SHELL_PAGE}`
// ?change=1 forces the shell to render the input form instead of
// auto-connecting to the previously saved URL. This prevents the
// backend URL from being exposed in the input field when the user
// explicitly picks "Server Settings".
const SHELL_URL_FORCE_CHANGE = `file://${SHELL_PAGE}?change=1`

/** @type {BrowserWindow | null} */
let mainWindow = null

function getMenuLabels() {
  return getDesktopMenuLabels(app.getLocale())
}

function getShellUrl() {
  return SHELL_URL
}

function openServerSettings() {
  if (!mainWindow) {
    return
  }
  mainWindow.loadURL(SHELL_URL_FORCE_CHANGE)
}

function createWindow() {
  const labels = getMenuLabels()

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 360,
    minHeight: 640,
    title: labels.appTitle,
    autoHideMenuBar: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  mainWindow.loadURL(getShellUrl())

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function buildMenu() {
  const labels = getMenuLabels()

  const template = [
    {
      label: labels.app,
      submenu: [
        {
          label: labels.serverSettings,
          accelerator: 'CmdOrCtrl+,',
          click: openServerSettings
        },
        { type: 'separator' },
        { role: 'quit', label: labels.quit }
      ]
    },
    {
      label: labels.view,
      submenu: [
        { role: 'reload', label: labels.reload },
        { role: 'forceReload', label: labels.forceReload },
        { type: 'separator' },
        { role: 'resetZoom', label: labels.resetZoom },
        { role: 'zoomIn', label: labels.zoomIn },
        { role: 'zoomOut', label: labels.zoomOut },
        { type: 'separator' },
        { role: 'togglefullscreen', label: labels.fullscreen }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.whenReady().then(() => {
  buildMenu()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
