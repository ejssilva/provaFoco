# Guia de Acesso Administrativo

## Acesso ao Painel Admin

O painel administrativo permite gerenciar questões, categorias, bancas e visualizar estatísticas.

### Como Acessar

1. Acesse a URL: `/admin`
2. Se não estiver logado, você será redirecionado para `/admin/login`
3. Digite a senha de administrador

### Credenciais Padrão

A senha padrão para o ambiente de desenvolvimento é:
**`Cl050223*`**

> **Nota de Segurança**: Em produção, certifique-se de configurar a variável de ambiente `ADMIN_PASSWORD` com uma senha forte.

## Troubleshooting

### Login Falha (Senha Incorreta)

1. Verifique se a variável de ambiente `ADMIN_PASSWORD` está configurada no arquivo `.env`.
2. Se não estiver configurada, a senha padrão acima será utilizada.
3. Verifique se o caps lock está ativado.

### Sessão não Persiste

O sistema utiliza cookies `httpOnly` para segurança.

1. Verifique se o navegador está aceitando cookies.
2. Em ambiente de desenvolvimento (`localhost`), certifique-se de que não há bloqueios de cookies de terceiros se estiver usando portas diferentes (embora o projeto agora use porta única 3000).

### Debugging

Para verificar o estado da autenticação no frontend:

1. Abra o Console do Desenvolvedor (F12)
2. Vá para a aba **Application** > **Local Storage**
3. Procure pela chave `portal-runtime-user-info`
   - Esta chave contém os dados públicos do usuário logado (cache client-side)
4. Vá para a aba **Network** e verifique a requisição para `/api/trpc/auth.me`

## Rotas Importantes

- `/admin`: Dashboard principal
- `/admin/login`: Tela de login
- `/admin/questions`: Gerenciamento de questões
- `/`: Página inicial pública
