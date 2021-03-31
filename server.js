const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const grpc = require('grpc');

const PROTO_PATH = "./ifome.proto";

const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });


var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).ifome;

const cardapio = [
    { nome: "Pizza", preco: 15.06 },
    { nome: "Sorvete", preco: 2.09 },
    { nome: "Lasanha", preco: 18.12 }
]

let pedidos = []

let entregar = []

/**
 * Envia cardápio para cliente;
 * @returns {ListaDeItensDoCardapio} Retorno de estrutura ListaDeItensDoCardapio correspondente ao cardápio.
 */
function listarCardapio(call, callback) {
    console.log("Carregando Cardápio\n") 
    callback(null, { cardapio: cardapio });
}

/**
 * Adiciona estrutura de itemCardápio ao cardápio local;
 * @param  {ItemCardapio} call.request estrutura ItemCardapio;
 * @returns {ListaDeItensDoCardapio} Retorno de estrutura ListaDeItensDoCardapio correspondente ao cardápio.
 */
function adicionarItemCardapio(call, callback) {
    console.log("-> Adicionando novo item ao Cardápio!");

    cardapio.push(call.request);
    callback(null, { cardapio: cardapio });
}

/**
 * Remove estrutura de itemCardápio do cardápio local;
 * @param  {Nome} call.request.nome nome para pesquisa no cardápio;
 * @returns {ListaDeItensDoCardapio} Retorno de estrutura ListaDeItensDoCardapio correspondente ao cardápio.
 */
function removerItemCardapio(call, callback) {
    console.log("-> Removendo item do Cardápio!");

    var resultado = 0;

    for (var i = 0; i < cardapio.length; i++) {
        if (cardapio[i].nome === call.request.nome) {
            cardapio.splice(i, 1);
            resultado = 1;
            break;
        }
    }

    if (resultado === 1) {
        console.log("OK!");
        callback(null, { cardapio: cardapio });
    }
    else {
        console.log("Item não encontrado/cardápio vazio.");
        callback({}, "erro");
    }
}

/**
 * Adiciona estrutura de itemPedido a lista de pedidos local;
 * @param  {Pedido} call.request.pedido estrutura Pedido para adição;
 * @returns {Posicao} Retorno de estrutura Posicao correspondente a numero do pedido.
 */
function adicionarPedido(call, callback) {
    console.log("-> Adicionando Pedido!");

    cliente_pedido = call.request.pedido
    numero_pedido = pedidos.length+1
    for (i in cliente_pedido){
        cliente_pedido[i].numero = numero_pedido
    }
    
    pedidos.push(cliente_pedido)    
    callback(null, {posicao: numero_pedido});
}

/**
 * Adiciona estrutura de itemPedido a lista de entrega local;
 * @param  {Pedido} call.request.pedido estrutura Pedido para adição;
 * @returns {Posicao} Retorno de estrutura Posicao correspondente a numero de entrega do pedido.
 */
function entregarPedido(call, callback) {
    console.log("-> Adicionando pedido para entrega!");

    cliente_pedido = call.request.pedido
    numero_pedido = entregar.length+1
       
    entregar.push(cliente_pedido)    
    callback(null, {posicao: numero_pedido});
}

/**
 * Consulta estrutura de itemPedido a lista de pedidos local a partir de numero posição da inserção;
 * @param  {Posicao} call.request.posicao estrutura Posicao para realização de consulta;
 * @returns {Pedido} Retorno de estrutura Pedido correspondente ao pedido inserico ao adicionar na lista de pedidos.
 */
function consultarPedido(call, callback){
    console.log("-> Verificando...");
    numero_pedido = call.request.posicao
    callback(null, {pedido: pedidos[numero_pedido-1]})
}

const server = new grpc.Server();

server.addService(protoDescriptor.IFome.service, {
    ListarCardapio: listarCardapio,
    AdicionarItemCardapio: adicionarItemCardapio,
    RemoverItemCardapio: removerItemCardapio,
    AdicionarPedido: adicionarPedido,
    ConsultarPedido: consultarPedido,
    EntregarPedido: entregarPedido
})

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());

server.start();

console.log("Servidor iniciado na porta 50051");