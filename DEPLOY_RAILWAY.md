# Guia de Deploy no Railway

Este guia explica como hospedar o Portal Questões Concurso na plataforma Railway.

## 1. Pré-requisitos
- Conta no GitHub (onde o código está hospedado).
- Conta no [Railway](https://railway.com/) (pode criar usando o GitHub).

## 2. Configuração Inicial no Railway

1. Acesse [railway.com](https://railway.com/) e faça login.
2. Clique em **"New Project"** -> **"Deploy from GitHub repo"**.
3. Selecione o repositório `provaFoco`.
4. Clique em **"Deploy Now"**.

## 3. Variáveis de Ambiente

Após o deploy inicial (que pode falhar por falta de variáveis), vá na aba **Variables** do seu serviço no Railway e adicione as seguintes variáveis (baseadas no seu arquivo `.env`):

| Variável | Valor Recomendado | Descrição |
|----------|-------------------|-----------|
| `NODE_ENV` | `production` | Define o ambiente como produção |
| `PORT` | `3000` (ou deixe o Railway definir) | Porta do servidor |
| `DATABASE_URL` | `/app/data/sqlite.db` | Caminho para o banco de dados persistente |
| `JWT_SECRET` | (gere um hash seguro) | Segredo para tokens de autenticação |
| `ADMIN_PASSWORD` | (sua senha segura) | Senha do painel admin |
| `VITE_APP_ID` | `portal-questoes` | ID da aplicação |
| `VITE_GA_MEASUREMENT_ID` | (seu ID do Analytics) | Opcional: ID do Google Analytics |

> **Nota:** Para `OAUTH_SERVER_URL` e `VITE_APP_URL`, use a URL que o Railway gerar para você (ex: `https://prova-foco-production.up.railway.app`).

## 4. Persistência de Dados (Volume)

Como usamos SQLite (um banco de dados em arquivo), precisamos de um "Volume" para que os dados não sejam apagados a cada deploy.

1. No painel do seu serviço no Railway, vá em **Settings**.
2. Desça até a seção **Volumes**.
3. Clique em **"Add Volume"**.
4. Configure o **Mount Path** para `/app/data`.
   - Isso cria uma pasta persistente em `/app/data`.
5. Certifique-se que a variável `DATABASE_URL` está apontando para dentro desse volume (ex: `/app/data/sqlite.db`).

## 5. Build e Start Command

O Railway detecta automaticamente projetos Node.js, mas para garantir:

- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

## 6. Domínio Personalizado (Registro)

Se você quiser usar `provafoco.com.br` em vez do subdomínio do Railway:

1. No Railway, vá em **Settings** -> **Networking** -> **Custom Domains**.
2. Digite seu domínio (ex: `provafoco.com.br`).
3. O Railway vai te dar registros DNS (CNAME ou A record) para configurar onde você comprou o domínio (Registro.br, GoDaddy, etc.).
4. Adicione esses registros no painel do seu registrador de domínio.

## Resumo dos Passos Críticos

1. **Volume**: Essencial para não perder o banco de dados.
2. **Variáveis**: `DATABASE_URL` deve apontar para o volume (`/app/data/sqlite.db`).
3. **Domínio**: Configurado na aba Networking.

---

**Dica de Segurança**: Gere um `JWT_SECRET` longo e aleatório para produção. Não use "supersecretkey1234567890".
