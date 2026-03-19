# Dimittens 🌿
> **Plataforma Full-Stack de Intermediação e Suporte Psicológico**

O **Dimittens** é um ecossistema digital robusto projetado para conectar pacientes e profissionais da saúde mental. O projeto foca em segurança, gestão de agenda e uma experiência de usuário fluida, garantindo que o suporte terapêutico esteja a apenas alguns cliques de distância.

---

## 🛠️ Stack Tecnológica

- **Backend:** Node.js com Express.js
- **Banco de Dados:** MySQL (Hospedado via Clever Cloud)
- **Frontend:** EJS, CSS e JavaScript
- **Gestão de Sessões:** Express-Session com persistência em banco de dados.
- **Segurança:** Criptografia de senhas com BCrypt.

---

## 🗄️ Arquitetura do Banco de Dados

O coração do Dimittens é um banco de dados relacional altamente estruturado. A modelagem permite um controle granular sobre diferentes fluxos do sistema:

### Entidades Principais:
- **USUARIO:** Tabela central com suporte a polimorfismo (Comum, Psicologo, Menor de Idade, Admin).
- **PSICOLOGO:** Extensão da tabela usuário contendo dados específicos como CRP, Especialidade e Valor de Consulta.
- **CALENDARIO & CONSULTAS:** Lógica complexa para gestão de horários, eventos e status de agendamento (Agendada, Realizada, Cancelada).
- **SESSIONS:** Implementação de persistência de sessão em nível de banco de dados para maior segurança e controle de engajamento.

### Relacionamentos e Integridade:
- Uso rigoroso de **Chaves Estrangeiras (FKs)** para garantir a integridade referencial entre usuários, assinaturas de planos e agendamentos.
- Implementação de **Enums** para padronização de status (ex: status da consulta, tipo de usuário).

---

## 🌟 Destaques Técnicos

### 1. Sistema de Autenticação e Autorização
Fui responsável por garantir que o fluxo de **Cadastro e Login** funcionasse perfeitamente. Isso incluiu:
- Persistência correta dos dados após validações complexas.
- Diferenciação de permissões (RBAC - Role Based Access Control) para que um paciente não acesse o painel do administrador.

### 2. Gestão de Disponibilidade
O sistema permite que psicólogos marquem dias e horários disponíveis, que são refletidos em tempo real para o agendamento do paciente, utilizando uma lógica de cruzamento de dados na tabela `CALENDARIO`.

### 3. Painel Administrativo (BI)
Monitoramento de métricas como taxa de comparecimento, gestão de denúncias e controle de cupons/assinaturas, permitindo uma visão macro da saúde do negócio.

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/PedroVisan/TCC-Dimittens.git](https://github.com/PedroVisan/TCC-Dimittens.git)
