# Guia do Painel Administrativo

## Acesso Exclusivo

O painel administrativo do Portal de Questões para Concursos é **totalmente protegido** e acessível apenas para você (proprietário) como administrador.

### Como Acessar

1. **Acesse o portal**: Vá para a URL do seu site
2. **Faça login**: Clique em "Fazer Login" e use sua conta Manus OAuth
3. **Acesse o painel**: Você será automaticamente reconhecido como admin e terá acesso ao painel administrativo
4. **URL direta**: Você também pode acessar diretamente em `/admin`

### Segurança

- ✅ Apenas usuários com role `admin` podem acessar o painel
- ✅ Todas as operações (criar, editar, deletar) requerem autenticação admin
- ✅ O acesso é verificado tanto no frontend quanto no backend
- ✅ Se um usuário não-admin tentar acessar, será redirecionado para a home

## Funcionalidades do Painel

### 1. Dashboard
- **Estatísticas Gerais**: Total de questões, categorias, bancas
- **Gráficos Visuais**: Distribuição por categoria, dificuldade e banca
- **Taxa de Cobertura**: Visualize a proporção de questões por categoria

### 2. Gerenciamento de Questões
- **Criar Questão**: Adicione novas questões com todas as informações
- **Editar Questão**: Modifique questões existentes
- **Deletar Questão**: Remova questões do banco de dados
- **Buscar e Filtrar**: 
  - Busque por texto da questão
  - Filtre por categoria
  - Filtre por banca
  - Paginação automática (10 questões por página)

#### Campos Obrigatórios para Questão:
- **Categoria**: Selecione a matéria (Português, Matemática, Informática, Legislação, etc.)
- **Banca**: Escolha a banca examinadora (CESPE, FCC, FGV, etc.)
- **Dificuldade**: Fácil, Médio ou Difícil
- **Texto da Questão**: O enunciado completo
- **Alternativas A-E**: Todas as 5 opções de resposta
- **Resposta Correta**: Qual alternativa é a correta
- **Explicação**: Justificativa detalhada da resposta

#### Campos Opcionais:
- **Ano**: Ano de realização do concurso
- **Fonte**: Referência da questão

### 3. Gerenciamento de Categorias
- **Criar Categoria**: Adicione novas matérias/disciplinas
- **Editar Categoria**: Modifique nome, descrição, cor e ícone
- **Deletar Categoria**: Remova categorias (cuidado: isso afeta as questões)
- **Personalização**: 
  - Escolha cores para cada categoria
  - Adicione ícones representativos
  - Defina ordem de exibição

### 4. Gerenciamento de Bancas
- **Criar Banca**: Adicione novas bancas examinadoras
- **Editar Banca**: Atualize informações da banca
- **Deletar Banca**: Remova bancas do sistema
- **Exemplos de Bancas**: CESPE, FCC, FGV, VUNESP, IBFC, etc.

### 5. Gerenciamento de Anúncios
- **Criar Anúncio**: Configure anúncios para monetização
- **Posições Disponíveis**:
  - Header (topo da página)
  - Sidebar (lateral)
  - Entre Questões (durante resolução)
  - Footer (rodapé)
- **Editar Anúncio**: Modifique conteúdo e posição
- **Deletar Anúncio**: Remova anúncios

## Dicas de Uso

### Importar Questões em Lote
Atualmente, você pode adicionar questões uma por uma através da interface. Para adicionar muitas questões rapidamente:

1. Prepare um arquivo com as questões em formato estruturado
2. Use o formulário de criação para cada questão
3. Aproveite a busca para verificar duplicatas

### Organizar Categorias
- Use cores consistentes para cada matéria
- Mantenha uma ordem lógica (ex: por dificuldade ou por importância)
- Adicione descrições claras para cada categoria

### Monitorar Qualidade
- Verifique regularmente as estatísticas no dashboard
- Certifique-se de que as explicações são claras e detalhadas
- Mantenha o equilíbrio entre dificuldades

## Segurança e Backup

- ✅ Todas as alterações são registradas no banco de dados
- ✅ O sistema mantém histórico de mudanças
- ✅ Recomenda-se fazer backup regular do banco de dados
- ✅ Senhas e dados sensíveis são criptografados

## Troubleshooting

### Não consigo acessar o painel
- Verifique se está logado com a conta correta
- Certifique-se de que sua conta tem role `admin`
- Limpe o cache do navegador e tente novamente

### Questão não aparece após criar
- Verifique se a questão está marcada como ativa
- Confirme que a categoria e banca estão ativas
- Aguarde alguns segundos para a página atualizar

### Erro ao deletar questão
- Certifique-se de que tem permissão admin
- Verifique se a questão não está sendo usada em simulados

## Contato e Suporte

Para dúvidas ou problemas, consulte a documentação completa do projeto ou entre em contato com o suporte.

---

**Última atualização**: Janeiro 2026
**Versão**: 1.0
