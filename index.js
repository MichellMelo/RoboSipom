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
 * Preenche o modal de Adicionar Pessoa (Formulário 2)
 */
async function preencherModalPessoa(page, pessoa) {
    try {
        console.log(`\nAbrindo modal para pessoa: [${pessoa.tipo} - ${pessoa.nome}]...`);

        const btnAddPessoa = page.locator('button[data-target="#modalPessoa"], button:has(.fa-plus):has-text("Pessoa")').first();
        await btnAddPessoa.waitFor({ state: 'visible', timeout: 8000 });
        await btnAddPessoa.click();

        const modalPessoa = page.locator('#modalPessoa');
        await modalPessoa.waitFor({ state: 'visible', timeout: 8000 });
        await page.waitForTimeout(500);

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

        if (pessoa.cpf) {
            console.log(`Preenchendo CPF: ${pessoa.cpf}...`);
            const inputCPF = page.locator('#modalPessoa input[name="cpf"], #modalPessoa #cpf').first();
            await inputCPF.fill(pessoa.cpf);
            await inputCPF.dispatchEvent('change');
            await inputCPF.dispatchEvent('blur');
            await page.waitForTimeout(1000);
        }

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

        if (pessoa.sexo) {
            console.log(`Selecionando Sexo: ${pessoa.sexo}...`);
            const selectSexo = page.locator('#modalPessoa select[name="sexo"]').first();
            const valorSexo = pessoa.sexo.toUpperCase().startsWith('F') ? '2' : '1';
            await selectSexo.selectOption(valorSexo).catch(() => { });
            await selectSexo.dispatchEvent('change');
            await selectSexo.dispatchEvent('input');
        }

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

        const selectMorte = page.locator('#modalPessoa select[name="morte"], #modalPessoa select').last();
        await selectMorte.selectOption({ label: pessoa.morte || 'NÃO' }).catch(() => { });

        await page.waitForTimeout(600);

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
 * Executa a etapa de Pessoas na tela de detalhes
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
 * Preenche o modal de Procedimento Policial
 */
async function preencherModalProcedimento(page, procedimento) {
    try {
        console.log('\nIniciando fluxo de Procedimentos...');

        console.log('1. Clicando na aba Procedimentos...');
        const abaProcedimentos = page.locator('#procedimentos-tab, a[href="#procedimentos"]').first();
        await abaProcedimentos.waitFor({ state: 'visible', timeout: 8000 });
        await abaProcedimentos.click();
        await page.waitForTimeout(600);

        console.log('2. Clicando no botão para abrir modal Procedimento...');
        const btnAbrirModal = page.locator('button[data-target="#modalProcedimento"]').first();
        await btnAbrirModal.waitFor({ state: 'visible', timeout: 8000 });
        await btnAbrirModal.click();

        const modalProcedimento = page.locator('#modalProcedimento');
        await modalProcedimento.waitFor({ state: 'visible', timeout: 8000 });
        await page.waitForTimeout(500);

        console.log('3. Selecionando Repartição de Registro: "Polícia Civil"...');
        const selectorReparticao = '#modalProcedimento select#reparticao, #modalProcedimento select[name="reparticao"]';

        await page.waitForSelector(selectorReparticao, { state: 'attached', timeout: 8000 });

        await page.evaluate((sel) => {
            const select = document.querySelector(sel);
            if (select) {
                select.value = '2'; // 2 = Polícia Civil
                select.dispatchEvent(new Event('change', { bubbles: true }));
                select.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }, selectorReparticao);

        await page.waitForTimeout(800);

        if (procedimento.procedimento) {
            console.log(`4. Selecionando Procedimento: "${procedimento.procedimento}"...`);
            const selectProc = page.locator('#modalProcedimento select[name="procedimento"], #modalProcedimento #procedimento').first();
            await selectProc.selectOption({ label: procedimento.procedimento }, { force: true }).catch(async () => {
                await selectProc.selectOption({ index: 1 }, { force: true });
            });
            await selectProc.dispatchEvent('change');
            await page.waitForTimeout(400);
        }

        const termoDelegacia = procedimento.codigoDelegacia || procedimento.delegaciaTexto || '110';
        console.log(`5. Buscando Delegacia pelo código/termo: "${termoDelegacia}"...`);
        const comboDelegacia = page.locator('#modalProcedimento [id*="procedimento_delegacia"]').first();
        await comboDelegacia.click({ force: true });
        await page.waitForTimeout(300);

        const searchInputDelegacia = page.locator('.select2-container--open input.select2-search__field').first();
        await searchInputDelegacia.fill(termoDelegacia);
        await page.waitForTimeout(800);

        const opcaoDelegacia = page.locator('.select2-results__option--highlighted, .select2-results__option').first();
        if (await opcaoDelegacia.isVisible()) {
            await opcaoDelegacia.click();
        } else {
            await page.keyboard.press('Enter');
        }
        await page.waitForTimeout(400);

        if (procedimento.delegado) {
            console.log(`6. Buscando Delegado: "${procedimento.delegado}"...`);
            const comboDelegado = page.locator('#modalProcedimento [id*="procedimento_delegado"]').first();
            await comboDelegado.click({ force: true });
            await page.waitForTimeout(300);

            const searchInputDelegado = page.locator('.select2-container--open input.select2-search__field').first();
            await searchInputDelegado.fill(procedimento.delegado);
            await page.waitForTimeout(800);

            const opcaoDelegado = page.locator('.select2-results__option--highlighted, .select2-results__option').first();
            if (await opcaoDelegado.isVisible()) {
                await opcaoDelegado.click();
            } else {
                await page.keyboard.press('Enter');
            }
            await page.waitForTimeout(400);
        }

        if (procedimento.numero) {
            console.log(`7. Preenchendo Número do B.O.: ${procedimento.numero}...`);
            const inputNumero = page.locator('#modalProcedimento input[name="procedimento_numero"]').first();
            await inputNumero.focus();
            await inputNumero.fill('');
            await inputNumero.fill(procedimento.numero);
            await inputNumero.dispatchEvent('input');
            await inputNumero.dispatchEvent('change');
        }

        if (procedimento.ano) {
            console.log(`8. Preenchendo Ano: ${procedimento.ano}...`);
            const inputAno = page.locator('#modalProcedimento input[name="procedimento_ano"]').first();
            await inputAno.focus();
            await inputAno.fill('');
            await inputAno.fill(procedimento.ano);
            await inputAno.dispatchEvent('input');
            await inputAno.dispatchEvent('change');
        }

        console.log('✅ Modal Procedimento preenchido com sucesso!');
    } catch (error) {
        console.warn('⚠️ Falha ao preencher Modal Procedimento:', error.message);
    }
}

/**
 * Preenche o modal de Histórico e sincroniza o Summernote
 */
async function preencherModalHistorico(page, textoHistorico) {
    try {
        if (!textoHistorico) {
            console.warn('⚠️ Nenhum texto de histórico fornecido para preenchimento.');
            return;
        }

        console.log('\nIniciando fluxo de preenchimento do Histórico...');

        console.log('1. Clicando na aba Histórico...');
        const abaHistorico = page.locator('#historicos-tab, a[href="#historicos"]').first();
        await abaHistorico.waitFor({ state: 'visible', timeout: 8000 });
        await abaHistorico.click();
        await page.waitForTimeout(600);

        console.log('2. Clicando no botão para abrir o modal de Histórico...');
        const btnAbrirModal = page.locator('#btnHistoricoModal, button[data-target="#modalHistorico"]').first();
        await btnAbrirModal.waitFor({ state: 'visible', timeout: 8000 });
        await btnAbrirModal.click();

        const modalHistorico = page.locator('#modalHistorico');
        await modalHistorico.waitFor({ state: 'visible', timeout: 8000 });
        await page.waitForTimeout(500);

        console.log('3. Inserindo o texto no editor do Histórico...');
        await page.evaluate((texto) => {
            if (window.$ && $('#modalHistorico textarea').length) {
                try {
                    $('#modalHistorico textarea').summernote('code', texto);
                } catch (e) { }
            }

            const editable = document.querySelector('#modalHistorico .note-editable, #modalHistorico [contenteditable="true"]');
            if (editable) {
                editable.innerHTML = texto;
            }

            const textarea = document.querySelector('#modalHistorico textarea');
            if (textarea) {
                textarea.value = texto;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, textoHistorico);

        await page.waitForTimeout(600);

        console.log('4. Confirmando gravação do Histórico...');
        await page.evaluate(() => {
            const btnSalvar = document.querySelector('#btn-salvar-historico') || document.querySelector('#modalHistorico input[type="submit"]');
            if (btnSalvar) {
                btnSalvar.click();
            } else {
                const form = document.querySelector('#modalHistorico form');
                if (form) form.requestSubmit ? form.requestSubmit() : form.submit();
            }
        });

        await modalHistorico.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => { });
        await page.waitForTimeout(1000);

        console.log('✅ Histórico gravado e salvo com sucesso!');
    } catch (error) {
        console.warn('⚠️ Falha ao preencher o Histórico:', error.message);
    }
}

/**
 * Preenche o modal de Materiais e confirma no elemento input#btn-salvar-material
 */
async function preencherModalMaterial(page, dadosMaterial) {
    try {
        if (!dadosMaterial || !dadosMaterial.possuiMaterial || !dadosMaterial.lista || !dadosMaterial.lista.length) {
            console.log('\nℹ️ Relatório sem apreensão de materiais (S/A). Etapa de Materiais ignorada.');
            return;
        }

        console.log(`\nIniciando fluxo de preenchimento para ${dadosMaterial.lista.length} material(is)...`);

        console.log('1. Clicando na aba Materiais...');
        const abaMateriais = page.locator('#materiais-tab, a[href="#materiais"]').first();
        await abaMateriais.waitFor({ state: 'visible', timeout: 8000 });
        await abaMateriais.click();
        await page.waitForTimeout(600);

        for (let i = 0; i < dadosMaterial.lista.length; i++) {
            const item = dadosMaterial.lista[i];
            console.log(`\n====================================================`);
            console.log(`Cadastrando Material [${i + 1}/${dadosMaterial.lista.length}]: ${item.tipoLabel}`);
            console.log(`====================================================`);

            const btnAbrirModal = page.locator('button[data-target="#modalMaterial"]').first();
            await btnAbrirModal.waitFor({ state: 'visible', timeout: 8000 });
            await btnAbrirModal.click();

            const modalMaterial = page.locator('#modalMaterial');
            await modalMaterial.waitFor({ state: 'visible', timeout: 8000 });
            await page.waitForTimeout(500);

            const selectorTipoMaterial = '#modalMaterial select[name="material_tipo"], select[name="material_tipo"]';
            await page.waitForSelector(selectorTipoMaterial, { state: 'attached', timeout: 8000 });

            await page.evaluate(({ selector, labelProcurado }) => {
                const select = document.querySelector(selector);
                if (select) {
                    const opt = Array.from(select.options).find(o => o.text.trim().toLowerCase() === labelProcurado.toLowerCase());
                    if (opt) {
                        select.value = opt.value;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        select.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
            }, { selector: selectorTipoMaterial, labelProcurado: item.tipoLabel });

            await page.waitForTimeout(600);

            // --- TRATAMENTO: DROGA ---
            if (item.tipoLabel.toLowerCase() === 'droga') {
                console.log(`Selecionando sub-tipo: "${item.subTipoDroga}" | Quantidade: ${item.quantidadeDroga}g`);

                await page.evaluate(({ subTipoTexto }) => {
                    const selects = Array.from(document.querySelectorAll('#modalMaterial select'));
                    const selectDroga = selects.find(s => s.name !== 'material_tipo');
                    if (selectDroga) {
                        const opt = Array.from(selectDroga.options).find(o => o.text.toLowerCase().includes(subTipoTexto.toLowerCase()));
                        if (opt) {
                            selectDroga.value = opt.value;
                            selectDroga.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                }, { subTipoTexto: item.subTipoDroga });

                await page.waitForTimeout(400);

                const inputQuantidade = page.locator('input[name="droga_quantidade"]').first();
                await inputQuantidade.waitFor({ state: 'visible', timeout: 5000 });
                await inputQuantidade.focus();
                await inputQuantidade.fill('');
                await inputQuantidade.fill(item.quantidadeDroga.toString());
                await inputQuantidade.dispatchEvent('input');
                await inputQuantidade.dispatchEvent('change');
            }

            // --- TRATAMENTO: DINHEIRO ---
            if (item.tipoLabel.toLowerCase() === 'dinheiro') {
                console.log(`Preenchendo valor em Dinheiro: R$ ${item.valorDinheiro}`);

                const inputDinheiro = page.locator('input[name="dinheiro_quantidade"]').first();
                await inputDinheiro.waitFor({ state: 'visible', timeout: 5000 });
                await inputDinheiro.focus();
                await inputDinheiro.click();
                await inputDinheiro.fill('');
                await inputDinheiro.fill(item.valorDinheiro.toString());

                await page.evaluate(({ val }) => {
                    const input = document.querySelector('input[name="dinheiro_quantidade"]');
                    if (input) {
                        input.value = val;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('keyup', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                }, { val: item.valorDinheiro.toString() });
            }

            await page.waitForTimeout(400);

            console.log('Confirmando gravação do Material...');
            await page.evaluate(() => {
                const btn = document.querySelector('#btn-salvar-material') || document.querySelector('#modalMaterial input[type="submit"]');
                if (btn) btn.click();
            });

            console.log('Aguardando gravação e fechamento do modal...');
            await modalMaterial.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => { });

            await page.waitForTimeout(1000);
            console.log(`✅ Material (${item.tipoLabel}) gravado com sucesso!`);
        }

        console.log('\n====================================================');
        console.log('✅ TODOS OS MATERIAIS FORAM REGISTRADOS COM SUCESSO!');
        console.log('====================================================');
    } catch (error) {
        console.warn('⚠️ Falha no fluxo de Materiais:', error.message);
    }
}

/**
 * Acessa a aba Composições e abre o modal de composição (#modalComposicao)
 */
async function preencherModalComposicao(page, dadosComposicao) {
    try {
        console.log('\nIniciando fluxo de preenchimento de Composições...');

        console.log('1. Clicando na aba Composições...');
        const abaComposicoes = page.locator('#composicoes-tab, a[href="#composicoes"]').first();
        await abaComposicoes.waitFor({ state: 'visible', timeout: 8000 });
        await abaComposicoes.click();
        await page.waitForTimeout(600);

        console.log('2. Clicando no botão para abrir o modal Composição...');
        const btnAbrirModal = page.locator('button[data-target="#modalComposicao"]').first();
        await btnAbrirModal.waitFor({ state: 'visible', timeout: 8000 });
        await btnAbrirModal.click();

        const modalComposicao = page.locator('#modalComposicao');
        await modalComposicao.waitFor({ state: 'visible', timeout: 8000 });
        await page.waitForTimeout(500);

        console.log('✅ Modal de Composição aberto com sucesso!');
    } catch (error) {
        console.warn('⚠️ Falha ao abrir o modal de Composição:', error.message);
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

    if (dados.historico) {
        await preencherModalHistorico(page, dados.historico);
    }

    if (dados.material && dados.material.possuiMaterial) {
        await preencherModalMaterial(page, dados.material);
    }

    await preencherModalComposicao(page, dados.composicao);
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
        console.log('1. Criar Ocorrência Completa (Pessoas + Procedimento + Histórico + Material + Composição)');
        console.log('2. Preencher apenas Pessoas na ocorrência atual');
        console.log('3. Preencher apenas Procedimento na ocorrência atual');
        console.log('4. Preencher apenas Histórico na ocorrência atual');
        console.log('5. Abrir apenas modal de Materiais na ocorrência atual');
        console.log('6. Abrir apenas modal de Composições na ocorrência atual');
        console.log('7. Sair');
        console.log('====================================================');

        const opcao = await aguardarComando('Digite o número da opção desejada e pressione ENTER: ');

        if (opcao.trim() === '1') {
            await executarOcorrenciaCompleta(page, dados);
        } else if (opcao.trim() === '2') {
            await executarFormulario2(page, dados);
        } else if (opcao.trim() === '3') {
            await preencherModalProcedimento(page, dados.procedimento);
        } else if (opcao.trim() === '4') {
            await preencherModalHistorico(page, dados.historico);
        } else if (opcao.trim() === '5') {
            await preencherModalMaterial(page, dados.material);
        } else if (opcao.trim() === '6') {
            await preencherModalComposicao(page, dados.composicao);
        } else if (opcao.trim() === '7' || opcao.trim().toLowerCase() === 'sair') {
            continuar = false;
            console.log('Encerrando o robô...');
            await context.close();
            break;
        }
    }
})();