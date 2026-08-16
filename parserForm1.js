/**
 * Mapeamento exato dos Bairros por Circunscrição da OPM (21º BPM)
 */
const MAPA_BAIRROS_OPM = {
    // --- 1ª CIA / 21º BPM ---
    'CONJUNTO ESPERANÇA': '1ªCIA/21ºBPM',
    'CONJUNTO ESPERANCA': '1ªCIA/21ºBPM',
    'CONJ. ESPERANÇA': '1ªCIA/21ºBPM',
    'CONJ. ESPERANCA': '1ªCIA/21ºBPM',
    'VILA MANOEL SATIRO': '1ªCIA/21ºBPM',
    'VILA MANOEL SÁTIRO': '1ªCIA/21ºBPM',
    'PARQUE SÃO JOSÉ': '1ªCIA/21ºBPM',
    'PARQUE SAO JOSE': '1ªCIA/21ºBPM',
    'PQ SÃO JOSÉ': '1ªCIA/21ºBPM',
    'PQ SAO JOSE': '1ªCIA/21ºBPM',
    'PARQUE SANTA ROSA': '1ªCIA/21ºBPM',
    'PQ SANTA ROSA': '1ªCIA/21ºBPM',
    'PARQUE PRESIDENTE VARGAS': '1ªCIA/21ºBPM',
    'PQ PRESIDENTE VARGAS': '1ªCIA/21ºBPM',
    'PRESIDENTE VARGAS': '1ªCIA/21ºBPM',
    'CANINDEZINHO': '1ªCIA/21ºBPM',
    'MARAPONGA': '1ªCIA/21ºBPM',
    'JARDIM CEARENSE': '1ªCIA/21ºBPM',
    'NOVO MONDUBIM': '1ªCIA/21ºBPM',

    // --- 2ª CIA / 21º BPM ---
    'PLANALTO AIRTON SENA': '2ªCIA/21ºBPM',
    'PLANALTO AYRTON SENNA': '2ªCIA/21ºBPM',
    'PREFEITO JOSÉ WALTER': '2ªCIA/21ºBPM',
    'PREFEITO JOSE WALTER': '2ªCIA/21ºBPM',
    'JOSÉ WALTER': '2ªCIA/21ºBPM',
    'JOSE WALTER': '2ªCIA/21ºBPM',
    'ARACAPÉ': '2ªCIA/21ºBPM',
    'ARACAPE': '2ªCIA/21ºBPM',
    'MONDUBIM': '2ªCIA/21ºBPM',
    'CIDADE NOVA': '2ªCIA/21ºBPM',
    'PARQUE SANTANA': '2ªCIA/21ºBPM',
    'PQ SANTANA': '2ªCIA/21ºBPM',
};

/**
 * Tabela De-Para com TODAS as opções do SIPOM e equivalências de rua
 */
const MAPA_NATUREZAS_SIPOM = {
    // --- EQUIVALÊNCIAS / EXPRESSÕES DE RUA COMUNS ---
    'ABANDONO DE MATERIAL ILICITO': 'OUTRAS INFRAÇÕES À LEI DE ENTORPECENTES',
    'ABANDONO DE MATERIAL ILÍCITO': 'OUTRAS INFRAÇÕES À LEI DE ENTORPECENTES',
    'ACHADO DE ENTORPECENTE': 'OUTRAS INFRAÇÕES À LEI DE ENTORPECENTES',
    'APREENSÃO DE ENTORPECENTES': 'OUTRAS INFRAÇÕES À LEI DE ENTORPECENTES',
    'APREENSAO DE ENTORPECENTES': 'OUTRAS INFRAÇÕES À LEI DE ENTORPECENTES',
    'TRAFICO DE DROGAS': 'TRAFICO ILICITO DE DRODAS',
    'TRAFICO DE ENTORPECENTES': 'TRAFICO ILICITO DE DRODAS',
    'USO DE DROGAS': 'USUARIOS OU DEPENDENTES DE DROGAS',
    'MANDADO DE PRISAO': 'CRUMPIMENTO DE MANDADO DE PRISÃO',
    'RECAPTURA': 'RECAPTURA DE PRESO',
    'PORTE DE ARMA': 'PORTE ILEGAL DE ARMA DE FOGO DE USO PERMITIDO',
    'POSSE DE ARMA': 'POSSE IRREGULAR DE ARMA DE FOGO DE USO PERMITITDO',
    'ROUBO DE CELULAR': 'ROUBO DE DISPPOSITIVO DE TELEFONIA MÓVEL',

    // --- TODAS AS OPÇÕES OFICIAIS DO SISTEMA ---
    'HOMICIDIO DOLOSO': 'HOMICIDIO DOLOSO',
    'LESAO CORPORAL DOLOSA': 'LESAO CORPORAL DOLOSA',
    'ESTUPRO': 'ESTUPRO',
    'FURTO QUALIFICADO (ARROMBAMENTIO)': 'FURTO QUALIFICADO (ARROMBAMENTIO)',
    'ROUBO (OUTROS)': 'ROUBO (OUTROS)',
    'FURTO(OUTROS)': 'FURTO(OUTROS)',
    'AMEAÇA': 'AMEAÇA',
    'FURTO DE VEICULO': 'FURTO DE VEICULO',
    'USO DE ENTORPECENTES': 'USO DE ENTORPECENTES',
    'TRAFICO DE ENTORPECENTES': 'TRAFICO DE ENTORPECENTES',
    'NAO INFORMADO': 'NAO INFORMADO',
    'CALUNIA': 'CALUNIA',
    'DIFAMACÃO': 'DIFAMACÃO',
    'INJURIA': 'INJURIA',
    'CONSTRAGIMENTO ILEGAL': 'CONSTRAGIMENTO ILEGAL',
    'SEQUESTRO E CARCERE PRIVADO': 'SEQUESTRO E CARCERE PRIVADO',
    'VIOLACAO DE DOMICILIO': 'VIOLACAO DE DOMICILIO',
    'EXTORSAO': 'EXTORSAO',
    'EXTORSAO MEDIANTE SEQUESTRO': 'EXTORSAO MEDIANTE SEQUESTRO',
    'DANO': 'DANO',
    'APROPIACAO INDEBITA': 'APROPIACAO INDEBITA',
    'ESTELIONATO': 'ESTELIONATO',
    'RECEPTACAO': 'RECEPTACAO',
    'HOMICIDIO CULPOSO': 'HOMICIDIO CULPOSO',
    'LESAO CORPORAL CULPOSA': 'LESAO CORPORAL CULPOSA',
    'LESAO CORPORAL SEGUIDA DE MORTE': 'LESAO CORPORAL SEGUIDA DE MORTE',
    'ATENTADO VIOLENTO AO PUDOR': 'ATENTADO VIOLENTO AO PUDOR',
    'SEDUCAO': 'SEDUCAO',
    'CORRUPCAO DE MENORES': 'CORRUPCAO DE MENORES',
    'NAO DELITUOSA': 'NAO DELITUOSA',
    'ACIDENTES - OUTROS': 'ACIDENTES - OUTROS',
    'TORTURA': 'TORTURA',
    'PRECOCEITO DE RACA OU DE COR': 'PRECOCEITO DE RACA OU DE COR',
    'HOMICIDIO CULPOSO NO TRANSITO': 'HOMICIDIO CULPOSO NO TRANSITO',
    'LESAO CORPORAL CULPOSA - TRANSITO': 'LESAO CORPORAL CULPOSA - TRANSITO',
    'OUTROS CRIME CONTRA A VIDA': 'OUTROS CRIME CONTRA A VIDA',
    'PERICLITACAO DA VIDA OU SAUDE': 'PERICLITACAO DA VIDA OU SAUDE',
    'RIXA': 'RIXA',
    'OUTROS CRIMES CONTRA A LIBERDADE INDIVIDUAL': 'OUTROS CRIMES CONTRA A LIBERDADE INDIVIDUAL',
    'ROUBO SEGUIDO DE MORTE (LATROCCINIO)': 'ROUBO SEGUIDO DE MORTE (LATROCCINIO)',
    'OUTROS CRIMES CONTRA O PATRIMONIO': 'OUTROS CRIMES CONTRA O PATRIMONIO',
    'CRIME CONTRA A PROPRIEDADE IMATERIAL': 'CRIME CONTRA A PROPRIEDADE IMATERIAL',
    'CRIME CONTRA A ORGANIZACAO DO TRABALHO': 'CRIME CONTRA A ORGANIZACAO DO TRABALHO',
    'CRIME CONTRA O SENTIMENTO RELIGIOSOS': 'CRIME CONTRA O SENTIMENTO RELIGIOSOS',
    'CRIME CONTRA O RESPEITO AOS MORTOS': 'CRIME CONTRA O RESPEITO AOS MORTOS',
    'RAPTO': 'RAPTO',
    'OUTROS CRIMES CONTRA OS COSTUMES': 'OUTROS CRIMES CONTRA OS COSTUMES',
    'CRIME CONTRA A INCOLUMIDADE PUBLICA': 'CRIME CONTRA A INCOLUMIDADE PUBLICA',
    'CRIME CONTRA A FE PUBLICA': 'CRIME CONTRA A FE PUBLICA',
    'CRIME CONTRA A ADMINISTRACAO PUBLICA': 'CRIME CONTRA A ADMINISTRACAO PUBLICA',
    'CONTRAVENCAO PENAL': 'CONTRAVENCAO PENAL',
    'CRIME CONTRA O CONSUMIDOR': 'CRIME CONTRA O CONSUMIDOR',
    'CRIME ELEITORAL': 'CRIME ELEITORAL',
    'ABUSO DE AUTORIDADE': 'ABUSO DE AUTORIDADE',
    'CRIME CONTRA A ORDEM TRIBUTARIA': 'CRIME CONTRA A ORDEM TRIBUTARIA',
    'AFOGAMENTO': 'AFOGAMENTO',
    'SUICIDIO': 'SUICIDIO',
    'ACIDENTE DE TRABALHO': 'ACIDENTE DE TRABALHO',
    'EXTRAVIO DE DOCUMENTOS/OBJETOS/VALORES': 'EXTRAVIO DE DOCUMENTOS/OBJETOS/VALORES',
    'PORTE ILEGAL DE ARMA DE FOGO': 'PORTE ILEGAL DE ARMA DE FOGO',
    'CRIME AMBIENTAL': 'CRIME AMBIENTAL',
    'ROUBODE CARGA': 'ROUBODE CARGA',
    'ROUBO DE VEICULO': 'ROUBO DE VEICULO',
    'DIRECAO PERIGOSA': 'DIRECAO PERIGOSA',
    'OUTROS CRIMES DE TRANSITO': 'OUTROS CRIMES DE TRANSITO',
    'MORTE NATURAL': 'MORTE NATURAL',
    'DESAPARECIMENTO DE PESSOA': 'DESAPARECIMENTO DE PESSOA',
    'MORTE SUSPEITA': 'MORTE SUSPEITA',
    'CRIME PREVISTO NO ESTATUTO DO MENO': 'CRIME PREVISTO NO ESTATUTO DO MENO',
    'EXPLORACAO SEXUAL DE MENOR': 'EXPLORACAO SEXUAL DE MENOR',
    'CRIME CONTRA A ORDEM ECONOMICA': 'CRIME CONTRA A ORDEM ECONOMICA',
    'OUTRAS INFRAÇÕES À LEI DE ENTORPECENTES': 'OUTRAS INFRAÇÕES À LEI DE ENTORPECENTES',
    'CRIME PREVISTOS NA LEI DE LICITAÇÕES': 'CRIME PREVISTOS NA LEI DE LICITAÇÕES',
    'CRIME DE RESPONSABILIDADE DE PREFEITOS E VEREADORES': 'CRIME DE RESPONSABILIDADE DE PREFEITOS E VEREADORES',
    'CRIME PREVISTOS NA LEI DE RESPONSABILIDADE FISCAL': 'CRIME PREVISTOS NA LEI DE RESPONSABILIDADE FISCAL',
    'CRIME DE LAVAGEM OU OCULTAÇÃO DE BENS': 'CRIME DE LAVAGEM OU OCULTAÇÃO DE BENS',
    'CRIME CONTRA A PAZ PUBLICA': 'CRIME CONTRA A PAZ PUBLICA',
    'CRIME CONTRA A PROPRIEDADE INDUSTRIAL': 'CRIME CONTRA A PROPRIEDADE INDUSTRIAL',
    'INTERCEPTACAO DE COMUNICAÇÕES TELEFÔNICAS': 'INTERCEPTACAO DE COMUNICAÇÕES TELEFÔNICAS',
    'INTERCEPTAÇÃO DE SISTEMAS DE INFORMÁTICA OU TELEMÁTICA': 'INTERCEPTAÇÃO DE SISTEMAS DE INFORMÁTICA OU TELEMÁTICA',
    'QUEBRA DE SEGREDO DE JUSTIÇA': 'QUEBRA DE SEGREDO DE JUSTIÇA',
    'CRIME EM AÇÃO DE ALIMENTOS': 'CRIME EM AÇÃO DE ALIMENTOS',
    'CRIME CONTRA A ADMINISTRAÇÃO PÚBLICA(PARC. SOLO URBADO)': 'CRIME CONTRA A ADMINISTRAÇÃO PÚBLICA(PARC. SOLO URBADO)',
    'CRIME PREVISTO NA LEI DE IMPRENSA': 'CRIME PREVISTO NA LEI DE IMPRENSA',
    'CRIME CONTRA A ECONOMIA POPULAR': 'CRIME CONTRA A ECONOMIA POPULAR',
    'FUGA DE PRESO': 'FUGA DE PRESO',
    'MORTEACIDENTAL NO TRANSITO (EXCETO HOMICIDIO CULPOSO)': 'MORTEACIDENTAL NO TRANSITO (EXCETO HOMICIDIO CULPOSO)',
    'OUTRAS MORTES ACIDENTAIS (EXCETO HOMICIDIO CULPOSO)': 'OUTRAS MORTES ACIDENTAIS (EXCETO HOMICIDIO CULPOSO)',
    'LESAO ACIDENTAL NO TRANSITO (EXCETO LESAO CORPORAL CULPOSA)': 'LESAO ACIDENTAL NO TRANSITO (EXCETO LESAO CORPORAL CULPOSA)',
    'OUTRAS LESOES ACIDENTAIS (EXCETO LESAO CORPORAL CULPOSA)': 'OUTRAS LESOES ACIDENTAIS (EXCETO LESAO CORPORAL CULPOSA)',
    'OUTRAS LESOES CORPORAIS CULPOSAS': 'OUTRAS LESOES CORPORAIS CULPOSAS',
    'OUTROS CRIMES RESULTANTES EM LESAO CORPORAL': 'OUTROS CRIMES RESULTANTES EM LESAO CORPORAL',
    'ROUBO COM RESTRICAO DE LIBERDADE DA VITIMA': 'ROUBO COM RESTRICAO DE LIBERDADE DA VITIMA',
    'FURTO DE CARGA': 'FURTO DE CARGA',
    'LAVAGEM OU OCULTACAO DE BENS,DIREITOS E VALORES': 'LAVAGEM OU OCULTACAO DE BENS,DIREITOS E VALORES',
    'CRIME CONTRA O IDOSO': 'CRIME CONTRA O IDOSO',
    'POSSE IRREGULAR DE ARMA DE FOGO DE USO PERMITITDO': 'POSSE IRREGULAR DE ARMA DE FOGO DE USO PERMITITDO',
    'OMISSAO DE CAUTELA (POSSE DE ARMA DE FOGO)': 'OMISSAO DE CAUTELA (POSSE DE ARMA DE FOGO)',
    'PORTE ILEGAL DE ARMA DE FOGO DE USO PERMITIDO': 'PORTE ILEGAL DE ARMA DE FOGO DE USO PERMITIDO',
    'DISPARO DE ARMA DE FOGO': 'DISPARO DE ARMA DE FOGO',
    'VIOLACAO AO ESTATUTO DE DEFESA DO TORCEDOR': 'VIOLACAO AO ESTATUTO DE DEFESA DO TORCEDOR',
    'CRIME PREVISTO NA LEI 7347/85 ART 10': 'CRIME PREVISTO NA LEI 7347/85 art 10',
    'CRIME PREVISTO NA LEI 9504/97 9 (NORMAS PARA ELEIÇÃO)': 'CRIME PREVISTO NA LEI 9504/97 9 (NORMAS PARA ELEIÇÃO)',
    'FURTO DE PLACA DE VEICULO': 'FURTO DE PLACA DE VEICULO',
    'FURTO DE DOCUMENTOS': 'FURTO DE DOCUMENTOS',
    'EXTRAVIO DE DOCUMENTOS': 'EXTRAVIO DE DOCUMENTOS',
    'QUEBRA DE SIGILO DE OPERAÇÕES FINANCEIRAS': 'QUEBRA DE SIGILO DE OPERAÇÕES FINANCEIRAS',
    'USUARIOS OU DEPENDENTES DE DROGAS': 'USUARIOS OU DEPENDENTES DE DROGAS',
    'TRAFICO ILICITO DE DRODAS': 'TRAFICO ILICITO DE DRODAS',
    'VIOLAÇÃO DE DIREITOS DE AUTOR DE PROGRAMA DE COMPUTADOR': 'VIOLAÇÃO DE DIREITOS DE AUTOR DE PROGRAMA DE COMPUTADOR',
    'CRIME DE VIOLENCIA DOMESTICA': 'CRIME DE VIOLENCIA DOMESTICA',
    'TRAFICO INTERNACIONAL DE PESSOAS': 'TRAFICO INTERNACIONAL DE PESSOAS',
    'TRAFICO INTERNO DE PESSOAS': 'TRAFICO INTERNO DE PESSOAS',
    'OUTROS CRIMES COTRA A DIGNIDADE SEXUAL': 'OUTROS CRIMES COTRA A DIGNIDADE SEXUAL',
    'ESTUPRO DE VULNERAVEL': 'ESTUPRO DE VULNERAVEL',
    'CAUSA MORTIS IGNORADA': 'CAUSA MORTIS IGNORADA',
    'EXTRAVIO DE ARMA DE FOGO': 'EXTRAVIO DE ARMA DE FOGO',
    'ROUBO A BANCO': 'ROUBO A BANCO',
    'ROUBO A CAIXA ELETRÔNICO': 'ROUBO A CAIXA ELETRÔNICO',
    'ROUBO (SAIDINHA BANCÁRIA)': 'ROUBO (SAIDINHA BANCÁRIA)',
    'DENUNCIAÇÃO CALUNIOSA': 'DENUNCIAÇÃO CALUNIOSA',
    'ATENTADO CONTRA A SEG. DE TRANSP MARITIMO, FLUVIAL OU AEREO': 'ATENTADO CONTRA A SEG. DE TRANSP MARITIMO, FLUVIAL OU AEREO',
    'ACIDENTE DE TRÂNSITO': 'ACIDENTE DE TRÂNSITO',
    'ROUBO A PESSOA': 'ROUBO A PESSOA',
    'ROUBO A RESIDÊNCIA': 'ROUBO A RESIDÊNCIA',
    'RECUPERAÇÃO DE VEÍCULOS': 'RECUPERAÇÃO DE VEÍCULOS',
    'ESTATUTO DA PESSOA COM DEFICIÊNCIA': 'ESTATUTO DA PESSOA COM DEFICIÊNCIA',
    'FEMIICÍDIO': 'FEMIICÍDIO',
    'LESÃO CORPORAL DECORRENTE DE OPOSIÇÃO À INTERVENÇÃO POLICIAL': 'LESÃO CORPORAL DECORRENTE DE OPOSIÇÃO À INTERVENÇÃO POLICIAL',
    'HOMICÍDIO DECORRENTE DE OPOSIÇÃO À INTERVENÇÃO POLICIAL': 'HOMICÍDIO DECORRENTE DE OPOSIÇÃO À INTERVENÇÃO POLICIAL',
    'CRUMPIMENTO DE MANDADO DE PRISÃO': 'CRUMPIMENTO DE MANDADO DE PRISÃO',
    'RECAPTURA DE PRESO': 'RECAPTURA DE PRESO',
    'MAUS-TRATOS AOS ANIMAIS': 'MAUS-TRATOS AOS ANIMAIS',
    'PRECOCEITO DE RAÇA OU COR - CONDUTA HOMOFÓBICA': 'PRECOCEITO DE RAÇA OU COR - CONDUTA HOMOFÓBICA',
    'PRECOCEITO DE RAÇA OU COR - CONDUTA TRANSFÓBICA': 'PRECOCEITO DE RAÇA OU COR - CONDUTA TRANSFÓBICA',
    'PERSEGUIÇÃO': 'PERSEGUIÇÃO',
    'ORGANIZAÇÃO CRIMINOSA': 'ORGANIZAÇÃO CRIMINOSA',
    'VIOLÊNCIA PSICOLÓGICA CONTRA A MULHER': 'VIOLÊNCIA PSICOLÓGICA CONTRA A MULHER',
    'DESCUMPRIMENTO DE MEDIDAS PROTETIVAS DE URGÊNCIA': 'DESCUMPRIMENTO DE MEDIDAS PROTETIVAS DE URGÊNCIA',
    'CRIMES DE TERRORISMO (LEI 13.260/2016)': 'CRIMES DE TERRORISMO (LEI 13.260/2016)',
    'ROUBO DE DISPPOSITIVO DE TELEFONIA MÓVEL': 'ROUBO DE DISPPOSITIVO DE TELEFONIA MÓVEL'
};

function normalizarTexto(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .trim();
}

/**
 * Extrai envolvidos e qualificações (Pessoas)
 */
function extrairPessoas(textoLimpo) {
    const pessoas = [];
    const textoSanitizado = textoLimpo
        .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
        .replace(/\*/g, '');

    const inicioMatch = textoSanitizado.match(/Qualifica[çc][ãa]o\s+das\s+Partes:\s*([\s\S]*)/i);
    if (!inicioMatch) {
        return [{
            tipo: 'Infrator - Não identificado',
            cpf: '',
            sexo: '',
            morte: 'NÃO',
            nome: '',
            nascimento: '',
            mae: ''
        }];
    }

    let blocoTexto = inicioMatch[1];
    const fimMatch = blocoTexto.match(/([\s\S]*?)(?=\n\s*(?:Delegad[oa]|Material|Relato|Hist[óo]rico|Capitula[çc][ãa]o|N[°º]?\s*do\s*Mandado)|$)/i);
    if (fimMatch) {
        blocoTexto = fimMatch[1];
    }

    const linhas = blocoTexto.split('\n');
    let pessoaAtual = null;

    for (let linha of linhas) {
        const textoLinha = linha.trim();
        if (!textoLinha) continue;

        const papelMatch = textoLinha.match(/^(Acusado|Infrator|Preso|Suspeito|Autor|V[ií]tima|Testemunha|Tio|Tia):\s*(.*)/i);

        if (papelMatch) {
            if (pessoaAtual) pessoas.push(pessoaAtual);

            const rotuloOriginal = papelMatch[1].toUpperCase();
            const nomeBruto = papelMatch[2].replace(/,\s*vulgo.*$/i, '').trim();

            let tipoSipom = 'Infrator';
            if (/V[IÍ]TIMA/i.test(rotuloOriginal)) tipoSipom = 'Vitima';
            else if (/TESTEMUNHA/i.test(rotuloOriginal)) tipoSipom = 'Testemunha';
            else if (/TIO|TIA/i.test(rotuloOriginal)) tipoSipom = 'Tio (a)';

            pessoaAtual = {
                tipo: tipoSipom,
                nome: nomeBruto,
                cpf: '',
                sexo: 'MASCULINO',
                morte: 'NÃO',
                nascimento: '',
                mae: ''
            };
        } else if (pessoaAtual) {
            const cpfMatch = textoLinha.match(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/);
            if (cpfMatch) pessoaAtual.cpf = cpfMatch[0].replace(/\D/g, '');

            const nascMatch = textoLinha.match(/(?:Data\s+de\s+Nascimento|Nascimento|Nasc):\s*(\d{2}\/\d{2}\/\d{4})/i);
            if (nascMatch) pessoaAtual.nascimento = nascMatch[1];

            const maeMatch = textoLinha.match(/(?:M[ãa]e):\s*([^\n]+)/i);
            if (maeMatch) pessoaAtual.mae = maeMatch[1].trim();
        }
    }

    if (pessoaAtual) pessoas.push(pessoaAtual);

    return pessoas.length > 0 ? pessoas : [{
        tipo: 'Infrator - Não identificado',
        cpf: '',
        sexo: '',
        morte: 'NÃO',
        nome: '',
        nascimento: '',
        mae: ''
    }];
}

/**
 * Extrai informações do procedimento policial
 */
function extrairProcedimento(textoLimpo) {
    const textoSanitizado = textoLimpo.replace(/\*/g, '');
    const blocoMatch = textoSanitizado.match(/Delegad[oa](?:\/Delegacia\/Procedimento)?:\s*\n?\s*([^\n]+)/i);

    if (blocoMatch) {
        const linhaProc = blocoMatch[1].trim();
        const partes = linhaProc.split('/').map(p => p.trim());

        if (partes.length >= 3) {
            const delegado = partes[0];
            const delegaciaTexto = partes[1];
            const procTexto = partes.slice(2).join('/');

            const procMatch = procTexto.match(/(B\.?O\.?|I\.?P\.?|TCO)?\s*N?[°º]?\s*(\d+)-([\d\s]+)\/(\d{4})/i);

            let procedimentoNome = 'Boletim de Ocorrência - BO';
            let codigoDelegacia = '110';
            let numeroBo = '';
            let ano = '2026';

            if (procMatch) {
                const tipoSigla = (procMatch[1] || '').toUpperCase();
                codigoDelegacia = procMatch[2].trim();
                numeroBo = procMatch[3].replace(/\s+/g, '').trim();
                ano = procMatch[4].trim();

                if (tipoSigla.includes('I.P') || tipoSigla.includes('IP')) {
                    procedimentoNome = 'Inquerito Policial - IP';
                } else if (tipoSigla.includes('TCO')) {
                    procedimentoNome = 'Termo Circunstanciado de Ocorrência - TCO';
                }
            } else {
                const procSimpleMatch = procTexto.match(/(B\.?O\.?|I\.?P\.?|TCO)?\s*N?[°º]?\s*([\d\s-]+)\/(\d{4})/i);
                if (procSimpleMatch) {
                    numeroBo = procSimpleMatch[2].replace(/\s+/g, '').trim();
                    ano = procSimpleMatch[3].trim();
                }
            }

            return {
                delegado: delegado,
                delegaciaTexto: delegaciaTexto,
                codigoDelegacia: codigoDelegacia,
                procedimento: procedimentoNome,
                numero: numeroBo,
                ano: ano
            };
        }
    }

    return {
        delegado: '',
        delegaciaTexto: '10° Distrito Policial',
        codigoDelegacia: '110',
        procedimento: 'Boletim de Ocorrência - BO',
        numero: '',
        ano: '2026'
    };
}

/**
 * Extrai o texto do Histórico/Relato
 */
function extrairHistorico(textoLimpo) {
    const textoSanitizado = textoLimpo
        .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
        .replace(/\*/g, '');

    const match = textoSanitizado.match(/(?:Hist[óo]rico|Relato):\s*([\s\S]*)/i);
    return match ? match[1].trim() : '';
}

/**
 * Extrai e classifica múltiplos materiais do relatório (Drogas, Dinheiro, Armas, etc.)
 */
function extrairMaterial(textoLimpo) {
    const textoSanitizado = textoLimpo
        .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
        .replace(/\*/g, '');

    // Captura todo o bloco de texto da seção Material até a linha do Histórico
    const matchBloco = textoSanitizado.match(/Material\s*(?:apreendido\/recuperado)?:\s*([\s\S]*?)(?=\n\s*(?:Hist[óo]rico|Relato|Delegad[oa]|$))/i);

    if (!matchBloco) {
        return { possuiMaterial: false, lista: [] };
    }

    const blocoMaterial = matchBloco[1].trim();
    if (/^(S\/A|N\/A|SEM MATERIAL|NENHUM|NADA)$/i.test(blocoMaterial)) {
        return { possuiMaterial: false, lista: [] };
    }

    const listaMateriais = [];

    // --- 1. Captura de DROGAS ---
    const regexDroga = /(COCA[IÍ]NA|CRACK|MACONHA|SKANK|SKUNK|HAXIXE|ENTORPECENTE|DROGA)[^\d]*(\d+(?:[\.,]\d+)?)\s*(?:G|GRAMAS|GR)?/gi;
    let matchDroga;
    while ((matchDroga = regexDroga.exec(blocoMaterial)) !== null) {
        const nomeSubstancia = matchDroga[1].toUpperCase();
        const quantidade = matchDroga[2].replace(',', '.');

        let subTipoDroga = 'Maconha - gramas (g)';
        if (/COCA[IÍ]NA/i.test(nomeSubstancia)) subTipoDroga = 'Cocaína - gramas (g)';
        else if (/CRACK/i.test(nomeSubstancia)) subTipoDroga = 'Crack - gramas (g)';
        else if (/SKANK|SKUNK/i.test(nomeSubstancia)) subTipoDroga = 'Skank - gramas (g)';

        listaMateriais.push({
            tipoLabel: 'Droga',
            subTipoDroga: subTipoDroga,
            quantidadeDroga: quantidade
        });
    }

    // --- 2. Captura de DINHEIRO ---
    const regexDinheiro = /(?:DINHEIRO|ESP[ÉE]CIE|CEDULA|NOTAS|R\$|VALOR)\s*:?\s*(?:R\$\s*)?(\d+(?:\.\d{3})*(?:,\d{2})?|\d+)/gi;
    let matchDinheiro = regexDinheiro.exec(blocoMaterial);
    if (matchDinheiro) {
        let v = matchDinheiro[1].replace(/\./g, '');
        if (!v.includes(',')) v += ',00';
        listaMateriais.push({
            tipoLabel: 'Dinheiro',
            valorDinheiro: v
        });
    }

    // --- 3. Captura de OUTROS MATERIAIS (Arma, Munição, Celular, Veículo) ---
    if (listaMateriais.length === 0) {
        let tipoLabel = 'Outros';
        const descUpper = blocoMaterial.toUpperCase();

        if (/REV[ÓO]LVER|PISTOLA|ESPINGARDA|ARMA|RIFLE|FUZIL/i.test(descUpper)) tipoLabel = 'Arma';
        else if (/MUNI[ÇC][ÃA]O|CARTUCHO|PROJ[ÉE]TIL/i.test(descUpper)) tipoLabel = 'Munição';
        else if (/CELULAR|TELEFONE|SMARTPHONE|IPHONE/i.test(descUpper)) tipoLabel = 'Celular';
        else if (/VE[IÍ]CULO|CARRO|MOTO|AUTOM[ÓO]VEL/i.test(descUpper)) tipoLabel = 'Veículo';

        listaMateriais.push({ tipoLabel: tipoLabel });
    }

    return {
        possuiMaterial: listaMateriais.length > 0,
        lista: listaMateriais
    };
}

/**
 * Função principal exportada do parser
 */
function extrairDadosFormulario1(textoRelatorio) {
    if (!textoRelatorio || typeof textoRelatorio !== 'string') {
        throw new Error('O texto do relatório fornecido é inválido.');
    }

    const textoLimpo = textoRelatorio.replace(/\r\n/g, '\n');

    const numOcorrenciaMatch = textoLimpo.match(/(M\d{10,12})/i);
    const naturezaMatch = textoLimpo.match(/Natureza(?:\s+da\s+Ocorr[êe]ncia)?:\s*([^\n]+)/i);

    let naturezaFinal = 'CRUMPIMENTO DE MANDADO DE PRISÃO';
    if (naturezaMatch) {
        const naturezaBruta = naturezaMatch[1].trim();
        const naturezaChave = normalizarTexto(naturezaBruta);
        naturezaFinal = MAPA_NATUREZAS_SIPOM[naturezaChave] || naturezaBruta;
    }

    const dataMatch = textoLimpo.match(/Data:\s*(\d{2}\/\d{2}\/\d{4})/i);
    const horaMatch = textoLimpo.match(/Inicial:\s*(\d{2}h\d{2}min|\d{2}:\d{2})/i);

    let dataHoraIso = '';
    if (dataMatch && horaMatch) {
        const [dia, mes, ano] = dataMatch[1].split('/');
        const horaLimpa = horaMatch[1].replace('h', ':').replace('min', '');
        dataHoraIso = `${ano}-${mes}-${dia}T${horaLimpa}`;
    }

    const enderecoMatch = textoLimpo.match(/Endere[çc]o:\s*([^\n]+)/i);
    let enderecoBruto = enderecoMatch ? enderecoMatch[1].trim() : '';

    let rua = 'Rua 3';
    let numeral = '48';
    let bairro = 'Canindezinho';

    if (enderecoBruto) {
        const partes = enderecoBruto.split(',').map(p => p.trim());
        if (partes[0]) rua = partes[0];
        if (partes[1]) numeral = partes[1];
        if (partes[2]) bairro = partes[2];
    }

    let opmCalculada = '1ªCIA/21ºBPM';
    const bairroChave = normalizarTexto(bairro);
    if (MAPA_BAIRROS_OPM[bairroChave]) {
        opmCalculada = MAPA_BAIRROS_OPM[bairroChave];
    }

    return {
        natureza: naturezaFinal,
        dataHora: dataHoraIso,
        unidadeLocal: opmCalculada,
        opmAtendeu: opmCalculada,
        enderecoBusca: `${rua}, ${numeral}, ${bairro}, Fortaleza - CE`,
        ruaFallback: rua,
        numeral: numeral,
        bairroFallback: bairro,
        cidadeFallback: 'Fortaleza',
        numeroOcorrencia: numOcorrenciaMatch ? numOcorrenciaMatch[1].trim() : '',
        pessoas: extrairPessoas(textoLimpo),
        procedimento: extrairProcedimento(textoLimpo),
        historico: extrairHistorico(textoLimpo),
        material: extrairMaterial(textoLimpo)
    };
}

module.exports = {
    extrairDadosFormulario1,
    extrairPessoas,
    extrairProcedimento,
    extrairHistorico,
    extrairMaterial
};