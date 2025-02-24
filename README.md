# Medicar - Sistema de Gerenciamento de Consultas Médicas

## Descrição

O **Medicar** é uma solução completa para o gerenciamento de consultas médicas. Ideal para clínicas, consultórios ou profissionais de saúde que desejam automatizar processos de agendamento, cadastro e análise de dados médicos. A aplicação é composta por um backend robusto em Node.js e um frontend moderno em React, garantindo uma experiência de uso eficiente e responsiva.

---

## Funcionalidades

- **Gestão de Especialistas**: Cadastro, edição e exclusão de especialistas médicos.
- **Gestão de Consultas**: Criação e gerenciamento de consultas médicas com controle de datas, horários e disponibilidade.
- **Cadastro de Pacientes**: Registro e gerenciamento de informações pessoais e médicas de pacientes.
- **Relatórios e Análises**: Visualização de dados consolidados para suporte na tomada de decisões clínicas.

---

## Tecnologias Utilizadas

### Backend:

- **Node.js**: Ambiente de execução para o JavaScript.
- **TypeScript**: Adiciona tipagem estática ao JavaScript.
- **Express**: Framework minimalista para criação de APIs.
- **TypeORM**: Ferramenta para manipulação de banco de dados.
- **PostgreSQL**: Banco de dados relacional.

### Frontend:

- **React**: Biblioteca para construção de interfaces interativas.
- **Styled-Components**: Estilo dinâmico usando CSS-in-JS.
- **React Router**: Navegação entre páginas.

### Outras Ferramentas:

- **Docker**: Contêineres para padronizar ambientes.
- **ESLint/Prettier**: Linting e formatação de código.
- **Jest**: Framework de testes para garantir a qualidade do backend.

---

## Estrutura do Banco de Dados

Cada tabela no banco de dados desempenha um papel importante no sistema:

### Tabelas:

- **speciality**: Armazena as especialidades médicas disponíveis.

  - `id`, `name`, `description`.

- **doctor**: Gerencia os especialistas cadastrados.

  - `id`, `name`, `crm`, `email`, `phone`, `speciality_id`, `password`.

- **schedule**: Organiza os horários disponíveis.

  - `id`, `date`, `doctor_id`.

- **schedule_time**: Detalha os intervalos de horários para consultas.

  - `id`, `time`, `is_available`, `schedule_id`.

- **account_user**: Registra os usuários do sistema.

  - `id`, `name`, `email`, `password`, `is_admin`, `last_login`, `created_at`, `updated_at`.

- **appointment**: Registra as consultas agendadas.

  - `id`, `user_id`, `schedule_id`, `time`, `created_at`, `updated_at`, `deleted_at`, `observation`.

- **doctor_schedules**: Define os horários de trabalho dos especialistas.

  - `id`, `doctor_id`, `weekday`, `start_time`, `end_time`, `created_at`, `updated_at`, `deleted_at`.

- **Tabela: anamnesis**
  - `id`, `appointment_id` , `description` , `created_at` , `updated_at` , `deleted_at`

---

## Como Rodar o Projeto

### Requisitos

- **Node.js**: Versão 16 ou superior
- **NPM/Yarn**: Gerenciador de pacotes
- **Docker**: Para facilitar a configuração
- **PostgreSQL**: Para o banco de dados

### Passos para Execução

#### Backend:

1. Navegue até a pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o banco de dados no arquivo .env com as credenciais apropriadas.
4. Execute as migrações:
   ```bash
   npm run typeorm migration:run
   ```
5. Inicie o servidor:
   ```bash
   npm run dev:server
   ```

#### Frontend:

1. Navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
    npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Acesse a aplicação em `http://localhost:3000`.
