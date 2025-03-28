/**
 * Processo de renderização do documento nota.html *
 */

// Para "debugar" e testar a aplicação é necessário ativar as ferramentas do desenvolvidor <ctrl><shift><i>

// Capturar o foco da caixa de texto 
const foco = document.getElementById('inputNote')

// Alterar as propriedades do documento html ao iniciar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    foco.focus() //iniciar o documento com foco na caixa de texto
})

// Capturar os dados formulário (Passo 1: Fluxo)
let frmNote = document.getElementById('frmNote')
let note = document.getElementById('inputNote')
let color = document.getElementById('selectColor')

// ============================================================================================================
// ==================== CRUD Create =====================

// Evento relacionado ao botão submit
frmNote.addEventListener('submit', (event) => {
    // Evitar o comportamento padrão (recarregar a pagina)
    event.preventDefault()
    // IMPORTANTE! (teste de recebimento dos dados do form - Passo 1)
    console.log(note.value, color.value)
    // Crair um objeto para enviar ao main os dados da nota
    const stickyNote = {
        textNote: note.value,
        colorNote: color.value
    }
    // Enviar o objeto para o main (Passo 2: Fluxo)
    api.createNote(stickyNote)
})

// ================= FIM CRUD Create ====================
// ============================================================================================================
// ================= Resetar o formulário ====================

api.resetForm((args) => {
    // recarregar a pagina
    location.reload()
})



// ================= FIM - Resetar o formulário ====================