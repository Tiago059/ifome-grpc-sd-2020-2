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

const client = new protoDescriptor.ServicoIFome('localhost:50051', grpc.credentials.createInsecure());

client.ListarCardapio({}, function (err, response) {
    if (err != null) {
        console.log("Ocorreu um erro invocando o procedimento ListarCardapio. Detalhes: " + JSON.stringify(err));
        return;
    }

    console.log("----- CARDÁPIO -------\n" + JSON.stringify(response.cardapio));
});

