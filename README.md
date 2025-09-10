# Lulômetro - Avaliação do Presidente Lula

Gráfico interativo de avaliação do Presidente Lula (05-Jul a 20-Aug) — dados Antagonista/Real Time Big Data.

## Funcionalidades

- Visualização interativa dos dados de aprovação do Presidente Lula
- Exportação de gráficos em PNG
- Exportação de dados em CSV
- Legendas interativas (mostrar/ocultar séries)
- Design responsivo para dispositivos móveis
- Modo offline (PWA)

## Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis CSS)
- JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/)
- Google Fonts (Inter)

## Estrutura do Projeto

```
.
├── index.html          # Página principal
├── styles.css          # Estilos da aplicação
├── chart.js            # Lógica do gráfico e interações
├── service-worker.js   # Service worker para PWA
├── manifest.json       # Manifesto para PWA
├── package.json        # Configuração do projeto e dependências
└── README.md           # Este arquivo
```

## Como Executar

### Desenvolvimento

1. Clone o repositório
2. Abra `index.html` diretamente no navegador

OU

1. Instale as dependências: `npm install`
2. Inicie o servidor de desenvolvimento: `npm start`
3. Acesse `http://localhost:3000`

### Build para produção

```bash
npm run build
```

Este comando irá:
- Minificar o JavaScript usando Terser
- Minificar o CSS usando CSSO

## Personalização

### Dados

Os dados do gráfico estão definidos no arquivo `chart.js` na variável `raw`. Você pode atualizar os valores para refletir novos dados.

### Cores

As cores do gráfico e da interface podem ser personalizadas alterando as variáveis CSS no início do arquivo `styles.css`:

```css
:root{
  --bg:#0f1724; /* deep slate */
  --card:#0b1220;
  --muted:#9aa4b2;
  --accent1:#ef476f; /* ruim/péssimo */
  --accent2:#ffd166; /* regular */
  --accent3:#06d6a0; /* ótimo/bom */
  --glass: rgba(255,255,255,0.03);
}
```

## Acessibilidade

O projeto foi desenvolvido com foco em acessibilidade:

- Navegação por teclado
- Rótulos ARIA para leitores de tela
- Contraste adequado de cores
- Tamanho de fonte responsivo

## Licença

MIT

## Autor

Vitor de Lucca