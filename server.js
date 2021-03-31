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

function listarCardapio(call, callback) {
    console.log("-> Exibindo Cardápio!");    
    callback(null, { cardapio: cardapio });
}

function adicionarItemCardapio(call, callback) {
    console.log("-> Adicionando novo item ao Cardápio!");

    cardapio.push(call.request);
    //callback(null, {});
    callback(null, { cardapio: cardapio });
}

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
        //callback(null, {});
        callback(null, { cardapio: cardapio });
    }
    else {
        console.log("Item não encontrado/cardápio vazio.");
        callback({}, "erro");
    }
}

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

function entregarPedido(call, callback) {
    console.log("-> Adicionando pedido para entrega!");

    cliente_pedido = call.request.pedido
    numero_pedido = entregar.length+1
       
    entregar.push(cliente_pedido)    
    callback(null, {posicao: numero_pedido});
}

function consultarPedido(call, callback){
    console.log("-> Verificando...");
    numero_pedido = call.request.posicao
    callback(null, {pedido: pedidos[numero_pedido-1]})
}

const server = new grpc.Server();

server.addService(protoDescriptor.IFome.service, {
    ListarCardapio: listarCardapio,
    ConsultarItemCardapio: consultarItemCardapio,
    AdicionarItemCardapio: adicionarItemCardapio,
    RemoverItemCardapio: removerItemCardapio,
    AdicionarPedido: adicionarPedido,
    ConsultarPedido: consultarPedido,
    EntregarPedido: entregarPedido
})

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());

server.start();

console.log("Servidor iniciado na porta 50051");