# Amigos Vote

É uma aplicação web para votação entre amigos, permitindo que usuários criem questões e votem em diferentes opções. Inspirado pelo jogo "Amigos de M*rda".

## Lista de Tecnologias

- Next.js
- React
- TypeScript
- Supabase
- pnpm (ou npm/yarn)
- ESLint & Prettier

## Funcionalidades
- Cadastro de questões para votação
- Votação entre amigos
- Visualização dos resultados
- Integração com Supabase para persistência dos dados

## Como rodar o projeto localmente

1. **Pré-requisitos:**
   - Node.js (recomendado v18 ou superior)
   - pnpm (ou npm/yarn)
   - Conta e projeto no [Supabase](https://supabase.com/)

2. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd ladeiros-vote
   ```

3. **Instale as dependências:**
   ```bash
   pnpm install
   # ou npm install
   # ou yarn install
   ```

4. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env.local` na raiz do projeto.
   - Adicione as variáveis do Supabase e a chave de autenticação para rotinas automáticas:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=<sua-url-do-supabase>
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
     CRON_SECRET_KEY=<sua-cron-key>
     ```
   - `CRON_SECRET_KEY` é utilizada para autenticar rotinas automáticas (cron jobs) do projeto, garantindo que apenas chamadas autorizadas possam executar tarefas agendadas. Você pode gerar sua key da forma que preferir, só garanta que a key usada no secret do job seja *a mesma* usada no .env da sua instancia do projeto.

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm dev
   # ou npm run dev
   # ou yarn dev
   ```
   O projeto estará disponível em `http://localhost:3000`.

6. **Configure o banco de dados:**
   - Execute o arquivo `.db/migrate.sql` no seu banco PostgreSQL do Supabase para instalar as tabelas, índices e funções necessárias.
   - Você pode rodar o script usando o SQL Editor do Supabase ou qualquer ferramenta de administração PostgreSQL.

## Como contribuir

1. **Fork o repositório** e crie uma branch para sua feature ou correção:
   ```bash
   git checkout -b minha-feature
   ```
2. **Implemente sua alteração** seguindo o padrão do projeto.
3. **Faça commits claros e objetivos.**
4. **Abra um Pull Request** explicando sua contribuição.

### Recomendações
- Siga o padrão de código definido pelo ESLint e Prettier.
- Adicione testes se possível.
- Descreva bem o que foi alterado no PR.

## Licença
Este projeto está sob a licença MIT.

---
Dúvidas ou sugestões? Abra uma issue!
