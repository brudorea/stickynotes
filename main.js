console.log("Electron - Processo")

// Importação dos recursos do framework
// App (aplicação)
// BrowserWindow (criação da janela)
// nativeTheme (definir tema claro ou escuro)
// Menu (definir o menu personalizado)
// shell (acessar links externos no navegador padrão)
// ipcRenderer permite estabalecer uma comunicação entre processos (IPC) main.js <=> renderer.js
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')

// Ativação do preload.js (importação do path)
const path = require('node:path')

// Importação dos métodos conectar e desconectar (modulo de conexão)
const { conectar, desconectar } = require('./database.js')

// Importação do modelo de dados (Notes.js)
const noteModel = require('./src/models/Notes.js')

// Janela principal
let win
const createWindow = () => {
  // definindo tema da janela claro ou escuro
  nativeTheme.themeSource = 'light'
  win = new BrowserWindow({
    width: 1010, // largura
    height: 720, // altura
    //frame: false
    //resizable: false,
    //minimizable: false,
    //closable: false,
    //autoHideMenuBar: true,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Carregar o menu personalizado
  // Atenção! Antes importar o recurso Menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  // Carregar o documento HTML na janela
  win.loadFile('./src/views/index.html')
}

// Janela SOBRE
function aboutWindow() {
  nativeTheme.themeSource = 'light'
  // Obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()
  // Validação (se existir a janela principal)
  if (mainWindow) {
    about = new BrowserWindow({
      width: 300,
      height: 200,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      // Estabelecer uma relação hierárquica entre janelas
      parent: mainWindow,
      // Criar uma janela modal (só retorna a principal quando encerrada)
      modal: true,
      webPreferences: {
        proload: path.join(__dirname, 'preload.js')
      }
    })
  }
}

// Janela Nota
let note
function noteWindow() {
  nativeTheme.themeSource = 'light'
  // Obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()
  // Validação (se existir a janela principal)
  if (mainWindow) {
    note = new BrowserWindow({
      width: 400,
      height: 270,
      autoHideMenuBar: true,
      //resizable: false,
      //minimizable: false,
      // Estabelecer uma relação hierárquica entre janelas
      parent: mainWindow,
      // Criar uma janela modal (só retorna a principal quando encerrada)
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }

    })
  }

  note.loadFile('./src/views/nota.html')


}



// Inicialização da aplicação (assincronismo, ou seja, ".them" indica o assincronismo)
app.whenReady().then(() => {
  createWindow()

  // Melhor local para etabelecer a conexão com o banco de dados
  //No mongodb é mais eficiente manter uma única conexão aberta durante todo o tempo de vida do aplicativo e encerrar a conexão quando o aplicativo for finalizado
  // ipcMain.on (receber mensagem)
  // db-connect (rótulo da mensagem)
  ipcMain.on('db-connect', async (event) => {
    // a linha abaixo, estabelece a comunicação com o banco de dados e verifica se foi conectado com sucesso (return true)
    const conectado = await conectar()
    if (conectado) {


      // enviar ao renderizador uma mensagem para trocar a imagem do ícone do status do banco de dados (criar um dlay de 0.5 ou 1s para sincronização com a nuvem)
      setTimeout(() => {
        // enviar ao renderizador a mensagem "conectado"
        //db-status (IPC - Comunicação entre Processos - preload.js)
        event.reply('db-status', "conectado")
      }, 500) //500ms = 0.5s
    }
  })



  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Se o sistema não for MAC encerrar a aplicação quando a janela for fechada
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IMPORTANTE!!!!!!!
// Desconectar do banco de dados quando a aplicação for finalizada
app.on('before-quit', async () => {
  await desconectar()
})

// Reduzir a verbozidade de logs não criticos (devtools)
app.commandLine.appendSwitch('log-level', '3')

// Template do menu
const template = [
  {
    label: 'Notas',
    submenu: [
      {
        label: 'Criar nota',
        accelerator: 'Ctrl+N',
        click: () => noteWindow()
      },
      {
        type: 'separator'
      },
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Ferramentas',
    submenu: [
      {
        label: 'Aplicar zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Recarregar',
        role: "reload"
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools'
      },

    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Repositório',
        click: () => shell.openExternal('https://github.com/brudorea/stickynotes')
      },
      {
        label: 'Sobre',
        click: () => aboutWindow()
      }
    ]
  }
]

// ======================================================
// ==================== CRUD Create =====================

// Recebimento do objeto que contem os dados da nota
ipcMain.on('create-note', async (event, stickyNote) => {
  // IMPORTANTE! Teste de recebimento do objeto (Passo 2)
  console.log(stickyNote)
  // Uso do try-catch para tratamento de excessões
  try {

  } catch (error) {
    console.log(error)
  }
  // Criar uma nova estrutura de dados para salvar no banco
  // Atenção! Os atributos da estrutura precisam ser idênticos ao modelo e os valores são obtidos atraves do objeto stickynote  
  const newNote = noteModel ({
    texto: stickyNote.textNote,
    cor: stickyNote.colorNote
  })
  // Salvar a nota no banco de dados (Passo 3: Fluxo)
  newNote.save()
  // Enviar ao renderizador um pedido para limpar os campos e setar formulario com os padrões originais (foco no texto), usando o preload.js
  event.reply('reset-form')
})


// ================= FIM CRUD Create ====================
// ======================================================

// =======================================================================================================

// ======================== CRUD READ ======================== //
// =========================================================== //

// PASSO 2: Receber o renderer o pedido para listar as notas e fazer a busca no banco de dados
ipcMain.on('list-notes', async (event) => {
  //console.log("Teste IPC [list-notes]")//
  try {
    // PASSO 3: obter do banco a listagem de notas cadastradas
    const notes = await noteModel.find()
    console.log(notes) // teste do passo 3
    // PASSO 4: enviar ao renderer a listagem das notas
    // obs: IPC (string) | banco (JSON) (é necessário conversão usando JSON.stringify())
    // event.reply() resposta a solicitação (específica do solicitante)
    event.reply('render-notes', JSON.stringify(notes)) 
  } catch (error) {
    console.log(error)
  }
})

// ==================== FIM - CRUD READ ====================== //
// =========================================================== //