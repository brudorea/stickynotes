/**
 * preload.js - Usado no framework electron para aumentar a segurança e o desempenho
 */



// Importação dos recursos do framework electron
// ipcRenderer permite estabalecer uma comunicação entre processos (IPC) main.js <=> renderer.js
// contextBridge: permissões de comunicação entre processos usando a api do electron
const { ipcRenderer, contextBridge } = require('electron')

// Enviar uma mensagem para o main.js estabelecer uma conexão com o banco de dados quando iniciar a aplicação.
// Send (enviar)
// db-connect (rótulo para identificar a mensagem)
ipcRenderer.send('db-connect') 

// permissões para estabelecer a comunicação entre processos
contextBridge.exposeInMainWorld('api', {
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    aboutExit: () => ipcRenderer.send('about-exit'),
    createNote: (stickynote) => ipcRenderer.send('create-note', stickynote),
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    listNotes: () => ipcRenderer.send('list-notes'),
    renderNotes: (notes) => ipcRenderer.on('render-notes', notes)  
})


