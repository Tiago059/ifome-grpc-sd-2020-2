const prompt = require('prompt-sync')({sigint: true});

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


/**
 * Simula pausa na execução, simulando uma espera.
 * @returns {} Retorno vazio em caso de erro.
 */
function sleep(seconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < seconds * 1000);
}

var cardapio = []

cliente_pedido = {pedido: [
    { numero: 0, nome: "Pizza", preco: 15.06 , quantidade: 4}
]}


/**
 * Interface de usuário para execução de instruições.
 * @returns {} Retorno vazio em caso de erro.
 */
function menu() {
    console.log("------- IFOME --------");
    console.log("Obs: Não somos uma cópia do iFood.\n");
    console.log("1 - Ver Cardápio");
    console.log("2 - Adicionar Item ao Cardápio");
    console.log("3 - Remover Item do Cardápio")
    console.log("4 - Adicionar Item ao Pedido")
    console.log("5 - Remover Item do Pedido")
    console.log("6 - Enviar Pedido")
    console.log("7 - Consultar Pedido Enviado");
    console.log("0 - Sair");

    var resposta = prompt("Digite a opcao: ");

    switch (resposta) {
        case "1": listarCardapio(); break;
        case "2": adicionarItemCardapio(); break;
        case "3": removerItemCardapio(); break;
        case "4": adicionarItemPedido(); break;
        case "5": removerItemPedido(); break;
        case "6": adicionarPedido(); break;
        case "7": consultarPedido(); break;
        case "0": console.log("Lembramos aos nossos clientes que os dados não ficam salvos em disco. Até mais!"); client.close(); break;
    }
}

/**
 * Carrega cardápio localmente no cliente a partir de requisição da ultima versão do cardápio no servidor.
 * @returns {} Retorno vazio em caso de erro.
 */
function carregarCardapio() {
    sleep(2)
    client.ListarCardapio({}, function (err, response) {
        sleep(1)
        if (err != null) {
            console.log("Programa iniciado com erro. Por favor reinicie.\n");
            return;
        }
        cardapio = response.cardapio;
        if(cardapio == null){
            console.log("Programa iniciado com erro. Por favor reinicie")
        }else{
            console.log("Base de dados carregada com sucesso.")
        }
        menu()
    });
}

/**
 * Lista cardápio a partir de requisição da ultima versão do cardápio no servidor.
 * @returns {} Retorno vazio em caso de erro.
 */
function listarCardapio() {
    client.ListarCardapio({}, function (err, response) {
        if (err != null) {
            console.log("Ocorreu um erro invocando o procedimento ListarCardapio.\n Detalhes: " + JSON.stringify(err.details));
            return;
        }
        cardapio = response.cardapio;
        console.log("----- CARDÁPIO -------");
        for (const [index, element] of cardapio.entries()) {
            console.log(""+(index+1)+" - " + element.nome + "\t\tR$ " + element.preco);
        }
        menu();
    });
}

/**
 * Adiciona item ao cardápio no servido, com atualização do cardápio local do cliente.
 * @returns {} Retorno vazio em caso de erro.
 */
function adicionarItemCardapio() {
    const nomeItem = prompt("Digite o nome do item: ");
    const precoItem = prompt("Digite o preco do item: ");
    const itemCardapio = {
        nome: nomeItem,
        preco: precoItem
    }

    client.AdicionarItemCardapio(itemCardapio, function (err, response) {
        if (err != null) {
            console.log("Ocorreu um erro invocando o procedimento AdicionarItemCardapio.\n Detalhes: " + JSON.stringify(err.details));
            return;
        }
        cardapio = response.cardapio;
        console.log("Novo item adicionado com sucesso! Cheque o Cardápio para ver.\n");
        menu();
    });
}

/**
 * Remove item do cardápio no servido, com atualização do cardápio local do cliente.
 * @returns {} Retorno vazio em caso de erro.
 */
function removerItemCardapio() {
    const nomeItem = prompt("Digite o nome do item a ser removido: ");
    client.RemoverItemCardapio({ nome: nomeItem }, function (err, response) {
        if (err != null) {
            console.log("Item não encontrado ou cardápio está vazio.");
            menu();
            return;
        }
        else {
            cardapio = response.cardapio;
            console.log("Item removido com sucesso! Cheque o Cardápio para ver.\n");
            menu();
        }
    });
}

/**
 * Envia pedido montado localmente no cliente para adição em lista de pedidos no servidor.
 * @returns {} Retorno vazio em caso de erro.
 */
function adicionarPedido(){
    const Pedido = cliente_pedido
    const entregar = prompt("Digite 'S' case deseje separar para entrega, 'N' caso contrário; ");  
    client.AdicionarPedido(Pedido, function (err, response) {
        if (err != null){
            console.log("Ocorreu um erro invocando o procedimento AdicionarPedido.\n Detalhes: " + JSON.stringify(err.details));
            menu();
            return;
        }
        const numero_pedido = response.posicao
        console.log(`Pedido enviado com sucesso. O número do seu pedido é: ${numero_pedido}.\n`);
        if ((entregar == 'S') || (entregar == 's')){
            client.EntregarPedido(Pedido, function (err, response) {
                if (err != null){
                    console.log("Ocorreu um erro invocando o procedimento EntregarPedido.\n Detalhes: " + JSON.stringify(err.details));
                    menu();
                    return;
                }
                const numero_pedido = response.posicao
                console.log(`Pedido adicionado para entrega com sucesso. Sua posição para entrega é: ${numero_pedido}.\n`);
                menu();
            })
        }else{
            menu();
        }        
    })    
}

/**
 * Consulta pedido no servidor a partir de número de retorno ao enviar pedido.
 * @returns {} Retorno vazio em caso de erro.
 */
function consultarPedido(){
    const numero_pedido = prompt('Digite o número do pedido que deseja consultar:');
    client.ConsultarPedido({posicao:numero_pedido}, function(err, response){
        if(err != null){
            console.log("Pedido não encontrado.");
            menu();
            return;
        }
        const pedido = response.pedido
        for (i in pedido){
            console.log(pedido[i].nome + "\t\tR$ " + pedido[i].preco + "\t\tQtd.: " + pedido[i].quantidade);                
        }
        menu();        
    });
}

/**
 * Adicionar item a lista local de pedidos, realizando incremento quando item já existente.
 * @returns {} Retorno vazio em caso de erro.
 */
function adicionarItemPedido(){   
    console.log("\n----- CARDÁPIO -------");
    for (const [index, element] of cardapio.entries()) {
        console.log(""+(index+1)+" - " + element.nome + "\t\tR$ " + element.preco);
    }
    const numeroItem = (parseInt(prompt("Digite o numero do item no cardápio: ")))-1
    const quantidadeItem = parseInt(prompt("Digite a quantidade do item: "))

    var item = cardapio[numeroItem]

    if (item == null){
        console.log("Item não encontrato no cardápio.\n")
        menu()
        return;
    } 
    pedido = cliente_pedido.pedido
    var novo_item = 1;
    for (i in pedido){
        if (item.nome === pedido[i].nome){
            pedido[i].quantidade = pedido[i].quantidade + quantidadeItem
            novo_item = 0
        }
    }
        
    if(novo_item === 1){
        const itemPedido = {
            numero: 0,
            nome: item.nome,
            preco: item.preco,
            quantidade: quantidadeItem
        }    
        cliente_pedido.pedido.push(itemPedido)
    }
    
    console.log("----- PEDIDO -----")
    pedido = cliente_pedido.pedido
 
    for (const [index, element] of pedido.entries()) {
        console.log(""+(index+1)+" - " + element.nome + "\t\tR$ " +element.preco + "\t\tQtd.: " + element.quantidade);
    }
    menu();
}

/**
 * Remove item da lista local de pedidos a partir do decremento da quantidade de determinado item.
 * @returns {} Retorno vazio em caso de erro.
 */
function removerItemPedido(){   
    console.log("\n----- PEDIDO -----");
    pedido = cliente_pedido.pedido

    for (const [index, element] of pedido.entries()) {
        console.log(""+(index+1)+" - " + element.nome + "\t\tR$ " +element.preco + "\t\tQtd.: " + element.quantidade);
    }
    const numeroItem = (parseInt(prompt("Digite o numero do item do pedido: ")))-1
    const quantidadeItem = parseInt(prompt("Digite a quantidade do pedido: "))

    var item = pedido[numeroItem]

    if (item == null){
        console.log("Item não encontrato no pedido.\n")
        menu()
        return;
    } 
    if(quantidadeItem < item.quantidade){
        item.quantidade = item.quantidade - quantidadeItem
    }else{
        pedido.splice(numeroItem, 1);
    }
 
    console.log("----- PEDIDO-----")
    
    for (i in pedido){
        console.log(pedido[i].nome + "\t\tR$ " + pedido[i].preco + "\t\tQtd.: " + pedido[i].quantidade);                
    }
    menu();
}

carregarCardapio()