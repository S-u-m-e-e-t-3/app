const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const simpleGit = require('simple-git');
const fs = require('fs-extra');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    show: false,
    titleBarStyle: 'hiddenInset',
  });

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
    
  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event listeners
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for git operations
ipcMain.handle('select-git-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Git Repository Directory'
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('analyze-git-repository', async (event, gitPath) => {
  try {
    const git = simpleGit(gitPath);
    
    // Check if it's a valid git repository
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      throw new Error('Selected directory is not a git repository');
    }
    
    // Get commit log
    const log = await git.log({
      maxCount: 50, // Limit to last 50 commits for performance
      '--all': null,
      '--graph': null,
      '--pretty': 'fuller'
    });
    
    // Process commits and categorize them
    const processedCommits = log.all.map((commit, index) => {
      const message = commit.message.toLowerCase();
      let type = 'refactor'; // default
      
      // Auto-categorize based on commit message
      if (message.includes('fix') || message.includes('bug') || message.includes('patch')) {
        type = 'bug';
      } else if (message.includes('add') || message.includes('feature') || message.includes('implement') || message.includes('new')) {
        type = 'feature';
      } else if (message.includes('refactor') || message.includes('update') || message.includes('improve') || message.includes('optimize')) {
        type = 'refactor';
      }
      
      return {
        id: commit.hash.substring(0, 8),
        message: commit.message,
        author: commit.author_name,
        date: commit.date,
        type: type,
        files: [], // We'll get this from git show if needed
        additions: Math.floor(Math.random() * 100) + 1, // Placeholder
        deletions: Math.floor(Math.random() * 50) + 1,  // Placeholder
        description: generateDescription(commit.message, type)
      };
    });
    
    return processedCommits;
    
  } catch (error) {
    console.error('Git analysis error:', error);
    throw error;
  }
});

// Helper function to generate descriptions
function generateDescription(message, type) {
  const descriptions = {
    feature: [
      'Added new functionality to enhance user experience',
      'Implemented requested feature for improved workflow',
      'Introduced new capabilities to the system'
    ],
    bug: [
      'Resolved critical issue affecting system stability',
      'Fixed reported bug to improve reliability',
      'Addressed edge case causing unexpected behavior'
    ],
    refactor: [
      'Improved code structure and maintainability',
      'Optimized performance and reduced complexity',
      'Enhanced code quality through refactoring'
    ]
  };
  
  const typeDescriptions = descriptions[type] || descriptions.refactor;
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
}

// Handle app certificate verification (for dev)
app.commandLine.appendSwitch('ignore-certificate-errors');