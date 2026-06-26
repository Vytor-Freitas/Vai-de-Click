# Vai de Click — Redesign do Hub + Páginas de Categoria

**Data:** 2026-06-26
**Atualizado:** 2026-06-26 (revisão 2 — integração com API Divulga Links)
**Status:** Aprovado para implementação

---

## 1. Visão Geral

Redesign completo do Vai de Click: hub principal (`index.html`) com visual de portal de ofertas e páginas de categoria customizadas (`categoria.html`) com produtos reais da API Divulga Links.

Um proxy serverless em Vercel (`api/produtos.js`) protege o token da API. O browser chama `/api/produtos` — nunca a Divulga Links diretamente. Hospedagem em Vercel (já existente).

---

## 2. Escopo

### Incluído
- Redesign completo do `index.html` com gradiente vermelho → roxo
- Proxy serverless Vercel (`api/produtos.js`) protegendo o token
- Página de categoria reutilizável (`categoria.html`) com produtos reais
- Seção "Destaques por Categoria" no hub (2-3 produtos por categoria via API)
- Arquivo de configuração de categorias (`js/config.js`)
- `vercel.json` com headers CORS e cache

### Excluído
- Backend além do proxy (sem banco de dados, sem CMS)
- Autenticação de usuários
- Sistema de carrinho ou checkout
- Filtros por subcategoria ou loja afiliada nas páginas de categoria

---

## 3. Estrutura de Arquivos

```
/
├── index.html          Hub principal
├── categoria.html      Página de categoria reutilizável
├── api/
│   └── produtos.js     Proxy Vercel (Node.js serverless)
├── js/
│   ├── config.js       Mapeamento: slug → params API (usuário configura)
│   ├── hub.js          Carrega destaques por categoria no hub
│   └── categoria.js    Carrega produtos, busca, ordenação e paginação
├── logo.jpeg           Comprimir para ≤ 150 KB
└── vercel.json         Headers CORS e cache
```

---

## 4. Paleta de Cores

| Token | Valor | Uso |
|---|---|---|
| `vdc-red` | `#E62429` | Cor primária, início do gradiente |
| `vdc-purple` | `#7B2FBE` | Cor secundária, fim do gradiente |
| `vdc-gradient` | `linear-gradient(90deg, #E62429, #7B2FBE)` | Navbar, botões de ação |
| `vdc-gradient-hero` | `linear-gradient(135deg, #E62429 0%, #7B2FBE 100%)` | Hero banner |
| `vdc-whatsapp` | `#25D366` | Elementos de WhatsApp |
| `vdc-instagram` | `linear-gradient(45deg, #833AB4, #fd1d1d, #fcb045)` | Elementos de Instagram |
| `vdc-bg` | `#f7f7f7` | Fundo geral |
| `vdc-card` | `#FFFFFF` | Fundo dos cards |
| `vdc-text` | `#111111` | Texto principal |
| `vdc-muted` | `#888888` | Texto secundário |

---

## 5. Tipografia

- **Títulos:** Montserrat Black (peso 900) — via Google Fonts
- **Corpo:** Inter (pesos 400, 500, 700) — via Google Fonts
- **Tamanho base mobile:** 14–16px

---

## 6. API Proxy (`api/produtos.js`)

Vercel serverless function. Aceita `POST` com body JSON, repassa para a API Divulga Links e devolve a resposta.

**Endpoint exposto:** `POST /api/produtos`

**Body aceito (todos opcionais):**
```json
{
  "loja": "shopee",
  "categorias": [123, 456],
  "ordenacao": "updated_at",
  "page": 1,
  "buscar": "tênis"
}
```

**Valores válidos de `ordenacao`:** `updated_at`, `title:asc`, `title:desc`, `price_value:asc`, `price_value:desc`, `vendas:asc`, `vendas:desc`

**Implementação:**
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const token = process.env.DIVULGALINKS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Token não configurado' });
  }
  try {
    const upstream = await fetch('https://pro.divulgalinks.com.br/api/wp', {
      method: 'POST',
      headers: {
        'apiKey': token,
        'X-Requested-From': process.env.SITE_URL || 'https://vaideclick.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Upstream error' });
  }
}
```

**Variáveis de ambiente Vercel (configurar no painel):**
- `DIVULGALINKS_TOKEN` — token da conta Divulga Links
- `SITE_URL` — ex: `https://vaideclick.com`

---

## 7. Configuração de Categorias (`js/config.js`)

Mapeamento de slug de categoria para parâmetros da API. O usuário preenche os `categorias` (IDs do Divulga Links) após consultar o endpoint `/api/categorias`.

```javascript
window.VDC_CONFIG = {
  categorias: {
    eletronicos: {
      nome: 'Eletrônicos',
      icone: '💻',
      categorias: [], // preencher com IDs do Divulga Links
    },
    casa: {
      nome: 'Casa & Decor',
      icone: '🏠',
      categorias: [],
    },
    moda: {
      nome: 'Moda',
      icone: '👗',
      categorias: [],
    },
    calcados: {
      nome: 'Calçados',
      icone: '👟',
      categorias: [],
    },
    pet: {
      nome: 'Mundo Pet',
      icone: '🐾',
      categorias: [],
    },
  }
};
```

**Como obter os IDs:** Fazer uma chamada `POST /api/produtos` com body `{}` para ver todos os produtos e suas categorias, ou chamar diretamente a API de categorias.

---

## 8. Hub Principal (`index.html`)

Mobile-first, `max-w-sm` (384px) centralizado, scroll vertical.

### 8.1 Navbar
- Fundo: `vdc-gradient` horizontal, `position: sticky; top: 0; z-index: 50`
- Esquerda: logo (`logo.jpeg` 32×32px, border-radius 8px) + "VAI DE CLICK" + "Ofertas & Descontos"
- Direita: ícone Instagram → `https://www.instagram.com/vai_declick/` + ícone WhatsApp → scroll para `#grupos-vip`

### 8.2 Hero Banner
- Fundo: `vdc-gradient-hero`
- Badge pulsante: "🔥 NOVIDADES TODO DIA"
- Título: "As melhores ofertas estão aqui!" (Montserrat Black, 22px, branco)
- Subtítulo: "Grupos exclusivos, lojas selecionadas e muito desconto 💸"
- CTA primário (branco, texto vermelho): "📱 Grupos VIP" → scroll `#grupos-vip`
- CTA secundário (transparente, borda branca): "🛍️ Ver Lojas" → scroll `#nossas-lojas`
- Ícone decorativo: `🛍️` grande, opacidade 8%

### 8.3 Barra de Categorias
- Chips scrolláveis horizontais, sem scrollbar visível
- Chips: "🌟 Todos", "💻 Eletrônicos", "🏠 Casa", "👗 Moda", "👟 Calçados", "🐾 Pet"
- "Todos" começa ativo (gradiente vermelho→roxo). Demais: fundo `#f5f5f5`, texto cinza
- Clique em chip de categoria: scroll suave até `#destaque-<slug>` na seção de destaques, marca chip como ativo
- Clique em "Todos": scroll até `#nossas-lojas`, todos chips ficam inativos exceto "Todos"

### 8.4 Grid de Lojas ("Nossas Lojas")
- Título: "Nossas Lojas" com barra vertical gradiente
- Grid 3 colunas, 5 cards + 1 "Em breve"
- Cada card: ícone, nome, descrição, botão "VER LOJA →" que leva para `categoria.html?cat=<slug>`

| Categoria | Ícone | Slug | URL |
|---|---|---|---|
| Eletrônicos | 💻 | `eletronicos` | `categoria.html?cat=eletronicos` |
| Casa & Decor | 🏠 | `casa` | `categoria.html?cat=casa` |
| Moda | 👗 | `moda` | `categoria.html?cat=moda` |
| Calçados | 👟 | `calcados` | `categoria.html?cat=calcados` |
| Mundo Pet | 🐾 | `pet` | `categoria.html?cat=pet` |
| Em breve | 🛍️ | — | botão desabilitado (`#e5e7eb` / `#9ca3af`, cursor `not-allowed`) |

### 8.5 Destaques por Categoria (novo — API-driven)
- Título: "Ofertas em Destaque" com barra vertical gradiente
- Para cada categoria: linha com título da categoria + link "Ver todos →" (→ `categoria.html?cat=<slug>`) + scroll horizontal de 3 cards de produto
- Estado de carregamento: 3 skeleton cards (retângulos animados com pulse)
- Estado de erro: mensagem discreta "Não foi possível carregar"
- **Card de produto:**
  - Imagem quadrada 80×80px (object-cover, border-radius 8px), fallback emoji da categoria
  - Nome do produto (max 2 linhas, text-overflow ellipsis), 10px
  - Preço em vermelho bold, 12px
  - Preço antigo riscado (se disponível), 9px
  - Botão "VER OFERTA" → abre link afiliado em `target="_blank"`
- JS: ao carregar a página, `hub.js` chama `POST /api/produtos` para cada categoria com `page=1` e retorna até 3 produtos

### 8.6 Grupos VIP — WhatsApp
- Título: "Grupos VIP — WhatsApp" com barra vertical verde
- Banner gradiente verde escuro (`#075E54` → `#128C7E`)
- Grid 2 colunas de mini-cards, Pet ocupa 2 colunas

| Grupo | Link |
|---|---|
| Eletrônicos | `https://chat.whatsapp.com/LsBOhJUu09UG7BlNX1GhSZ` |
| Casa & Decor | `https://chat.whatsapp.com/H1V5sXKL4Ji0a93yAvAuZ7` |
| Moda Unissex | `https://chat.whatsapp.com/Ea3wnpLDL7GL4XDZZticoa` |
| Calçados | `https://chat.whatsapp.com/HMocwTuu24jFri5qwUeixT` |
| Mundo Pet | `https://chat.whatsapp.com/JQUj9ixaXBa4i71fm5Wbnq` |

### 8.7 Redes Sociais
- Card Instagram com fundo `vdc-instagram` → `https://www.instagram.com/vai_declick/`

### 8.8 Footer
- Fundo `#111`, texto "© 2026 Vai de Click · Todos os direitos reservados", branco 40% opacidade

---

## 9. Página de Categoria (`categoria.html`)

Lê `?cat=<slug>` da URL. Busca configuração em `window.VDC_CONFIG.categorias[slug]`.

### 9.1 Navbar
Igual ao hub (mesmo código copiado).

### 9.2 Hero Compacto
- Fundo: `vdc-gradient-hero` (mais baixo que o hub, padding vertical menor)
- Ícone da categoria (emoji, 32px)
- Título: nome da categoria (Montserrat Black, 20px, branco)
- Subtítulo: "Todas as ofertas de \<nome\>"
- Botão "← Voltar" → `index.html`

### 9.3 Produtos em Destaque
- Título: "Destaques" com barra gradiente
- Linha horizontal de 3 cards de produto (mesmos cards do hub, tamanho maior)
- Carregado com `page=1`, `ordenacao=updated_at`, primeiros 3 resultados

### 9.4 Barra de Filtros
- Fundo branco, sticky abaixo da navbar
- Campo de busca (placeholder "Buscar produtos...") com debounce de 400ms
- Select de ordenação: "Mais recentes", "Menor preço", "Maior preço"

Valores do select → `ordenacao`:
```
Mais recentes   → updated_at
Menor preço     → price_value:asc
Maior preço     → price_value:desc
```

### 9.5 Grade de Produtos
- Grid 2 colunas (mobile)
- Cada card: imagem, nome (2 linhas), preço, preço antigo, botão "VER OFERTA"
- Skeleton loading enquanto carrega

### 9.6 Paginação
- Botões "← Anterior" e "Próxima →" abaixo do grid
- Scroll para topo da grade ao mudar de página
- Contador: "Página X"
- Ocultar "← Anterior" na página 1. Ocultar "Próxima →" se a resposta retornar menos de 20 produtos (limite por página assumido: 20)

---

## 10. Comportamento JS

### `js/hub.js`
- `DOMContentLoaded` → para cada slug em `VDC_CONFIG.categorias`: `POST /api/produtos` com `{ categorias: config.categorias, page: 1 }`, renderiza 3 cards no container `#destaque-<slug>`
- Calls em paralelo via `Promise.all`

### `js/categoria.js`
- Lê slug da URL (`URLSearchParams`)
- Carrega configuração da categoria via `window.VDC_CONFIG`
- `carregarProdutos(params)`: `POST /api/produtos`, renderiza destaques (primeiros 3) e grade (resto)
- Busca: listener `input` com debounce 400ms, chama `carregarProdutos` com `buscar`
- Ordenação: listener `change`, chama `carregarProdutos` com `ordenacao`
- Paginação: mantém `paginaAtual` em memória, botões atualizam e chamam `carregarProdutos`

### `js/config.js`
- Define `window.VDC_CONFIG` (carregado antes de `hub.js` e `categoria.js`)

---

## 11. `vercel.json`

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "POST, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
      ]
    }
  ]
}
```

---

## 12. Performance

- Comprimir `logo.jpeg` de ~4.5 MB para ≤ 150 KB (squoosh.app ou similar)
- Tailwind via CDN (aceitável para este porte)
- Cache de 10 min no proxy (`s-maxage=600`)
- Imagens de produto: `loading="lazy"` + fallback emoji se erro de carregamento
