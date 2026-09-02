# SDR Dashboard

Dashboard desenvolvido para facilitar o controle e a contagem de leads durante a rotina de trabalho de um SDR.

O projeto surgiu de uma necessidade prática: ter uma forma mais simples de acompanhar os leads trabalhados e chegar aos números usados nos relatórios semanais, sem depender de contagens manuais.

## O que é

O SDR Dashboard é uma aplicação desktop para registro e acompanhamento dos leads trabalhados.

A ideia é manter as informações organizadas em um único lugar e permitir uma visualização rápida dos números durante a rotina.

O projeto foi desenvolvido inicialmente para uso pessoal e continua sendo utilizado dessa forma.

## Funcionalidades

- Registro e contagem de leads;
- Visualização dos números em um dashboard;
- Organização dos dados de acordo com a rotina de SDR;
- Interface voltada para consulta rápida;
- Execução como aplicação desktop.

## Principais tecnologias

### React

Foi utilizado para construir a interface da aplicação e dividir o dashboard em componentes menores e reutilizáveis.

A escolha do React também facilitou a atualização da interface conforme os dados são alterados.

### TypeScript

Usei TypeScript para ter mais segurança durante o desenvolvimento e deixar mais claro o formato dos dados utilizados pela aplicação.

Como o projeto trabalha com diferentes informações relacionadas aos leads, a tipagem ajuda a evitar erros e facilita a manutenção do código.

### Vite

O Vite foi escolhido como ferramenta de desenvolvimento e build por ser simples, rápido e ter uma configuração enxuta para projetos React.

Ele também deixa o processo de desenvolvimento mais ágil, principalmente durante os testes e alterações na interface.

### Electron

O Electron foi utilizado para transformar a aplicação React em um aplicativo desktop.

Como a ferramenta foi criada para uso pessoal no computador, não havia necessidade de depender de um navegador para utilizá-la. Com o Electron, consegui manter a interface feita em tecnologias web e disponibilizá-la como uma aplicação para desktop.

### CSS

O CSS foi utilizado para construir o layout e a identidade visual da aplicação.

A ideia foi manter a interface simples e funcional, priorizando a visualização rápida das informações durante o uso.

## Estrutura

```text
sdr-dashboard/
├── electron/
├── public/
├── src/
│   ├── components/
│   ├── constants/
│   ├── types/
│   └── utils/
├── build/
├── iniciar.bat
├── package.json
├── tsconfig.json
└── vite.config.ts
```

A maior parte da aplicação fica dentro de `src`.

Os componentes da interface ficam em `components`, as constantes em `constants`, as tipagens em `types` e as funções auxiliares em `utils`.

A pasta `electron` concentra a parte responsável pela execução da aplicação como desktop.

## Como executar

### Requisitos

- Node.js
- npm

### Instalação

Clone o repositório:

```bash
git clone https://github.com/dantebaldez/sdr-dashboard.git
```

Entre na pasta:

```bash
cd sdr-dashboard
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm run dev
```

No Windows, também existe o arquivo `iniciar.bat` para facilitar a inicialização.

## Uso

O dashboard foi pensado para acompanhar a rotina diária de um SDR.

Durante o trabalho, os leads podem ser registrados na aplicação e os números ficam disponíveis no próprio dashboard. No fechamento da semana, essas informações servem como base para a elaboração dos relatórios.

A proposta é simples: **menos contagem manual e uma visão mais rápida dos números.**

## Contexto

Esse não começou como um projeto para ser vendido ou disponibilizado como SaaS.

Eu precisava resolver um problema que fazia parte da minha própria rotina de trabalho e decidi construir uma ferramenta para isso.

A partir dessa necessidade, o projeto também acabou sendo uma forma de colocar em prática conhecimentos de desenvolvimento frontend e desktop em uma aplicação que realmente teria uso no dia a dia.

## Status

Projeto funcional e mantido para uso pessoal.

O repositório está público principalmente para documentação e portfólio.

## Autor

**Dante Baldez**

[GitHub](https://github.com/dantebaldez)

[Repositório do projeto](https://github.com/dantebaldez/sdr-dashboard)

---

🎧 Playlist que acompanhou o desenvolvimento: [ela já não gosta mais do mimin — Spotify](https://open.spotify.com/playlist/3HfLt6r4nF8yhb0XhbpOwo)