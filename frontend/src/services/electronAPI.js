// Electron API service for renderer process
const { ipcRenderer } = window.require('electron');

export const electronAPI = {
  // Select git directory
  selectGitDirectory: async () => {
    return await ipcRenderer.invoke('select-git-directory');
  },
  
  // Analyze git repository
  analyzeGitRepository: async (gitPath) => {
    return await ipcRenderer.invoke('analyze-git-repository', gitPath);
  },
  
  // Check if running in Electron
  isElectron: () => {
    return window.process && window.process.type;
  }
};