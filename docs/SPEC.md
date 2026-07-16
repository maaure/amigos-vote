# Inimigo do Dia — Spec

## O que é

**Inimigo do Dia** (codinome `amigos-vote` / `ladeiros-vote`) é uma aplicação web de votação entre amigos com propósitos caóticos e humorísticos. Inspirada no jogo **"Amigos de M\*rda"**, a ideia é simples: todo dia uma pergunta capciosa é publicada, e cada membro do grupo vota em qual amigo melhor (ou pior) se encaixa na descrição. Os resultados são revelados e acumulados num histórico que todo mundo pode ver.

A aplicação não tem propósito produtivo, corporativo ou edificante. Ela existe para que grupos de amigos possam, de forma organizada e anônima, tirar sarro uns dos outros com perguntas do tipo _"Quem tem mais chance de ser preso por engano?"_ ou _"Quem sumiria do grupo sem avisar?"_.

## Público alvo

Grupos de amigos que já têm intimidade o suficiente para rir de si mesmos. O app presume que os usuários se conhecem, confiam uns nos outros o suficiente para compartilhar um código de grupo, e têm maturidade emocional para não levar pro pessoal o fato de terem sido eleitos "inimigo do dia".

## Tom e humor

O tom é de **zoeira autoconsciente**. A landing page já entrega:

- O nome **"Inimigo do Dia"** em vez de algo neutro como "Votação entre amigos"
- O subtítulo fala em _"perguntas capciosas"_ e _"descubra o que seus amigos pensam sobre você"_ — um convite ao caos
- O footer tem um disclaimer sincero: _"Lembre-se: é apenas uma brincadeira para se divertir com os amigos!"_

O humor está na premissa, não na interface. A UI é limpa e funcional — o contraste entre o design sóbrio (Tailwind, shadcn/ui, dark mode) e a natureza absurda das perguntas é parte da graça.

## Funcionalidades principais

### Autenticação

- Login via **GitHub OAuth** (NextAuth). Nada de email/senha — é um app de nicho, GitHub como gatekeeper já filtra o público.

### Grupos privados

- Qualquer usuário logado pode **criar um grupo** (nome + descrição opcional).
- Ao criar, o sistema gera um **código de acesso de 6 caracteres**.
- Outros usuários entram no grupo usando esse código.
- Cada grupo é uma bolha isolada: perguntas, votos e resultados são escopados ao grupo.

### Pergunta do dia

- O sistema mantém um **banco de questões** (tabela `questions`).
- Todo dia, uma pergunta não usada é selecionada aleatoriamente e publicada.
- Cada grupo vê a mesma pergunta do dia, mas vota independentemente.
- A pergunta varia: pode permitir **1 ou múltiplos votos** (`allowedVotes`).
- Um **timer regressivo** mostra quanto tempo falta para a próxima pergunta (meia-noite UTC).

### Votação

- O usuário vê a lista de amigos do grupo e seleciona quantos a pergunta permitir.
- Um voto por pessoa por dia por grupo — depois de votar, vê a tela de "Você já votou! Volte amanhã."
- Feedbacks com toast (sonner): sucesso, erro, "em desenvolvimento".

### Resultados

- Os resultados ficam disponíveis no **histórico do grupo**.
- Cada pergunta passada é um card expansível que mostra:
  - Data da pergunta
  - Ranking dos "vencedores" com contagem de votos, porcentagem e barra de progresso
  - Destaque de troféu para o 1º lugar
  - Avatar e nome de cada participante
- Resultado vazio = _"Não houve votos nesse dia :("_.

### Features planejadas (botões "Em desenvolvimento...")

- Sugerir pergunta
- Votar pergunta de amanhã

## Stack técnica

| Camada          | Tecnologia                         |
| --------------- | ---------------------------------- |
| Framework       | Next.js 15 (App Router, Turbopack) |
| Linguagem       | TypeScript                         |
| Banco           | PostgreSQL 15                      |
| ORM             | Drizzle ORM                        |
| Autenticação    | NextAuth v4 (GitHub OAuth)         |
| UI              | Tailwind CSS 4 + shadcn/ui (Radix) |
| Gráficos        | Recharts                           |
| Data fetching   | TanStack React Query + Axios       |
| Forms           | React Hook Form + Zod              |
| Containerização | Docker + Docker Compose            |
| Package manager | pnpm                               |

## Estrutura de dados

Quatro entidades principais:

- **questions** — banco de perguntas. Cada uma tem texto, número de votos permitidos, flag `used`, e data de publicação.
- **friends** — usuários (atrelados ao GitHub ID). Nome, foto, github_id único.
- **groups** — grupos privados. Nome, descrição, código de acesso único, contagem de membros.
- **votes** — registros de voto (quem votou, em quem, em qual pergunta, em qual grupo).

Uma pergunta é publicada uma única vez globalmente (campo `publishedWhen`), mas os votos são segregados por grupo (`groupId` na tabela `votes`).
