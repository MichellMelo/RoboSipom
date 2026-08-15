const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { extrairDadosFormulario1 } = require('./parserForm1');

function obterTextoRelatorio() {
    const caminhoArquivo = path.join(__dirname, 'relatorio.txt');
    if (fs.existsSync(caminhoArquivo)) {
        return fs.readFileSync(caminhoArquivo, 'utf-8');
    }
    throw new Error('Arquivo relatorio.txt não encontrado.');
}

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

(async () => {
    const textoBruto = obterTextoRelatorio();
    const dados = extrairDadosFormulario1(textoBruto);

    console.log('--- Dados Extraídos para Preenchimento ---');
    console.log(dados);
    console.log('------------------------------------------');

    // Cria/usa um perfil exclusivo do robô sem conflito com o Chrome pessoal
    const userDataDir = path.join(__dirname, 'perfil-robo-chrome');

    console.log('Iniciando Google Chrome com o perfil Default...');

    // Lança o contexto com parâmetros adicionais para evitar travamento de perfil
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

    // Pega a aba já aberta ou cria uma nova
    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

    console.log('Navegando explicitamente para o SIPOM...');
    await page.goto('https://sipom.pm.ce.gov.br/login', { waitUntil: 'domcontentloaded' });

    console.log('====================================================');
    console.log('AGUARDANDO LOGIN E OTP NO NAVEGADOR...');
    console.log('====================================================');

    await page.waitForURL('**/sipom.pm.ce.gov.br/**', { timeout: 0 });

    console.log('Login detectado! Carregando painel...');
    await page.waitForLoadState('networkidle').catch(() => { });
    await page.waitForTimeout(1000);

    // 1. Clica no card ROP
    console.log('Acessando o sistema ROP...');
    try {
        const cardROP = page.locator('div:has-text("ROP"), a:has-text("ROP"), .card:has-text("ROP")').first();
        await cardROP.waitFor({ state: 'visible', timeout: 10000 });
        await cardROP.click();
    } catch (e) {
        console.warn('⚠️ Falha ao clicar no card ROP. Tentando URL direta...');
        await page.goto('https://sipom.pm.ce.gov.br/ocorrencias');
    }

    await page.waitForLoadState('networkidle').catch(() => { });
    await page.waitForTimeout(1000);

    // 2. Clica no menu + Criar ocorrência
    console.log('Navegando para "+ Criar corrência"...');
    try {
        const btnCriarOcorrencia = page.locator('text="+ Criar corrência", text="+ Criar ocorrência", a:has-text("Criar")').first();
        await btnCriarOcorrencia.waitFor({ state: 'visible', timeout: 10000 });
        await btnCriarOcorrencia.click();
    } catch (e) {
        console.warn('⚠️ Falha ao clicar no menu "+ Criar corrência". Tentando URL direta...');
        await page.goto('https://sipom.pm.ce.gov.br/ocorrencias/ocorrencias-criar');
    }

    await page.waitForLoadState('networkidle').catch(() => { });
    await page.waitForTimeout(1500);

    // 3. Preenchimento do Formulário
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
    console.log('Confira os dados e clique em "Registrar Ocorrência".');
    console.log('Aguardando o redirecionamento para a tela de detalhes...');
    console.log('----------------------------------------------------');

    // O robô fica aguardando a URL mudar para a tela de detalhes (detalhando a ocorrência)
    await page.waitForURL('**/ocorrencias/**', { timeout: 0 });
    await page.waitForLoadState('networkidle').catch(() => { });
    await page.waitForTimeout(1500);

    console.log('Tela de detalhes detectada! Iniciando preenchimento do Formulário 2...');
})();