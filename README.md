# 🔗 URL Short API

Uma API RESTful construída com o **NestJS** e focada em escalabilidade, tipagem forte e documentação automatizada.

---

## 🚀 Tecnologias e Ferramentas

* **Framework:** [NestJS] (TypeScript)
* **ORM:** [Prisma]
* **Banco de Dados:** [PostgreSQL]
* **Documentação:** [Swagger/OpenAPI]
* **Containerização:** [Docker] & Docker Compose
* **Validação:** Class-Validator & DTOs
* **Testes:** Jest & Supertest (Unitários e E2E)

---

## 🛠️ Funcionalidades

* **Encurtamento de URLs:** Geração de códigos únicos para URLs longas.
* **Estatísticas em Tempo Real:** Contabilização automática de acessos ao recuperar a URL original.
* **Gestão Completa (CRUD):** Endpoints para criar, buscar, atualizar e deletar URLs.
* **Validação de Dados:** Uso de DTOs para garantir que apenas dados válidos entrem no sistema.
* **Documentação Interativa:** Interface Swagger para testar a API diretamente pelo navegador.
* **Qualidade de Código:** Suíte completa de testes unitários e de integração (E2E).

---

## 🚦 Como Executar o Projeto

### 🐳 Via Docker

Certifique-se de ter o **Docker** e o **Docker Compose** instalados em sua máquina.

1.  **Clone o repositório:**
    ```bash
    git clone <repo>
    cd api-url-short
    ```

2.  **Suba a aplicação:**
    ```bash
    docker compose up --build
    ```

3.  **Acesse:**
    * **API:** [http://localhost:3000/api](http://localhost:3000/api)
    * **Swagger (Documentação):** [http://localhost:3000/docs](http://localhost:3000/docs)

---

### 💻 Execução Local

Caso prefira rodar sem o container da aplicação:

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Configure as variáveis de ambiente:**
    ```bash
    cp .env.example .env
    ```

3.  **Suba apenas o banco de dados:**
    ```bash
    docker compose up -d postgres
    ```

4.  **Prepare o Banco de Dados (Migrations):**
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

5.  **Inicie a aplicação:**
    ```bash
    npm run start:dev
    ```

---

## 📑 Endpoints da API

| Método   | Endpoint                        | Descrição                                  |
| :------- | :------------------------------ | :----------------------------------------- |
| `POST`   | `/api/shorten`                  | Cria uma nova URL encurtada                |
| `GET`    | `/api/shorten/:shortCode`       | Busca a URL original e contabiliza acesso  |
| `PUT`    | `/api/shorten/:shortCode`       | Atualiza o destino de uma URL encurtada    |
| `DELETE` | `/api/shorten/:shortCode`       | Remove uma URL encurtada do sistema        |
| `GET`    | `/api/shorten/:shortCode/stats` | Obtém detalhes e estatísticas de acesso    |

---

## 🧪 Testes

```bash
# Testes Unitários
npm run test

# Testes End-to-End (E2E)
npm run test:e2e