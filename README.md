# Inventário Solares

Painel de inventário do galpão do Projeto Solares (área de Barcos · Telemetria).
Mesma "vibe" do painel de telemetria: Vite + React + TypeScript + Tailwind, Supabase (banco + login Google) e deploy na Vercel.

## Funcionalidades

| Aba | O que faz |
|---|---|
| Resumo | Cards com totais, aviso de itens em falta, unidades por tipo, orçamento em aberto, últimas anotações |
| Inventário | Cadastro/edição de componentes, busca, filtro por tipo e por status, botões +/− de estoque |
| Alertas | Itens em falta (qtd 0) e com estoque baixo (qtd ≤ mínimo) + botão "Solicitar orçamento" |
| Diário de Bordo | Anotações de falha / perda / observação, com componente relacionado e desconto opcional do estoque |
| Orçamento | Lista de compras com preço, fornecedor, link, status e botão "Dar entrada no estoque" |
| Importar/Exportar | Exporta CSV (inventário, diário, orçamento) e importa CSV de componentes (com pré-visualização) |
| Equipe | Cadastro de quem pode acessar (igual ao painel): Trainee / Membro / Moderador |

Modo escuro/claro no botão do cabeçalho (lembra a escolha).

### Permissões
- **Trainee**: só visualiza.
- **Membro**: cadastra e edita componentes, diário e orçamento.
- **Moderador**: tudo acima + apaga registros + gerencia a equipe.
- Sem cargo e sem ser moderador: "Acesso Negado" (igual ao painel).

As regras também estão aplicadas no banco (RLS, em `supabase/schema.sql`), então não dependem só do front-end.

## Estrutura

```
src/
├─ components/
│  ├─ layout/        Sidebar, Header, AppShell
│  ├─ ui/            Modal, PageHeader, Spinner, EmptyState, StatusBadge
│  └─ inventario/    ComponenteCard, ComponenteForm
├─ pages/            uma página por aba + Login + telas especiais
├─ hooks/            useAuth, useTheme, useToast, useData, useTabela (CRUD genérico), useMembros
├─ utils/            csv, estoque, format, constants
├─ config/tabs.ts    lista de abas (para criar uma aba nova, edite aqui e em AppShell.tsx)
├─ lib/supabase.ts   cliente do Supabase
└─ types/            interfaces TypeScript
supabase/schema.sql  tabelas + permissões (rodar no SQL Editor)
```

## Passo a passo

### 1. VS Code (rodar local)
1. Instale o [Node.js LTS](https://nodejs.org) e o [Git](https://git-scm.com).
2. Descompacte o projeto, abra a pasta no VS Code (`File > Open Folder`).
3. Terminal do VS Code (`Ctrl+'`):
   ```bash
   npm install
   cp .env.example .env     # no Windows (PowerShell): copy .env.example .env
   ```
4. Deixe o `.env` para preencher no passo 2.

### 2. Supabase
1. Em [supabase.com](https://supabase.com) crie um **novo projeto** (recomendado separado do painel de telemetria).
2. **SQL Editor → New query**: abra `supabase/schema.sql`, **troque `SEU_EMAIL@gmail.com` pelo seu e-mail do Google**, cole tudo e clique em **Run**.
3. **Project Settings → API**: copie *Project URL* e *anon public key* para o `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. **Login com Google**:
   - [Google Cloud Console](https://console.cloud.google.com) → crie/selecione um projeto → *APIs e serviços → Tela de consentimento OAuth* (tipo Externo) → *Credenciais → Criar credenciais → ID do cliente OAuth* (aplicativo da Web).
   - Em *URIs de redirecionamento autorizados* coloque: `https://SEU-PROJETO.supabase.co/auth/v1/callback` (aparece em Supabase → Authentication → Providers → Google).
   - Copie *Client ID* e *Client Secret* para **Supabase → Authentication → Providers → Google**, ative e salve.
   - (Se já usa o login Google no painel, pode reaproveitar o mesmo Client ID e só adicionar a nova URI de redirecionamento.)
5. **Authentication → URL Configuration**: 
   - *Site URL*: `http://localhost:5173` por enquanto (troque pela URL da Vercel depois).
   - *Redirect URLs*: adicione `http://localhost:5173/**` e, depois, `https://SEU-APP.vercel.app/**`.

### 3. Testar local
```bash
npm run dev
```
Abra http://localhost:5173, entre com o Google (o e-mail precisa ser o do passo 2.2).

### 4. GitHub
```bash
git init
git add .
git commit -m "Inventário Solares"
git branch -M main
git remote add origin https://github.com/SolaresUfes/NOME-DO-REPO.git
git push -u origin main
```
(Crie antes o repositório vazio no GitHub. O `.env` não sobe: está no `.gitignore`.)

### 5. Vercel
1. [vercel.com](https://vercel.com) → **Add New → Project** → importe o repositório.
2. Framework: **Vite** (detectado automaticamente). Build: `npm run build`. Output: `dist`.
3. **Environment Variables**: adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (mesmos valores do `.env`).
4. **Deploy**.
5. Volte no Supabase → *Authentication → URL Configuration* e troque a *Site URL* pela URL da Vercel (adicione também em *Redirect URLs*).
6. Qualquer `git push` na `main` faz novo deploy automático.

### 6. Cadastrar a equipe
Entre no site → aba **Equipe** → e-mail do Google do trainee, cargo **Trainee** → Cadastrar.

## CSV

- **Exportar**: aba *Importar/Exportar*. Usa `;` e acentos corretos para abrir direto no Excel.
- **Importar**: colunas `nome` (obrigatória), `tipo`, `quantidade`, `quantidade_minima`, `localizacao`, `descricao`. Aceita `;`, `,` ou tab. Use "Baixar modelo" para ver o formato. Itens com mesmo nome podem ser atualizados ou ignorados (checkbox).

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| "Configuração faltando" | `.env` ausente/incorreto (reinicie o `npm run dev`) ou variáveis não cadastradas na Vercel (faça novo deploy) |
| Volta para o login / "sem acesso" | E-mail não está em `usuarios_autorizados` (confira se trocou `SEU_EMAIL` no SQL) |
| Erro `redirect_uri_mismatch` | URI de redirecionamento do Google diferente de `https://<projeto>.supabase.co/auth/v1/callback` |
| Login funciona local e não na Vercel | Falta a URL da Vercel em *Site URL / Redirect URLs* no Supabase |
| "new row violates row-level security" | Usuário é Trainee (somente leitura) ou o SQL não foi executado por completo |
