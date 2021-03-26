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

const servicoIFome = protoDescriptor.servicoIFome;

// Funções de Callback do IFome

function listarCardapio(call, callback) {
    console.log("----- CARDÁPIO -----");
    callback(null, { itemCardapio: {} });
}

function consultarItemCardapio(call, callback) {
    console.log("----- ITEM DO CARDÁPIO -----");
    console.log("\n" + call.request.posicao);
    callback(null, { nome: "Abacate", preco: 4.20 });
}

function adicionarItemCardapio(call, callback) {
    var cardapio = {
        nome: call.request.nome,
        preco: call.request.preco
    };

    console.log("----- NOVO ITEM DO CARDÁPIO -----");
    console.log("\n" + JSON.stringify(cardapio));
    callback(null, {});
}

const server = new grpc.Server();

server.addService(ServicoIFome.service,
    {
        ListarCardapio: listarCardapio,
        ConsultarItemCardapio: consultarItemCardapio,
        AdicionarItemCardapio: adicionarItemCardapio
    });

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();