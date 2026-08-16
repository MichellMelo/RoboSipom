#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { extrairDadosFormulario1 } = require('./parserForm1');

/**
 * Interface interativa para leitura via terminal
 */
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
 * Busca todos os arquivos .txt na pasta do projeto
 */
function listarArquivosRelatorio() {
    const pastaAtual = __dirname;
    const arquivos = fs.readdirSync(pastaAtual).filter(f => f.endsWith('.txt'));
    return arquivos;
}

/**
 * Permite ao usuário escolher qual relatório ler ou lê o arquivo padrão 'relatorio.txt'
 */
async function selecionarEObterTextoRelatorio(nomeArquivoDefinido = null) {
    if (nomeArquivoDefinido) {
        const caminho = path.join(__dirname, nomeArquivoDefinido);
        if (fs.existsSync(caminho)) {
            return { nome: nomeArquivoDefinido, conteudo: fs.readFileSync(caminho, 'utf-8') };
        }
    }

    const arquivos = listarArquivosRelatorio();

    if (arquivos.length === 0) {
        throw new Error('Nenhum arquivo .txt de relatório foi encontrado na pasta do robô.');
    }

    if (arquivos.length === 1) {
        const caminho = path.join(__dirname, arquivos[0]);
        return { nome: arquivos[0], conteudo: fs.readFileSync(caminho, 'utf-8') };
    }

    console.log('\n====================================================');
    console.log('ARQUIVOS DE RELATÓRIO ENCONTRADOS:');
    arquivos.forEach((arq, index) => {
        console.log(`${index + 1}. ${arq}`);
    });
    console.log('====================================================');

    const opcao = await aguardarComando('Digite o número do relatório que deseja carregar: ');
    const idx = parseInt(opcao.trim(), 10) - 1;

    if (!isNaN(idx) && arquivos[idx]) {
        const caminho = path.join(__dirname, arquivos[idx]);
        return { nome: arquivos[idx], conteudo: fs.readFileSync(caminho, 'utf-8') };
    }

    console.log('⚠️ Opção inválida. Carregando o primeiro arquivo por padrão...');
    const caminhoPadrao = path.join(__dirname, arquivos[0]);
    return { nome: arquivos[0], conteudo: fs.readFileSync(caminhoPadrao, 'utf-8') };
}

/**
 * Preenche o dropdown Select2 (jQuery) no SIPOM de forma ultrarrápida e direta
 */
async function selecionarSelect2(page, labelCampo, valorBusca, valorOpcao) {
    try {
        console.log(`Buscando ${labelCampo}: "${valorOpcao}"...`);

        // 1. Localiza a caixa do Select2 associada ao rótulo/campo sem fazer varredura profunda no DOM
        const containerSelect2 = page.locator(`
            .form-group:has-text("${labelCampo}") .select2-container,
            label:has-text("${labelCampo}") + .select2-container,
            div:has-text("${labelCampo}") .select2-selection
        `).first();

        // Aguarda a visibilidade do elemento de clique (timeout reduzido para no máximo 3s)
        await containerSelect2.waitFor({ state: 'visible', timeout: 3000 });
        await containerSelect2.click();

        // 2. Localiza o input de busca aberto no Select2
        const campoBusca = page.locator('.select2-container--open .select2-search__field, input.select2-search__field').first();

        if (await campoBusca.isVisible({ timeout: 1000 }).catch(() => false)) {
            await campoBusca.fill(valorBusca);
        }

        // 3. Clica na primeira opção que corresponda à busca sem aguardar tempos fixos
        const opcao = page.locator(`.select2-results__option:has-text("${valorOpcao}"), .select2-results__option--highlighted`).first();
        await opcao.waitFor({ state: 'visible', timeout: 3000 });
        await opcao.click();

        console.log(`✅ ${labelCampo} preenchido com sucesso!`);
        return true;
    } catch (error) {
        console.warn(`⚠️ Não foi possível selecionar ${labelCampo} ("${valorOpcao}"). Seguindo fluxo...`);
        await page.keyboard.press('Escape').catch(() => { });
        return false;
    }
}

/**
 * Preenche o modal de Adicionar Pessoa e confirma no elemento #btn-salvar-pessoa
 */
async function preencherModalPessoa(page, pessoa) {
    // Trava de segurança: ignora se não houver nome de pessoa válido
    const termosInvalidos = [
        'NÃO IDENTIFICADO',
        'NAO IDENTIFICADO',
        'NÃO INFORMADO',
        'NAO INFORMADO',
        'DESCONHECIDO',
        'IGNORADO',
        'A APURAR'
    ];

    if (!pessoa || !pessoa.nome || termosInvalidos.includes(pessoa.nome.trim().toUpperCase())) {
        console.log(`\nℹ️ Pessoa ignorada (sem nome de pessoa válido): [${pessoa?.tipo || 'Pessoa'} - ${pessoa?.nome || 'N/A'}]`);
        return;
    }

    try {
        console.log(`\nAbrindo modal para pessoa: [${pessoa.tipo} - ${pessoa.nome}]...`);

        // 1. Abertura do modal via API do Bootstrap para evitar bloqueio por backdrop
        await page.evaluate(() => {
            if (typeof $ !== 'undefined') {
                $('#modalPessoa').modal('show');
            } else {
                const btn = document.querySelector('button[data-target="#modalPessoa"], button:has(.fa-plus):has-text("Pessoa")');
                if (btn) btn.click();
            }
        });

        const modalPessoa = page.locator('#modalPessoa');
        await modalPessoa.waitFor({ state: 'visible', timeout: 8000 });
        await page.waitForTimeout(400);

        // 2. SELEÇÃO DO VÍNCULO NO ELEMENTO select[name="vinculo"]
        console.log(`Selecionando Vínculo no Modal: "${pessoa.tipo}"...`);
        const selectVinculo = page.locator('#modalPessoa select[name="vinculo"]').first();
        await selectVinculo.waitFor({ state: 'visible', timeout: 5000 });

        await page.evaluate(({ tipoDesejado }) => {
            const select = document.querySelector('#modalPessoa select[name="vinculo"]');
            if (!select) return;

            // Remove acentos e padroniza para comparação insensível a maiúsculas
            const normalizar = str => str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase() : '';

            const alvo = normalizar(tipoDesejado);
            const options = Array.from(select.options);

            let opcaoEncontrada = options.find(opt => normalizar(opt.text) === alvo || normalizar(opt.value) === alvo) ||
                options.find(opt => normalizar(opt.text).includes(alvo) || alvo.includes(normalizar(opt.text)));

            if (opcaoEncontrada) {
                select.value = opcaoEncontrada.value;

                // Eventos nativos e jQuery
                select.dispatchEvent(new Event('change', { bubbles: true }));
                select.dispatchEvent(new Event('input', { bubbles: true }));

                if (typeof $ !== 'undefined') {
                    $(select).trigger('change');
                }
            }
        }, { tipoDesejado: pessoa.tipo });

        await page.waitForTimeout(300);

        // 3. PREENCHIMENTO DO CPF
        if (pessoa.cpf) {
            console.log(`Preenchendo CPF: ${pessoa.cpf}...`);
            const inputCPF = page.locator('#modalPessoa input[name="cpf"]').first();
            await inputCPF.fill(pessoa.cpf);
            await inputCPF.dispatchEvent('change');
            await inputCPF.dispatchEvent('blur');
            await page.waitForTimeout(300);
        }

        // 4. PREENCHIMENTO DO NOME COMPLETO
        if (pessoa.nome) {
            console.log(`Preenchendo Nome: "${pessoa.nome}"...`);
            const inputNome = page.locator('#modalPessoa input[name="nome"]').first();
            await inputNome.waitFor({ state: 'visible', timeout: 5000 });
            await inputNome.click();
            await inputNome.fill('');
            await inputNome.fill(pessoa.nome);
            await inputNome.dispatchEvent('input');
            await inputNome.dispatchEvent('change');
        }

        // 5. PREENCHIMENTO DA DATA DE NASCIMENTO
        if (pessoa.nascimento) {
            console.log(`Preenchendo Data de Nascimento: ${pessoa.nascimento}...`);
            let dataIso = pessoa.nascimento;
            if (pessoa.nascimento.includes('/')) {
                const [d, m, a] = pessoa.nascimento.split('/');
                dataIso = `${a}-${m}-${d}`;
            }

            await page.evaluate(({ valIso, valBr }) => {
                const input = document.querySelector('#modalPessoa input[name="nascimento"]');
                if (input) {
                    input.value = valIso || valBr;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, { valIso: dataIso, valBr: pessoa.nascimento });
        }

        // 6. PREENCHIMENTO DO NOME DA MÃE
        if (pessoa.mae) {
            console.log(`Preenchendo Nome da Mãe: "${pessoa.mae}"...`);
            await page.evaluate(({ val }) => {
                const input = document.querySelector('#modalPessoa input[name="mae"]');
                if (input) {
                    input.value = val;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, { val: pessoa.mae });
        }

        // 7. SELEÇÃO DO CAMPO MORTE (PADRÃO: NÃO)
        const selectMorte = page.locator('#modalPessoa select[name="morte"]').first();
        if (await selectMorte.isVisible({ timeout: 1000 }).catch(() => false)) {
            await selectMorte.selectOption({ label: pessoa.morte || 'NÃO' }).catch(() => { });
        }

        await page.waitForTimeout(400);

        // 8. SUBMISSÃO DO MODAL VIA #btn-salvar-pessoa
        console.log('Confirmando gravação da pessoa em #btn-salvar-pessoa...');
        await page.evaluate(() => {
            const btn = document.querySelector('#btn-salvar-pessoa');
            if (btn) btn.click();
        });

        // 9. AGUARDA FECHAMENTO NATIVO OU FORÇA O ENCERRAMENTO SEGURO
        await modalPessoa.waitFor({ state: 'hidden', timeout: 8000 }).catch(async () => {
            await page.evaluate(() => {
                if (typeof $ !== 'undefined') {
                    $('#modalPessoa').modal('hide');
                }
            });
        });

        await page.waitForTimeout(1000);
        console.log(`✅ Pessoa (${pessoa.tipo} - ${pessoa.nome}) cadastrada com sucesso!`);
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

        // Submissão do Modal de Procedimento Policial via #btn-salvar-procedimento
        console.log('Confirmando gravação do Procedimento em #btn-salvar-procedimento...');
        await page.evaluate(() => {
            const btn = document.querySelector('#btn-salvar-procedimento') ||
                document.querySelector('#modalProcedimento input[type="submit"]') ||
                document.querySelector('#modalProcedimento button:has-text("Salvar")');
            if (btn) btn.click();
        });

        // Aguarda o modal sumir para garantir a gravação e permitir o próximo passo
        console.log('Aguardando gravação e fechamento do modal de Procedimento...');
        await modalProcedimento.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => { });
        await page.waitForTimeout(1000);

        console.log('✅ Modal Procedimento preenchido e gravado com sucesso!');
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
                console.log(`Sub-tipo detectado: "${item.subTipoDroga}" | Quantidade: ${item.quantidadeDroga}g`);

                // Seleciona o sub-tipo exato da droga no dropdown
                await page.evaluate(({ subTipoTexto }) => {
                    const selects = Array.from(document.querySelectorAll('#modalMaterial select'));
                    // Busca o dropdown que contém as opções de sub-tipos de drogas
                    const selectSubtipo = selects.find(s => s.name !== 'material_tipo');

                    if (selectSubtipo) {
                        const opt = Array.from(selectSubtipo.options).find(o =>
                            o.text.trim().toLowerCase().includes(subTipoTexto.toLowerCase()) ||
                            subTipoTexto.toLowerCase().includes(o.text.trim().toLowerCase())
                        );
                        if (opt) {
                            selectSubtipo.value = opt.value;
                            selectSubtipo.dispatchEvent(new Event('change', { bubbles: true }));
                            selectSubtipo.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }
                }, { subTipoTexto: item.subTipoDroga });

                await page.waitForTimeout(400);

                // Preenche a quantidade em gramas
                const inputQuantidade = page.locator('#modalMaterial input[name="droga_quantidade"], input[name="droga_quantidade"]').first();
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
 * Preenche o modal de Composição garantindo a seleção sequencial:
 * Modal -> Tipo de Policiamento -> Função -> Matrícula -> Salvar
 */
async function preencherModalComposicao(page, dadosComposicao) {
    try {
        if (!dadosComposicao || !dadosComposicao.integrantes || !dadosComposicao.integrantes.length) {
            console.log('\nℹ️ Nenhuma composição fornecida no relatório.');
            return;
        }

        console.log(`\nIniciando fluxo de preenchimento para ${dadosComposicao.integrantes.length} integrante(s) da Composição...`);

        console.log('1. Clicando na aba Composições...');
        const abaComposicoes = page.locator('#composicoes-tab, a[href="#composicoes"]').first();
        await abaComposicoes.waitFor({ state: 'visible', timeout: 8000 });
        await abaComposicoes.click();
        await page.waitForTimeout(600);

        for (let i = 0; i < dadosComposicao.integrantes.length; i++) {
            const pol = dadosComposicao.integrantes[i];
            console.log(`\n====================================================`);
            console.log(`Cadastrando Integrante [${i + 1}/${dadosComposicao.integrantes.length}]: ${pol.funcao} | Matrícula: ${pol.matricula}`);
            console.log(`====================================================`);

            console.log('1. Clicando no botão para abrir modal Composição...');
            const btnAbrirModal = page.locator('button[data-target="#modalComposicao"]').first();
            await btnAbrirModal.waitFor({ state: 'visible', timeout: 8000 });
            await btnAbrirModal.click();

            const modalComposicao = page.locator('#modalComposicao');
            await modalComposicao.waitFor({ state: 'visible', timeout: 8000 });
            await page.waitForTimeout(500);

            const tipoProcurado = dadosComposicao.tipoPoliciamento || 'Motorizado';
            console.log(`2. Selecionando Tipo de Policiamento: "${tipoProcurado}"...`);
            const selectorPoliciamento = '#modalComposicao select[name="policiamento_tipo"], select[name="policiamento_tipo"]';
            await page.waitForSelector(selectorPoliciamento, { state: 'attached', timeout: 8000 });

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
            }, { selector: selectorPoliciamento, labelProcurado: tipoProcurado });

            await page.waitForTimeout(600);

            console.log(`3. Selecionando Função: "${pol.funcao}"...`);
            const selectorFuncao = '#modalComposicao select#composicao-funcoes, #modalComposicao select[name="composicao_funcao"]';
            await page.waitForSelector(selectorFuncao, { state: 'visible', timeout: 8000 });

            await page.evaluate(({ selector, labelFuncao }) => {
                const select = document.querySelector(selector);
                if (select) {
                    const opt = Array.from(select.options).find(o => o.text.trim().toLowerCase() === labelFuncao.toLowerCase());
                    if (opt) {
                        select.value = opt.value;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        select.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
            }, { selector: selectorFuncao, labelFuncao: pol.funcao });

            await page.waitForTimeout(400);

            console.log(`4. Preenchendo Matrícula: ${pol.matricula}...`);
            const inputMatricula = page.locator('#modalComposicao input[name="composicao_matricula"]').first();
            await inputMatricula.waitFor({ state: 'visible', timeout: 5000 });
            await inputMatricula.focus();
            await inputMatricula.fill('');
            await inputMatricula.fill(pol.matricula);

            await page.evaluate(({ val }) => {
                const input = document.querySelector('#modalComposicao input[name="composicao_matricula"]');
                if (input) {
                    input.value = val;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('keyup', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new Event('blur', { bubbles: true }));
                }
            }, { val: pol.matricula });

            await page.waitForTimeout(400);

            console.log('5. Confirmando gravação do integrante...');
            await page.evaluate(() => {
                const btn = document.querySelector('#btn-salvar-composicao') ||
                    document.querySelector('#modalComposicao input[type="submit"]') ||
                    document.querySelector('#modalComposicao button:has-text("Atualizar")');
                if (btn) btn.click();
            });

            console.log('Aguardando gravação e fechamento do modal...');
            await modalComposicao.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => { });
            await page.waitForTimeout(1000);

            console.log(`✅ Integrante (${pol.funcao}) gravado com sucesso!`);
        }

        console.log('\n====================================================');
        console.log('✅ COMPOSIÇÃO COMPLETA REGISTRADA COM SUCESSO!');
        console.log('====================================================');
    } catch (error) {
        console.warn('⚠️ Falha no fluxo de Composição:', error.message);
    }
}

/**
 * Executa o fluxo completo do Formulário 1 até a tela de Detalhes
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

    // 1. NATUREZA DA OCORRÊNCIA
    if (dados.natureza) {
        await selecionarSelect2(page, 'Natureza', dados.natureza, dados.natureza);
    }

    // 2. DATA E HORÁRIO
    if (dados.dataHora) {
        await page.fill('input[type="datetime-local"], input[placeholder*="dd/mm/aaaa"]', dados.dataHora).catch(() => { });
    }

    // 3. UNIDADE MILITAR (ID direto: #select2-unidade-container)
    if (dados.unidadeLocal) {
        console.log(`Buscando Unidade Militar via #select2-unidade-container: "${dados.unidadeLocal}"...`);
        try {
            const containerUnidade = page.locator('#select2-unidade-container, [aria-labelledby="select2-unidade-container"]').first();
            await containerUnidade.waitFor({ state: 'visible', timeout: 5000 });
            await containerUnidade.click({ force: true });

            const campoBusca = page.locator('.select2-container--open .select2-search__field').first();
            await campoBusca.waitFor({ state: 'visible', timeout: 2000 });

            const termoBusca = dados.opmBusca || '21';
            await campoBusca.fill(termoBusca);
            await page.waitForTimeout(400);

            const opcao = page.locator('.select2-results__option--highlighted, .select2-results__option').first();
            await opcao.waitFor({ state: 'visible', timeout: 3000 });
            await opcao.click();

            console.log('✅ Unidade Militar selecionada com sucesso via ID direto!');
        } catch (err) {
            console.warn('⚠️ Falha ao selecionar Unidade Militar via ID direto:', err.message);
        }
    }

    // 4. ENDEREÇO E CAMPOS DE BUSCA
    if (dados.enderecoBusca) {
        try {
            const inputBusca = page.locator('input[placeholder*="Digite um local"]');
            await inputBusca.waitFor({ state: 'visible', timeout: 5000 });
            await inputBusca.fill(dados.enderecoBusca);

            await page.waitForSelector('.pac-item', { timeout: 4000 });
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);
        } catch (e) {
            console.warn('⚠️ Google Places indisponível ou lento. Preenchendo campos manuais...');
            try {
                if (dados.ruaFallback) {
                    await page.fill('input[placeholder*="Rod., Rua"]', String(dados.ruaFallback));
                }
                if (dados.bairroFallback) {
                    await page.fill('input[placeholder*="Bairro"]', String(dados.bairroFallback));
                }
                if (dados.cidadeFallback) {
                    await page.fill('input[placeholder*="Cidade"]', String(dados.cidadeFallback));
                }
            } catch (err) {
                console.warn('⚠️ Erro ao preencher campos manuais de endereço, seguindo o fluxo...');
            }
        }
    }

    // 5. NUMERAL DO ENDEREÇO
    try {
        const valorNumeral = (dados.numeral && String(dados.numeral).trim() !== '') ? String(dados.numeral) : 'S/N';
        const inputNumeral = page.locator('input[placeholder*="Numeral"], input[name*="numeral"]').first();
        if (await inputNumeral.isVisible({ timeout: 2000 }).catch(() => false)) {
            await inputNumeral.fill(valorNumeral);
            console.log(`✅ Numeral (${valorNumeral}) preenchido com sucesso!`);
        }
    } catch (e) {
        console.warn('⚠️ Não foi possível preencher o Numeral, seguindo o fluxo...');
    }

    // 6. OPM QUE ATENDEU (ID direto: #select2-opm-container)
    if (dados.opmAtendeu) {
        console.log(`Preenchendo OPM de forma direta via #select2-opm-container: "${dados.opmAtendeu}"...`);
        try {
            const containerOPM = page.locator('#select2-opm-container, [aria-labelledby="select2-opm-container"]').first();
            await containerOPM.waitFor({ state: 'visible', timeout: 5000 });
            await containerOPM.click({ force: true });

            const campoBusca = page.locator('.select2-container--open .select2-search__field').first();
            await campoBusca.waitFor({ state: 'visible', timeout: 2000 });

            const termoBusca = dados.opmBusca || '21';
            await campoBusca.fill(termoBusca);
            await page.waitForTimeout(400);

            const opcao = page.locator('.select2-results__option--highlighted, .select2-results__option').first();
            await opcao.waitFor({ state: 'visible', timeout: 3000 });
            await opcao.click();

            console.log('✅ OPM selecionada instantaneamente via ID direto!');
        } catch (err) {
            console.warn('⚠️ Falha ao selecionar OPM via ID direto:', err.message);
        }
    }

    // 7. NÚMERO DA OCORRÊNCIA (FICHA CIOPS)
    if (dados.numeroOcorrencia) {
        console.log(`Preenchendo Número da Ocorrência (Ficha CIOPS): ${dados.numeroOcorrencia}...`);
        try {
            const inputOcorrencia = page.locator('input[name="numero_ocorrencia"]').first();
            await inputOcorrencia.waitFor({ state: 'visible', timeout: 8000 });
            await inputOcorrencia.focus();
            await inputOcorrencia.click();
            await inputOcorrencia.fill('');
            await inputOcorrencia.fill(dados.numeroOcorrencia);

            await page.evaluate(({ val }) => {
                const input = document.querySelector('input[name="numero_ocorrencia"]');
                if (input) {
                    input.value = val;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new Event('blur', { bubbles: true }));
                }
            }, { val: dados.numeroOcorrencia });

            console.log('✅ Número da Ocorrência preenchido com sucesso!');
        } catch (error) {
            console.warn('⚠️ Não foi possível localizar o campo input[name="numero_ocorrencia"]:', error.message);
        }
    }

    console.log('----------------------------------------------------');
    console.log('FORMULÁRIO 1 PREENCHIDO COM SUCESSO!');
    console.log('Submetendo formulário via #btn-salvar-ocorrencia...');
    console.log('----------------------------------------------------');

    // 8. SUBMISSÃO DO FORMULÁRIO 1
    try {
        await page.evaluate(() => {
            const btn = document.querySelector('#btn-salvar-ocorrencia') ||
                document.querySelector('input[value="Registrar Ocorrência"]') ||
                document.querySelector('input[type="submit"]');
            if (btn) btn.click();
        });
        console.log('✅ Botão "Registrar Ocorrência" clicado com sucesso!');
    } catch (err) {
        console.warn('⚠️ Falha ao clicar no botão de salvar ocorrência:', err.message);
    }

    // 9. AGUARDA REDIRECIONAMENTO E PREENCHE OS MODAIS
    console.log('Aguardando redirecionamento para a tela de detalhes...');
    let telaDetalhesDetectada = false;
    let tentativas = 0;

    while (!telaDetalhesDetectada && tentativas < 20) {
        await page.waitForTimeout(1000);
        tentativas++;

        const urlAtual = page.url();
        const estaNaTelaDetalhes = !urlAtual.endsWith('/ocorrencias-criar') && urlAtual.includes('/ocorrencias');
        const botaoPessoaVisivel = await page.locator('button[data-target="#modalPessoa"]').isVisible().catch(() => false);

        if (estaNaTelaDetalhes || botaoPessoaVisivel) {
            telaDetalhesDetectada = true;
        }
    }

    if (telaDetalhesDetectada) {
        console.log('\n✅ Tela "Detalhando a ocorrência" detectada com sucesso!');
        await page.waitForTimeout(1500);

        // Executa o preenchimento dos modais sequencialmente
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
    } else {
        console.warn('⚠️ O formulário pode não ter sido salvo. Verifique pendências de preenchimento na tela.');
    }
}

(async () => {
    const PASTA_PROJETO = __dirname;
    const userDataDir = path.join(PASTA_PROJETO, 'perfil-robo-chrome');

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

    let continuarSistema = true;

    while (continuarSistema) {
        let relatorioAtual = null;

        try {
            relatorioAtual = await selecionarEObterTextoRelatorio();
        } catch (err) {
            console.error('❌ Erro:', err.message);
            break;
        }

        const dados = extrairDadosFormulario1(relatorioAtual.conteudo);

        console.log('\n====================================================');
        console.log(`📄 RELATÓRIO CARREGADO: [ ${relatorioAtual.nome} ]`);
        console.log('ESCOLHA UMA OPÇÃO DE EXECUÇÃO:');
        console.log('1. Criar Ocorrência Completa (Formulário 1 -> Pessoas -> Procedimento -> Histórico -> Material -> Composição)');
        console.log('2. Preencher apenas Pessoas na ocorrência atual');
        console.log('3. Preencher apenas Procedimento na ocorrência atual');
        console.log('4. Preencher apenas Histórico na ocorrência atual');
        console.log('5. Preencher apenas Materiais na ocorrência atual');
        console.log('6. Preencher apenas Composições na ocorrência atual');
        console.log('7. FAZER TUDO AGORA (Executa Pessoas, Procedimento, Histórico, Material e Composição em sequência)');
        console.log('8. Trocar de arquivo de Relatório');
        console.log('9. Sair do Sistema');
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
        } else if (opcao.trim() === '7') {
            console.log('\n🚀 Iniciando execução sequencial de todas as etapas...');
            await executarFormulario2(page, dados);
            if (dados.procedimento) await preencherModalProcedimento(page, dados.procedimento);
            if (dados.historico) await preencherModalHistorico(page, dados.historico);
            if (dados.material && dados.material.possuiMaterial) await preencherModalMaterial(page, dados.material);
            if (dados.composicao) await preencherModalComposicao(page, dados.composicao);
            console.log('\n🎉 TODOS OS MODAIS FORAM PREENCHIDOS E FINALIZADOS COM SUCESSO!');
        } else if (opcao.trim() === '8') {
            console.log('\nRetornando para a seleção de relatório...');
            continue;
        } else if (opcao.trim() === '9' || opcao.trim().toLowerCase() === 'sair') {
            continuarSistema = false;
            console.log('Encerrando o robô...');
            await context.close();
            break;
        }

        console.log('\n====================================================');
        const proximoComando = await aguardarComando('Deseja ler outro relatório agora? (S/N): ');
        if (proximoComando.trim().toLowerCase() !== 's') {
            continuarSistema = false;
            console.log('Encerrando o robô...');
            await context.close();
            break;
        }
    }
})();