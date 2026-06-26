# Hub Redesign + Categoria API — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o Vai de Click num portal de ofertas completo: hub redesenhado com produtos reais da API Divulga Links e páginas de categoria com busca, ordenação e paginação — tudo com proxy Vercel protegendo o token da API.

**Architecture:** Hub (`index.html`) + proxy serverless Vercel (`api/produtos.js`) + configuração de categorias (`js/config.js`) + página de categoria reutilizável (`categoria.html`). O browser nunca chama a Divulga Links diretamente — toda chamada passa por `/api/produtos`. Hospedagem em Vercel (já existente). Zero build step; todos os estilos via Tailwind CDN.

**Tech Stack:** HTML5, Tailwind CSS 3 (CDN), Font Awesome 6.4 (CDN), Google Fonts (Montserrat + Inter), JavaScript ES5/ES6 vanilla, Vercel Serverless Functions (Node.js runtime)

## Global Constraints

- Mobile-first, `max-w-sm` (384px) centralizado
- Gradiente primário: `linear-gradient(90deg, #E62429, #7B2FBE)`
- Gradiente hero: `linear-gradient(135deg, #E62429 0%, #7B2FBE 100%)`
- Fundo geral: `#f7f7f7`
- Todos os links externos com `target="_blank" rel="noopener noreferrer"`
- Commits no formato Conventional Commits (`feat:`, `style:`, `fix:`, `perf:`)
- Nunca use co-autor nos commits
- Token da API em variável de ambiente Vercel: `DIVULGALINKS_TOKEN`
- URL do site em variável de ambiente: `SITE_URL` (ex: `https://vaideclick.com`)
- Cards de loja no hub linkam para `categoria.html?cat=<slug>` (não para subdomínios externos)

---

## Mapeamento de Arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `index.html` | Reescrever | Hub principal |
| `categoria.html` | Criar | Página de categoria reutilizável |
| `api/produtos.js` | Criar | Proxy Vercel para API Divulga Links |
| `js/config.js` | Criar | Mapeamento slug → params API |
| `js/hub.js` | Criar | Fetch e render dos destaques no hub |
| `js/categoria.js` | Criar | Fetch, busca, ordenação e paginação na categoria |
| `vercel.json` | Criar | Headers CORS para `/api/*` |
| `logo.jpeg` | Comprimir | Reduzir de ~4.5 MB para ≤ 150 KB |

---

## Task 1: Scaffold — Estrutura de Arquivos

**Files:**
- Create: `api/produtos.js`, `js/config.js`, `js/hub.js`, `js/categoria.js`, `categoria.html`, `vercel.json`
- Modify: `index.html` (reescrever)

**Interfaces:**
- Produces: estrutura de arquivos completa com stubs. `index.html` carrega sem erros no browser com config Tailwind e fontes. Comentários HTML marcam onde cada task seguinte insere conteúdo.

- [ ] **Step 1: Criar pastas e arquivos stub**

```bash
mkdir -p api js
touch api/produtos.js js/config.js js/hub.js js/categoria.js
```

- [ ] **Step 2: Criar vercel.json**

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

- [ ] **Step 3: Reescrever index.html com scaffold**

Substitua TODO o conteúdo de `index.html` por:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Vai de Click — Ofertas e Descontos Todo Dia</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Montserrat:wght@800;900&display=swap" rel="stylesheet">

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            heading: ['Montserrat', 'sans-serif'],
          },
          colors: {
            vdc: {
              red:    '#E62429',
              purple: '#7B2FBE',
              bg:     '#f7f7f7',
              card:   '#FFFFFF',
              text:   '#111111',
              muted:  '#888888',
              wa:     '#25D366',
            }
          }
        }
      }
    }
  </script>

  <style>
    ::-webkit-scrollbar { width: 0; background: transparent; }
    .vdc-gradient      { background: linear-gradient(90deg,  #E62429, #7B2FBE); }
    .vdc-gradient-hero { background: linear-gradient(135deg, #E62429 0%, #7B2FBE 100%); }
    .vdc-gradient-ig   { background: linear-gradient(45deg,  #833AB4, #fd1d1d, #fcb045); }
    .chip-active       { background: linear-gradient(90deg, #E62429, #7B2FBE); color: white; }
    .chip-inactive     { background: #f5f5f5; color: #555; }
    .card-btn          { background: linear-gradient(90deg, #E62429, #7B2FBE); }
    .section-bar       { width: 3px; border-radius: 2px;
                         background: linear-gradient(180deg, #E62429, #7B2FBE); }
    .section-bar-green { width: 3px; border-radius: 2px; background: #25D366; }
    .line-clamp-2      { display: -webkit-box; -webkit-line-clamp: 2;
                         -webkit-box-orient: vertical; overflow: hidden; }
  </style>
</head>

<body class="bg-vdc-bg antialiased min-h-screen overflow-x-hidden">
  <div class="max-w-sm mx-auto flex flex-col min-h-screen">

    <!-- NAVBAR (Task 4) -->

    <main class="flex-1 flex flex-col">

      <!-- HERO (Task 4) -->

      <!-- CHIPS (Task 4) -->

      <!-- LOJAS (Task 4) -->

      <!-- DESTAQUES (Task 6) -->

      <!-- WHATSAPP (Task 5) -->

      <!-- SOCIAL (Task 5) -->

    </main>

    <!-- FOOTER (Task 5) -->

  </div>

  <script src="js/config.js"></script>
  <script src="js/hub.js"></script>
  <script>
    /* JS chips — Task 5 */
  </script>
</body>
</html>
```

- [ ] **Step 4: Criar categoria.html com scaffold**

Conteúdo de `categoria.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Vai de Click — Categoria</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Montserrat:wght@800;900&display=swap" rel="stylesheet">

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            heading: ['Montserrat', 'sans-serif'],
          },
          colors: {
            vdc: {
              red:    '#E62429',
              purple: '#7B2FBE',
              bg:     '#f7f7f7',
              card:   '#FFFFFF',
              text:   '#111111',
              muted:  '#888888',
            }
          }
        }
      }
    }
  </script>

  <style>
    ::-webkit-scrollbar { width: 0; background: transparent; }
    .vdc-gradient      { background: linear-gradient(90deg,  #E62429, #7B2FBE); }
    .vdc-gradient-hero { background: linear-gradient(135deg, #E62429 0%, #7B2FBE 100%); }
    .card-btn          { background: linear-gradient(90deg, #E62429, #7B2FBE); }
    .section-bar       { width: 3px; border-radius: 2px;
                         background: linear-gradient(180deg, #E62429, #7B2FBE); }
    .line-clamp-2      { display: -webkit-box; -webkit-line-clamp: 2;
                         -webkit-box-orient: vertical; overflow: hidden; }
  </style>
</head>

<body class="bg-vdc-bg antialiased min-h-screen overflow-x-hidden">
  <div class="max-w-sm mx-auto flex flex-col min-h-screen">

    <!-- NAVBAR (Task 8) -->

    <main class="flex-1 flex flex-col">

      <!-- HERO COMPACTO (Task 8) -->

      <!-- FILTROS (Task 8) -->

      <!-- DESTAQUES DA CATEGORIA (Task 8) -->

      <!-- GRADE DE PRODUTOS (Task 8) -->

      <!-- PAGINAÇÃO (Task 8) -->

    </main>

    <!-- FOOTER (Task 8) -->

  </div>

  <script src="js/config.js"></script>
  <script src="js/categoria.js"></script>
</body>
</html>
```

- [ ] **Step 5: Verificar no browser**

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080`. Checar:
- Página carrega sem erros no console
- Fundo `#f7f7f7` visível
- Fonte Inter carregada (inspecionar `body` no DevTools)

- [ ] **Step 6: Commit**

```bash
git add index.html categoria.html api/produtos.js js/config.js js/hub.js js/categoria.js vercel.json
git commit -m "feat: scaffold estrutura de arquivos do hub redesign"
```

---

## Task 2: Proxy API Vercel (`api/produtos.js`)

**Files:**
- Modify: `api/produtos.js`

**Interfaces:**
- Produces: `POST /api/produtos` — aceita body JSON com `{ loja, categorias, ordenacao, page, buscar }`, repassa para `https://pro.divulgalinks.com.br/api/wp` com autenticação via `DIVULGALINKS_TOKEN`, retorna JSON com cache de 10 min

- [ ] **Step 1: Implementar o proxy**

Conteúdo completo de `api/produtos.js`:

```javascript
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.DIVULGALINKS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Token nao configurado' });
  }

  try {
    const upstream = await fetch('https://pro.divulgalinks.com.br/api/wp', {
      method: 'POST',
      headers: {
        'apiKey': token,
        'X-Requested-From': process.env.SITE_URL || 'https://vaideclick.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body || {}),
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Upstream error', status: upstream.status });
    }

    const data = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Falha ao conectar com a API' });
  }
}
```

- [ ] **Step 2: Configurar .env.local para teste local**

```bash
# Criar .env.local com token real (NÃO commitar)
cat > .env.local << 'EOF'
DIVULGALINKS_TOKEN=cole_o_token_aqui
SITE_URL=https://vaideclick.com
EOF

# Garantir que .env.local está no .gitignore
grep -q '\.env\.local' .gitignore || echo '.env.local' >> .gitignore
```

- [ ] **Step 3: Testar com vercel dev**

Se o Vercel CLI estiver instalado:

```bash
vercel dev
```

Em outro terminal:
```bash
curl -s -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{"page": 1}' | head -200
```

Esperado: JSON com lista de produtos (array). Se `vercel` não estiver disponível localmente, testar após deploy.

- [ ] **Step 4: Commit**

```bash
git add api/produtos.js vercel.json .gitignore
git commit -m "feat: proxy Vercel para API Divulga Links em api/produtos.js"
```

---

## Task 3: Configuração de Categorias (`js/config.js`)

**Files:**
- Modify: `js/config.js`

**Interfaces:**
- Produces: `window.VDC_CONFIG.categorias` — objeto global indexado por slug. Cada entrada tem `{ nome: string, icone: string, categorias: number[] }`
- Consumed by: `js/hub.js` (Task 7) e `js/categoria.js` (Task 8)

- [ ] **Step 1: Implementar config.js**

```javascript
window.VDC_CONFIG = {
  categorias: {
    eletronicos: {
      nome: 'Eletrônicos',
      icone: '💻',
      categorias: [],
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

**Nota sobre os IDs de categoria:** O array `categorias` de cada entrada deve conter os IDs de categoria do Divulga Links para filtrar os produtos. Deixar vazio retorna todos os produtos sem filtro. Para descobrir os IDs, fazer uma chamada `POST /api/produtos` com body `{}` e verificar o campo `categoria_id` (ou similar) nos produtos retornados.

- [ ] **Step 2: Verificar no browser console**

Abrir `http://localhost:8080`. No console DevTools:

```javascript
console.log(window.VDC_CONFIG)
// Esperado: { categorias: { eletronicos: {...}, casa: {...}, ... } }
console.log(Object.keys(window.VDC_CONFIG.categorias))
// Esperado: ["eletronicos", "casa", "moda", "calcados", "pet"]
```

- [ ] **Step 3: Commit**

```bash
git add js/config.js
git commit -m "feat: mapeamento de categorias em js/config.js"
```

---

## Task 4: Hub — Navbar, Hero, Chips e Grid de Lojas

**Files:**
- Modify: `index.html` — substituir `<!-- NAVBAR (Task 4) -->`, `<!-- HERO (Task 4) -->`, `<!-- CHIPS (Task 4) -->`, `<!-- LOJAS (Task 4) -->`

**Interfaces:**
- Produces: seções 1-4 do hub visíveis. Chips têm `data-target="#destaque-<slug>"` (apontam para a seção de destaques, Task 6). Cards de loja linkam para `categoria.html?cat=<slug>`.

- [ ] **Step 1: Adicionar navbar**

Substitua `<!-- NAVBAR (Task 4) -->` por:

```html
<nav class="vdc-gradient sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between shadow-lg">
  <div class="flex items-center gap-2.5">
    <div class="w-8 h-8 rounded-lg overflow-hidden border-2 border-white/30 flex-shrink-0">
      <img src="logo.jpeg" alt="Vai de Click" class="w-full h-full object-cover">
    </div>
    <div>
      <p class="font-heading font-black text-white text-sm leading-none tracking-tight">VAI DE CLICK</p>
      <p class="text-white/70 text-[10px] leading-none mt-0.5">Ofertas &amp; Descontos</p>
    </div>
  </div>
  <div class="flex items-center gap-2">
    <a href="https://www.instagram.com/vai_declick/" target="_blank" rel="noopener noreferrer"
       class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
      <i class="fa-brands fa-instagram text-white text-sm"></i>
    </a>
    <a href="#grupos-vip"
       class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
      <i class="fa-brands fa-whatsapp text-white text-sm"></i>
    </a>
  </div>
</nav>
```

- [ ] **Step 2: Adicionar hero**

Substitua `<!-- HERO (Task 4) -->` por:

```html
<section class="vdc-gradient-hero px-5 py-8 relative overflow-hidden">
  <div class="absolute right-[-16px] top-[-16px] text-[96px] opacity-[0.08] select-none pointer-events-none">🛍️</div>
  <span class="inline-flex items-center gap-1.5 bg-white/25 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest mb-3 animate-pulse">
    🔥 NOVIDADES TODO DIA
  </span>
  <h1 class="font-heading font-black text-white text-[22px] leading-tight mb-1">
    As melhores ofertas<br>estão aqui!
  </h1>
  <p class="text-white/80 text-xs mb-5">
    Grupos exclusivos, lojas selecionadas e muito desconto 💸
  </p>
  <div class="flex items-center gap-3">
    <a href="#grupos-vip"
       class="flex items-center gap-1.5 bg-white text-vdc-red font-bold text-xs px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform">
      📱 Grupos VIP
    </a>
    <a href="#nossas-lojas"
       class="flex items-center gap-1.5 border border-white/50 text-white font-bold text-xs px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
      🛍️ Ver Lojas
    </a>
  </div>
</section>
```

- [ ] **Step 3: Adicionar chips**

Substitua `<!-- CHIPS (Task 4) -->` por:

```html
<div id="chips-bar" class="bg-white border-b border-gray-100 px-3 py-2 flex gap-2 overflow-x-auto">
  <button data-target="#nossas-lojas"
          class="chip chip-active flex-shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    🌟 Todos
  </button>
  <button data-target="#destaque-eletronicos"
          class="chip chip-inactive flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    💻 Eletrônicos
  </button>
  <button data-target="#destaque-casa"
          class="chip chip-inactive flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    🏠 Casa
  </button>
  <button data-target="#destaque-moda"
          class="chip chip-inactive flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    👗 Moda
  </button>
  <button data-target="#destaque-calcados"
          class="chip chip-inactive flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    👟 Calçados
  </button>
  <button data-target="#destaque-pet"
          class="chip chip-inactive flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    🐾 Pet
  </button>
</div>
```

- [ ] **Step 4: Adicionar grid de lojas**

Substitua `<!-- LOJAS (Task 4) -->` por:

```html
<section id="nossas-lojas" class="px-3 pt-4 pb-2">
  <div class="flex items-center gap-2 mb-3">
    <div class="section-bar h-4 flex-shrink-0"></div>
    <h2 class="text-[11px] font-black text-vdc-text uppercase tracking-widest">Nossas Lojas</h2>
  </div>
  <div class="grid grid-cols-3 gap-2">

    <a href="categoria.html?cat=eletronicos"
       class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-vdc-red hover:shadow-md transition-shadow">
      <span class="text-2xl mb-1">💻</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Eletrônicos</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Smartphones, TVs...</p>
      <span class="card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md w-full text-center">VER LOJA →</span>
    </a>

    <a href="categoria.html?cat=casa"
       class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-purple-500 hover:shadow-md transition-shadow">
      <span class="text-2xl mb-1">🏠</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Casa & Decor</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Móveis, utensílios...</p>
      <span class="card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md w-full text-center">VER LOJA →</span>
    </a>

    <a href="categoria.html?cat=moda"
       class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-vdc-purple hover:shadow-md transition-shadow">
      <span class="text-2xl mb-1">👗</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Moda</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Masculino, Feminino...</p>
      <span class="card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md w-full text-center">VER LOJA →</span>
    </a>

    <a href="categoria.html?cat=calcados"
       class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-vdc-red hover:shadow-md transition-shadow">
      <span class="text-2xl mb-1">👟</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Calçados</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Fem, Masc, Inf...</p>
      <span class="card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md w-full text-center">VER LOJA →</span>
    </a>

    <a href="categoria.html?cat=pet"
       class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-purple-500 hover:shadow-md transition-shadow">
      <span class="text-2xl mb-1">🐾</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Mundo Pet</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Rações, brinquedos...</p>
      <span class="card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md w-full text-center">VER LOJA →</span>
    </a>

    <div class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-gray-200 opacity-60">
      <span class="text-2xl mb-1">🛍️</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Em breve</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Nova categoria</p>
      <span class="bg-[#e5e7eb] text-[#9ca3af] text-[8px] font-bold px-2 py-1 rounded-md w-full text-center cursor-not-allowed">EM BREVE</span>
    </div>

  </div>
</section>
```

- [ ] **Step 5: Verificar no browser**

Recarregar `http://localhost:8080`. Checar:
- Navbar com gradiente vermelho→roxo fica sticky ao rolar
- Hero com badge pulsante e dois CTAs na mesma linha
- Chips scrolláveis, "🌟 Todos" ativo (gradiente)
- Grid 3 colunas com 5 cards + 1 "Em breve" acinzentado
- Clicar em card de loja: href deve ser `categoria.html?cat=<slug>` (verificar no DevTools)
- Clicar chips de categoria: nenhum scroll ainda (seção alvo não existe) — comportamento esperado

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: hub — navbar, hero, chips e grid de lojas"
```

---

## Task 5: Hub — WhatsApp, Social, Footer e JS dos Chips

**Files:**
- Modify: `index.html` — substituir `<!-- WHATSAPP -->`, `<!-- SOCIAL -->`, `<!-- FOOTER -->` e `/* JS chips */`

**Interfaces:**
- Consumes: `.chip` com `data-target` (Task 4), `.chip-active` / `.chip-inactive` (Task 1 scaffold)
- Produces: hub completo estaticamente (sem a seção de destaques). Chips com scroll suave funcional.

- [ ] **Step 1: Adicionar seção WhatsApp**

Substitua `<!-- WHATSAPP (Task 5) -->` por:

```html
<section id="grupos-vip" class="px-3 pt-4 pb-2">
  <div class="flex items-center gap-2 mb-3">
    <div class="section-bar-green h-4 flex-shrink-0"></div>
    <h2 class="text-[11px] font-black text-vdc-text uppercase tracking-widest">Grupos VIP — WhatsApp</h2>
  </div>

  <div class="rounded-xl p-3 mb-2 flex items-center gap-3"
       style="background: linear-gradient(135deg, #075E54, #128C7E);">
    <span class="text-3xl flex-shrink-0">📱</span>
    <div>
      <p class="text-white font-black text-xs leading-tight">Receba ofertas no WhatsApp</p>
      <p class="text-white/70 text-[10px]">Grupos separados por categoria</p>
    </div>
    <span class="ml-auto bg-vdc-wa text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex-shrink-0">ENTRAR</span>
  </div>

  <div class="grid grid-cols-2 gap-1.5">

    <a href="https://chat.whatsapp.com/LsBOhJUu09UG7BlNX1GhSZ" target="_blank" rel="noopener noreferrer"
       class="bg-vdc-card border border-green-100 border-l-[3px] border-l-vdc-wa rounded-lg px-2.5 py-2 flex items-center gap-2 hover:shadow-sm transition-shadow">
      <span class="text-sm">💻</span>
      <span class="text-[10px] font-bold text-vdc-text">Eletrônicos</span>
      <span class="ml-auto text-vdc-wa text-[10px]">→</span>
    </a>

    <a href="https://chat.whatsapp.com/H1V5sXKL4Ji0a93yAvAuZ7" target="_blank" rel="noopener noreferrer"
       class="bg-vdc-card border border-green-100 border-l-[3px] border-l-vdc-wa rounded-lg px-2.5 py-2 flex items-center gap-2 hover:shadow-sm transition-shadow">
      <span class="text-sm">🏠</span>
      <span class="text-[10px] font-bold text-vdc-text">Casa & Decor</span>
      <span class="ml-auto text-vdc-wa text-[10px]">→</span>
    </a>

    <a href="https://chat.whatsapp.com/Ea3wnpLDL7GL4XDZZticoa" target="_blank" rel="noopener noreferrer"
       class="bg-vdc-card border border-green-100 border-l-[3px] border-l-vdc-wa rounded-lg px-2.5 py-2 flex items-center gap-2 hover:shadow-sm transition-shadow">
      <span class="text-sm">👗</span>
      <span class="text-[10px] font-bold text-vdc-text">Moda Unissex</span>
      <span class="ml-auto text-vdc-wa text-[10px]">→</span>
    </a>

    <a href="https://chat.whatsapp.com/HMocwTuu24jFri5qwUeixT" target="_blank" rel="noopener noreferrer"
       class="bg-vdc-card border border-green-100 border-l-[3px] border-l-vdc-wa rounded-lg px-2.5 py-2 flex items-center gap-2 hover:shadow-sm transition-shadow">
      <span class="text-sm">👟</span>
      <span class="text-[10px] font-bold text-vdc-text">Calçados</span>
      <span class="ml-auto text-vdc-wa text-[10px]">→</span>
    </a>

    <a href="https://chat.whatsapp.com/JQUj9ixaXBa4i71fm5Wbnq" target="_blank" rel="noopener noreferrer"
       class="col-span-2 bg-vdc-card border border-green-100 border-l-[3px] border-l-vdc-wa rounded-lg px-2.5 py-2 flex items-center gap-2 hover:shadow-sm transition-shadow">
      <span class="text-sm">🐾</span>
      <span class="text-[10px] font-bold text-vdc-text">Mundo Pet</span>
      <span class="ml-auto text-vdc-wa text-[10px]">→</span>
    </a>

  </div>
</section>
```

- [ ] **Step 2: Adicionar seção Social**

Substitua `<!-- SOCIAL (Task 5) -->` por:

```html
<section class="px-3 pt-4 pb-4">
  <div class="flex items-center gap-2 mb-3">
    <div class="section-bar h-4 flex-shrink-0"></div>
    <h2 class="text-[11px] font-black text-vdc-text uppercase tracking-widest">Nos siga nas redes</h2>
  </div>
  <a href="https://www.instagram.com/vai_declick/" target="_blank" rel="noopener noreferrer"
     class="vdc-gradient-ig rounded-xl p-3 flex items-center gap-3 hover:opacity-90 transition-opacity">
    <i class="fa-brands fa-instagram text-white text-2xl flex-shrink-0"></i>
    <div>
      <p class="text-white font-black text-xs">@vai_declick</p>
      <p class="text-white/80 text-[10px]">Siga para ver stories de ofertas!</p>
    </div>
    <span class="ml-auto bg-white/25 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex-shrink-0">SEGUIR</span>
  </a>
</section>
```

- [ ] **Step 3: Adicionar footer**

Substitua `<!-- FOOTER (Task 5) -->` por:

```html
<footer class="bg-[#111] py-3 px-4 text-center">
  <p class="text-white/40 text-[8px]">© 2026 Vai de Click · Todos os direitos reservados</p>
</footer>
```

- [ ] **Step 4: Adicionar JS dos chips**

Substitua `/* JS chips — Task 5 */` por:

```javascript
(function () {
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var targetId = chip.getAttribute('data-target');
      var target = document.querySelector(targetId);
      chips.forEach(function (c) {
        c.classList.remove('chip-active');
        c.classList.add('chip-inactive');
      });
      chip.classList.remove('chip-inactive');
      chip.classList.add('chip-active');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}());
```

- [ ] **Step 5: Verificar no browser**

Checar:
- Banner WhatsApp com gradiente verde escuro visível
- 4 mini-cards em 2 colunas, "Mundo Pet" ocupa linha inteira
- Card Instagram com gradiente colorido (roxo→vermelho→laranja)
- Footer preto no rodapé
- Clicar "🌟 Todos" → scroll até `#nossas-lojas` e chip fica ativo
- Clicar chips de categoria → chip fica ativo (scroll pode não funcionar ainda se destaques não foram adicionados)
- Ícone WhatsApp na navbar → scroll até `#grupos-vip` ✅
- CTAs do hero → scroll para suas seções ✅

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: hub — whatsapp, redes sociais, footer e interatividade dos chips"
```

---

## Task 6: Hub — Seção Destaques por Categoria (HTML)

**Files:**
- Modify: `index.html` — substituir `<!-- DESTAQUES (Task 6) -->`

**Interfaces:**
- Produces: `<section id="ofertas-destaque">` com 5 blocos (um por categoria), cada um com `id="destaque-<slug>"` e um container `id="produtos-<slug>"` onde `hub.js` vai renderizar os cards. Estado inicial: containers vazios.

- [ ] **Step 1: Adicionar seção destaques**

Substitua `<!-- DESTAQUES (Task 6) -->` por:

```html
<section id="ofertas-destaque" class="px-3 pt-4 pb-4">
  <div class="flex items-center gap-2 mb-4">
    <div class="section-bar h-4 flex-shrink-0"></div>
    <h2 class="text-[11px] font-black text-vdc-text uppercase tracking-widest">Ofertas em Destaque</h2>
  </div>

  <div id="destaque-eletronicos" class="mb-5">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-bold text-vdc-text">💻 Eletrônicos</span>
      <a href="categoria.html?cat=eletronicos" class="text-[10px] text-vdc-red font-medium hover:underline">Ver todos →</a>
    </div>
    <div id="produtos-eletronicos" class="flex gap-2 overflow-x-auto pb-1"></div>
  </div>

  <div id="destaque-casa" class="mb-5">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-bold text-vdc-text">🏠 Casa & Decor</span>
      <a href="categoria.html?cat=casa" class="text-[10px] text-vdc-red font-medium hover:underline">Ver todos →</a>
    </div>
    <div id="produtos-casa" class="flex gap-2 overflow-x-auto pb-1"></div>
  </div>

  <div id="destaque-moda" class="mb-5">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-bold text-vdc-text">👗 Moda</span>
      <a href="categoria.html?cat=moda" class="text-[10px] text-vdc-red font-medium hover:underline">Ver todos →</a>
    </div>
    <div id="produtos-moda" class="flex gap-2 overflow-x-auto pb-1"></div>
  </div>

  <div id="destaque-calcados" class="mb-5">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-bold text-vdc-text">👟 Calçados</span>
      <a href="categoria.html?cat=calcados" class="text-[10px] text-vdc-red font-medium hover:underline">Ver todos →</a>
    </div>
    <div id="produtos-calcados" class="flex gap-2 overflow-x-auto pb-1"></div>
  </div>

  <div id="destaque-pet" class="mb-2">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-bold text-vdc-text">🐾 Mundo Pet</span>
      <a href="categoria.html?cat=pet" class="text-[10px] text-vdc-red font-medium hover:underline">Ver todos →</a>
    </div>
    <div id="produtos-pet" class="flex gap-2 overflow-x-auto pb-1"></div>
  </div>

</section>
```

- [ ] **Step 2: Verificar no browser**

Recarregar `http://localhost:8080`. Checar:
- Seção "Ofertas em Destaque" visível entre o grid de lojas e WhatsApp
- 5 blocos com título de categoria e link "Ver todos →"
- Containers de produtos estão vazios (normal — hub.js preenche na Task 7)
- Clicar chip "💻 Eletrônicos" → scroll suave até `#destaque-eletronicos` ✅
- Links "Ver todos →" apontam para `categoria.html?cat=<slug>` ✅

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: hub — scaffold da seção destaques por categoria"
```

---

## Task 7: `js/hub.js` — Carregamento de Destaques via API

**Files:**
- Modify: `js/hub.js`

**Interfaces:**
- Consumes: `window.VDC_CONFIG.categorias` (Task 3), `#produtos-<slug>` containers (Task 6), `POST /api/produtos` (Task 2)
- Produces: skeleton animado enquanto carrega; 3 cards de produto por categoria com imagem, nome, preço e CTA "VER OFERTA"; mensagem discreta em caso de falha

- [ ] **Step 1: Implementar hub.js**

```javascript
(function () {
  var SLUGS = Object.keys(window.VDC_CONFIG.categorias);

  function skeletonCards() {
    var card = '<div class="flex-shrink-0 w-32 bg-white rounded-xl p-2 animate-pulse shadow-sm">' +
      '<div class="w-full h-20 bg-gray-200 rounded-lg mb-2"></div>' +
      '<div class="h-2 bg-gray-200 rounded mb-1 w-full"></div>' +
      '<div class="h-2 bg-gray-200 rounded mb-2 w-2/3"></div>' +
      '<div class="h-5 bg-gray-200 rounded w-full"></div>' +
      '</div>';
    return card + card + card;
  }

  function formatarPreco(valor) {
    if (!valor) return '';
    return 'R$ ' + parseFloat(valor).toFixed(2).replace('.', ',');
  }

  function escapar(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function produtoCard(produto, config) {
    var preco = formatarPreco(produto.price_value);
    var precoAntigo = formatarPreco(produto.price_old_value);
    var url = escapar(produto.url || produto.link || '#');
    var titulo = escapar(produto.title || produto.name || '');
    var imgSrc = produto.image || produto.thumbnail || '';

    var imgHtml = imgSrc
      ? '<img src="' + escapar(imgSrc) + '" alt="" class="w-full h-20 object-cover rounded-lg mb-2" loading="lazy">'
      : '<div class="w-full h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-3xl">' + config.icone + '</div>';

    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" ' +
      'class="flex-shrink-0 w-32 bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow flex flex-col">' +
      imgHtml +
      '<p class="text-[10px] font-medium text-gray-800 leading-tight mb-0.5 line-clamp-2 flex-1">' + titulo + '</p>' +
      (preco ? '<p class="text-[11px] font-black text-vdc-red">' + preco + '</p>' : '') +
      (precoAntigo ? '<p class="text-[9px] text-gray-400 line-through -mt-0.5 mb-0.5">' + precoAntigo + '</p>' : '') +
      '<div class="mt-1 card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md text-center">VER OFERTA</div>' +
      '</a>';
  }

  function carregarCategoria(slug) {
    var config = window.VDC_CONFIG.categorias[slug];
    var container = document.getElementById('produtos-' + slug);
    if (!container) return Promise.resolve();

    container.innerHTML = skeletonCards();

    return fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categorias: config.categorias,
        ordenacao: 'updated_at',
        page: 1,
      }),
    })
    .then(function (resp) { return resp.json(); })
    .then(function (data) {
      var produtos = Array.isArray(data) ? data : (data.data || data.produtos || []);
      if (!produtos.length) {
        container.innerHTML = '<p class="text-[10px] text-gray-400 px-1 py-2">Nenhum produto no momento</p>';
        return;
      }
      container.innerHTML = produtos.slice(0, 3).map(function (p) {
        return produtoCard(p, config);
      }).join('');
    })
    .catch(function () {
      container.innerHTML = '<p class="text-[10px] text-red-400 px-1 py-2">Não foi possível carregar</p>';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Promise.allSettled
      ? Promise.allSettled(SLUGS.map(carregarCategoria))
      : SLUGS.forEach(carregarCategoria);
  });
}());
```

- [ ] **Step 2: Testar com vercel dev**

```bash
vercel dev
```

Abrir `http://localhost:3000`. Checar:
- Skeleton de 3 cards aparece em cada categoria imediatamente ao carregar
- Após 1-3 segundos, cards reais substituem os skeletons
- Cada card: imagem (ou emoji fallback), nome truncado em 2 linhas, preço em vermelho, botão "VER OFERTA"
- Clicar card → abre link afiliado em nova aba
- Clicar chip "💻 Eletrônicos" → scroll para `#destaque-eletronicos` e mostra os produtos ✅

Se vercel não disponível localmente: fazer deploy e testar em produção.

- [ ] **Step 3: Commit**

```bash
git add js/hub.js
git commit -m "feat: js/hub.js carrega 3 produtos por categoria via API com skeleton loading"
```

---

## Task 8: `categoria.html` + `js/categoria.js` — Página de Categoria Completa

**Files:**
- Modify: `categoria.html` — substituir todos os comentários Task 8
- Modify: `js/categoria.js` — implementação completa

**Interfaces:**
- Consumes: `window.VDC_CONFIG.categorias[slug]` (Task 3), `POST /api/produtos` (Task 2)
- Produces: página de categoria completa. Slug lido de `?cat=` na URL. Navbar com voltar, hero compacto, filtros sticky, destaques horizontais (primeiros 3 produtos da carga inicial), grade 2 colunas com paginação.

- [ ] **Step 1: Preencher categoria.html com seções**

Substitua `<!-- NAVBAR (Task 8) -->` por:

```html
<nav class="vdc-gradient sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between shadow-lg">
  <div class="flex items-center gap-2.5">
    <a href="index.html"
       class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-1 hover:bg-white/30 transition-colors">
      <i class="fa-solid fa-arrow-left text-white text-sm"></i>
    </a>
    <div>
      <p class="font-heading font-black text-white text-sm leading-none tracking-tight">VAI DE CLICK</p>
      <p class="text-white/70 text-[10px] leading-none mt-0.5" data-cat-nome>Categoria</p>
    </div>
  </div>
  <a href="https://www.instagram.com/vai_declick/" target="_blank" rel="noopener noreferrer"
     class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
    <i class="fa-brands fa-instagram text-white text-sm"></i>
  </a>
</nav>
```

Substitua `<!-- HERO COMPACTO (Task 8) -->` por:

```html
<section class="vdc-gradient-hero px-5 py-5 relative overflow-hidden">
  <div class="absolute right-[-10px] top-[-10px] text-[72px] opacity-[0.08] select-none pointer-events-none" data-cat-icone>🛍️</div>
  <div class="flex items-center gap-2 mb-1">
    <span class="text-2xl" data-cat-icone>🛍️</span>
    <h1 class="font-heading font-black text-white text-[18px] leading-tight" data-cat-nome>Categoria</h1>
  </div>
  <p class="text-white/70 text-[11px]">Todas as ofertas de <span data-cat-nome class="font-bold">Categoria</span></p>
</section>
```

Substitua `<!-- FILTROS (Task 8) -->` por:

```html
<div class="bg-white border-b border-gray-100 px-3 py-2 sticky top-[49px] z-40 flex gap-2">
  <div class="flex-1 relative">
    <input id="busca-input" type="text" placeholder="Buscar produtos..."
           class="w-full bg-gray-50 border border-gray-200 rounded-lg text-xs px-3 py-2 pr-8 outline-none focus:border-vdc-red transition-colors">
    <i class="fa-solid fa-search absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
  </div>
  <select id="select-ordenacao"
          class="bg-gray-50 border border-gray-200 rounded-lg text-xs px-2 py-2 outline-none focus:border-vdc-red transition-colors">
    <option value="updated_at">Mais recentes</option>
    <option value="price_value:asc">Menor preço</option>
    <option value="price_value:desc">Maior preço</option>
  </select>
</div>
```

Substitua `<!-- DESTAQUES DA CATEGORIA (Task 8) -->` por:

```html
<section id="secao-destaques" class="px-3 pt-4 pb-2">
  <div class="flex items-center gap-2 mb-3">
    <div class="section-bar h-4 flex-shrink-0"></div>
    <h2 class="text-[11px] font-black text-vdc-text uppercase tracking-widest">Destaques</h2>
  </div>
  <div id="destaques-grid" class="flex gap-2 overflow-x-auto pb-1"></div>
</section>
```

Substitua `<!-- GRADE DE PRODUTOS (Task 8) -->` por:

```html
<section class="px-3 pt-3 pb-2">
  <div class="flex items-center gap-2 mb-3">
    <div class="section-bar h-4 flex-shrink-0"></div>
    <h2 class="text-[11px] font-black text-vdc-text uppercase tracking-widest">Todos os Produtos</h2>
  </div>
  <div id="grade-produtos" class="grid grid-cols-2 gap-2"></div>
</section>
```

Substitua `<!-- PAGINAÇÃO (Task 8) -->` por:

```html
<div class="px-3 py-4 flex items-center justify-between gap-2">
  <button id="btn-anterior" disabled
          class="flex-1 bg-gray-100 text-gray-500 text-xs font-bold py-2 px-3 rounded-lg disabled:opacity-40 hover:bg-gray-200 transition-colors">
    ← Anterior
  </button>
  <span id="pagina-info" class="text-xs text-gray-500 font-medium flex-shrink-0">Página 1</span>
  <button id="btn-proximo" disabled
          class="flex-1 bg-gray-100 text-gray-500 text-xs font-bold py-2 px-3 rounded-lg disabled:opacity-40 hover:bg-gray-200 transition-colors">
    Próxima →
  </button>
</div>
```

Substitua `<!-- FOOTER (Task 8) -->` por:

```html
<footer class="bg-[#111] py-3 px-4 text-center">
  <p class="text-white/40 text-[8px]">© 2026 Vai de Click · Todos os direitos reservados</p>
</footer>
```

- [ ] **Step 2: Implementar js/categoria.js**

```javascript
(function () {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('cat') || 'eletronicos';
  var config = (window.VDC_CONFIG && window.VDC_CONFIG.categorias[slug]) ||
    { nome: slug, icone: '🛍️', categorias: [] };

  var paginaAtual = 1;
  var buscaAtual = '';
  var ordenacaoAtual = 'updated_at';
  var carregando = false;
  var PER_PAGE = 20;
  var destaquesCarregados = false;

  document.title = 'Vai de Click — ' + config.nome;
  document.querySelectorAll('[data-cat-nome]').forEach(function (el) { el.textContent = config.nome; });
  document.querySelectorAll('[data-cat-icone]').forEach(function (el) { el.textContent = config.icone; });

  function escapar(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatarPreco(valor) {
    if (!valor) return '';
    return 'R$ ' + parseFloat(valor).toFixed(2).replace('.', ',');
  }

  function skeletonHoriz() {
    var c = '<div class="flex-shrink-0 w-32 bg-white rounded-xl p-2 animate-pulse shadow-sm">' +
      '<div class="w-full h-20 bg-gray-200 rounded-lg mb-2"></div>' +
      '<div class="h-2 bg-gray-200 rounded mb-1"></div>' +
      '<div class="h-2 bg-gray-200 rounded mb-2 w-2/3"></div>' +
      '<div class="h-5 bg-gray-200 rounded"></div></div>';
    return c + c + c;
  }

  function skeletonGrade() {
    var c = '<div class="bg-white rounded-xl p-2 animate-pulse shadow-sm">' +
      '<div class="w-full aspect-square bg-gray-200 rounded-lg mb-2"></div>' +
      '<div class="h-2 bg-gray-200 rounded mb-1"></div>' +
      '<div class="h-2 bg-gray-200 rounded mb-2 w-2/3"></div>' +
      '<div class="h-6 bg-gray-200 rounded"></div></div>';
    return c + c + c + c + c + c;
  }

  function cardHoriz(p) {
    var preco = formatarPreco(p.price_value);
    var precoAntigo = formatarPreco(p.price_old_value);
    var url = escapar(p.url || p.link || '#');
    var titulo = escapar(p.title || p.name || '');
    var imgSrc = p.image || p.thumbnail || '';
    var imgHtml = imgSrc
      ? '<img src="' + escapar(imgSrc) + '" alt="" class="w-full h-20 object-cover rounded-lg mb-2" loading="lazy">'
      : '<div class="w-full h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-3xl">' + config.icone + '</div>';
    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" ' +
      'class="flex-shrink-0 w-32 bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow flex flex-col">' +
      imgHtml +
      '<p class="text-[10px] font-medium text-gray-800 leading-tight mb-0.5 line-clamp-2 flex-1">' + titulo + '</p>' +
      (preco ? '<p class="text-[11px] font-black text-vdc-red">' + preco + '</p>' : '') +
      (precoAntigo ? '<p class="text-[9px] text-gray-400 line-through -mt-0.5 mb-0.5">' + precoAntigo + '</p>' : '') +
      '<div class="mt-auto card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md text-center">VER OFERTA</div></a>';
  }

  function cardGrade(p) {
    var preco = formatarPreco(p.price_value);
    var precoAntigo = formatarPreco(p.price_old_value);
    var url = escapar(p.url || p.link || '#');
    var titulo = escapar(p.title || p.name || '');
    var imgSrc = p.image || p.thumbnail || '';
    var imgHtml = imgSrc
      ? '<img src="' + escapar(imgSrc) + '" alt="" class="w-full aspect-square object-cover rounded-lg mb-2" loading="lazy">'
      : '<div class="w-full aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-4xl">' + config.icone + '</div>';
    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" ' +
      'class="bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow flex flex-col">' +
      imgHtml +
      '<p class="text-[11px] font-medium text-gray-800 leading-tight mb-1 line-clamp-2 flex-1">' + titulo + '</p>' +
      (preco ? '<p class="text-sm font-black text-vdc-red">' + preco + '</p>' : '') +
      (precoAntigo ? '<p class="text-[9px] text-gray-400 line-through -mt-0.5 mb-1">' + precoAntigo + '</p>' : '') +
      '<div class="mt-auto card-btn text-white text-[9px] font-bold px-2 py-1.5 rounded-md text-center">VER OFERTA</div></a>';
  }

  function carregarProdutos() {
    if (carregando) return;
    carregando = true;

    var destaques = document.getElementById('destaques-grid');
    var secaoDestaques = document.getElementById('secao-destaques');
    var grade = document.getElementById('grade-produtos');
    var prevBtn = document.getElementById('btn-anterior');
    var nextBtn = document.getElementById('btn-proximo');
    var pageInfo = document.getElementById('pagina-info');

    if (!destaquesCarregados && destaques) destaques.innerHTML = skeletonHoriz();
    if (grade) grade.innerHTML = skeletonGrade();

    fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categorias: config.categorias,
        ordenacao: ordenacaoAtual,
        page: paginaAtual,
        buscar: buscaAtual || undefined,
      }),
    })
    .then(function (resp) { return resp.json(); })
    .then(function (data) {
      var produtos = Array.isArray(data) ? data : (data.data || data.produtos || []);

      if (!destaquesCarregados && destaques) {
        destaquesCarregados = true;
        if (secaoDestaques) secaoDestaques.style.display = buscaAtual ? 'none' : '';
        destaques.innerHTML = produtos.length
          ? produtos.slice(0, 3).map(cardHoriz).join('')
          : '<p class="text-[10px] text-gray-400 py-2">Nenhum destaque</p>';
      }

      if (grade) {
        grade.innerHTML = produtos.length
          ? produtos.map(cardGrade).join('')
          : '<p class="col-span-2 text-center text-[11px] text-gray-400 py-8">Nenhum produto encontrado</p>';
      }

      if (prevBtn) prevBtn.disabled = paginaAtual <= 1;
      if (nextBtn) nextBtn.disabled = produtos.length < PER_PAGE;
      if (pageInfo) pageInfo.textContent = 'Página ' + paginaAtual;
    })
    .catch(function () {
      if (!destaquesCarregados && destaques) {
        destaquesCarregados = true;
        destaques.innerHTML = '';
      }
      if (grade) grade.innerHTML =
        '<p class="col-span-2 text-center text-[11px] text-red-400 py-8">Erro ao carregar produtos</p>';
    })
    .then(function () { carregando = false; });
  }

  var inputBusca = document.getElementById('busca-input');
  if (inputBusca) {
    var debounceTimer;
    inputBusca.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        buscaAtual = inputBusca.value.trim();
        paginaAtual = 1;
        var secaoDestaques = document.getElementById('secao-destaques');
        if (secaoDestaques) secaoDestaques.style.display = buscaAtual ? 'none' : '';
        carregarProdutos();
      }, 400);
    });
  }

  var selectOrdenacao = document.getElementById('select-ordenacao');
  if (selectOrdenacao) {
    selectOrdenacao.addEventListener('change', function () {
      ordenacaoAtual = selectOrdenacao.value;
      paginaAtual = 1;
      carregarProdutos();
    });
  }

  var prevBtn = document.getElementById('btn-anterior');
  var nextBtn = document.getElementById('btn-proximo');
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      if (paginaAtual > 1 && !carregando) {
        paginaAtual--;
        carregarProdutos();
        var grade = document.getElementById('grade-produtos');
        if (grade) grade.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (!carregando) {
        paginaAtual++;
        carregarProdutos();
        var grade = document.getElementById('grade-produtos');
        if (grade) grade.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  carregarProdutos();
}());
```

- [ ] **Step 3: Testar categoria.html**

Abrir `http://localhost:3000/categoria.html?cat=eletronicos`:
- Título da aba: "Vai de Click — Eletrônicos"
- Navbar mostra "Eletrônicos" no subtítulo
- Botão ← na navbar leva para `index.html`
- Hero exibe 💻 e "Eletrônicos"
- Skeleton nos destaques e na grade
- Após carregamento: 3 cards horizontais nos destaques, grade 2 colunas
- Digitar no campo busca → após 400ms a grade atualiza; seção destaques some
- Limpar busca → destaques reaparecem
- Mudar ordenação → grade atualiza com nova ordenação
- Página 1: "← Anterior" desabilitado
- Se retornar < 20 produtos: "Próxima →" desabilitado

Abrir `http://localhost:3000/categoria.html?cat=moda`:
- Ícone e nome mudam para 👗 Moda ✅

- [ ] **Step 4: Commit**

```bash
git add categoria.html js/categoria.js
git commit -m "feat: página de categoria com produtos, busca, ordenação e paginação"
```

---

## Task 9: Performance e Revisão Final

**Files:**
- Modify: `logo.jpeg` (comprimir)
- Verify: todos os arquivos (sem mudanças de código)

- [ ] **Step 1: Comprimir logo.jpeg**

Acesse [squoosh.app](https://squoosh.app):
1. Arraste `logo.jpeg` (~4.5 MB)
2. Selecione formato **MozJPEG**, qualidade **75**
3. Confirme que o arquivo resultante tem ≤ 150 KB
4. Salve como `logo.jpeg` na raiz (substituir original)

- [ ] **Step 2: Verificar .gitignore**

```bash
grep -E '\.env' .gitignore
# Deve mostrar .env.local (ou .env*)
# Se não estiver:
echo '.env.local' >> .gitignore
```

- [ ] **Step 3: Auditoria de links externos**

No browser console em `index.html` e `categoria.html`:

```javascript
var sem = [];
document.querySelectorAll('a[href]').forEach(function(a) {
  var h = a.getAttribute('href');
  if (h && h.startsWith('http') && !(a.rel || '').includes('noopener')) {
    sem.push(a.href);
  }
});
console.log('Links sem rel=noopener:', sem.length, sem);
// Esperado: 0 links
```

- [ ] **Step 4: Checklist visual final (viewport 390px)**

`index.html`:
- [ ] Navbar sticky ao rolar
- [ ] Hero com badge pulsante "🔥 NOVIDADES TODO DIA"
- [ ] Chips rodam horizontalmente sem scrollbar visível
- [ ] Cards de loja linkam para `categoria.html?cat=<slug>` (não para subdomínios)
- [ ] Seção destaques entre lojas e WhatsApp (com skeleton ou produtos reais)
- [ ] Chip "💻 Eletrônicos" → scroll até a linha Eletrônicos nos destaques ✅
- [ ] Card Instagram com gradiente colorido
- [ ] Footer "© 2026" visível no rodapé
- [ ] Logo sem distorção (após compressão)

`categoria.html?cat=eletronicos`:
- [ ] Botão ← na navbar leva de volta para index.html
- [ ] Título da aba: "Vai de Click — Eletrônicos"
- [ ] Barra de filtros sticky abaixo da navbar
- [ ] Grade 2 colunas com produtos
- [ ] Busca debounce funciona (digitar → aguardar 400ms → grade atualiza)
- [ ] Paginação: "← Anterior" desabilitado na página 1

- [ ] **Step 5: Commit final**

```bash
git add logo.jpeg .gitignore
git commit -m "perf: compressão da logo e auditoria final de links"
```
