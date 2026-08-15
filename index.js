const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { extrairDadosFormulario1 } = require('./parserForm1');

function obterTextoRelatorio() {
    const caminhoArquivo = path.join(__dirname, 'relatorio.txt');
    if (fs.existsSync(caminhoArquivo)) {
        return fs.readFileSync(caminhoArquivo, 'utf-8');
    }
    throw new Error('Arquivo relatorio.txt não encontrado.');
}

function aguardarComando(mensagem) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(mensagem, resposta => {
        rl.close();
        resolve(resposta);
    }));
}

/**
 * Preenche o dropdown Select2 (jQuery) no SIPOM
 */
async function selecionarSelect2(page, labelCampo, valorBusca, valorOpcao) {
    try {
        console.log(`Buscando ${labelCampo}: "${valorOpcao}"...`);

        const containerSelect2 = page.locator(`
            div.form-group:has-text("${labelCampo}") .select2-container,
            div:has-text("${labelCampo}") + .select2-container,
            .select2-container:has-text("${labelCampo}")
        `).first();

        const elementoClique = (await containerSelect2.isVisible().catch(() => false))
            ? containerSelect2
            : page.locator('.select2-container').first();

        await elementoClique.waitFor({ state: 'visible', timeout: 8000 });
        await elementoClique.click();
        await page.waitForTimeout(300);

        const campoBusca = page.locator('.select2-search__field, input.select2-search__field').last();

        if (await campoBusca.isVisible({ timeout: 1500 }).catch(() => false)) {
            await campoBusca.fill(valorBusca);
            await page.waitForTimeout(400);
        }

        const opcao = page.locator(`.select2-results__option:has-text("${valorOpcao}")`).first();
        await opcao.waitFor({ state: 'visible', timeout: 5000 });
        await opcao.click();

        console.log(`✅ ${labelCampo} preenchido com sucesso!`);
        return true;
    } catch (error) {
        console.warn(`⚠️ Não foi possível selecionar ${labelCampo} ("${valorOpcao}").`);
        await page.keyboard.press('Escape').catch(() => { });
        return false;
    }
}

/**
 * Preenche o modal de Adicionar Pessoa (Formulário 2) via injeção DOM e sincronização de eventos
 */
async function preencherModalPessoa(page, pessoa) {
    try {
        console.log(`\nAbrindo modal para pessoa: [${pessoa.tipo} - ${pessoa.nome}]...`);

        // 1. Clica no botão "+ Pessoa"
        const btnAddPessoa = page.locator('button[data-target="#modalPessoa"], button:has(.fa-plus):has-text("Pessoa")').first();
        await btnAddPessoa.waitFor({ state: 'visible', timeout: 8000 });
        await btnAddPessoa.click();

        // 2. Aguarda a abertura do modal
        const modalPessoa = page.locator('#modalPessoa');
        await modalPessoa.waitFor({ state: 'visible', timeout: 8000 });
        await page.waitForTimeout(500);

        // 3. Seleciona o tipo no dropdown ("Pessoas Envolvidas")
        const selectTipo = page.locator('#modalPessoa select').first();
        await selectTipo.waitFor({ state: 'visible', timeout: 5000 });

        try {
            await selectTipo.selectOption({ label: pessoa.tipo });
        } catch (e) {
            const optionValue = await selectTipo.evaluate((select, tipo) => {
                const options = Array.from(select.options);
                const match = options.find(opt => opt.text.toLowerCase().includes(tipo.toLowerCase()));
                return match ? match.value : options[1]?.value;
            }, pessoa.tipo);

            if (optionValue) {
                await selectTipo.selectOption(optionValue);
            }
        }

        await selectTipo.dispatchEvent('change');
        await selectTipo.dispatchEvent('input');
        await page.waitForTimeout(300);

        // 4. Preenche CPF (se houver)
        if (pessoa.cpf) {
            console.log(`Preenchendo CPF: ${pessoa.cpf}...`);
            const inputCPF = page.locator('#modalPessoa input[name="cpf"], #modalPessoa #cpf').first();
            await inputCPF.fill(pessoa.cpf);
            await inputCPF.dispatchEvent('change');
            await inputCPF.dispatchEvent('blur');
            await page.waitForTimeout(1000);
        }

        // 5. Preenche Nome Completo
        if (pessoa.nome) {
            console.log(`Preenchendo Nome: "${pessoa.nome}"...`);
            const inputNome = page.locator('#modalPessoa input[name="nome"]').first();
            await inputNome.waitFor({ state: 'visible', timeout: 8000 });
            await inputNome.click();
            await inputNome.fill('');
            await inputNome.fill(pessoa.nome);
            await inputNome.dispatchEvent('input');
            await inputNome.dispatchEvent('change');
        }

        // 6. Preenche Sexo (1 = Masculino, 2 = Feminino)
        if (pessoa.sexo) {
            console.log(`Selecionando Sexo: ${pessoa.sexo}...`);
            const selectSexo = page.locator('#modalPessoa select[name="sexo"]').first();
            const valorSexo = pessoa.sexo.toUpperCase().startsWith('F') ? '2' : '1';
            await selectSexo.selectOption(valorSexo).catch(() => { });
            await selectSexo.dispatchEvent('change');
            await selectSexo.dispatchEvent('input');
        }

        // 7. Preenche Data de Nascimento (04/12/1997 -> 1997-12-04 para input date)
        if (pessoa.nascimento) {
            console.log(`Preenchendo Data de Nascimento: ${pessoa.nascimento}...`);
            const selectorNasc = '#modalPessoa input[name="nascimento"]';

            let dataIso = pessoa.nascimento;
            if (pessoa.nascimento.includes('/')) {
                const [d, m, a] = pessoa.nascimento.split('/');
                dataIso = `${a}-${m}-${d}`;
            }

            await page.evaluate(({ selector, valIso, valBr }) => {
                const input = document.querySelector(selector);
                if (input) {
                    input.value = valIso;
                    if (!input.value) {
                        input.value = valBr;
                    }
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new Event('blur', { bubbles: true }));
                }
            }, { selector: selectorNasc, valIso: dataIso, valBr: pessoa.nascimento });
        }

        // 8. Preenche Nome da Mãe
        if (pessoa.mae) {
            console.log(`Preenchendo Nome da Mãe: "${pessoa.mae}"...`);
            const selectorMae = '#modalPessoa input[name="mae"]';

            await page.evaluate(({ selector, val }) => {
                const input = document.querySelector(selector);
                if (input) {
                    input.value = val;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new Event('blur', { bubbles: true }));
                }
            }, { selector: selectorMae, val: pessoa.mae });
        }

        // 9. Morte (padrão: NÃO)
        const selectMorte = page.locator('#modalPessoa select[name="morte"], #modalPessoa select').last();
        await selectMorte.selectOption({ label: pessoa.morte || 'NÃO' }).catch(() => { });

        await page.waitForTimeout(600);

        // 10. Confirma a inclusão
        console.log('Confirmando inclusão da pessoa...');
        const btnAdicionar = page.locator('#modalPessoa button:has-text("Adicionar")').first();
        await btnAdicionar.click();
        await page.waitForTimeout(1000);

        console.log(`✅ Pessoa (${pessoa.tipo} - ${pessoa.nome}) adicionada com sucesso!`);
    } catch (error) {
        console.warn('⚠️ Falha ao preencher pessoa:', error.message);
        await page.keyboard.press('Escape').catch(() => { });
    }
}
/**
 * Executa o fluxo de Pessoas na tela de detalhes
 */
async function executarFormulario2(page, dados) {
    console.log('\nVerificando a tela "Detalhando a ocorrência"...');

    const abaPessoas = page.locator('text="Pessoas"').first();
    if (await abaPessoas.isVisible().catch(() => false)) {
        await abaPessoas.click().catch(() => { });
    }

    if (dados.pessoas && dados.pessoas.length > 0) {
        for (const pessoa of dados.pessoas) {
            await preencherModalPessoa(page, pessoa);
        }
    }

    console.log('----------------------------------------------------');
    console.log('ETAPA DE PESSOAS FINALIZADA!');
    console.log('----------------------------------------------------');
}

/**
 * Preenche o modal de Procedimento (Formulário 3)
 */
async function preencherModalProcedimento(page, procedimentoData) {
    try {
        console.log('\nIniciando preenchimento da aba Procedimentos...');

        const abaProcedimentos = page.locator('text="Procedimentos"').first();
        if (await abaProcedimentos.isVisible().catch(() => false)) {
            await abaProcedimentos.click();
            await page.waitForTimeout(500);
        }

        const btnAddProcedimento = page.locator('button[data-target="#modalProcedimento"]').first();
        await btnAddProcedimento.waitFor({ state: 'visible', timeout: 8000 });
        await btnAddProcedimento.click();
        await page.waitForTimeout(600);

        if (procedimentoData.procedimento) {
            console.log(`Selecionando Procedimento: "${procedimentoData.procedimento}"...`);
            const selectProc = page.locator('#modalProcedimento select').nth(0);
            await selectProc.selectOption({ label: procedimentoData.procedimento }).catch(async () => {
                await selectProc.selectOption({ index: 3 });
            });
        }

        const selectReparticao = page.locator('#modalProcedimento select').nth(1);
        if (await selectReparticao.isVisible().catch(() => false)) {
            await selectReparticao.selectOption({ index: 1 }).catch(() => { });
        }

        if (procedimentoData.delegacia) {
            await selecionarSelect2(page, 'Delegacia', procedimentoData.delegacia, procedimentoData.delegacia);
        }

        if (procedimentoData.delegado) {
            await selecionarSelect2(page, 'Delegado', procedimentoData.delegado, procedimentoData.delegado);
        }

        if (procedimentoData.numero) {
            console.log(`Preenchendo Número: ${procedimentoData.numero}...`);
            const inputNumero = page.locator('#modalProcedimento input[placeholder*="Número"], #modalProcedimento input').first();
            await inputNumero.fill(procedimentoData.numero).catch(() => { });
        }

        if (procedimentoData.ano) {
            console.log(`Preenchendo Ano: ${procedimentoData.ano}...`);
            const inputAno = page.locator('#modalProcedimento input[placeholder*="Ano"]').first();
            if (await inputAno.isVisible().catch(() => false)) {
                await inputAno.fill(procedimentoData.ano).catch(() => { });
            }
        }

        console.log('----------------------------------------------------');
        console.log('PROCEDIMENTO PREENCHIDO COM SUCESSO!');
        console.log('Confira os dados e clique no botão verde "Atualizar".');
        console.log('----------------------------------------------------');

    } catch (error) {
        console.warn('⚠️ Falha ao preencher o procedimento:', error.message);
    }
}

/**
 * Executa o fluxo completo
 */
async function executarOcorrenciaCompleta(page, dados) {
    console.log('\nNavegando para a tela de criação de ocorrência...');
    try {
        const btnCriarOcorrencia = page.locator('text="+ Criar corrência", text="+ Criar ocorrência", a:has-text("Criar")').first();
        await btnCriarOcorrencia.waitFor({ state: 'visible', timeout: 4000 });
        await btnCriarOcorrencia.click();
    } catch (e) {
        await page.goto('https://sipom.pm.ce.gov.br/ocorrencias/ocorrencias-criar', { waitUntil: 'domcontentloaded' });
    }

    await page.waitForTimeout(1500);

    if (dados.natureza) {
        await selecionarSelect2(page, 'Natureza', dados.natureza, dados.natureza);
    }

    if (dados.dataHora) {
        await page.fill('input[type="datetime-local"], input[placeholder*="dd/mm/aaaa"]', dados.dataHora).catch(() => { });
    }

    if (dados.unidadeLocal) {
        await selecionarSelect2(page, 'Unidade Militar', '21', dados.unidadeLocal);
    }

    if (dados.enderecoBusca) {
        try {
            const inputBusca = page.locator('input[placeholder*="Digite um local"]');
            await inputBusca.fill(dados.enderecoBusca);

            await page.waitForSelector('.pac-item', { timeout: 4000 });
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
        } catch (e) {
            console.warn('Google Places indisponível. Preenchendo campos manuais...');
            await page.fill('input[placeholder*="Rod., Rua"]', dados.ruaFallback).catch(() => { });
            await page.fill('input[placeholder*="Bairro"]', dados.bairroFallback).catch(() => { });
            await page.fill('input[placeholder*="Cidade"]', dados.cidadeFallback).catch(() => { });
        }
    }

    await page.fill('input[placeholder*="Numeral"]', dados.numeral).catch(() => { });

    if (dados.opmAtendeu) {
        await selecionarSelect2(page, 'OPM', '21', dados.opmAtendeu);
    }

    await page.fill('input[placeholder*="ocorrencia"], input[name*="ocorrencia"]', dados.numeroOcorrencia).catch(() => { });

    console.log('----------------------------------------------------');
    console.log('FORMULÁRIO 1 PREENCHIDO COM SUCESSO!');
    console.log('Confira os dados na tela e clique em "Registrar Ocorrência".');
    console.log('Aguardando a confirmação manual para ir à tela de detalhes...');
    console.log('----------------------------------------------------');

    // Validação ativa para detectar a entrada na tela de detalhes
    let telaDetalhesDetectada = false;
    while (!telaDetalhesDetectada) {
        await page.waitForTimeout(1000);
        const urlAtual = page.url();

        const estaNaTelaDetalhes = !urlAtual.endsWith('/ocorrencias-criar') && urlAtual.includes('/ocorrencias');
        const botaoPessoaVisivel = await page.locator('button[data-target="#modalPessoa"]').isVisible().catch(() => false);

        if (estaNaTelaDetalhes || botaoPessoaVisivel) {
            telaDetalhesDetectada = true;
        }
    }

    console.log('\n✅ Tela "Detalhando a ocorrência" detectada!');
    await page.waitForTimeout(1500);

    await executarFormulario2(page, dados);

    if (dados.procedimento) {
        await preencherModalProcedimento(page, dados.procedimento);
    }
}

(async () => {
    const userDataDir = path.join(__dirname, 'perfil-robo-chrome');

    console.log('Iniciando Google Chrome com perfil exclusivo...');

    const context = await chromium.launchPersistentContext(userDataDir, {
        channel: 'chrome',
        headless: false,
        slowMo: 60,
        args: [
            '--profile-directory=Default',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

    console.log('Navegando para o SIPOM...');
    await page.goto('https://sipom.pm.ce.gov.br/login', { waitUntil: 'domcontentloaded' });

    console.log('====================================================');
    console.log('AGUARDANDO LOGIN E OTP NO NAVEGADOR...');
    console.log('====================================================');

    await page.waitForURL('**/sipom.pm.ce.gov.br/**', { timeout: 0 });
    console.log('Login detectado com sucesso!');

    let continuar = true;

    while (continuar) {
        const textoBruto = obterTextoRelatorio();
        const dados = extrairDadosFormulario1(textoBruto);

        console.log('\n====================================================');
        console.log('ESCOLHA UMA OPÇÃO DE EXECUÇÃO:');
        console.log('1. Criar Ocorrência Completa (Formulário 1 + Pessoas + Procedimento)');
        console.log('2. Preencher apenas Pessoas na ocorrência atual');
        console.log('3. Preencher apenas Procedimento na ocorrência atual');
        console.log('4. Sair');
        console.log('====================================================');

        const opcao = await aguardarComando('Digite o número da opção desejada e pressione ENTER: ');

        if (opcao.trim() === '1') {
            await executarOcorrenciaCompleta(page, dados);
        } else if (opcao.trim() === '2') {
            await executarFormulario2(page, dados);
        } else if (opcao.trim() === '3') {
            await preencherModalProcedimento(page, dados.procedimento);
        } else if (opcao.trim() === '4' || opcao.trim().toLowerCase() === 'sair') {
            continuar = false;
            console.log('Encerrando o robô...');
            await context.close();
            break;
        } else {
            console.log('⚠️ Opção inválida. Tente novamente.');
        }
    }
})();