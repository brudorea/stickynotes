/**
 * Processo de renderização do documento index.html
 */

console.log("Processo de renderização")

// estratégia para renderizar(desenhar) as notas adesivas:
// usar uma lista para preencher de forma dinâmica os itens(notas)

// vetor global para manipular os dados do banco 
let arrayNotes = []

// captura do id da list <ul> do documento index.html
const list = document.getElementById('listNotes')

// inserção da data no rodapé
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return data.toLocaleDateString('pt-BR', options)
}

document.getElementById('dataAtual').innerHTML = obterData()

// Troca do ícone do banco de dados (status da conexão)
// Uso da API do preload.js
api.dbStatus((event, message) => {
    //teste de recebimento da mensagem
    console.log(message)
    if (message === "conectado") {
        document.getElementById('iconeDB').src = "../public/img/dbon.png"
    } else {
        document.getElementById('iconeDB').src = "../public/img/dboff.png"    
    }
})

// ======================== CRUD READ ======================== //
// =========================================================== //

// PASSO 1: Enviar ao main um pedido para listr notas
api.listNotes()

// PASSO 5: Recebimento das notas via IPC e renderização
api.renderNotes((event, notes) => {
    const renderNotes = JSON.parse(notes) // JSON.parse converte de string para JSON
    console.log(renderNotes) // teste de recebimento do passo 5
    // renderizar no index.html o conteudo do array
    arrayNotes = renderNotes // atribuir ao vetor o JSON recebido
    // uso do laço forEach para percorrer o vetor e extrair os dados
    arrayNotes.forEach ((n) => {
        // adição de tags <li> no documento index.html
        list.innerHTML += `
        <br>
        <li>
            <p>${n._id}</p>
            <p>${n.texto}</p>
            <p>${n.cor}</p>
        </li>
        `
    })

})


// ==================== FIM - CRUD READ ====================== //
// =========================================================== //
