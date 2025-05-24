

<p align="center">
  <img src="https://github.com/user-attachments/assets/ee7dac24-4ee2-42f6-bac6-64327b309e2a" alt="Imagem" width="400" />
</p>


## **Resumo do Projeto** 📝
O **Fitmeet Frontend** é a interface web do projeto **Fitmeet**, uma plataforma que conecta pessoas por meio de atividades físicas e eventos esportivos.A plataforma permite que os usuários criem, participem e gerenciem atividades, promovendo um estilo de vida saudável e colaborativo. Com uma interface moderna e responsiva, o projeto utiliza tecnologias de ponta para oferecer uma experiência fluida e intuitiva.

---

## **Tecnologias e Ferramentas** 🛠️

### **Principais Tecnologias**
- **React** ⚛️: Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript** 🟦: Superset do JavaScript que adiciona tipagem estática ao código.
- **Vite** ⚡: Ferramenta de build rápida para desenvolvimento de aplicações modernas.
- **TailwindCSS** 🎨: Framework CSS para estilização rápida e eficiente.
- **Radix UI** 🖼️: Componentes acessíveis e estilizados para construção de interfaces.
- **React Hook Form** 📋: Gerenciamento de formulários com validação simplificada.
- **React Router DOM** 🛤️: Gerenciamento de rotas no frontend.
- **Leaflet** e **React-Leaflet** 🗺️: Biblioteca para renderização de mapas interativos.
- **Zod** ✅: Validação de dados no frontend.

### **Testes**
- **Vitest** 🧪: Framework de testes para validação de funcionalidades.
- **Testing Library** 🧩: Testes de componentes React com foco em acessibilidade.
- **Jest-DOM** 🖥️: Extensões para facilitar asserções em testes DOM.

---

## **Organização das Pastas e Arquivos** 📂

A estrutura do projeto foi organizada para facilitar a manutenção e escalabilidade. Abaixo está uma visão geral das principais pastas e seus propósitos:

### **Estrutura de Pastas**
```
frontend/
├── public/                # Arquivos estáticos (imagens, ícones, etc.)
├── src/                   # Código-fonte principal
│   ├── api/               # Serviços para comunicação com a API
│   ├── assets/            # Recursos como imagens e ícones
│   ├── components/        # Componentes reutilizáveis da interface
│   │   ├── ui/            # Componentes de interface de usuário (botões, modais, etc.)
│   ├── context/           # Contextos globais para gerenciamento de estado
│   ├── hooks/             # Hooks personalizados
│   ├── lib/               # Funções utilitárias
│   ├── pages/             # Páginas principais da aplicação
│   ├── tests/             # Testes unitários e de integração
│   ├── App.tsx            # Componente raiz da aplicação
│   ├── main.tsx           # Ponto de entrada do React
│   ├── index.css          # Estilos globais
├── docker-compose.yml     # Configuração do Docker Compose
├── package.json           # Dependências e scripts do projeto
├── vite.config.ts         # Configuração do Vite
```

### **Detalhes das Pastas**
- **`api/`**: Contém funções para realizar chamadas à API disponibilizada pela organização.
- **`components/ui/`**: Componentes reutilizáveis como botões, modais, inputs e carrosséis.
- **`context/`**: Gerencia estados globais, como tipos de atividades e dados do usuário.
- **`hooks/`**: Hooks personalizados para encapsular lógica reutilizável.
- **`pages/`**: Contém as páginas principais, como login, registro, perfil e home.
- **`tests/`**: Testes automatizados para garantir a qualidade do código.

---

## **Funcionalidades do Frontend** 🚀

### **Autenticação e Gerenciamento de Usuários**
- Registro e login de usuários com validação de credenciais.
- Atualização de perfil, incluindo upload de avatar.
- Definição de preferências de atividades.

### **Exploração de Atividades**
- Visualização de atividades por categoria.
- Mapa interativo para localização de atividades.
- Carrossel de conquistas e atividades em destaque.

### **Sistema de Recompensas**
- Exibição de conquistas no perfil do usuário.
- Exibilçao do nivel no perfil do usuário.

### **Interface Responsiva**
- Design adaptado para dispositivos móveis e desktops.
- Componentes acessíveis e estilizados com TailwindCSS e Radix UI.



## **Como Executar o Projeto** 🏃‍♂️

### **Pré-requisitos**
- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- A Api utilizada foi a disponibizada por vocês

### **Passos**
1. Clone o repositório:
   ```bash
   git clone https://github.com/bc-fullstack-06/Jober-Junior-de-Moura-Pinto.git
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
     ```env
     VITE_API_URL=http://localhost:3000
     ```

4. Execute o projeto:
   ```bash
   npm run dev
   ```

5. Acesse a aplicação:
   - URL: [http://localhost:3000](http://localhost:3000)

---
