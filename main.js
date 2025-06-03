const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const buildExists = fs.existsSync(path.join(__dirname, 'frontend/build/index.html'));
const isDev = !buildExists;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true
    }
  });

  if (isDev) {
    console.log("🔧 Dev mode: loading localhost");
    win.loadURL('http://localhost:3000');
  } else {
    console.log("🚀 Production mode: loading React build");
    win.loadFile(path.join(__dirname, 'frontend/build/index.html'));
  }

  // Optional: show DevTools for debugging
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
