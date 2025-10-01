# 🚀 Guia de Deploy

## Opção 1: Render.com (RECOMENDADO - 100% GRATUITO) ⭐

### Custo: $0/mês (Free Tier permanente)

1. **Crie conta no Render.com:**
   - Acesse https://render.com
   - Faça login com GitHub

2. **Conecte o repositório:**
   - No dashboard, clique em "New +"
   - Selecione "Blueprint"
   - Conecte este repositório GitHub
   - Render detectará automaticamente o `render.yaml`

3. **Configure as variáveis de ambiente:**
   - JWT_JWKS_URI: `https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_flr8GZaH0/.well-known/jwks.json`
   - JWT_ISSUER: `https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_flr8GZaH0`
   - AWS_ACCESS_KEY_ID: (suas credenciais)
   - AWS_SECRET_ACCESS_KEY: (suas credenciais)
   - COGNITO_USER_POOL_ID: (seu pool ID)
   - COGNITO_CLIENT_ID: (seu client ID)
   - COGNITO_CLIENT_SECRET: (seu client secret)

4. **Deploy:**
   - Clique em "Apply"
   - Aguarde 3-5 minutos
   - Sua aplicação estará disponível em: `https://backend-interview-task.onrender.com`

### ✅ Incluído no Free Tier:
- Web Service (750 horas/mês)
- PostgreSQL Database (1GB storage)
- SSL automático
- Auto deploy do GitHub
- Logs em tempo real

---

## Opção 2: Railway.dev (GRÁTIS com $5 crédito) 🚂

### Custo: $0-5/mês

1. **Instale Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Deploy:**
   ```bash
   railway init
   railway up
   railway add --plugin postgresql
   ```

4. **Configure variáveis:**
   ```bash
   railway variables set JWT_JWKS_URI=https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_flr8GZaH0/.well-known/jwks.json
   railway variables set JWT_ISSUER=https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_flr8GZaH0
   # ... outras variáveis
   ```

5. **Obter URL:**
   ```bash
   railway domain
   ```

---

## Opção 3: AWS (usando Imagem ECR já criada) 💰

### Custo: ~$15-25/mês

**Imagem Docker já está no ECR:**
```
629830531421.dkr.ecr.sa-east-1.amazonaws.com/backend-interview-task:latest
```

### Passos para completar deploy AWS:

1. **Adicionar permissão RDS ao usuário IAM** (necessário):
   - No AWS Console → IAM → Users → seu usuário
   - Adicionar policy: `AmazonRDSFullAccess`

2. **Criar banco RDS:**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier backend-interview-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username postgres \
     --master-user-password BackendTask2025! \
     --allocated-storage 20 \
     --publicly-accessible \
     --region sa-east-1
   ```

3. **Aguardar banco ficar disponível (~10 min):**
   ```bash
   aws rds describe-db-instances \
     --db-instance-identifier backend-interview-db \
     --query 'DBInstances[0].Endpoint.Address' \
     --output text
   ```

4. **Criar ECS Task Definition e Service** (ou usar EC2)

---

## Opção 4: Fly.io (GRÁTIS até $5/mês) ✈️

1. **Instale Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login e deploy:**
   ```bash
   fly auth login
   fly launch --image 629830531421.dkr.ecr.sa-east-1.amazonaws.com/backend-interview-task:latest
   fly postgres create
   fly postgres attach backend-interview-db
   ```

3. **Configure secrets:**
   ```bash
   fly secrets set JWT_JWKS_URI=https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_flr8GZaH0/.well-known/jwks.json
   fly secrets set JWT_ISSUER=https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_flr8GZaH0
   # ... outras variáveis
   ```

---

## 🎯 Recomendação Final

**Para máxima economia:** Use **Render.com** (Opção 1)
- ✅ 100% gratuito
- ✅ Deploy em 5 minutos
- ✅ PostgreSQL incluído
- ✅ SSL automático
- ✅ Zero manutenção

**Para produção séria:** Use **AWS ECS Fargate** (Opção 3)
- ✅ Mais controle
- ✅ Integração AWS completa
- ✅ Escalabilidade

---

## 📊 Comparação de Custos

| Plataforma | Custo/mês | Deploy | Banco Incluído |
|------------|-----------|--------|----------------|
| Render     | $0        | ⚡ Fácil | ✅ PostgreSQL 1GB |
| Railway    | $0-5      | ⚡ Fácil | ✅ PostgreSQL |
| Fly.io     | $0-5      | 🔧 Médio | ✅ PostgreSQL |
| AWS        | $15-25    | 🔧 Complexo | ❌ Pago separado |

---

## 🔗 Links Úteis

- [Render Dashboard](https://dashboard.render.com)
- [Railway Dashboard](https://railway.app)
- [Fly.io Dashboard](https://fly.io/dashboard)
- [AWS Console](https://console.aws.amazon.com)

---

**Status atual:**
- ✅ Imagem Docker no ECR
- ✅ Código pronto para deploy
- ⏳ Aguardando escolha de plataforma

