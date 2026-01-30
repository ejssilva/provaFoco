# Guia de Login - Painel Administrativo

## Problema: Login não funciona em ambiente de desenvolvimento

Se você está tentando fazer login e o redirecionamento não funciona, siga este guia.

## Solução 1: Usar a URL Pública do Manus

O portal está hospedado em um servidor Manus com uma URL pública. Para fazer login corretamente:

1. **Acesse a URL pública** do seu portal (fornecida pelo Manus)
   - Exemplo: `https://3000-xxxxx.sg1.manus.computer`

2. **Clique em "Entrar para Começar"**
   - Você será redirecionado para `https://manus.im/app-auth`

3. **Faça login com sua conta Manus**
   - Se não tiver conta, crie uma em `https://manus.im`

4. **Após autenticação**
   - Você será redirecionado de volta para o portal
   - Um cookie de sessão será criado
   - Você verá os botões "Começar a Responder", "Ver Estatísticas" e "Painel Admin"

5. **Acesse o Painel Admin**
   - Clique no botão "Painel Admin"
   - Você será levado para `/admin` com acesso completo

## Solução 2: Modo Desenvolvimento (Bypass de Login)

Se você está desenvolvendo localmente e quer testar sem fazer login real:

### Opção A: Usar localStorage para simular login

Abra o console do navegador (F12) e execute:

```javascript
// Simular usuário admin no localStorage
const adminUser = {
  id: 1,
  openId: "RHwVo4s4KUtvcoohsziZir", // OWNER_OPEN_ID
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastSignedIn: new Date().toISOString()
};

localStorage.setItem("manus-runtime-user-info", JSON.stringify(adminUser));

// Recarregar a página
window.location.reload();
```

Após executar, recarregue a página e você verá o botão "Painel Admin".

### Opção B: Criar rota de teste (não recomendado para produção)

Se precisar de um bypass permanente, você pode adicionar uma rota de teste no backend:

```typescript
// Em server/_core/index.ts, adicione:
app.get("/api/test/login", (req, res) => {
  const sessionToken = await sdk.createSessionToken("RHwVo4s4KUtvcoohsziZir", {
    name: "Admin User",
  });
  
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
  res.redirect("/");
});
```

Então acesse: `http://localhost:3000/api/test/login`

## Verificar Status de Login

Para verificar se você está logado:

1. Abra o console do navegador (F12)
2. Vá para a aba "Application" → "Cookies"
3. Procure por um cookie chamado `session` ou similar
4. Se existir, você está logado
5. Verifique também o localStorage por `manus-runtime-user-info`

## Troubleshooting

### "Entrar para Começar" não faz nada
- Verifique se as variáveis de ambiente estão corretas:
  - `VITE_OAUTH_PORTAL_URL` deve ser `https://manus.im`
  - `VITE_APP_ID` deve estar preenchido
- Verifique o console do navegador (F12) para erros de JavaScript

### Redirecionamento para OAuth não funciona
- Certifique-se de que está usando a URL pública do Manus
- URLs locais (localhost:3000) não funcionam com OAuth
- O callback deve ser acessível publicamente

### Cookie não persiste após login
- Verifique se o navegador permite cookies de terceiros
- Certifique-se de que está usando HTTPS (não HTTP)
- Verifique as opções de cookie em `server/_core/cookies.ts`

## Acessar o Painel Admin Diretamente

Se você já está logado, pode acessar diretamente:

- **URL**: `/admin` ou `/admin/`
- **Exemplo**: `https://seu-portal.com/admin`

Se não estiver logado, será redirecionado para a home.

## Próximas Etapas

Após fazer login com sucesso:

1. Vá para o **Painel Admin**
2. Clique na aba **Dashboard** para ver estatísticas
3. Clique na aba **Questões** para gerenciar questões
4. Use o botão **"Nova Questão"** para adicionar questões
5. Configure **Categorias**, **Bancas** e **Anúncios** conforme necessário

---

**Nota**: O sistema usa OAuth Manus para autenticação. Você precisa ter uma conta Manus válida para fazer login. Se não tiver, crie uma em `https://manus.im`.
