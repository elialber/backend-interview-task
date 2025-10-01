# 🚀 Informações de Deploy - Backend Interview Task

## 📍 Aplicação em Produção

### URLs Principais

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **API Base** | http://56.124.105.5 | URL principal da API |
| **Swagger Docs** | http://56.124.105.5/docs | Documentação interativa |
| **Health Check** | http://56.124.105.5/me | Endpoint de teste (requer auth) |

---

## 🔗 Endpoints da API

### Públicos
- `POST http://56.124.105.5/auth` - Autenticação/Registro

### Protegidos (requer JWT)
- `GET http://56.124.105.5/me` - Dados do usuário autenticado
- `PUT http://56.124.105.5/edit-account` - Editar conta
- `GET http://56.124.105.5/users` - Listar usuários (somente admin)

### Documentação
- `GET http://56.124.105.5/docs` - Swagger UI

---

## 🏗️ Infraestrutura AWS

### EC2 Instance
- **Instance ID:** `i-0f1a4b3a71adb1415`
- **Tipo:** t2.micro (Free Tier)
- **IP Público:** 56.124.105.5
- **Região:** sa-east-1 (São Paulo)
- **SO:** Ubuntu 22.04 LTS
- **Availability Zone:** sa-east-1a

### Security Group
- **ID:** `sg-079def50eb8145314`
- **Nome:** backend-interview-sg
- **Regras:**
  - SSH (22) - Aberto para 0.0.0.0/0
  - HTTP (80) - Aberto para 0.0.0.0/0
  - Custom (3001) - Aberto para 0.0.0.0/0

### ECR Repository
- **URI:** `629830531421.dkr.ecr.sa-east-1.amazonaws.com/backend-interview-task:latest`
- **Região:** sa-east-1

### Banco de Dados
- **Tipo:** PostgreSQL 14-alpine
- **Deploy:** Containerizado no EC2
- **Volume:** postgres_data (persistente)
- **Credenciais:**
  - User: postgres
  - Database: backend_interview
  - Host: db (interno ao Docker network)

---

## 🔐 Acesso SSH

### Conectar ao servidor:
```bash
ssh -i backend-interview-key.pem ubuntu@56.124.105.5
```

### Ver logs da aplicação:
```bash
ssh -i backend-interview-key.pem ubuntu@56.124.105.5 "docker logs backend-interview-task-api-1"
```

### Reiniciar aplicação:
```bash
ssh -i backend-interview-key.pem ubuntu@56.124.105.5 "cd ~/backend-interview-task && docker-compose -f docker-compose.prod.yml restart"
```

### Ver status dos containers:
```bash
ssh -i backend-interview-key.pem ubuntu@56.124.105.5 "docker ps"
```

---

## 🐳 Docker Containers

### Containers Ativos
1. **backend-interview-task-api-1**
   - Imagem: backend-interview-task-api
   - Portas: 80:3000, 3001:3000
   - Status: Running
   - Restart: unless-stopped

2. **backend-interview-task-db-1**
   - Imagem: postgres:14-alpine
   - Porta interna: 5432
   - Status: Running
   - Restart: unless-stopped

### Docker Compose
- **Arquivo:** `~/backend-interview-task/docker-compose.prod.yml`
- **Network:** backend-interview-task_default
- **Volume:** backend-interview-task_postgres_data

---

## 🔧 Variáveis de Ambiente (Configuradas)

```bash
NODE_ENV=production
POSTGRES_HOST=db
DB_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=BackendTask2025!
POSTGRES_DB=backend_interview
JWT_JWKS_URI=https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_flr8GZaH0/.well-known/jwks.json
JWT_ISSUER=https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_flr8GZaH0
AWS_ACCESS_KEY_ID=AKIA6DAC24IGDJ2VPOOY
AWS_REGION=sa-east-1
COGNITO_USER_POOL_ID=sa-east-1_flr8GZaH0
COGNITO_CLIENT_ID=6vus2v45rs9hjenib42rbj7ncc
```

---

## 💰 Custos

| Recurso | Custo Mensal | Observação |
|---------|--------------|------------|
| EC2 t2.micro | $0 | Free Tier (12 meses) |
| PostgreSQL | $0 | Containerizado no EC2 |
| ECR Storage | ~$0.10 | Storage de imagem |
| **Total** | **~$0/mês** | No primeiro ano |

**Após Free Tier:**
- EC2 t2.micro: ~$8-10/mês
- Total estimado: ~$8-10/mês

---

## 🧪 Testar Deploy

### 1. Teste básico (sem autenticação):
```bash
curl http://56.124.105.5/me
```
**Resposta esperada:**
```json
{"message":"Authentication token is missing"}
```

### 2. Teste de autenticação:
```bash
curl -X POST http://56.124.105.5/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"SuaSenha123!"}'
```

### 3. Acessar Swagger:
Abra no navegador: http://56.124.105.5/docs

---

## 📝 Comandos Úteis

### Atualizar código na produção:
```bash
# 1. Transferir arquivos atualizados
tar --exclude='node_modules' --exclude='.git' --exclude='dist' -czf /tmp/backend.tar.gz .
scp -i backend-interview-key.pem /tmp/backend.tar.gz ubuntu@56.124.105.5:~/

# 2. No servidor
ssh -i backend-interview-key.pem ubuntu@56.124.105.5
cd ~/backend-interview-task
tar -xzf ~/backend.tar.gz
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Backup do banco de dados:
```bash
ssh -i backend-interview-key.pem ubuntu@56.124.105.5 \
  "docker exec backend-interview-task-db-1 pg_dump -U postgres backend_interview" > backup.sql
```

### Restore do banco de dados:
```bash
cat backup.sql | ssh -i backend-interview-key.pem ubuntu@56.124.105.5 \
  "docker exec -i backend-interview-task-db-1 psql -U postgres backend_interview"
```

---

## ✅ Status Atual

- ✅ Aplicação deployada e funcionando
- ✅ Swagger documentação disponível
- ✅ Banco de dados operacional
- ✅ Integração AWS Cognito ativa
- ✅ Sem cold start
- ✅ Free Tier AWS (primeiro ano)

---

## 🚨 Manutenção

### Monitoramento
- **Logs:** `docker logs -f backend-interview-task-api-1`
- **Métricas EC2:** AWS CloudWatch Console
- **Health Check:** `curl http://56.124.105.5/me`

### Troubleshooting
1. **Aplicação não responde:**
   ```bash
   ssh -i backend-interview-key.pem ubuntu@56.124.105.5 "docker ps"
   ssh -i backend-interview-key.pem ubuntu@56.124.105.5 "docker logs backend-interview-task-api-1"
   ```

2. **Reiniciar tudo:**
   ```bash
   ssh -i backend-interview-key.pem ubuntu@56.124.105.5 \
     "cd ~/backend-interview-task && docker-compose -f docker-compose.prod.yml restart"
   ```

3. **Rebuild completo:**
   ```bash
   ssh -i backend-interview-key.pem ubuntu@56.124.105.5 \
     "cd ~/backend-interview-task && docker-compose -f docker-compose.prod.yml down && \
      docker-compose -f docker-compose.prod.yml up -d --build"
   ```

---

## 📞 Informações de Contato

**Desenvolvedor:** Elialber Lopes  
**Email:** elialberlopes@gmail.com  
**GitHub:** https://github.com/elialber/backend-interview-task

---

**Data de Deploy:** 01/10/2025  
**Última Atualização:** 01/10/2025  
**Status:** ✅ Ativo e Operacional

