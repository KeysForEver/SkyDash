# SkyDash 🚀

**SkyDash** é um dashboard em tempo real desenvolvido especificamente para exibição em TVs. Ele fornece uma visão clara e organizada do status de fabricação, instalações e cronograma de serviços, permitindo um acompanhamento ágil e visual da operação.

## ✨ Funcionalidades

- **📅 Calendário de Instalações**: Visualização de 3 meses (anterior, atual e próximo) com indicadores de status coloridos:
  - 🔴 **Vermelho**: Atrasado (Pendente com data passada).
  - 🟡 **Amarelo**: Em andamento ou Pendente futuro.
  - 🟢 **Verde**: Concluído.
- **📊 Gráficos de Desempenho**: Insights visuais sobre a distribuição de serviços e status de fabricação usando Recharts.
- **📋 Tabela de Serviços**: Listagem detalhada de todos os serviços ativos, integrando dados de fabricação e instalação.
- **📂 Integração com Excel**: O sistema lê automaticamente os dados de um arquivo Excel (`SERVIÇOS 22.xlsx`), facilitando a atualização das informações.
- **📺 Otimizado para TV**: Layout responsivo de 3 colunas verticais que maximiza o espaço da tela, ideal para monitoramento contínuo.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, Vite, Tailwind CSS, Recharts, Lucide Icons, date-fns.
- **Backend**: Express.js, tsx.
- **Manipulação de Dados**: XLSX (SheetJS).

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- npm (geralmente instalado com o Node.js)

### Passos para Instalação

1. **Clone o repositório** (ou baixe os arquivos):
   ```bash
   git clone <url-do-repositorio>
   cd skydash
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**:
   Abra [http://localhost:3000](http://localhost:3000) para visualizar o dashboard.

## 📂 Estrutura de Dados

O projeto espera um arquivo `.xlsx` na raiz do diretório com as seguintes colunas:
- `SERVIÇOS`: Nome do serviço/projeto.
- `STATUS FABRICAÇÃO`: Status atual da produção.
- `STATUS INSTALAÇÃO`: Status da instalação (PENDENTE, EM ANDAMENTO, CONCLUÍDO).
- `DATA INSTALAÇÃO`: Data prevista no formato YYYY-MM-DD.

---
Desenvolvido para facilitar a gestão visual de serviços. 🛠️
