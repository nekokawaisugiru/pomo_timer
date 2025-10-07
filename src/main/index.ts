import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

const APP_USER_MODEL_ID = 'com.electron.app'

function getIconPath(): string {
  if (is.dev) {
    return join(process.cwd(), 'src', 'renderer', 'public', 'icons', '25icon.png')
  }
  return join(process.resourcesPath, 'icons', '25icon.png')
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 380,
    height: 480,
    transparent: true,
    frame: false,
    backgroundColor: '#00000000',
    show: false,
    autoHideMenuBar: true,
    icon: getIconPath(),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  mainWindow.setIcon(getIconPath())

  mainWindow.webContents.on('preload-error', (_e, path, error) => {
    console.error('[main] preload-error:', path, error)
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.setAlwaysOnTop(true)
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Windows のタスクバーにピン留め可能にするため AppUserModelId を設定
app.setAppUserModelId(APP_USER_MODEL_ID)

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// サンプル IPC（必要ならレンダラーから利用）
// ipcMain.on('ping', (event) => {
//   event.sender.send('pong')
// })

ipcMain.on('close', () => {
  app.quit()
})

ipcMain.on('minimize', () => {
  const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
  if (win) {
    win.minimize()
  }
})
