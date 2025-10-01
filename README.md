# Tarefa Backend Caveo

## Objetivo

Nesta tarefa, o candidato deverá configurar um projeto backend utilizando Node.js e integrar a aplicação com AWS Cognito para controlar a autorização de rotas. A tarefa inclui a configuração de um banco de dados com PostgreSQL, o uso do ORM TypeORM, e a inicialização do ambiente de desenvolvimento com Docker Compose.

---

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- Conta AWS com Cognito configurado

### Executar com Docker
```bash
npm run docker:dev
```

### Executar localmente
```bash
npm install
npm run dev
```

### Executar testes
```bash
npm test
```

### Acessar documentação
- Swagger: http://localhost:3001/docs
- Postman: Importe `docs/postman/postman_collection.json`

---

## 🌐 Deploy em Produção

### ✅ Imagem Docker (Pronta no ECR)
```
629830531421.dkr.ecr.sa-east-1.amazonaws.com/backend-interview-task:latest
```

### 🎯 Opções de Deploy

#### 1. **Render.com** (RECOMENDADO - 100% GRÁTIS) ⭐
- Custo: $0/mês
- PostgreSQL incluído (1GB)
- SSL automático
- [Ver guia completo](./DEPLOY.md#opção-1-rendercom-recomendado---100-gratuito-)

#### 2. **Railway.dev** (Grátis com $5 crédito)
- Custo: $0-5/mês
- Deploy via CLI
- [Ver guia completo](./DEPLOY.md#opção-2-railwaydev-grátis-com-5-crédito-)

#### 3. **AWS ECS/Fargate**
- Custo: ~$15-25/mês
- Requer permissão RDS
- [Ver guia completo](./DEPLOY.md#opção-3-aws-usando-imagem-ecr-já-criada-)

📖 **[Guia Completo de Deploy](./DEPLOY.md)**

---

## 📋 Requisitos e Implementação

### 1. ✅ Inicialização do Repositório

**Requisitos:**
- Configure um novo repositório Node.js.
- Utilize o framework **KoaJS**.
- Adicione **TypeORM** para gerenciar o banco de dados.
- Utilize **PostgreSQL** como banco de dados relacional.
- Utilize **Typescript**.

**Implementação:**
- ✅ Node.js configurado com TypeScript (`tsconfig.json`)
- ✅ KoaJS v3.0.1 (`src/index.ts`)
- ✅ TypeORM v0.3.27 (`src/data-source.ts`)
- ✅ PostgreSQL via Docker (`docker-compose.yml`)
- ✅ TypeScript v5.1.6 com strict mode

**Arquivos:**
- `package.json` - Dependências e scripts
- `tsconfig.json` - Configuração TypeScript
- `src/index.ts` - Aplicação Koa principal
- `src/data-source.ts` - Configuração TypeORM

---

### 2. ✅ Tabelas

**Requisitos:**
- Deverá ser criada uma tabela com o nome de `User`, com os seguintes campos: name, email, role, isOnboarded, createdAt, deletedAt, updatedAt.

**Implementação:**
- ✅ Entidade User criada com TypeORM
- ✅ Todos os campos obrigatórios implementados:
  - `id` (UUID, PrimaryGeneratedColumn)
  - `name` (varchar 255)
  - `email` (varchar 255, unique)
  - `role` (varchar 50)
  - `isOnboarded` (boolean, default: false)
  - `createdAt` (timestamp, CreateDateColumn)
  - `updatedAt` (timestamp, UpdateDateColumn)
  - `deletedAt` (timestamp, DeleteDateColumn - soft delete)

**Arquivos:**
- `src/entities/User.ts` - Definição da entidade

---

### 3. ✅ Configuração com Docker Compose

**Requisitos:**
- Configure um arquivo `docker-compose.yml` para inicializar a API e o banco de dados PostgreSQL.
- Certifique-se de que o ambiente esteja isolado e fácil de replicar.

**Implementação:**
- ✅ `docker-compose.yml` configurado com 2 serviços:
  - **api**: Aplicação Node.js/Koa (porta 3001)
  - **db**: PostgreSQL 14-alpine (porta 5433)
- ✅ Volumes persistentes para dados do PostgreSQL
- ✅ Variáveis de ambiente isoladas (`.env.docker`)
- ✅ Dependências configuradas (api depende de db)
- ✅ Script npm: `npm run docker:dev`

**Arquivos:**
- `docker-compose.yml` - Configuração dos containers
- `Dockerfile` - Build da aplicação
- `.env.docker` - Variáveis de ambiente

---

### 4. ✅ Integração com AWS Cognito

**Requisitos:**
- Crie uma conta AWS, se necessário.
- Configure um User Pool no AWS Cognito.
- Integre a API com AWS Cognito para autenticação de usuários.

**Implementação:**
- ✅ AWS SDK integrado (@aws-sdk/client-cognito-identity-provider v3.899.0)
- ✅ User Pool configurado no AWS Cognito (região sa-east-1)
- ✅ Autenticação via USER_PASSWORD_AUTH
- ✅ Registro automático de novos usuários
- ✅ Confirmação automática (adminConfirmSignUp)
- ✅ Geração de tokens JWT pelo Cognito
- ✅ Cálculo correto de SECRET_HASH
- ✅ Sincronização automática com banco de dados local

**Arquivos:**
- `src/services/auth.ts` - Lógica de integração com Cognito

---

### 5. ✅ Middleware de Autorização

**Requisitos:**
- Desenvolva um middleware em KoaJS para controlar a autorização das rotas.
- O middleware deve bloquear o acesso de usuários não autenticados.
- Integre a verificação do JWT gerado pelo Cognito para proteger as rotas.

**Implementação:**
- ✅ Middleware `authMiddleware` implementado
- ✅ Extração do token do header `Authorization: Bearer <token>`
- ✅ Validação de presença do token (401 se ausente)
- ✅ Decodificação do JWT
- ✅ Verificação de assinatura usando JWKS do Cognito
- ✅ Validação do issuer
- ✅ Injeção dos dados do usuário em `ctx.state.user`
- ✅ Tratamento de erros (401 para tokens inválidos)

**Arquivos:**
- `src/middleware/auth.ts` - Middleware de autenticação

---

### 6. ✅ Escopos e Permissões

**Requisitos:**
- Crie diferentes escopos de usuário (por exemplo, `admin`, `usuário`) no cognito.
- Configure permissões específicas para cada escopo, garantindo que apenas usuários com as permissões corretas possam acessar determinadas rotas.

**Implementação:**
- ✅ Grupos criados no Cognito:
  - **admin**: Acesso completo (pode alterar role, acessar /users)
  - **user**: Acesso básico (implícito, sem grupo)
- ✅ Verificação de `cognito:groups` no token JWT
- ✅ Controle de permissões por rota:
  - `/users` - Somente admin
  - `/edit-account` - Admin pode alterar role, user não pode
- ✅ Retorno de 403 Forbidden quando permissões insuficientes

**Validação:**
- Token sem grupo admin → 403 ao acessar `/users`
- Token com grupo admin → 200 ao acessar `/users`

---

### 7. ✅ Criação de rotas

**Requisitos:**
- Deve ser criadas rotas de /auth, /me, /edit-account e /users
- A rota `/auth` deverá ser pública, a rota /me e /edit-account devem ser protegidas pelo JWT retornado pelo Cognito
- A rota `/auth` servirá como um signInOrRegister, onde deverá verificar se o usuário já existe, senão criar em nosso banco de dados.
- Para a rota `/edit-account` os usuários com escopo de admin, poderão alterar as informações de nome e role, enquanto os usuários com escopo de usuário somente poderão alterar o seu nome, após alterar o nome, a flag de isOnboarded deve ser modificada para true.
- A rota `/users` deverá ser protegida e somente os usuários com escopo de admin poderão acessa-lá, essa rota retornara todos os usuários cadastrados em nosso banco.

**Implementação:**

#### ✅ POST /auth (Pública)
- Arquivo: `src/routes/auth.ts`
- Implementa signInOrRegister
- Cria usuário no Cognito se não existir
- Sincroniza com banco de dados local
- Retorna JWT token
- Validação de campos (username, password)

#### ✅ GET /me (Protegida)
- Arquivo: `src/routes/me.ts`
- Protegida por `authMiddleware`
- Retorna dados do usuário autenticado do token JWT

#### ✅ PUT /edit-account (Protegida)
- Arquivo: `src/routes/edit-account.ts`
- Protegida por `authMiddleware`
- **Admin pode:**
  - Alterar `name`
  - Alterar `role`
- **Usuário comum pode:**
  - Alterar apenas `name`
  - `isOnboarded` é setado para `true` ao alterar nome
  - Recebe 403 se tentar alterar `role`

#### ✅ GET /users (Protegida - Admin only)
- Arquivo: `src/routes/users.ts`
- Protegida por `authMiddleware`
- Restrição: apenas usuários com grupo `admin`
- Retorna todos os usuários do banco
- Retorna 403 para não-admins

**Arquivos:**
- `src/routes/auth.ts`
- `src/routes/me.ts`
- `src/routes/edit-account.ts`
- `src/routes/users.ts`
- `src/routes/index.ts` - Agregador de rotas

---

### 8. ✅ Documentação

**Requisitos:**
- Utilize Postman ou Swagger para a documentação das rotas e funcionalidades.
- Exemplifique os requests que serão executados na plataforma.
- Utilize commits pequenos e de claro entendimento.

**Implementação:**

#### Swagger
- ✅ Configurado em `src/swagger.ts`
- ✅ Disponível em http://localhost:3001/docs
- ✅ OpenAPI 3.0.0
- ✅ Todas as rotas documentadas com JSDoc
- ✅ Schema do User definido
- ✅ Bearer Authentication configurado

#### Postman
- ✅ Collection: `docs/postman/postman_collection.json`
- ✅ Todas as 4 rotas incluídas
- ✅ Headers pré-configurados
- ✅ Exemplos de body

#### Documentação Markdown
- ✅ `docs/API_DOCUMENTATION.md` - Guia completo da API
- ✅ Exemplos de cURL para todas as rotas
- ✅ Exemplos de requests e responses
- ✅ Documentação de erros

#### Commits
- ✅ Commits pequenos e descritivos
- ✅ Mensagens claras (feat:, fix:, refactor:)
- ✅ Histórico limpo e organizado

**Arquivos:**
- `src/swagger.ts` - Configuração Swagger
- `docs/postman/postman_collection.json` - Collection Postman
- `docs/API_DOCUMENTATION.md` - Documentação da API

---

## 🌟 Diferenciais Implementados

### ✅ Testes unitários e E2E
- **13 testes passando** com Jest
- 6 suítes de teste configuradas
- Cobertura de rotas principais
- Testes E2E para todas as rotas
- Teste unitário do serviço de autenticação

**Arquivos:**
- `tests/routes/*.e2e.test.ts` - Testes E2E
- `tests/services/auth.test.ts` - Teste unitário
- `tests/database.test.ts` - Teste de conexão
- `jest.config.js` - Configuração Jest

**Executar:**
```bash
npm test
```

---

### ✅ Postman com rotas de testes
- Collection completa em JSON
- Todas as 4 rotas principais
- Headers pré-configurados
- Exemplos de body

**Arquivo:** `docs/postman/postman_collection.json`

---

### ✅ Env com variáveis de ambiente encriptadas
- Script de decriptação: `decrypt-env.sh`
- Usa OpenSSL AES-256-CBC
- Arquivo `.env.enc` (encriptado)
- Decriptação automática antes do start

**Arquivo:** `decrypt-env.sh`

---

### ✅ Padrões de desenvolvimento aplicados
- **ESLint** configurado (.eslintrc.js)
- **Prettier** configurado (.prettierrc)
- **TypeScript** strict mode
- Convenções de código:
  - camelCase para variáveis e funções
  - PascalCase para classes e tipos
  - Indentação consistente
  - Imports organizados

**Scripts:**
```bash
npm run lint          # Verificar erros
npm run lint:fix      # Corrigir automaticamente
npm run format        # Formatar código
```

---

## 📊 Status dos Requisitos

### Requisitos Obrigatórios: 8/8 ✅ (100%)
1. ✅ Inicialização do Repositório
2. ✅ Tabelas
3. ✅ Docker Compose
4. ✅ AWS Cognito
5. ✅ Middleware de Autorização
6. ✅ Escopos e Permissões
7. ✅ Rotas (/auth, /me, /edit-account, /users)
8. ✅ Documentação

### Diferenciais: 4/5 ✅ (80%)
- ✅ Testes unitários e E2E
- ✅ Postman com rotas
- ✅ Env com variáveis encriptadas
- ✅ Padrões de desenvolvimento (linter, prettier, etc)
- ❌ Aplicação funcional com link na AWS (não implementado)

---

## 🎯 Pontos Fortes

1. **Arquitetura bem estruturada** - Separação clara de responsabilidades
2. **Segurança robusta** - Verificação JWT completa com JWKS
3. **Testes abrangentes** - 13 testes cobrindo casos principais
4. **Documentação completa** - Swagger + Postman + Markdown
5. **Boas práticas** - Linter, Prettier, TypeScript strict
6. **Docker pronto** - Ambiente isolado e replicável
7. **Integração AWS real** - Cognito funcionando perfeitamente

---

## 📚 Referências

- [Documentação do Docker](https://docs.docker.com/)
- [Documentação do KoaJS](https://koajs.com/)
- [Documentação do TypeORM](https://typeorm.io/)
- [AWS Cognito](https://docs.aws.amazon.com/cognito/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📝 Observações Importantes

### Como adicionar usuário ao grupo admin no Cognito:
1. Acesse AWS Console → Cognito → User Pools
2. Selecione o User Pool configurado
3. Vá em "Groups" → Selecione "admin"
4. Clique em "Add user to group"
5. Selecione o usuário e adicione
6. **Importante:** Faça login novamente para obter um novo token com o grupo

### Troubleshooting:
- **403 na rota /users mesmo sendo admin?** → Faça login novamente para obter token atualizado com o grupo
- **Erro de conexão com DB?** → Verifique se o Docker está rodando e as portas estão livres
- **Token inválido?** → Verifique as variáveis de ambiente do Cognito (.env)

---

**Data da última verificação:** 01/10/2025

**Status:** ✅ Pronto para produção
