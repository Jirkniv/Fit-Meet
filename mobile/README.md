# 📱 **Fitmeet Mobile**

Bem-vindo ao **Fitmeet Mobile**, a aplicação mobile do projeto **Fitmeet**, uma plataforma que conecta pessoas por meio de atividades físicas e eventos esportivos. Este aplicativo foi desenvolvido para proporcionar uma experiência fluida e intuitiva, permitindo que os usuários explorem, participem e gerenciem atividades diretamente de seus dispositivos móveis.

---

## 🎯 **Tema do Projeto**

O **Fitmeet** é uma plataforma que promove um estilo de vida saudável e colaborativo, conectando pessoas por meio de atividades físicas e eventos esportivos. Com funcionalidades como inscrição em atividades, gerenciamento de preferências e conquistas, o aplicativo incentiva a interação social e a prática de esportes.

---

## 🛠️ **Principais Tecnologias e Bibliotecas**

### **Tecnologias Utilizadas**
- **React Native**: Biblioteca para construção de interfaces de usuário nativas.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática ao código.
- **Axios**: Para realizar chamadas HTTP e comunicação com a API.
- **React Navigation**: Gerenciamento de rotas e navegação no aplicativo.
- **React Native Keychain**: Gerenciamento seguro de credenciais.
- **React Native Maps**: Renderização de mapas interativos.
- **React Native Toast Message**: Exibição de notificações e mensagens de feedback.
- **Phosphor Icons**: Ícones modernos e personalizáveis para a interface.

---

## ✅ **Boas Práticas e Metodologias**

### **Boas Práticas**
- **Componentização**: Componentes reutilizáveis e bem estruturados para facilitar a manutenção e escalabilidade.
- **Gerenciamento de Estado com Context API**: Estados globais organizados para melhorar a consistência e reduzir a complexidade.
- **Validação de Dados**: Uso de validações para garantir a integridade dos dados do usuário.
- **Responsividade**: Interface adaptada para diferentes tamanhos de tela.
- **Segurança**:
  - Armazenamento seguro de credenciais com **React Native Keychain**.
  - Autenticação JWT para proteger rotas e dados sensíveis.

### **Metodologias**
- **Clean Code**: Código limpo e legível, com nomes de variáveis e funções descritivos.
- **DRY (Don't Repeat Yourself)**: Reutilização de lógica e componentes para evitar duplicação de código.
- **KISS (Keep It Simple, Stupid)**: Soluções simples e diretas para problemas complexos.
- **Atomic Design**: Organização dos componentes em níveis (átomos, moléculas, organismos) para facilitar a escalabilidade.

---

## 🚀 **Como Inicializar o Projeto no Android**

### **Pré-requisitos**
- Node.js (versão 18 ou superior)
- Android Studio (com emulador configurado)
- Java Development Kit (JDK) 11 ou superior
- React Native CLI

### **Passos para Inicialização**

1. Clone o Repositório:
   - `git clone https://github.com/bc-fullstack-06/Jober-Junior-de-Moura-Pinto.git`
   - `cd mobile`

2. Instale as Dependências:
   - `npm install`

3. Configure as Variáveis de Ambiente:
   - Crie um arquivo `.env` na raiz do projeto com a seguinte configuração:
     - `API_URL=http://10.0.2.2:3000`

###### 4. Inicie o container da Api para ter acesso aos dados

   Para poder utilizar o mapa você precisará de sua propria Key do google maps, e inseri-la em:

   ```
   Path/Jober-Junior-de-Moura-Pinto/mobile/android/app/src/main/AndroidManifest.xml 

   <meta-data android:name="com.google.android.geo.API_KEY" android:value="SUA-KEY"/>
   ```

5. Inicie o Metro Bundler:
   - Em um terminal, execute: `npm start`

6. Execute o Projeto no Android:
   - Em outro terminal, execute: `npm run android`

7. Acesse o Aplicativo:
   - O aplicativo será iniciado no emulador Android ou em um dispositivo físico conectado.

---

## ✨ **Funcionalidades Principais**

- **Autenticação e Gerenciamento de Usuários**:
  - Login e registro de usuários.
  - Atualização de perfil e upload de avatar.
  - Definição de preferências de atividades.

- **Exploração de Atividades**:
  - Visualização de atividades por categoria.
  - Inscrição e cancelamento em atividades.
  - Aprovação de participantes (para organizadores).

- **Sistema de Recompensas**:
  - Exibição de conquistas e níveis no perfil do usuário.

- **Mapa Interativo**:
  - Localização de atividades no mapa.

---


## ⚠️ Observações Importantes:
###### 👾Estado geral do projeto
O projeto foi desenvolvido com bastante dedicação e acredito ter conseguido entregar uma solução completa. Apesar de alguns erros e ajustes pontuais, todas as funcionalidades principais foram implementadas com sucesso. Pode ser que algumas abordagens não sejam as mais otimizadas, mas o funcionamento geral foi garantido.


###### 🛑 Limitações
Devido a limitações de hardware, desenvolvi o projeto diretamente no meu celular durante a maior parte do tempo. Somente ao final fiz ajustes para compatibilidade com o emulador. Como resultado, a base dos estilos foi pensada para a tela do meu aparelho, que é relativamente pequena — o que pode causar diferenças no espaçamento ou tamanho de alguns elementos em dispositivos maiores.


###### 📁 Problemas com Caminho Muito Longo no Windows
- Dependendo do local onde você clonar o repositorio você pode acabar se deparando com o erro: 
 
 ```
 The object file directory /*PATH*/ has xxx characters.
The maximum full path to an object file is 250 characters.
 Object file react/renderer/components/rngesturehandler_codegen/States.cpp.o cannot be
safely placed under this directory. The build may not work correctly.
```
- Resolva fazendo os seguintes passos:
1. Mapeia o caminho longo como drive M:
```  
subst M: "C:\SEU-PATH\Jober-Junior-de-Moura-Pinto\mobile"
```
  2. Agora abra o projeto a partir de M:
```
cd M:
```
3. Execute normalmente os comandos a partir desse novo caminho.

❌ Bugs

Possivelmente no primeiro login os tipos de atividades não irão aparecer e não será possivel fazer muita coisa, mas depois de explorar um pouco app ele aparece e as coisas voltam ao normal.

Para que alguns botôes atualizem pode ser neçessario ir para outra pagina e voltar.

---

