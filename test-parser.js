const fs = require('fs');
const path = require('path');
const { extrairDadosFormulario1 } = require('./parserForm1');

console.log('1. Iniciando o teste do parser...');

// Caminho absoluto para evitar dúvidas de onde o Node está procurando
const caminhoRelatorio = path.join(__dirname, 'relatorio.txt');
console.log('2. Procurando arquivo em:', caminhoRelatorio);

if (!fs.existsSync(caminhoRelatorio)) {
    console.error('ERRO: O arquivo relatorio.txt NÃO foi encontrado nessa pasta!');
    process.exit(1);
}

const texto = fs.readFileSync(caminhoRelatorio, 'utf-8');

if (!texto.trim()) {
    console.error('AVISO: O arquivo relatorio.txt está VAZIO!');
    process.exit(1);
}

console.log('3. Conteúdo lido do arquivo relatorio.txt:');
console.log('----------------------------------------');
console.log(texto);
console.log('----------------------------------------');

// Executa a extração
const resultado = extrairDadosFormulario1(texto);

console.log('4. RESULTADO FINAL EXTRAÍDO COM SUCESSO:');
console.dir(resultado, { depth: null, colors: true });