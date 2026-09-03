const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('kommoAPI', {
	getPipelines: (config) => ipcRenderer.invoke('kommo:get-pipelines', config),
	importLeads: (config) => ipcRenderer.invoke('kommo:import-leads', config),
});