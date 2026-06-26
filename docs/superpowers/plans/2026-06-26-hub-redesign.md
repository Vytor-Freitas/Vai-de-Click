# Hub Redesign — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o `index.html` atual por um hub redesenhado com visual de portal de ofertas, gradiente vermelho→roxo, e 7 seções: navbar, hero, chips de categoria, grid de lojas, grupos WhatsApp, redes sociais e footer.

**Architecture:** Página HTML única estática (`index.html`) com Tailwind CSS via CDN, Font Awesome via CDN e Google Fonts. Sem build step, sem dependências instaladas. JS vanilla embutido no final do `<body>` para comportamento dos chips de categoria. Cada seção é adicionada e verificada incrementalmente.

**Tech Stack:** HTML5, Tailwind CSS 3 (CDN), Font Awesome 6.4 (CDN), Google Fonts (Montserrat + Inter), JavaScript vanilla

## Global Constraints

- Arquivo único: `index.html` na raiz do repositório
- Mobile-first; largura máxima `max-w-sm` (384px) centralizada
- Gradiente primário: `linear-gradient(90deg, #E62429, #7B2FBE)`
- Gradiente hero: `linear-gradient(135deg, #E62429 0%, #7B2FBE 100%)`
- Fundo geral: `#f7f7f7`
- Commits no formato Conventional Commits (`feat:`, `style:`, `fix:`)
- Todos os links externos com `target="_blank" rel="noopener noreferrer"`
- Nunca use co-autor nos commits

---

## Mapeamento de Arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `index.html` | Modificar (reescrever) | Toda a página — estrutura, estilos e JS |
| `logo.jpeg` | Comprimir | Reduzir de ~4.5 MB para ≤ 150 KB |

---

## Task 1: Scaffold Base (head + estrutura + config Tailwind)

**Files:**
- Modify: `index.html` (reescrever do zero)

**Interfaces:**
- Produces: página HTML válida carregando sem erros, com cores e fontes configuradas; outras tasks adicionam seções dentro de `<main>`

- [ ] **Step 1: Reescrever index.html com scaffold base**

Substitua TODO o conteúdo de `index.html` por:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Vai de Click — Ofertas e Descontos Todo Dia</title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Google Fonts -->
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
    .vdc-gradient         { background: linear-gradient(90deg,  #E62429, #7B2FBE); }
    .vdc-gradient-hero    { background: linear-gradient(135deg, #E62429 0%, #7B2FBE 100%); }
    .vdc-gradient-ig      { background: linear-gradient(45deg,  #833AB4, #fd1d1d, #fcb045); }
    .vdc-gradient-text    { background: linear-gradient(90deg,  #E62429, #7B2FBE);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent; }
    .chip-active          { background: linear-gradient(90deg, #E62429, #7B2FBE); color: white; }
    .chip-inactive        { background: #f5f5f5; color: #555; }
    .card-btn             { background: linear-gradient(90deg, #E62429, #7B2FBE); }
    .section-bar          { width: 3px; border-radius: 2px;
                            background: linear-gradient(180deg, #E62429, #7B2FBE); }
    .section-bar-green    { width: 3px; border-radius: 2px; background: #25D366; }
  </style>
</head>

<body class="bg-vdc-bg antialiased min-h-screen overflow-x-hidden">

  <div class="max-w-sm mx-auto flex flex-col min-h-screen">

    <!-- NAVBAR (Task 2) -->

    <main class="flex-1 flex flex-col">

      <!-- HERO (Task 3) -->

      <!-- CHIPS (Task 4) -->

      <!-- LOJAS (Task 5) -->

      <!-- WHATSAPP (Task 6) -->

      <!-- SOCIAL (Task 7) -->

    </main>

    <!-- FOOTER (Task 7) -->

  </div>

  <script>
    /* JS interativo — Task 8 */
  </script>

</body>
</html>
```

- [ ] **Step 2: Verificar no browser**

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080`. Checar:
- Página carrega sem erros no console
- Fundo é `#f7f7f7` (cinza claro)
- Fonte Inter carregada (inspecionar elemento `body`)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: scaffold base do hub redesign com config Tailwind e fontes"
```

---

## Task 2: Navbar

**Files:**
- Modify: `index.html` — substituir comentário `<!-- NAVBAR (Task 2) -->`

**Interfaces:**
- Produces: `<nav id="navbar">` com gradiente, logo, links sociais

- [ ] **Step 1: Adicionar navbar**

Substitua `<!-- NAVBAR (Task 2) -->` por:

```html
<nav class="vdc-gradient sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between shadow-lg">
  <!-- Logo + Marca -->
  <div class="flex items-center gap-2.5">
    <div class="w-8 h-8 rounded-lg overflow-hidden border-2 border-white/30 flex-shrink-0">
      <img src="logo.jpeg" alt="Vai de Click" class="w-full h-full object-cover">
    </div>
    <div>
      <p class="font-heading font-black text-white text-sm leading-none tracking-tight">VAI DE CLICK</p>
      <p class="text-white/70 text-[10px] leading-none mt-0.5">Ofertas &amp; Descontos</p>
    </div>
  </div>

  <!-- Ícones Sociais -->
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

- [ ] **Step 2: Verificar no browser**

Recarregar `http://localhost:8080`. Checar:
- Navbar fica no topo ao rolar a página
- Gradiente vermelho→roxo visível
- Logo aparece (pode estar quebrada até comprimir — normal)
- Ícone Instagram e WhatsApp visíveis e clicáveis
- Em viewport 390px (DevTools) o layout não quebra

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: navbar sticky com gradiente e ícones sociais"
```

---

## Task 3: Hero Banner

**Files:**
- Modify: `index.html` — substituir comentário `<!-- HERO (Task 3) -->`

**Interfaces:**
- Produces: `<section id="hero">` com gradiente hero, badge, título, subtítulo, 2 CTAs

- [ ] **Step 1: Adicionar hero**

Substitua `<!-- HERO (Task 3) -->` por:

```html
<section class="vdc-gradient-hero px-5 py-8 relative overflow-hidden">
  <!-- Ícone decorativo de fundo -->
  <div class="absolute right-[-16px] top-[-16px] text-[96px] opacity-[0.08] select-none pointer-events-none">🛍️</div>

  <!-- Badge pulsante -->
  <span class="inline-flex items-center gap-1.5 bg-white/25 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest mb-3 animate-pulse">
    🔥 NOVIDADES TODO DIA
  </span>

  <!-- Título -->
  <h1 class="font-heading font-black text-white text-[22px] leading-tight mb-1">
    As melhores ofertas<br>estão aqui!
  </h1>

  <!-- Subtítulo -->
  <p class="text-white/80 text-xs mb-5">
    Grupos exclusivos, lojas selecionadas e muito desconto 💸
  </p>

  <!-- CTAs -->
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

- [ ] **Step 2: Verificar no browser**

Checar:
- Gradiente hero (vermelho→roxo diagonal) visível
- Badge "🔥 NOVIDADES TODO DIA" piscando
- Título em Montserrat Black 22px branco
- Dois botões na mesma linha
- Ícone 🛍️ aparece levemente ao fundo

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: hero banner com gradiente, badge e CTAs"
```

---

## Task 4: Barra de Categorias (Chips)

**Files:**
- Modify: `index.html` — substituir comentário `<!-- CHIPS (Task 4) -->`

**Interfaces:**
- Produces: `<div id="chips-bar">` com 6 chips scrolláveis. Cada chip tem `data-target="#<id>"`. Task 8 conecta o JS.

- [ ] **Step 1: Adicionar chips**

Substitua `<!-- CHIPS (Task 4) -->` por:

```html
<div id="chips-bar" class="bg-white border-b border-gray-100 px-3 py-2 flex gap-2 overflow-x-auto">
  <button data-target="#nossas-lojas"
          class="chip chip-active flex-shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    🌟 Todos
  </button>
  <button data-target="#cat-eletronicos"
          class="chip chip-inactive flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    💻 Eletrônicos
  </button>
  <button data-target="#cat-casa"
          class="chip chip-inactive flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    🏠 Casa
  </button>
  <button data-target="#cat-moda"
          class="chip chip-inactive flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    👗 Moda
  </button>
  <button data-target="#cat-calcados"
          class="chip chip-inactive flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    👟 Calçados
  </button>
  <button data-target="#cat-pet"
          class="chip chip-inactive flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all">
    🐾 Pet
  </button>
</div>
```

- [ ] **Step 2: Verificar no browser**

Checar:
- Barra branca com borda inferior cinza
- Chip "🌟 Todos" com gradiente vermelho→roxo (ativo)
- Demais chips com fundo cinza claro
- Em viewport 390px a barra rola horizontalmente sem mostrar scrollbar

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: barra de chips de categorias scrollável"
```

---

## Task 5: Grid de Lojas

**Files:**
- Modify: `index.html` — substituir comentário `<!-- LOJAS (Task 5) -->`

**Interfaces:**
- Produces: `<section id="nossas-lojas">` com grid 3 colunas, 5 cards de categoria + 1 "Em breve". Cada card de categoria tem `id="cat-<slug>"` para targeting dos chips.

- [ ] **Step 1: Adicionar grid de lojas**

Substitua `<!-- LOJAS (Task 5) -->` por:

```html
<section id="nossas-lojas" class="px-3 pt-4 pb-2">
  <!-- Título da seção -->
  <div class="flex items-center gap-2 mb-3">
    <div class="section-bar h-4 flex-shrink-0"></div>
    <h2 class="text-[11px] font-black text-vdc-text uppercase tracking-widest">Nossas Lojas</h2>
  </div>

  <!-- Grid 3 colunas -->
  <div class="grid grid-cols-3 gap-2">

    <!-- Eletrônicos -->
    <a id="cat-eletronicos"
       href="https://tech.vaideclick.com/" target="_blank" rel="noopener noreferrer"
       class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-vdc-red hover:shadow-md transition-shadow">
      <span class="text-2xl mb-1">💻</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Eletrônicos</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Smartphones, TVs...</p>
      <span class="card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md w-full text-center">VER LOJA →</span>
    </a>

    <!-- Casa & Decor -->
    <a id="cat-casa"
       href="https://casa.vaideclick.com/" target="_blank" rel="noopener noreferrer"
       class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-purple-500 hover:shadow-md transition-shadow">
      <span class="text-2xl mb-1">🏠</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Casa & Decor</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Móveis, utensílios...</p>
      <span class="card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md w-full text-center">VER LOJA →</span>
    </a>

    <!-- Moda -->
    <a id="cat-moda"
       href="https://moda.vaideclick.com/" target="_blank" rel="noopener noreferrer"
       class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-vdc-purple hover:shadow-md transition-shadow">
      <span class="text-2xl mb-1">👗</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Moda</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Masculino, Feminino...</p>
      <span class="card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md w-full text-center">VER LOJA →</span>
    </a>

    <!-- Calçados -->
    <a id="cat-calcados"
       href="https://calcados.vaideclick.com/" target="_blank" rel="noopener noreferrer"
       class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-vdc-red hover:shadow-md transition-shadow">
      <span class="text-2xl mb-1">👟</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Calçados</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Fem, Masc, Inf...</p>
      <span class="card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md w-full text-center">VER LOJA →</span>
    </a>

    <!-- Mundo Pet -->
    <a id="cat-pet"
       href="https://pets.vaideclick.com/" target="_blank" rel="noopener noreferrer"
       class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-purple-500 hover:shadow-md transition-shadow">
      <span class="text-2xl mb-1">🐾</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Mundo Pet</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Rações, brinquedos...</p>
      <span class="card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md w-full text-center">VER LOJA →</span>
    </a>

    <!-- Em breve -->
    <div class="bg-vdc-card rounded-xl p-2.5 flex flex-col items-center text-center shadow-sm border-t-[3px] border-gray-200 opacity-60">
      <span class="text-2xl mb-1">🛍️</span>
      <p class="text-[10px] font-bold text-vdc-text leading-tight mb-0.5">Em breve</p>
      <p class="text-[8px] text-vdc-muted leading-tight mb-2">Nova categoria</p>
      <span class="bg-[#e5e7eb] text-[#9ca3af] text-[8px] font-bold px-2 py-1 rounded-md w-full text-center cursor-not-allowed">EM BREVE</span>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Verificar no browser**

Checar:
- Grid 3 colunas visível
- Cada card tem borda superior colorida (vermelho, roxo alternando)
- Card "Em breve" está acinzentado e com aparência desabilitada
- Clicar em qualquer card abre o subdomínio em nova aba
- Em viewport 390px o grid não quebra

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: grid de lojas com 5 categorias e card em breve"
```

---

## Task 6: Seção Grupos VIP (WhatsApp)

**Files:**
- Modify: `index.html` — substituir comentário `<!-- WHATSAPP (Task 6) -->`

**Interfaces:**
- Produces: `<section id="grupos-vip">` com banner verde e mini-cards por grupo

- [ ] **Step 1: Adicionar seção WhatsApp**

Substitua `<!-- WHATSAPP (Task 6) -->` por:

```html
<section id="grupos-vip" class="px-3 pt-4 pb-2">
  <!-- Título da seção -->
  <div class="flex items-center gap-2 mb-3">
    <div class="section-bar-green h-4 flex-shrink-0"></div>
    <h2 class="text-[11px] font-black text-vdc-text uppercase tracking-widest">Grupos VIP — WhatsApp</h2>
  </div>

  <!-- Banner principal -->
  <div class="rounded-xl p-3 mb-2 flex items-center gap-3"
       style="background: linear-gradient(135deg, #075E54, #128C7E);">
    <span class="text-3xl flex-shrink-0">📱</span>
    <div>
      <p class="text-white font-black text-xs leading-tight">Receba ofertas no WhatsApp</p>
      <p class="text-white/70 text-[10px]">Grupos separados por categoria</p>
    </div>
    <span class="ml-auto bg-vdc-wa text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex-shrink-0">ENTRAR</span>
  </div>

  <!-- Mini-cards -->
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

    <!-- Pet ocupa 2 colunas -->
    <a href="https://chat.whatsapp.com/JQUj9ixaXBa4i71fm5Wbnq" target="_blank" rel="noopener noreferrer"
       class="col-span-2 bg-vdc-card border border-green-100 border-l-[3px] border-l-vdc-wa rounded-lg px-2.5 py-2 flex items-center gap-2 hover:shadow-sm transition-shadow">
      <span class="text-sm">🐾</span>
      <span class="text-[10px] font-bold text-vdc-text">Mundo Pet</span>
      <span class="ml-auto text-vdc-wa text-[10px]">→</span>
    </a>

  </div>
</section>
```

- [ ] **Step 2: Verificar no browser**

Checar:
- Banner verde escuro com gradiente visível
- 4 mini-cards em grid 2 colunas
- Card "Mundo Pet" ocupa linha inteira
- Todos os links abrem o grupo WhatsApp em nova aba
- Âncora `#grupos-vip` funciona: colar `http://localhost:8080/#grupos-vip` na barra de endereço rola até a seção

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: seção grupos VIP WhatsApp com banner e mini-cards"
```

---

## Task 7: Redes Sociais + Footer

**Files:**
- Modify: `index.html` — substituir comentário `<!-- SOCIAL + FOOTER (Task 7) -->`

**Interfaces:**
- Produces: card do Instagram + `<footer>` com copyright 2026

- [ ] **Step 1: Substituir `<!-- SOCIAL (Task 7) -->` pela seção de redes sociais**

```html
<!-- Redes Sociais -->
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

- [ ] **Step 2: Substituir `<!-- FOOTER (Task 7) -->` pelo footer**

```html
<!-- Footer -->
<footer class="bg-[#111] py-3 px-4 text-center">
  <p class="text-white/40 text-[8px]">© 2026 Vai de Click · Todos os direitos reservados</p>
</footer>
```

- [ ] **Step 3: Verificar no browser**

Checar:
- Card Instagram com gradiente roxo-vermelho-laranja visível
- Ícone Instagram visível (Font Awesome)
- Link abre `@vai_declick` em nova aba
- Footer preto com texto branco transparente no rodapé
- Página completa rola do topo até o footer sem quebras de layout

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: seção redes sociais e footer"
```

---

## Task 8: JS — Comportamento dos Chips

**Files:**
- Modify: `index.html` — substituir comentário `/* JS interativo — Task 8 */` dentro de `<script>`

**Interfaces:**
- Consumes: `.chip` (botões da Task 4), `data-target` (atributo com `#id` do elemento alvo), `.chip-active` / `.chip-inactive` (classes CSS do scaffold)
- Produces: scroll suave ao clicar em chip; chip clicado fica ativo, demais ficam inativos

- [ ] **Step 1: Adicionar JS dos chips**

Substitua `/* JS interativo — Task 8 */` por:

```javascript
(function () {
  const chips = document.querySelectorAll('.chip');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const targetId = chip.getAttribute('data-target');
      const target = document.querySelector(targetId);

      // Atualiza estado visual dos chips
      chips.forEach(function (c) {
        c.classList.remove('chip-active');
        c.classList.add('chip-inactive');
      });
      chip.classList.remove('chip-inactive');
      chip.classList.add('chip-active');

      // Scroll suave até o alvo
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}());
```

- [ ] **Step 2: Verificar no browser**

Checar:
- Clicar em "💻 Eletrônicos" → página rola até o card Eletrônicos e chip fica vermelho/roxo
- Clicar em "🌟 Todos" → página rola até `#nossas-lojas` e chip "Todos" fica ativo
- Clicar sequencialmente em dois chips: apenas o último fica ativo
- Clicar no ícone WhatsApp na navbar → scroll até `#grupos-vip`
- Clicar nos CTAs do hero → scroll até `#grupos-vip` e `#nossas-lojas` respectivamente

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: interatividade dos chips com scroll suave e estado ativo"
```

---

## Task 9: Performance e Revisão Final

**Files:**
- Modify: `logo.jpeg` — comprimir
- Modify: `index.html` — nenhuma mudança de código; apenas validação

- [ ] **Step 1: Comprimir logo.jpeg**

Acesse [squoosh.app](https://squoosh.app) no browser:
1. Arraste `logo.jpeg` (4.5 MB)
2. Selecione formato **MozJPEG**, qualidade **75**
3. Salve como `logo.jpeg` na raiz do repositório (substituir o original)
4. Confirme que o arquivo resultante tem ≤ 150 KB

- [ ] **Step 2: Validar HTML**

```bash
curl -s https://validator.w3.org/nu/?out=text \
  --data-urlencode "doc@index.html" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  | head -40
```

Se o validador não estiver disponível via curl, abra `https://validator.w3.org/nu/` e cole o HTML manualmente. Esperado: 0 erros (warnings são aceitáveis).

- [ ] **Step 3: Auditoria de links**

Abrir o DevTools no browser e executar no console:

```javascript
document.querySelectorAll('a[href]').forEach(a => {
  if (!a.getAttribute('rel')?.includes('noopener')) {
    console.warn('Missing rel=noopener:', a.href);
  }
});
```

Esperado: nenhum warning no console.

- [ ] **Step 4: Checklist visual final**

Em viewport 390px (DevTools → iPhone 12 Pro):
- [ ] Navbar está sticky ao rolar
- [ ] Hero ocupa a área acima do fold
- [ ] Chips rodam horizontalmente sem scrollbar visível
- [ ] Grid 3 colunas não quebra
- [ ] Card "Em breve" está acinzentado
- [ ] Banner WhatsApp com gradiente verde
- [ ] Card Pet ocupa 2 colunas
- [ ] Card Instagram com gradiente colorido
- [ ] Footer visível no rodapé
- [ ] Logo aparece sem espaço em branco (após compressão)

- [ ] **Step 5: Commit final**

```bash
git add index.html logo.jpeg
git commit -m "perf: comprimir logo e auditoria final de links e HTML"
```
