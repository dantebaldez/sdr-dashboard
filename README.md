# ☀️ SDR Dashboard

Um app web pra você (SDR) acompanhar os leads da semana sem depender de planilha, sem complicação e com os dados sempre sincronizados — acesse de qualquer computador, os dados te acompanham.

Feito sob medida pro dia a dia de uma equipe comercial do setor de energia solar.

## O que ele faz

- **Cadastra leads** com número de telefone e origem (WhatsApp, Formulário, Indicação)
- **Abre o WhatsApp** direto pelo número ao clicar no telefone do lead na tabela
- **Acompanha o status** de cada lead (Novo → Reunião agendada → Proposta enviada → Perdido), editável direto na tabela
- **Classifica** reuniões e propostas como Novo ou Follow-up
- **Marca No Show** quando um lead com reunião agendada não aparece
- **Anotação por lead** — campo de nota curta editável diretamente na tabela, inclusive em semanas encerradas
- **Mostra indicadores** cruzando origem × status
- **Taxa de conversão automática** — percentual de leads que viraram reunião ou proposta
- **Organiza por semana**, com histórico de semanas encerradas (somente consulta)
- **Metas semanais** travadas após definir, com barra de progresso
- **Comparativo entre semanas** — gráfico das últimas 6 semanas
- **Relatório semanal** formatado, com um clique pra copiar
- **Exporta gráficos** como imagem pra enviar ao marketing
- **Busca global** por telefone (atalho `/`) em qualquer semana
- **Exporta CSV** de toda a base pra backup
- **Integração com Kommo CRM** — importa leads com mapeamento de status
- **Dados seguros** no Supabase, protegidos por autenticação e-mail/senha
- **Modo escuro** com paleta inspirada em energia solar

## Tecnologias

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Supabase](https://supabase.com/) — banco PostgreSQL + autenticação
- CSS puro — sem framework de UI
- [Vercel](https://vercel.com/) — hospedagem com deploy automático pelo GitHub

## Como rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Configure as variáveis de ambiente antes (veja abaixo).

## Variáveis de ambiente

Crie `.env.local` na raiz:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public
```

> Nunca suba o `.env.local` pro GitHub — ele já está no `.gitignore` por padrão nos projetos Vite.

## Deploy no Vercel

1. Conecte o repositório no [Vercel](https://vercel.com)
2. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas variáveis de ambiente do projeto
3. Deploy — qualquer `push` na branch principal atualiza automaticamente

## Banco de dados

Tabelas necessárias: `leads` e `semanas`. Acesso protegido por Row Level Security (RLS) — só usuários autenticados leem e escrevem.

Script de criação disponível em `docs/schema.sql`.

## Uso no dia a dia

1. Acesse pelo link do Vercel e faça login.
2. Cadastre leads — clique no número pra abrir o WhatsApp direto.
3. Atualize status, tipo e No Show conforme a conversa evolui.
4. Acompanhe indicadores e progresso das metas.
5. Na sexta, gere o relatório e copie pra mandar pro time.
6. Ao fim da semana, clique em "Encerrar semana".

---
🎧 Playlist que acompanhou o desenvolvimento: [ela já não gosta mais do mimin — Spotify](https://open.spotify.com/playlist/3HfLt6r4nF8yhb0XhbpOwo)