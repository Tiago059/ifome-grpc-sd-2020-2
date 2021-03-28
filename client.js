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

function menu() {
    console.log("------- IFOME --------");
    console.log("Obs: Não somos uma cópia do iFood.\n");
    console.log("1 - Ver Cardápio");
    console.log("2 - Adicionar Item ao Cardápio");
    console.log("3 - Remover Item do Cardápio")
    console.log("0 - Sair");

    var resposta = readlineSync.question("Digite a opcao: ");

    switch (resposta) {
        case "1": listarCardapio(); break;
        case "2": adicionarItemCardapio(); break;
        case "3": removerItemCardapio(); break;
        case "0": console.log("Lembramos aos nossos clientes que os dados não ficam salvos em disco. Até mais!"); break;
    }
}

function listarCardapio() {
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

        menu();
    });
}

function adicionarItemCardapio() {
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

        console.log("Novo item adicionado com sucesso! Cheque o Cardápio para ver.\n");
        menu();
    });

}

function removerItemCardapio() {
    const nomeItem = readlineSync.question("Digite o nome do item a ser removido: ");

    client.RemoverItemCardapio({ nome: nomeItem }, function (err, response) {

        if (err != null) {
            console.log("Item não encontrado ou cardápio está vazio.");
            menu();
            return;
        }
        else {
            console.log("Item removido com sucesso! Cheque o Cardápio para ver.\n");
            menu();
        }

    });

}

menu();