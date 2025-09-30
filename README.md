## 🚀 Tecnologias

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

-   **React**: Biblioteca JavaScript para criar interfaces de usuário.
-   **Vite**: Ferramenta de build que oferece uma experiência de desenvolvimento rápida.
-   **TypeScript**: Linguagem de programação.

## ⚙️ Pré-requisitos

Antes de começar, você precisará ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

Recomendamos o uso de um gerenciador de pacotes como o [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/).

## 💻 Instalação

Siga os passos abaixo para clonar e executar o projeto em sua máquina local:

1.  **Clone o repositório:**

    ```bash
    git clone [https://aws.amazon.com/pt/what-is/repo/](https://aws.amazon.com/pt/what-is/repo/)
    ```

2.  **Navegue até o diretório do projeto:**

    ```bash
    cd [nome-do-diretorio-do-projeto]
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    # ou yarn install
    # ou pnpm install
    ```

4.  **Inicie a aplicação em modo de desenvolvimento:**

    ```bash
    npm run dev
    # ou yarn dev
    # ou pnpm dev
    ```

    A aplicação estará disponível em `http://localhost:5173`.

5. **Teste da Aplicação**

    Para testar a aplicação juntamente com o back é necessario rodar ambos e no arquivo src/Home/FileUploadComponent.jsx na linha 121 substituir a URL por "http://127.0.0.1:8000/classify_file"