# 🌟 **Projeto Backend - Fit Meet** 🌟

Este é o backend do projeto **Fit Meet**, desenvolvido para gerenciar usuários, atividades e conquistas, utilizando boas práticas de desenvolvimento, tecnologias modernas e uma arquitetura bem estruturada.

---

## 🚀 **Tecnologias Utilizadas**

### 🔹 **Linguagem e Ambiente**
- **Node.js**: Ambiente de execução JavaScript para o backend.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática ao código.

### 📚 **Frameworks e Bibliotecas**
- **Express**: Framework minimalista para criação de APIs REST.
- **Prisma**: ORM (Object-Relational Mapping) para interação com o banco de dados.
- **Zod**: Biblioteca para validação de esquemas de dados.
- **bcryptjs**: Para criptografia de senhas.
- **jsonwebtoken (JWT)**: Para autenticação e autorização.
- **Multer**: Middleware para upload de arquivos.
- **Swagger-UI-Express**: Para documentação interativa da API.
- **AWS SDK**: Para integração com o serviço S3 (armazenamento de arquivos).

### 🗄️ **Banco de Dados**
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar informações de usuários, atividades, preferências e conquistas.

### 🛠️ **Ferramentas de Desenvolvimento**
- **Nodemon**: Para reiniciar automaticamente o servidor durante o desenvolvimento.
- **Jest**: Framework de testes para garantir a qualidade do código.
- **Supertest**: Para testes de integração das rotas da API.

---

## 📂 **Estrutura do Projeto**

O projeto segue uma estrutura modular e organizada, separando responsabilidades em diferentes camadas:

```
backend/
├── assets/                # Arquivos estáticos (imagens, etc.)
├── controllers/           # Controladores para lidar com as requisições HTTP
├── middlewares/           # Middlewares para validação, autenticação e outras funções
├── prisma/                # Configuração do Prisma e migrações do banco de dados
├── repositories/          # Camada de acesso ao banco de dados
├── routes/                # Definição das rotas da API
├── seeds/                 # Scripts para popular o banco de dados com dados iniciais
├── services/              # Lógica de negócios e integração com repositórios
├── swagger/               # 📜 **Documentação da API em formato Swagger**
├── test/                  # Testes unitários e de integração
├── types/                 # Definição de tipos TypeScript
├── validations/           # Validações de entrada utilizando Zod
├── .env                   # Variáveis de ambiente
├── Dockerfile             # Configuração para containerização com Docker
├── docker-compose.yml     # Configuração para orquestração de containers
├── tsconfig.json          # Configuração do TypeScript
└── package.json           # Dependências e scripts do projeto
```

---

## 🎯 **Principais Funcionalidades**

### 🔑 **Autenticação e Autorização**
- Login e registro de usuários com autenticação JWT.
- Middleware `authGuard` para proteger rotas que exigem autenticação.
- Verificação de status do usuário (`checkUserStatus`).

### 👤 **Gerenciamento de Usuários**
- Atualização de dados do usuário.
- Upload de avatar.
- Definição de preferências do usuário.
- Desativação de contas.

### 📅 **Gerenciamento de Atividades**
- Criação, atualização e exclusão de atividades.
- Inscrição e cancelamento em atividades.
- Aprovação de participantes.
- Check-in em atividades.

### 🏆 **Conquistas**
- Sistema de conquistas baseado em critérios personalizados.
- **Seed** para popular conquistas iniciais.

### 📜 **Documentação da API**
- **🔗 Acesse a documentação interativa pelo Swagger:**
  👉 **[http://localhost:7777/docs](http://localhost:7777/docs)** 🚀

---

## ✅ **Boas Práticas Aplicadas**

### 📌 **Arquitetura**
- Separar responsabilidades entre **controllers, services e repositories**.
- Uso de **middlewares** para validação, autenticação e autorização.

### ✅ **Validação**
- Uso do **Zod** para garantir a integridade dos dados.

### 🔐 **Segurança**
- Criptografia de senhas com **bcrypt**.
- Autenticação **JWT** para proteger rotas.

### 🧪 **Testes**
- Testes unitários e de integração usando **Jest** e **Supertest**.

### 🐳 **Containerização**
- Uso de **Docker** e **Docker Compose** para padronização do ambiente.

---

## 💻 **Como Executar o Projeto**

### **Passos**
1. Clone o repositório e instale as dependências:
   ```bash
   git clone https://github.com/bc-fullstack-06/Jober-Junior-de-Moura-Pinto.git
   cd backend
   npm install
   ```

2. Configure as variáveis de ambiente no `.env`.

 - Crie um arquivo .env na raiz do projeto com as seguintes variáveis para conseguir rodar o docker:
    ```
      PORT=7777;
      DATABASE_URL="postgresql://postgres:postgres@Sysmap:5432/Bootcamp?schema=public"
      #DATABASE_URL="postgresql://<USUARIO>:<SENHA>@<HOST>:<PORTA>/<DATABASE>?schema=public"

      JWT_SECRET=infqi8wne982n89n89n89wd7e117asd416548h484jku8j1g5e18181e8g1agotybs
      BUCKET_NAME=bootcamp
      S3_ENDPOINT=http://localstack:4566
      AWS_REGION=us-east-1
      AWS_ACCESS_KEY=test
      AWS_SECRET_ACCESS_KEY=test
   ```


3. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
      ```
4.    
     ```
   docker build -t backend .
     ```
5. Execute o container:
   
 ```
   docker run -p 7777:7777 -it backend
 ```
5. **📜 Acesse a documentação da API:**
   👉 **[http://localhost:7777/docs](http://localhost:7777/docs)** 🌍

---
