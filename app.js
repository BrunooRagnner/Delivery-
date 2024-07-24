const produtos = [
    { nome: "Hamburguer Clássico", preco: 20.00, descricao: "Delicioso hambúrguer com carne 100% bovina", imagem: "cheeseburguer.jpeg" },
    { nome: "Cheeseburguer", preco: 22.00, descricao: "Hambúrguer com queijo derretido e bacon", imagem: "cheeseburguer.jpeg" },
    { nome: "Veggie Burger", preco: 18.00, descricao: "Hambúrguer vegetariano com legumes frescos", imagem: "cheeseburguer.jpeg" }
];

const taxaEntrega = 2.00;
let totalPedido = 0;
const produtosPedido = [];
const numeroHamburgueria = "+5584991612793"; // Número da hamburgueria

function atualizarTotal() {
    const incluirTaxa = document.getElementById('incluirTaxa').checked;
    const totalFinal = incluirTaxa ? totalPedido + taxaEntrega : totalPedido;
    document.getElementById('totalPedido').textContent = `Total do Pedido: R$ ${totalFinal.toFixed(2)}`;
}

function adicionarProduto(nome, preco) {
    produtosPedido.push({ nome, preco });
    totalPedido += preco;
    atualizarTotal();
    renderizarProdutosPedido();
}

function removerProduto(nome) {
    const index = produtosPedido.findIndex(produto => produto.nome === nome);
    if (index !== -1) {
        totalPedido -= produtosPedido[index].preco;
        produtosPedido.splice(index, 1);
        atualizarTotal();
        renderizarProdutosPedido();
    }
}

function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = produto.imagem;
    img.alt = produto.nome;
    card.appendChild(img);

    const h3 = document.createElement('h3');
    h3.textContent = produto.nome;
    card.appendChild(h3);

    const pDescricao = document.createElement('p');
    pDescricao.textContent = produto.descricao;
    card.appendChild(pDescricao);

    const pPreco = document.createElement('p');
    pPreco.textContent = `R$ ${produto.preco.toFixed(2)}`;
    card.appendChild(pPreco);

    const buttonAdicionar = document.createElement('button');
    buttonAdicionar.textContent = 'Adicionar ao Pedido';
    buttonAdicionar.addEventListener('click', () => adicionarProduto(produto.nome, produto.preco));
    card.appendChild(buttonAdicionar);

    return card;
}

function renderizarProdutos() {
    const container = document.getElementById('produtos');
    container.innerHTML = '';
    produtos.forEach(produto => {
        const card = criarCardProduto(produto);
        container.appendChild(card);
    });
}

function renderizarProdutosPedido() {
    const container = document.getElementById('produtosPedido');
    container.innerHTML = '';
    produtosPedido.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produtoPedido';
        div.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)}`;

        const buttonRemover = document.createElement('button');
        buttonRemover.textContent = 'Remover';
        buttonRemover.addEventListener('click', () => removerProduto(produto.nome));
        div.appendChild(buttonRemover);

        container.appendChild(div);
    });
}

function abrirModal() {
    document.getElementById('confirmationModal').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('confirmationModal').style.display = 'none';
}

function confirmarPedido() {
    const nome = document.getElementById('nomeCliente').value;
    const endereco = document.getElementById('enderecoCliente').value;
    const telefone = document.getElementById('telefoneCliente').value;
    const pagamento = document.querySelector('input[name="pagamento"]:checked').value;
    const precisaTroco = document.getElementById('troco').checked;
    const incluirTaxa = document.getElementById('incluirTaxa').checked;

    if (!nome || !endereco || !telefone) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const mensagemCliente = `
*Pedido Confirmado!*

Nome: ${nome}
Endereço: ${endereco}
Telefone: ${telefone}
Forma de Pagamento: ${pagamento}
Precisa de Troco: ${precisaTroco ? 'Sim' : 'Não'}
Incluir Taxa de Entrega: ${incluirTaxa ? 'Sim' : 'Não'}
Itens do Pedido:
${produtosPedido.map(produto => `- ${produto.nome} - R$ ${produto.preco.toFixed(2)}`).join('\n')}
Total: R$ ${(totalPedido + (incluirTaxa ? taxaEntrega : 0)).toFixed(2)}
    `;

    const mensagemHamburgueria = `
Novo pedido #${Math.floor(Math.random() * 1000)} de ${nome}:

Telefone do Cliente: ${telefone}
${produtosPedido.map(produto => `${produto.nome} - R$ ${produto.preco.toFixed(2)}`).join('\n')}

Total: R$ ${(totalPedido + (incluirTaxa ? taxaEntrega : 0)).toFixed(2)}

Método de Pagamento: ${pagamento}
Precisa de Troco: ${precisaTroco ? 'Sim' : 'Não'}
Incluir Taxa de Entrega: ${incluirTaxa ? 'Sim' : 'Não'}
Localização: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}
    `;

    const telefoneFormatado = telefone.replace(/\D/g, '');
    const urlWhatsAppCliente = `https://wa.me/${telefoneFormatado}?text=${encodeURIComponent(mensagemCliente)}`;
    const urlWhatsAppHamburgueria = `https://wa.me/${numeroHamburgueria}?text=${encodeURIComponent(mensagemHamburgueria)}`;

    // Enviar a mensagem para a hamburgueria
    window.open(urlWhatsAppHamburgueria, '_blank');
    
    // Enviar a confirmação para o cliente
    window.open(urlWhatsAppCliente, '_blank');
    
    fecharModal();
    // Limpar os campos do pedido após o envio
    document.getElementById('nomeCliente').value = '';
    document.getElementById('enderecoCliente').value = '';
    document.getElementById('telefoneCliente').value = '';
    document.getElementById('troco').checked = false;
    document.getElementById('incluirTaxa').checked = false;
    totalPedido = 0;
    produtosPedido.length = 0;
    atualizarTotal();
    renderizarProdutosPedido();
}

document.getElementById('gerarPedido').addEventListener('click', abrirModal);
document.getElementById('confirmarPedido').addEventListener('click', confirmarPedido);
document.getElementById('cancelarPedido').addEventListener('click', fecharModal);

// Inicializar a exibição dos produtos
renderizarProdutos();