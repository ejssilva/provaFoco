# Portal de Questões de Concurso - TODO

## Backend & Banco de Dados
- [x] Implementar CRUD completo de questões (create, read, update, delete, activate/deactivate)
- [x] Implementar CRUD de categorias (Português, Matemática, Informática)
- [x] Implementar CRUD de bancas examinadoras (CESPE, FCC, FGV, etc.)
- [x] Implementar CRUD de níveis de dificuldade
- [x] Implementar CRUD de anúncios com múltiplas posições
- [x] Implementar endpoints de filtro de questões (categoria, banca, dificuldade, ano)
- [x] Implementar endpoints de estatísticas do usuário (geral e por categoria)
- [x] Criar seed com questões reais de Português, Matemática e Informática

## Painel Administrativo
- [x] Criar layout do painel administrativo com sidebar
- [x] Implementar página de gerenciamento de questões
- [x] Implementar página de gerenciamento de categorias
- [x] Implementar página de gerenciamento de bancas
- [x] Implementar página de gerenciamento de anúncios
- [ ] Implementar página de estatísticas globais
- [x] Adicionar proteção de autenticação (apenas admin)
- [x] Implementar validação de formulários

## Interface Pública
- [x] Criar página inicial com apresentação do portal
- [x] Implementar página de resolução de questões
- [x] Implementar sistema de filtros (categoria, banca, dificuldade)
- [ ] Implementar sistema de paginação
- [x] Implementar modo aleatório de questões
- [x] Implementar feedback imediato (acerto/erro com explicação)
- [x] Criar página de estatísticas do usuário
- [ ] Implementar página de simulados

## Sistema de Anúncios
- [ ] Integrar Google AdSense ou AdNetwork
- [x] Implementar posições de anúncios (header, sidebar, entre questões, footer)
- [ ] Criar componentes de exibição de anúncios
- [ ] Implementar lógica de rotação de anúncios

## Otimização SEO
- [x] Criar meta tags dinâmicas por página
- [ ] Gerar sitemap.xml
- [x] Criar robots.txt
- [ ] Implementar schema.org markup (FAQSchema, ArticleSchema)
- [x] Otimizar URLs semânticas
- [x] Implementar Open Graph tags
- [x] Criar canonical tags
- [ ] Adicionar structured data para questões

## Testes & Qualidade
- [x] Escrever testes unitários para procedures tRPC
- [x] Testar fluxo de autenticação admin
- [x] Testar CRUD de questões
- [x] Testar sistema de filtros
- [x] Testar cálculo de estatísticas

## Deployment & Publicação
- [ ] Validar responsividade em mobile
- [ ] Testar performance
- [ ] Criar checkpoint final
- [ ] Publicar projeto


## Matéria de Legislação
- [x] Criar categoria de Legislação
- [x] Adicionar questões sobre Constituição Federal
- [x] Adicionar questões sobre Lei de Responsabilidade Fiscal (LRF)
- [x] Adicionar questões sobre Lei de Acesso à Informação
- [x] Adicionar questões sobre Lei Anticorrupção
- [x] Adicionar questões sobre Lei de Licitações e Contratos
- [x] Adicionar questões sobre Código de Ética Profissional
- [x] Adicionar questões sobre Direito Administrativo
- [x] Adicionar questões sobre Direito Constitucional
- [x] Testar filtros com nova categoria


## Melhorias no Painel Administrativo
- [x] Adicionar validação de acesso exclusivo para proprietário
- [x] Criar interface melhorada com dashboard de estatísticas
- [x] Implementar paginação na listagem de questões
- [x] Adicionar busca e filtros avançados
- [ ] Criar sistema de importação em lote de questões (CSV/Excel)
- [ ] Adicionar preview de questões antes de salvar
- [ ] Implementar histórico de alterações
- [ ] Criar relatório de desempenho de questões


## Bugs Reportados
- [x] Usuário não consegue acessar painel administrativo após login
- [x] Verificar se role está sendo definida corretamente como admin
- [x] Verificar redirecionamento após autenticação OAuth
- [x] Adicionar link para painel admin na home
- [x] Corrigir opções de cookie para suportar domínios
- [x] Erro no componente Select vazio na aba Questões
- [x] Adicionar rotas de teste para acesso rápido ao painel admin
- [ ] Usuário não consegue fazer login ao clicar em "Entrar para Começar"
- [ ] Verificar redirecionamento OAuth e URL de callback
- [ ] Verificar logs de erro do OAuth
