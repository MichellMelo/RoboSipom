# 🛡️ Robô SIPOM - Automação de Registro de Ocorrências

Ferramenta de automação desenvolvida em **Node.js** e **Playwright** para otimizar e acelerar o processo de cadastro e registro de ocorrências policiais no sistema **SIPOM**. O robô realiza a leitura de relatórios de texto (`.txt`) e preenche automaticamente todas as etapas dos formulários, incluindo dados gerais, envolvidos, materiais apreendidos e procedimentos.

---

## 🚀 Funcionalidades

- **Parser de Relatórios:** Extração automática de dados como Natureza da Ocorrência, Unidade Militar, OPM, Ficha CIOPS, Endereço, Qualificação das Partes, Materiais e Procedimentos a partir de relatórios em texto bruto.
- **Preenchimento do Formulário Inicial:** Seleção automatizada de campos Select2 (Natureza, Unidade Militar, OPM), data/hora, número de ocorrência e localização.
- **Gestão Dinâmica de Pessoas:** Identificação e cadastro de Vítimas, Infratores e Testemunhas, com filtragem automática de nomes não identificados/inválidos e sanitização de dados pessoais.
- **Cadastro de Materiais:** Registro sequencial e categorizado de drogas (Crack, Cocaína, Maconha, Skank, etc., com quantidades em gramas) e valores em dinheiro.
- **Registro de Procedimentos:** Preenchimento de informações sobre delegacias, delegados e tipo de procedimento instaurado.
- **Sessão Persistente:** Armazenamento automático de cookies e login do Chrome para evitar reautenticação a cada execução.

---

## 🛠️ Pré-requisitos

Antes de instalar e executar a ferramenta, certifique-se de ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/) (Versão 18 LTS ou superior)
- [Git](https://git-scm.com/)
- [Google Chrome](https://www.google.com/chrome/) instalado no sistema operacional

---

## 📥 Instalação

1. **Clonar o repositório:**

   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd <NOME_DA_PASTA_DO_PROJETO>
   ```

2. **Instalar as dependências do projeto:**

   ```bash
   npm install
   ```

3. **Instalar os navegadores do Playwright:**

   ```bash
   npx playwright install
   ```

4. **Registrar o comando global (Opcional):**

   Para conseguir iniciar o robô a partir de qualquer pasta/diretório do terminal no seu computador, execute:

   ```bash
   npm link
   ```

---

## 🖥️ Como Usar

1. **Inserir Relatório:** Cole o arquivo de texto do relatório (.txt) na raiz da pasta do projeto.

2. **Executar o Robô:**

   Caso tenha executado o `npm link`, abra qualquer terminal e digite:

   ```bash
   robo-sipom
   ```

   Caso prefira rodar diretamente do diretório do código:

   ```bash
   node index.js
   ```

3. **Primeiro Acesso / Login:** Na primeira execução em uma nova máquina, faça o login manual e a verificação OTP/2FA no SIPOM através da janela do Chrome aberta pelo robô. A sessão ficará salva no diretório `perfil-robo-chrome/` para os acessos subsequentes.

---

## 📂 Estrutura de Arquivos

```
├── index.js # Script principal de automação e navegação no SIPOM
├── parserForm1.js # Módulo de extração, limpeza e estruturação de dados do texto
├── package.json # Configurações de dependências e binário CLI
├── perfil-robo-chrome/ # Diretório de sessão e perfil do navegador (gerado automaticamente)
└── README.md # Documentação do projeto
```

---

## ⚠️ Avisos e Boas Práticas

- **Manutenção do Sistema:** Alterações de layout ou atualizações estruturais no sistema SIPOM podem exigir ajustes pontuais nos seletores do arquivo index.js.

- **Segurança da Informação:** Mantenha os arquivos de relatórios em ambiente seguro e não versione arquivos com dados sensíveis de ocorrências no repositório público.
