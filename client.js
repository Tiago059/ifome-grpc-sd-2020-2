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


const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).ifome;

const client = new protoDescriptor.IFome('localhost:50051', grpc.credentials.createInsecure());

client.ListarCardapio({}, function (err, response) {
    if (err != null) {
        console.log("Ocorreu um erro invocando o procedimento ListarCardapio.\n Detalhes: " + JSON.stringify(err.details));
        return;
    }

    // Pegamos o resultado da requisição, que no nosso caso é aquela variável cardápio...
    const cardapio = response.cardapio;
    console.log("----- CARDÁPIO -------\n");
    for (var i = 0; i < cardapio.length; i++) {
        console.log(cardapio[i].nome + "\t\tR$ " + cardapio[i].preco + "\n");
    }

});

