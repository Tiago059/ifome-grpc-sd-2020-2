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
    { nome: "Ketchup", preco: 0.15 }
]

function listarCardapio(call, callback) {
    console.log("----- CARDÁPIO -----");
    callback(null, { cardapio: cardapio });
}

function consultarItemCardapio(call, callback) {
    console.log("----- ITEM DO CARDÁPIO -----");

    var nome = call.request.nome;
    console.log("\n" + nome);

    let resultado = null;

    for (var i = 0; i < cardapio.length; i++) {
        if (cardapio[i].nome === nome) {
            resultado = cardapio[i];
            break;
        }
    }

    if (resultado != null) {
        callback(null, { itemCardapio: resultado });
    }
    else {
        callback(null, { erro: "Item não encontrado..." });
    }

}


function adicionarItemCardapio(call, callback) {
    const itemCardapio = call.request.itemCardapio;

    cardapio.push(itemCardapio);

    callback(null, {});
}

const server = new grpc.Server();

server.addService(protoDescriptor.IFome.service, {
    ListarCardapio: listarCardapio,
    ConsultarItemCardapio: consultarItemCardapio,
    AdicionarItemCardapio: adicionarItemCardapio
})

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());

server.start();

console.log("Servidor iniciado na porta 50051, mas ninguém liga...");