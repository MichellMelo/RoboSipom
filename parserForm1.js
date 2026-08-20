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
    'TRAFICO DE DROGAS': 'TRAFICO ILICITO DE DROGAS',
    'TRAFICO DE ENTORPECENTES': 'TRAFICO ILICITO DE DROGAS',
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
 * Trata o texto do Batalhão/OPM para busca limpa no Select2
 */
function extrairOPM(textoLimpo) {
    const match = textoLimpo.match(/OPM\/VTR\/?:\s*\n?\s*([^\n]+)/i);
    let opmTexto = '21° BPM';
    let opmBusca = '21';

    if (match) {
        const linhaOpm = match[1].trim();
        const matchNum = linhaOpm.match(/\d+/);
        if (matchNum) {
            opmBusca = matchNum[0];
        }

        // Remove referências de Cia para manter apenas o Batalhão na busca do Select2
        if (linhaOpm.toUpperCase().includes('BPM')) {
            const partes = linhaOpm.split(/[-/]/);
            const parteBpm = partes.find(p => p.toUpperCase().includes('BPM')) || linhaOpm;
            opmTexto = parteBpm.trim();
        } else {
            opmTexto = linhaOpm;
        }
    }

    return { opmTexto, opmBusca };
}

/**
 * Verifica se a string extraída representa um nome de pessoa válido
 */
function ehNomeValido(nome) {
    if (!nome) return false;
    const nomeLimpo = nome.trim().toUpperCase();

    const termosInvalidos = [
        'NÃO IDENTIFICADO',
        'NAO IDENTIFICADO',
        'NÃO INFORMADO',
        'NAO INFORMADO',
        'DESCONHECIDO',
        'IGNORADO',
        'A APURAR',
        'S/N',
        'SEM INFORMACAO',
        'SEM INFORMAÇÃO'
    ];

    // Descarta se for exatamente igual a um dos termos inválidos
    if (termosInvalidos.some(termo => nomeLimpo === termo)) {
        return false;
    }

    // Descarta se for excessivamente curto
    if (nomeLimpo.length < 2) {
        return false;
    }

    return true;
}

/**
 * Extrai a lista de pessoas qualificadas no relatório (Vítima, Infrator, Testemunha, etc.)
 */
function extrairPessoas(textoLimpo) {
    const textoSanitizado = textoLimpo.replace(/\*/g, '');
    const pessoas = [];

    // Captura o bloco de Qualificação das Partes até a próxima seção
    const matchBloco = textoSanitizado.match(/Qualifica[çc][ãa]o das Partes:\s*([\s\S]*?)(?=\n\s*(?:Delegad[oa]|Material|Hist[óo]rico|$))/i);

    if (!matchBloco) {
        return pessoas;
    }

    const blocoTexto = matchBloco[1].trim();

    // Regex para identificar blocos de pessoas: Papel: Nome \n Nascimento: Data \n Mãe: Nome
    const regexPessoa = /(V[íi]tima|Acusado|Infrator|Preso|Suspeito|Autor|Testemunha)\s*:?\s*([^\n]+)(?:\n\s*Nascimento\s*:?\s*([^\n]+))?(?:\n\s*M[ãa]e\s*:?\s*([^\n]+))?/gi;

    let match;
    while ((match = regexPessoa.exec(blocoTexto)) !== null) {
        const papelBruto = match[1].trim();
        const nomePessoa = match[2].trim();
        const nascimentoBruto = match[3] ? match[3].trim() : '';
        const maeBruta = match[4] ? match[4].trim() : '';

        // Aplica a validação de nome de pessoa válido
        if (ehNomeValido(nomePessoa)) {
            // 1. Mapeamento para as opções exatas da caixa de seleção do SIPOM
            let papelMapeado = 'Vitima';
            const papelUpper = papelBruto.toUpperCase();

            if (/ACUSADO|PRESO|SUSPEITO|AUTOR|INFRATOR/i.test(papelUpper)) {
                papelMapeado = 'Infrator';
            } else if (/TESTEMUNHA/i.test(papelUpper)) {
                papelMapeado = 'Testemunha';
            } else if (/V[IÍ]TIMA/i.test(papelUpper)) {
                papelMapeado = 'Vitima';
            }

            // 2. Extração limpa de Data de Nascimento (filtra apenas formatos DD/MM/AAAA)
            let nascimento = '';
            if (nascimentoBruto) {
                const matchData = nascimentoBruto.match(/\d{2}\/\d{2}\/\d{4}/);
                if (matchData) {
                    nascimento = matchData[0];
                }
            }

            // 3. Validação do Nome da Mãe
            let mae = '';
            if (maeBruta && ehNomeValido(maeBruta)) {
                mae = maeBruta;
            }

            pessoas.push({
                tipo: papelMapeado,
                nome: nomePessoa,
                nascimento: nascimento,
                mae: mae
            });
        }
    }

    return pessoas;
}

/**
 * Extrai e padroniza as informações do procedimento policial
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

            const procMatch = procTexto.match(/(B\.?O\.?|I\.?P\.?|TCO|ATO\s+INFRACIONAL|AIA|BOC)?\s*N?[°º]?\s*(\d+)-([\d\s]+)\/(\d{4})/i);

            let procedimentoNome = 'Boletim de Ocorrência - BO';
            let codigoDelegacia = '110';
            let numeroBo = '';
            let ano = '2026';

            if (procMatch) {
                const tipoSigla = (procMatch[1] || '').toUpperCase();
                codigoDelegacia = procMatch[2].trim();
                numeroBo = procMatch[3].replace(/\s+/g, '').trim();
                ano = procMatch[4].trim();

                // Mapeamento exato para os rótulos do SIPOM
                if (/I\.?P|INQUERITO/i.test(tipoSigla)) {
                    procedimentoNome = 'Inquerito Policial - IP';
                } else if (/TCO|TERMO\s+CIRCUNSTANCIADO/i.test(tipoSigla)) {
                    procedimentoNome = 'Termo Circunstanciado de Ocorrência - TCO';
                } else if (/ATO\s+INFRACIONAL|AIA|BOC/i.test(tipoSigla)) {
                    procedimentoNome = 'Ato Infracional';
                } else {
                    procedimentoNome = 'Boletim de Ocorrência - BO';
                }
            } else {
                const procSimpleMatch = procTexto.match(/(B\.?O\.?|I\.?P\.?|TCO|ATO\s+INFRACIONAL|AIA|BOC)?\s*N?[°º]?\s*([\d\s-]+)\/(\d{4})/i);
                if (procSimpleMatch) {
                    const tipoSigla = (procSimpleMatch[1] || '').toUpperCase();
                    numeroBo = procSimpleMatch[2].replace(/\s+/g, '').trim();
                    ano = procSimpleMatch[3].trim();

                    if (/I\.?P|INQUERITO/i.test(tipoSigla)) {
                        procedimentoNome = 'Inquerito Policial - IP';
                    } else if (/TCO|TERMO\s+CIRCUNSTANCIADO/i.test(tipoSigla)) {
                        procedimentoNome = 'Termo Circunstanciado de Ocorrência - TCO';
                    } else if (/ATO\s+INFRACIONAL|AIA|BOC/i.test(tipoSigla)) {
                        procedimentoNome = 'Ato Infracional';
                    } else {
                        procedimentoNome = 'Boletim de Ocorrência - BO';
                    }
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
 * Extrai a lista de materiais apreendidos (Armas, Veículos, Drogas e Dinheiro)
 */
function extrairMaterial(textoLimpo) {
    const textoSanitizado = textoLimpo
        .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
        .replace(/\*/g, '');

    const matchBloco = textoSanitizado.match(/Material\s*:?\s*([\s\S]*?)(?=\n\s*(?:Hist[óo]rico|Relato|Delegad[oa]|Qualifica[çc][ãa]o|Composi[çc][ãa]o|$))/i);

    if (!matchBloco) {
        return { possuiMaterial: false, lista: [] };
    }

    const blocoMaterial = matchBloco[1].trim();
    if (/^(S\/A|N\/A|SEM MATERIAL|NENHUM|NADA)$/i.test(blocoMaterial)) {
        return { possuiMaterial: false, lista: [] };
    }

    const listaMateriais = [];
    const linhas = blocoMaterial.split('\n');

    for (let linha of linhas) {
        const linhaUpper = linha.trim().toUpperCase();
        if (!linhaUpper) continue;

        // --- 1. CAPTURA DE ARMA DE FOGO ---
        if (/ARMA|PISTOLA|REV[ÓO]LVER|FUZIL|ESPINGARDA|RIFLE|CARABINA|SIMULACRO/i.test(linhaUpper)) {
            // Identifica o Subtipo (Imagem 2)
            let subTipoArma = 'Pistola';
            if (/REV[ÓO]LVER/i.test(linhaUpper)) subTipoArma = 'Revolver';
            else if (/FUZIL/i.test(linhaUpper)) subTipoArma = 'Fuzil';
            else if (/ESPINGARDA/i.test(linhaUpper)) subTipoArma = 'Espingarda';
            else if (/RIFLE/i.test(linhaUpper)) subTipoArma = 'Rifle';
            else if (/CARABINA/i.test(linhaUpper)) subTipoArma = 'Carabina';
            else if (/SIMULACRO/i.test(linhaUpper)) subTipoArma = 'Simulacro';
            else if (/ARTESANAL/i.test(linhaUpper)) subTipoArma = 'Artesanal';
            else if (/BRANCA/i.test(linhaUpper)) subTipoArma = 'Branca';

            // Identifica a Marca (Rossi, Taurus, Imbel, Glock, etc.)
            let marca = 'Taurus';
            if (/ROSSI/i.test(linhaUpper)) marca = 'Rossi';
            else if (/GLOCK/i.test(linhaUpper)) marca = 'Glock';
            else if (/IMBEL/i.test(linhaUpper)) marca = 'Imbel';

            // Extrai o Calibre (Ex: .38, 38, 9mm, .40, 12, .380)
            const matchCalibre = linhaUpper.match(/(?:\.?380|\.?38|\.?40|9MM|12|\.?357|5\.56|7\.62)/i);
            const calibre = matchCalibre ? matchCalibre[0].replace('.', '') : '38';

            // Extrai a Numeração da Arma
            const matchNum = linhaUpper.match(/(?:N[º°S]|NUMERO|NR|SERIE)\s*:?\s*([A-Z0-9\.-]+)/i) ||
                linhaUpper.match(/\b([A-Z]{1,3}\d{4,8}|\d{5,8})\b/i);
            const numero = matchNum ? matchNum[1].replace(/[\.-]/g, '') : 'S/N';

            // Extrai a Quantidade (padrão: 1)
            const matchQtd = linhaUpper.match(/(\d+)\s*(?:ARMA|PISTOLA|REV[ÓO]LVER|UNIDADE|UN)/i);
            const quantidade = matchQtd ? matchQtd[1] : '1';

            listaMateriais.push({
                tipoLabel: 'Arma',
                subTipoArma: subTipoArma,
                marca: marca,
                calibre: calibre,
                numero: numero,
                quantidade: quantidade
            });
        }

        // --- 2. CAPTURA DE VEÍCULOS ---
        else if (/VE[IÍ]CULO|MOTO|MOTOCICLETA|CARRO|AUTOM[ÓO]VEL/i.test(linhaUpper)) {
            const matchPlaca = linhaUpper.match(/[A-Z]{3}[-\s]?[0-9][A-Z0-9][0-9]{2}/i);
            if (matchPlaca) {
                const placaFormatada = matchPlaca[0].replace(/[-\s]/g, '').toUpperCase();
                let situacao = 'Apreendido';
                if (/RECUPERAD[OA]|ROUBAD[OA]|FURTAD[OA]/i.test(linhaUpper) || /RECUPERAD[OA]/i.test(textoSanitizado)) {
                    situacao = 'Recuperado';
                }
                listaMateriais.push({
                    tipoLabel: 'Veículo',
                    placa: placaFormatada,
                    situacao: situacao
                });
            }
        }

        // --- 3. CAPTURA DE DROGA ---
        else if (/DROGA|CRACK|COCA[IÍ]NA|MACONHA|SKANK|SKUNK|HAXIXE|ENTORPECENTE/i.test(linhaUpper)) {
            const matchQtd = linhaUpper.match(/(\d+(?:[\.,]\d+)?)\s*(?:G|GRAMAS|GR|PINOS|PEDRAS|SACOS)?/i);
            const quantidade = matchQtd ? matchQtd[1].replace(',', '.') : '1';
            let subTipoDroga = 'Maconha - gramas (g)';

            if (/CRACK/i.test(linhaUpper)) subTipoDroga = 'Crack - gramas (g)';
            else if (/COCA[IÍ]NA|COCAINA/i.test(linhaUpper)) subTipoDroga = 'Cocaína - gramas (g)';
            else if (/SKANK|SKUNK/i.test(linhaUpper)) subTipoDroga = 'Skank - gramas (g)';
            else if (/HAXIXE/i.test(linhaUpper)) subTipoDroga = 'Haxixe - gramas (g)';

            listaMateriais.push({
                tipoLabel: 'Droga',
                subTipoDroga: subTipoDroga,
                quantidadeDroga: quantidade
            });
        }

        // --- 4. CAPTURA DE DINHEIRO ---
        else if (/DINHEIRO|ESP[ÉE]CIE|CEDULA|NOTAS|R\$/i.test(linhaUpper)) {
            const matchVal = linhaUpper.match(/(?:R\$\s*)?(\d+(?:\.\d{3})*(?:,\d{2})?|\d+)/i);
            if (matchVal) {
                let v = matchVal[1].replace(/\./g, '');
                if (!v.includes(',')) v += ',00';
                listaMateriais.push({
                    tipoLabel: 'Dinheiro',
                    valorDinheiro: v
                });
            }
        }
    }

    return {
        possuiMaterial: listaMateriais.length > 0,
        lista: listaMateriais
    };
}

/**
 * Formata strings de matrícula diversas para o padrão oficial XXX.XXX-X-X
 */
function formatarMatricula(matriculaBruta) {
    const apenasNum = matriculaBruta.replace(/\D/g, '');
    if (apenasNum.length === 8) {
        return `${apenasNum.slice(0, 3)}.${apenasNum.slice(3, 6)}-${apenasNum.slice(6, 7)}-${apenasNum.slice(7, 8)}`;
    }
    // Caso já venha com hífens/pontos
    return matriculaBruta.replace(/\s+/g, '').trim();
}

/**
 * Extrai os dados de composição (CMT, MOT, PAT) tolerando variações nos cabeçalhos
 */
function extrairComposicao(textoLimpo) {
    const textoSanitizado = textoLimpo.replace(/\*/g, '');

    // 1. Identificação do Tipo de Policiamento
    let tipoPoliciamento = 'Motorizado';
    const matchVtr = textoSanitizado.match(/OPM\/VTR\/?:\s*([\s\S]*?)(?=\n\s*Composi[çc][ãa]o:|$)/i);
    if (matchVtr) {
        const textoVtr = matchVtr[1].toUpperCase();
        if (/MOTO|RAIO|MOTOPATRULHAMENTO/i.test(textoVtr)) tipoPoliciamento = 'Motopatrulhamento';
        else if (/A PE|PEDESTRE/i.test(textoVtr)) tipoPoliciamento = 'A pé';
        else if (/INTELIG[EÊ]NCIA|SAI/i.test(textoVtr)) tipoPoliciamento = 'Inteligência';
    }

    // 2. Extração Flexível do Bloco da Composição
    const matchComposicao = textoSanitizado.match(/Composi[çc][ãa]o:\s*([\s\S]*?)(?=\n\s*(?:Qualifica[çc][ãa]o|Delegad[oa]|Material|Hist[óo]rico|$))/i);
    const integrantes = [];

    if (matchComposicao) {
        const linhas = matchComposicao[1].split('\n');

        for (let linha of linhas) {
            const linhaLimpa = linha.trim();
            if (!linhaLimpa) continue;

            // Busca linhas iniciando com CMT, MOT ou PAT
            const matchLinha = linhaLimpa.match(/^(CMT|MOT|PAT)\s*:?\s*(.*?)(?:M\.?F\.?|Matr[íi]cula)?\s*:?\s*([\d\.\s-X]+)$/i);

            if (matchLinha) {
                const sigla = matchLinha[1].toUpperCase();
                let matriculaBruta = matchLinha[3].trim();

                let funcaoLabel = 'Patrulheiro';
                if (sigla === 'CMT') funcaoLabel = 'Comandante';
                else if (sigla === 'MOT') funcaoLabel = 'Motorista';

                // Tratamento de segurança caso a matrícula seja "Não informado"
                if (/N[ÃA]O\s+INFORMADO/i.test(matriculaBruta)) {
                    matriculaBruta = '';
                } else {
                    matriculaBruta = formatarMatricula(matriculaBruta);
                }

                integrantes.push({
                    funcao: funcaoLabel,
                    matricula: matriculaBruta
                });
            }
        }
    }

    return {
        tipoPoliciamento,
        integrantes
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
        material: extrairMaterial(textoLimpo),
        composicao: extrairComposicao(textoLimpo)
    };
}

module.exports = {
    extrairDadosFormulario1,
    extrairPessoas,
    extrairProcedimento,
    extrairHistorico,
    extrairMaterial,
    ehNomeValido
};