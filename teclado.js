// importação do pacote readline.
const readline = require('readline');

// cria um objeto readline que se conecta à entrada padrão (teclado) e
// à saída padrão (tela)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// imprime algumas instruções simples na tela
console.log("Digite quantas linhas de texto quiser que eu imprimo de volta! :)");
console.log("Quando não quiser mais, digite a palavra FIM.\n");

// o pulo do gato! A função "on" bloqueia o processo aguardando que um
// determinado evento aconteça, nesse caso o evento "line" (que ocorre quando
// uma linha é concluída com o ENTER). Sempre que o evento ocorre, ele passa
// a linha como parâmetro para uma função
rl.on('line', line => {
    // compara a linha com a palavra FIM. Se for igual, fecha o fluxo do
    // objeto "rl", o que faz com que a execução do processo seja concluído
    if (line === "FIM") {
        rl.close();
    }
    
    // imprime na tela a linha digitada
    console.log("Linha digitada: " + line);
});