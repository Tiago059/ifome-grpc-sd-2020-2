const readlineSync = require('readline-sync');

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

function sleep(seconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < seconds * 1000);
}

function imprimirMenu() {
    console.log("------- IFOME --------");
    console.log("Obs: Não somos uma cópia do iFood.\n");
    console.log("1 - Ver Cardápio");
    console.log("2 - Adicionar Item ao Cardápio");
    console.log("0 - Sair");
}

// imprimirMenu();

// var resposta = readlineSync.question("Digite a opcao: ");

function lc() {
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

        //resposta = readlineSync.question("Digite a opcao: ");
    });
}

function adc() {
    const nomeItem = readlineSync.question("Digite o nome do item: ");
    const precoItem = readlineSync.question("Digite o preco do item: ");

    const itemCardapio = {
        nome: nomeItem,
        preco: precoItem
    }

    client.AdicionarItemCardapio(itemCardapio, function (err, response) {

        if (err != null) {
            console.log("Ocorreu um erro invocando o procedimento AdicionarItemCardapio.\n Detalhes: " + JSON.stringify(err.details));
            return;
        }
        console.log("Novo item adicionado com sucesso! Cheque o Cardápio para ver.");
        lc();
    });

}

adc();




/*


while (true) {
    var resposta = readlineSync.question("Digite a opcao: ");

    console.log(resposta);

    console.log("CUUU");
    if (resposta === "1") {
        console.log("AAAAA")
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
        });
        console.log("BOSTA");
        sleep(2);
        console.log("querro morrer");

    }
    else if (resposta === "2") {
        console.log("AAAAA4")
        var nomeItem = readlineSync.question("Digite o nome do item: ");
        var precoItem = readlineSync.question("Digite o preco do item: ");

        client.AdicionarItemCardapio({ nome: nomeItem, preco: precoItem }, function (err, response) {
            if (err != null) {
                console.log("Ocorreu um erro invocando o procedimento AdicionarItemCardapio.\n Detalhes: " + JSON.stringify(err.details));
                return;
            }
            console.log("Novo item adicionado com sucesso! Cheque o Cardápio para ver.");
        });
    }
    else if (resposta === "0") {
        console.log("Lembramos aos nossos clientes que os dados não ficam salvos em disco. Até mais!");
        break;
    }
    else {
        console.log("Foi mal, não entendi nada meu brother. Tenta aí denovo.");
    }

    imprimirMenu();
}

*/


