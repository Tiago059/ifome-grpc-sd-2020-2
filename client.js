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


const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).ifome;

const client = new protoDescriptor.IFome('localhost:50051', grpc.credentials.createInsecure());

function imprimirMenu() {
    console.log("------- IFOME --------");
    console.log("Obs: Não somos uma cópia do iFood.\n");
    console.log("1 - Ver Cardápio\n");
    console.log("0 - Sair\n");
    console.log("Digite a opção: ");
}

imprimirMenu();

rl.on('line', line => {

    if (line === "1") {
        client.ListarCardapio({}, function (err, response) {
            if (err != null) {
                console.log("Ocorreu um erro invocando o procedimento ListarCardapio.\n Detalhes: " + JSON.stringify(err.details));
                return;
            }

            // Pegamos o resultado da requisição, que no nosso caso é aquela variável cardápio...
            const cardapio = response.cardapio;
            console.log("----- CARDÁPIO -------");
            for (var i = 0; i < cardapio.length; i++) {
                console.log(cardapio[i].nome + "\t\tR$ " + cardapio[i].preco);
            }

            console.log("\n");

            imprimirMenu();
        });

    }
    else if (line === "0") {
        console.log("Lembramos aos nossos clientes que os dados não ficam salvos em disco. Até mais!");
        rl.close();
    }
    else {
        console.log("Foi mal, não entendi. Tenta aí denovo.");
        imprimirMenu();
    }



});