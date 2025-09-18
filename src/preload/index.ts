import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  close: (): void => ipcRenderer.send('close')
}
// Use `contextBridge` APIs to expose only our safe custom API
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
