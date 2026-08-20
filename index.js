#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { extrairDadosFormulario1 } = require('./parserForm1');

/**
 * Exibe uma pergunta no terminal e aguarda a resposta do usuário (S/N)
 */
function perguntarConfirmacao(pergunta) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(`${pergunta} (S/N): `, resposta => {
            rl.close();
            const res = resposta.trim().toUpperCase();
            resolve(res === 'S' || res === 'SIM');
        });
    });
}

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
 * Permite ao usuário escolher qual relatório ler
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
 * Preenche o dropdown Select2 no SIPOM de forma direta
 */
async function selecionarSelect2(page, labelCampo, valorBusca, valorOpcao) {
    try {
        console.log(`Buscando ${labelCampo}: "${valorOpcao}"...`);

        const containerSelect2 = page.locator(`
            .form-group:has-text("${labelCampo}") .select2-container,
            label:has-text("${labelCampo}") + .select2-container,
            div:has-text("${labelCampo}") .select2-selection
        `).first();

        await containerSelect2.waitFor({ state: 'visible', timeout: 3000 });
        await containerSelect2.click();

        const campoBusca = page.locator('.select2-container--open .select2-search__field, input.select2-search__field').first();

        if (await campoBusca.isVisible({ timeout: 1000 }).catch(() => false)) {
            await campoBusca.fill(valorBusca);
        }

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
 * Preenche o modal de Adicionar Pessoa
 */
async function preencherModalPessoa(page, pessoa) {
    const termosInvalidos = [
        'NÃO IDENTIFICADO', 'NAO IDENTIFICADO',
        'NÃO INFORMADO', 'NAO INFORMADO',
        'DESCONHECIDO', 'IGNORADO', 'A APURAR'
    ];

    if (!pessoa || !pessoa.nome || termosInvalidos.includes(pessoa.nome.trim().toUpperCase())) {
        console.log(`\nℹ️ Pessoa ignorada: [${pessoa?.tipo || 'Pessoa'} - ${pessoa?.nome || 'N/A'}]`);
        return;
    }

    try {
        console.log(`\nAbrindo modal para pessoa: [${pessoa.tipo} - ${pessoa.nome}]...`);

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

        // SELEÇÃO DO VÍNCULO
        console.log(`Selecionando Vínculo no Modal: "${pessoa.tipo}"...`);
        const selectVinculo = page.locator('#modalPessoa select[name="vinculo"]').first();
        await selectVinculo.waitFor({ state: 'visible', timeout: 5000 });

        await page.evaluate(({ tipoDesejado }) => {
            const select = document.querySelector('#modalPessoa select[name="vinculo"]');
            if (!select) return;

            const normalizar = str => str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase() : '';
            const alvo = normalizar(tipoDesejado);
            const options = Array.from(select.options);

            let opt = options.find(o => normalizar(o.text) === alvo || normalizar(o.value) === alvo) ||
                options.find(o => normalizar(o.text).includes(alvo) || alvo.includes(normalizar(o.text)));

            if (opt) {
                select.value = opt.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                if (typeof $ !== 'undefined') $(select).trigger('change');
            }
        }, { tipoDesejado: pessoa.tipo });

        await page.waitForTimeout(300);

        if (pessoa.cpf) {
            console.log(`Preenchendo CPF: ${pessoa.cpf}...`);
            const inputCPF = page.locator('#modalPessoa input[name="cpf"]').first();
            await inputCPF.fill(pessoa.cpf);
            await inputCPF.dispatchEvent('change');
            await inputCPF.dispatchEvent('blur');
            await page.waitForTimeout(300);
        }

        if (pessoa.nome) {
            console.log(`Preenchendo Nome: "${pessoa.nome}"...`);
            const inputNome = page.locator('#modalPessoa input[name="nome"]').first();
            await inputNome.waitFor({ state: 'visible', timeout: 5000 });
            await inputNome.click();
            await inputNome.fill('');
            await inputNome.fill(pessoa.nome);
            await inputNome.dispatchEvent('input');
            await inputNome.dispatchEvent('change');
            await inputNome.dispatchEvent('blur');
        }

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

        const selectMorte = page.locator('#modalPessoa select[name="morte"]').first();
        if (await selectMorte.isVisible({ timeout: 1000 }).catch(() => false)) {
            await selectMorte.selectOption({ label: pessoa.morte || 'NÃO' }).catch(() => { });
        }

        await page.waitForTimeout(400);

        console.log('Confirmando gravação da pessoa em #btn-salvar-pessoa...');
        await page.evaluate(() => {
            const btn = document.querySelector('#btn-salvar-pessoa');
            if (btn) btn.click();
        });

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
        // Limpeza preventiva de backdrop/máscara residual
        await page.evaluate(() => {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
            document.body.style.paddingRight = '';
        });

        // TRAVA DE SEGURANÇA: Verifica se existem dados válidos de delegacia
        const termoDelegaciaBruto = procedimento?.codigoDelegacia || procedimento?.delegaciaTexto || '';

        const delegaciaInvalida = !procedimento ||
            (!procedimento.procedimento && !procedimento.delegaciaTexto && !procedimento.codigoDelegacia) ||
            !termoDelegaciaBruto.trim() ||
            /^(N\/A|S\/D|N[ÃA]O\s+INFORMADO|SEM\s+DELEGACIA|S\/N)$/i.test(termoDelegaciaBruto.trim());

        if (delegaciaInvalida) {
            console.log('\nℹ️ Nenhuma delegacia/procedimento informado no relatório. Etapa de Procedimento ignorada -> Avançando para Histórico...');
            return;
        }

        console.log('\nIniciando fluxo de Procedimentos...');

        // 1. ATIVAÇÃO DA ABA PROCEDIMENTOS (Via clique + acionamento Bootstrap JS)
        console.log('1. Clicando na aba Procedimentos...');
        await page.evaluate(() => {
            const aba = document.querySelector('#procedimentos-tab, a[href="#procedimentos"]');
            if (aba) {
                if (typeof $ !== 'undefined') $(aba).tab('show');
                else aba.click();
            }
        });
        await page.waitForTimeout(600);

        // 2. ABERTURA DO MODAL PROCEDIMENTO
        console.log('2. Abrindo modal Procedimento...');
        await page.evaluate(() => {
            if (typeof $ !== 'undefined') {
                $('#modalProcedimento').modal('show');
            } else {
                const btn = document.querySelector('button[data-target="#modalProcedimento"]');
                if (btn) btn.click();
            }
        });

        const modalProcedimento = page.locator('#modalProcedimento');
        await modalProcedimento.waitFor({ state: 'visible', timeout: 8000 });
        await page.waitForTimeout(500);

        // 3. SELEÇÃO DA REPARTIÇÃO ("Polícia Civil")
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

        // 4. SELEÇÃO DO TIPO DE PROCEDIMENTO
        if (procedimento.procedimento) {
            console.log(`4. Selecionando Procedimento: "${procedimento.procedimento}"...`);
            const selectProc = page.locator('#modalProcedimento select[name="procedimento"], #modalProcedimento #procedimento').first();
            await selectProc.selectOption({ label: procedimento.procedimento }, { force: true }).catch(async () => {
                await selectProc.selectOption({ index: 1 }, { force: true });
            });
            await selectProc.dispatchEvent('change');
            await page.waitForTimeout(400);
        }

        // 5. SELEÇÃO DA DELEGACIA VIA SELECT2
        const termoDelegacia = termoDelegaciaBruto.trim();
        console.log(`5. Buscando Delegacia pelo código/termo: "${termoDelegacia}"...`);
        try {
            await page.evaluate(() => {
                const selectDelegacia = document.querySelector('#modalProcedimento select[name="procedimento_delegacia"], #modalProcedimento select#procedimento_delegacia');
                if (selectDelegacia && typeof $ !== 'undefined') {
                    $(selectDelegacia).select2('open');
                }
            });

            await page.waitForTimeout(400);

            const searchInputDelegacia = page.locator('.select2-container--open input.select2-search__field').first();
            await searchInputDelegacia.waitFor({ state: 'visible', timeout: 5000 });
            await searchInputDelegacia.fill(termoDelegacia);
            await page.waitForTimeout(600);

            const opcaoDelegacia = page.locator('.select2-results__option--highlighted, .select2-results__option').first();
            if (await opcaoDelegacia.isVisible({ timeout: 3000 }).catch(() => false)) {
                await opcaoDelegacia.click();
            } else {
                await page.keyboard.press('Enter');
            }
            await page.waitForTimeout(400);
            console.log('✅ Delegacia selecionada com sucesso!');
        } catch (errDelegacia) {
            console.warn('⚠️ Falha ao selecionar Delegacia via Select2:', errDelegacia.message);
        }

        // 6. SELEÇÃO DO DELEGADO (SE HOUVER)
        if (procedimento.delegado && !/^(N\/A|S\/D|N[ÃA]O\s+INFORMADO)$/i.test(procedimento.delegado.trim())) {
            console.log(`6. Buscando Delegado: "${procedimento.delegado}"...`);
            try {
                await page.evaluate(() => {
                    const selectDelegado = document.querySelector('#modalProcedimento select[name="procedimento_delegado"], #modalProcedimento select#procedimento_delegado');
                    if (selectDelegado && typeof $ !== 'undefined') {
                        $(selectDelegado).select2('open');
                    }
                });

                await page.waitForTimeout(400);

                const searchInputDelegado = page.locator('.select2-container--open input.select2-search__field').first();
                await searchInputDelegado.waitFor({ state: 'visible', timeout: 5000 });
                await searchInputDelegado.fill(procedimento.delegado);
                await page.waitForTimeout(600);

                const opcaoDelegado = page.locator('.select2-results__option--highlighted, .select2-results__option').first();
                if (await opcaoDelegado.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await opcaoDelegado.click();
                } else {
                    await page.keyboard.press('Enter');
                }
                await page.waitForTimeout(400);
                console.log('✅ Delegado selecionado com sucesso!');
            } catch (errDelegado) {
                console.warn('⚠️ Falha ao selecionar Delegado via Select2:', errDelegado.message);
            }
        }

        // 7. PREENCHIMENTO DO NÚMERO
        if (procedimento.numero) {
            console.log(`7. Preenchendo Número do B.O.: ${procedimento.numero}...`);
            const inputNumero = page.locator('#modalProcedimento input[name="procedimento_numero"]').first();
            await inputNumero.focus();
            await inputNumero.fill('');
            await inputNumero.fill(procedimento.numero);
            await inputNumero.dispatchEvent('input');
            await inputNumero.dispatchEvent('change');
        }

        // 8. PREENCHIMENTO DO ANO
        if (procedimento.ano) {
            console.log(`8. Preenchendo Ano: ${procedimento.ano}...`);
            const inputAno = page.locator('#modalProcedimento input[name="procedimento_ano"]').first();
            await inputAno.focus();
            await inputAno.fill('');
            await inputAno.fill(procedimento.ano);
            await inputAno.dispatchEvent('input');
            await inputAno.dispatchEvent('change');
        }

        console.log('Confirmando gravação do Procedimento em #btn-salvar-procedimento...');
        await page.evaluate(() => {
            const btn = document.querySelector('#btn-salvar-procedimento') ||
                document.querySelector('#modalProcedimento input[type="submit"]') ||
                document.querySelector('#modalProcedimento button:has-text("Salvar")');
            if (btn) btn.click();
        });

        console.log('Aguardando gravação e fechamento do modal de Procedimento...');
        await modalProcedimento.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => { });

        await page.evaluate(() => {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
        });

        await page.waitForTimeout(1000);
        console.log('✅ Modal Procedimento preenchido e gravado com sucesso!');
    } catch (error) {
        console.warn('⚠️ Falha ao preencher Modal Procedimento:', error.message);
    }
}

/**
 * Preenche o modal de Histórico Policial (Suporta Summernote e Textarea nativo)
 */
async function preencherModalHistorico(page, historico) {
    try {
        // Limpeza preventiva de backdrop/máscara residual
        await page.evaluate(() => {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
            document.body.style.paddingRight = '';
        });

        if (!historico || !historico.trim()) {
            console.log('\nℹ️ Nenhum histórico fornecido no relatório. Etapa de Histórico ignorada.');
            return;
        }

        console.log('\nIniciando fluxo de preenchimento do Histórico...');

        console.log('1. Clicando na aba Histórico...');
        const abaHistoricos = page.locator('#historicos-tab, a[href="#historicos"]').first();
        await abaHistoricos.waitFor({ state: 'attached', timeout: 8000 });
        await abaHistoricos.click({ force: true });
        await page.waitForTimeout(600);

        console.log('2. Clicando no botão para abrir modal Histórico...');
        const btnAbrirModal = page.locator('button[data-target="#modalHistorico"]').first();
        await btnAbrirModal.waitFor({ state: 'visible', timeout: 8000 });
        await btnAbrirModal.click();

        const modalHistorico = page.locator('#modalHistorico');
        await modalHistorico.waitFor({ state: 'visible', timeout: 8000 });
        await page.waitForTimeout(600);

        console.log('3. Preenchendo o texto do Histórico (Injetando no Summernote e Textarea)...');

        // Preenchimento duplo: via Summernote API e fallback no elemento DOM
        await page.evaluate(({ texto }) => {
            // 1. Injeção direta se o plugin jQuery/Summernote estiver ativo
            const $textarea = $('#modalHistorico textarea#historico, #modalHistorico textarea[name="historico"]');
            if ($textarea.length && typeof $textarea.summernote === 'function') {
                try {
                    $textarea.summernote('code', texto);
                } catch (e) { }
            }

            // 2. Preenchimento no editor visual gerado (.note-editable)
            const noteEditable = document.querySelector('#modalHistorico .note-editable');
            if (noteEditable) {
                noteEditable.innerHTML = texto.replace(/\n/g, '<br>');
                noteEditable.dispatchEvent(new Event('input', { bubbles: true }));
                noteEditable.dispatchEvent(new Event('blur', { bubbles: true }));
            }

            // 3. Preenchimento do textarea original (mesmo se hidden)
            const textarea = document.querySelector('#modalHistorico textarea#historico, #modalHistorico textarea[name="historico"]');
            if (textarea) {
                textarea.value = texto;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                textarea.dispatchEvent(new Event('blur', { bubbles: true }));
            }
        }, { texto: historico });

        await page.waitForTimeout(500);

        console.log('4. Confirmando gravação do Histórico em #btn-salvar-historico...');
        await page.evaluate(() => {
            const btn = document.querySelector('#btn-salvar-historico') ||
                document.querySelector('#modalHistorico input[type="submit"]') ||
                document.querySelector('#modalHistorico button:has-text("Salvar")');
            if (btn) btn.click();
        });

        console.log('Aguardando gravação e fechamento do modal de Histórico...');
        await modalHistorico.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => { });

        // Limpeza de resíduos de modal na tela
        await page.evaluate(() => {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
        });

        await page.waitForTimeout(1000);
        console.log('✅ Histórico gravado com sucesso!');
    } catch (error) {
        console.warn('⚠️ Falha ao preencher o Histórico:', error.message);
    }
}

/**
 * Preenche o modal de Materiais (Suporta Drogas, Dinheiro e Veículos)
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

            // 1. SELEÇÃO DO TIPO DE MATERIAL
            const selectorTipoMaterial = '#modalMaterial select[name="material_tipo"], select[name="material_tipo"]';
            await page.waitForSelector(selectorTipoMaterial, { state: 'attached', timeout: 8000 });

            await page.evaluate(({ selector, labelProcurado }) => {
                const select = document.querySelector(selector);
                if (select) {
                    const normalizar = s => s ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase() : '';
                    const alvo = normalizar(labelProcurado);
                    const opt = Array.from(select.options).find(o => normalizar(o.text) === alvo || normalizar(o.value) === alvo) ||
                        Array.from(select.options).find(o => normalizar(o.text).includes(alvo) || alvo.includes(normalizar(o.text)));

                    if (opt) {
                        select.value = opt.value;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        select.dispatchEvent(new Event('input', { bubbles: true }));
                        if (typeof $ !== 'undefined') $(select).trigger('change');
                    }
                }
            }, { selector: selectorTipoMaterial, labelProcurado: item.tipoLabel });

            await page.waitForTimeout(600);

            // --- TRATAMENTO: VEÍCULO ---
            if (item.tipoLabel.toLowerCase().includes('veiculo') || item.tipoLabel.toLowerCase().includes('veículo')) {
                console.log(`Preenchendo Veículo -> Situação: "${item.situacao || 'Apreendido'}" | Placa: ${item.placa}`);

                // a) Seleciona Situação ("Apreendido" ou "Recuperado")
                await page.evaluate(({ situacaoDesejada }) => {
                    const selects = Array.from(document.querySelectorAll('#modalMaterial select'));
                    const selectSituacao = selects.find(s => s.name !== 'material_tipo');

                    if (selectSituacao) {
                        const normalizar = s => s ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase() : '';
                        const alvo = normalizar(situacaoDesejada);
                        const opt = Array.from(selectSituacao.options).find(o => normalizar(o.text) === alvo || normalizar(o.value) === alvo);

                        if (opt) {
                            selectSituacao.value = opt.value;
                            selectSituacao.dispatchEvent(new Event('change', { bubbles: true }));
                            selectSituacao.dispatchEvent(new Event('input', { bubbles: true }));
                            if (typeof $ !== 'undefined') $(selectSituacao).trigger('change');
                        }
                    }
                }, { situacaoDesejada: item.situacao || 'Apreendido' });

                await page.waitForTimeout(400);

                // b) Preenche o campo Placa e força a busca automática
                const inputPlaca = page.locator('#modalMaterial input[name="placa"], input[name="placa"]').first();
                await inputPlaca.waitFor({ state: 'visible', timeout: 5000 });
                await inputPlaca.focus();
                await inputPlaca.click();
                await inputPlaca.fill('');
                await inputPlaca.fill(item.placa);

                await page.evaluate(({ val }) => {
                    const input = document.querySelector('#modalMaterial input[name="placa"]');
                    if (input) {
                        input.value = val;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.dispatchEvent(new Event('blur', { bubbles: true }));
                        if (typeof $ !== 'undefined') $(input).trigger('blur').trigger('change');
                    }
                }, { val: item.placa });

                console.log('Aguardando carregamento automático dos dados do veículo...');
                await page.waitForTimeout(2500);
            }

            // --- TRATAMENTO: ARMA DE FOGO ---
            if (item.tipoLabel.toLowerCase() === 'arma' || item.tipoLabel.toLowerCase().includes('arma')) {
                console.log(`Preenchendo Arma -> Tipo: "${item.subTipoArma}" | Marca: "${item.marca}" | Calibre: "${item.calibre}" | Nº: ${item.numero}`);

                // a) Seleciona o Subtipo da Arma (select[name="arma_tipo"]) - Imagem 3
                await page.evaluate(({ tipoDesejado }) => {
                    const select = document.querySelector('#modalMaterial select[name="arma_tipo"]') ||
                        document.querySelector('#modalMaterial select:has(option[value*="Pistola"])');
                    if (select) {
                        const normalizar = s => s ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase() : '';
                        const alvo = normalizar(tipoDesejado);
                        const opt = Array.from(select.options).find(o => normalizar(o.text) === alvo || normalizar(o.value) === alvo) ||
                            Array.from(select.options).find(o => normalizar(o.text).includes(alvo) || alvo.includes(normalizar(o.text)));
                        if (opt) {
                            select.value = opt.value;
                            select.dispatchEvent(new Event('change', { bubbles: true }));
                            select.dispatchEvent(new Event('input', { bubbles: true }));
                            if (typeof $ !== 'undefined') $(select).trigger('change');
                        }
                    }
                }, { tipoDesejado: item.subTipoArma });

                await page.waitForTimeout(400);

                // b) Seleciona a Marca via Select2 (#select2-arma_marca-*-container) - Imagem 4
                try {
                    const containerMarca = page.locator('#modalMaterial [id*="select2-arma_marca"]').first();
                    await containerMarca.waitFor({ state: 'visible', timeout: 3000 });
                    await containerMarca.click({ force: true });

                    const searchInputMarca = page.locator('.select2-container--open input.select2-search__field').first();
                    await searchInputMarca.fill(item.marca);
                    await page.waitForTimeout(400);

                    const opcaoMarca = page.locator('.select2-results__option--highlighted, .select2-results__option').first();
                    await opcaoMarca.waitFor({ state: 'visible', timeout: 3000 });
                    await opcaoMarca.click();
                } catch (e) {
                    console.warn(`⚠️ Não foi possível selecionar a marca "${item.marca}" via Select2.`);
                }

                await page.waitForTimeout(400);

                // c) Seleciona o Calibre via Select2 (#select2-arma_calibre-*-container) - Imagem 5
                try {
                    const containerCalibre = page.locator('#modalMaterial [id*="select2-arma_calibre"]').first();
                    await containerCalibre.waitFor({ state: 'visible', timeout: 3000 });
                    await containerCalibre.click({ force: true });

                    const searchInputCalibre = page.locator('.select2-container--open input.select2-search__field').first();
                    await searchInputCalibre.fill(item.calibre);
                    await page.waitForTimeout(400);

                    const opcaoCalibre = page.locator('.select2-results__option--highlighted, .select2-results__option').first();
                    await opcaoCalibre.waitFor({ state: 'visible', timeout: 3000 });
                    await opcaoCalibre.click();
                } catch (e) {
                    console.warn(`⚠️ Não foi possível selecionar o calibre "${item.calibre}" via Select2.`);
                }

                await page.waitForTimeout(400);

                // d) Preenche o Número da Arma (input[name="arma_numero"]) - Imagem 6
                const inputNumero = page.locator('#modalMaterial input[name="arma_numero"]').first();
                if (await inputNumero.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await inputNumero.focus();
                    await inputNumero.fill('');
                    await inputNumero.fill(item.numero);
                    await inputNumero.dispatchEvent('input');
                    await inputNumero.dispatchEvent('change');
                }

                // e) Preenche a Quantidade (input[name="arma_quantidade"]) - Imagem 7
                const inputQtd = page.locator('#modalMaterial input[name="arma_quantidade"]').first();
                if (await inputQtd.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await inputQtd.focus();
                    await inputQtd.fill('');
                    await inputQtd.fill(item.quantidade.toString());
                    await inputQtd.dispatchEvent('input');
                    await inputQtd.dispatchEvent('change');
                }

                await page.waitForTimeout(400);
            }

            // --- TRATAMENTO: DROGA ---
            if (item.tipoLabel.toLowerCase() === 'droga') {
                console.log(`Sub-tipo detectado: "${item.subTipoDroga}" | Quantidade: ${item.quantidadeDroga}g`);

                await page.evaluate(({ subTipoTexto }) => {
                    const selects = Array.from(document.querySelectorAll('#modalMaterial select'));
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

            // 2. CLIQUE EM SALVAR MATERIAL (#btn-salvar-material)
            console.log('Confirmando gravação do Material em #btn-salvar-material...');
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
 * Preenche o modal de Composição (Suporta Motorizado, Motopatrulhamento, etc.)
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
 * @param {Page} page Instância do Playwright
 * @param {Object} dados Dados extraídos do relatório
 * @param {Boolean} autoSalvarForm1 Define se deve submeter o Formulário 1
 */
async function executarOcorrenciaCompleta(page, dados, autoSalvarForm1) {
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
    const unidadeAlvo = dados.unidadeLocal || '1ªCIA/21ºBPM';
    if (unidadeAlvo) {
        console.log(`Buscando Unidade Militar via #select2-unidade-container: "${unidadeAlvo}"...`);
        try {
            const containerUnidade = page.locator('#select2-unidade-container, [aria-labelledby="select2-unidade-container"]').first();
            await containerUnidade.waitFor({ state: 'visible', timeout: 5000 });
            await containerUnidade.click({ force: true });

            const campoBusca = page.locator('.select2-container--open .select2-search__field').first();
            await campoBusca.waitFor({ state: 'visible', timeout: 2000 });

            const termoBusca = dados.opmBusca || unidadeAlvo;
            await campoBusca.fill(termoBusca);
            await page.waitForTimeout(400);

            const opcao = page.locator('.select2-results__option--highlighted, .select2-results__option').first();
            await opcao.waitFor({ state: 'visible', timeout: 3000 });
            await opcao.click();

            console.log(`✅ Unidade Militar (${unidadeAlvo}) selecionada com sucesso!`);
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

    // 5. OPM QUE ATENDEU (ID direto: #select2-opm-container)
    const opmAlvo = dados.opmAtendeu || unidadeAlvo;
    if (opmAlvo) {
        console.log(`Preenchendo OPM de forma direta via #select2-opm-container: "${opmAlvo}"...`);
        try {
            const containerOPM = page.locator('#select2-opm-container, [aria-labelledby="select2-opm-container"]').first();
            await containerOPM.waitFor({ state: 'visible', timeout: 5000 });
            await containerOPM.click({ force: true });

            const campoBusca = page.locator('.select2-container--open .select2-search__field').first();
            await campoBusca.waitFor({ state: 'visible', timeout: 2000 });

            const termoBusca = dados.opmBusca || opmAlvo;
            await campoBusca.fill(termoBusca);
            await page.waitForTimeout(400);

            const opcao = page.locator('.select2-results__option--highlighted, .select2-results__option').first();
            await opcao.waitFor({ state: 'visible', timeout: 3000 });
            await opcao.click();

            console.log(`✅ OPM (${opmAlvo}) selecionada com sucesso!`);
        } catch (err) {
            console.warn('⚠️ Falha ao selecionar OPM via ID direto:', err.message);
        }
    }

    // 6. NÚMERO DA OCORRÊNCIA (FICHA CIOPS)
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
    console.log('----------------------------------------------------');

    // 7. VERIFICA A DECISÃO TOMADA NO INÍCIO
    if (autoSalvarForm1) {
        console.log('Submetendo formulário via #btn-salvar-ocorrencia...');
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

            // 1. Pessoas
            await executarFormulario2(page, dados);

            // 2. Procedimento (Executa apenas se houver dados válidos de delegacia)
            const temDelegaciaValida = dados.procedimento &&
                (dados.procedimento.procedimento || dados.procedimento.delegaciaTexto || dados.procedimento.codigoDelegacia) &&
                !/^(N\/A|S\/D|N[ÃA]O\s+INFORMADO|SEM\s+DELEGACIA)$/i.test(dados.procedimento.delegaciaTexto?.trim() || '');

            if (temDelegaciaValida) {
                await preencherModalProcedimento(page, dados.procedimento);
            } else {
                console.log('\nℹ️ Relatório sem delegacia/procedimento. Pulando direto para o Histórico...');
            }

            // 3. Histórico
            if (dados.historico) {
                await preencherModalHistorico(page, dados.historico);
            }

            // 4. Materiais
            if (dados.material && dados.material.possuiMaterial) {
                await preencherModalMaterial(page, dados.material);
            }

            // 5. Composição
            await preencherModalComposicao(page, dados.composicao);
        } else {
            console.warn('⚠️ O formulário pode não ter sido salvo. Verifique pendências de preenchimento na tela.');
        }
    } else {
        console.log('\n⏸️ Salvamento automático desativado conforme selecionado no início.');
        console.log('Confira os dados na tela do navegador e clique em "Registrar Ocorrência" quando desejar.');
    }
}

// EXECUÇÃO PRINCIPAL
(async () => {
    const autoSalvarForm1 = await perguntarConfirmacao('\n🤖 Deseja que o robô REGISTRE o Formulário 1 automaticamente ao terminar?');

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

        // 1. Carrega/Seleciona o relatório antes de entrar no menu das ações
        try {
            relatorioAtual = await selecionarEObterTextoRelatorio();
        } catch (err) {
            console.error('❌ Erro ao carregar relatório:', err.message);
            break;
        }

        let emExecucaoDoRelatorio = true;

        // 2. Loop de operações sobre o relatório atualmente selecionado
        while (emExecucaoDoRelatorio) {
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
                await executarOcorrenciaCompleta(page, dados, autoSalvarForm1);
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
                console.log('\nTroca de relatório solicitada...');
                emExecucaoDoRelatorio = false; // Sai do sub-loop para escolher novo relatório no loop principal
                continue;
            } else if (opcao.trim() === '9' || opcao.trim().toLowerCase() === 'sair') {
                emExecucaoDoRelatorio = false;
                continuarSistema = false;
                console.log('Encerrando o robô...');
                await context.close();
                break;
            }

            if (!continuarSistema) break;

            console.log('\n====================================================');
            const proximoComando = await aguardarComando('Deseja VOLTAR AO MENU PRINCIPAL com este relatório? (S/N): ');

            if (proximoComando.trim().toLowerCase() === 's' || proximoComando.trim().toLowerCase() === 'sim') {
                console.log('\nRetornando ao menu do relatório atual...');
                // Permanece no sub-loop com o mesmo relatório
            } else {
                emExecucaoDoRelatorio = false;
                continuarSistema = false;
                console.log('Encerrando o robô...');
                await context.close();
                break;
            }
        }
    }
})();