# Vai de Click — Redesign do Hub Principal

**Data:** 2026-06-26  
**Status:** Aprovado para implementação

---

## 1. Visão Geral

Redesign completo da página principal (`index.html`) do Vai de Click, transformando a landing page atual em um hub de ofertas com visual energético estilo "portal de promoções" (referências: Shopee, Americanas, Magazine Luiza).

O hub é uma **página única estática** (`index.html` + Tailwind CSS via CDN). As páginas de categoria continuam hospedadas no Divulga Links nos subdomínios existentes.

---

## 2. Escopo

### Incluído
- Redesign completo do `index.html` (HTML, CSS inline via Tailwind, JS vanilla)
- Nova identidade visual: gradiente vermelho `#E62429` → roxo `#7B2FBE`
- Todas as 7 seções descritas abaixo

### Excluído
- Páginas de categoria (permanecem no Divulga Links)
- Backend, banco de dados, ou qualquer integração com API
- Sistema de administração de conteúdo

---

## 3. Paleta de Cores

| Token | Valor | Uso |
|---|---|---|
| `vdc-red` | `#E62429` | Cor primária, início do gradiente |
| `vdc-purple` | `#7B2FBE` | Cor secundária, fim do gradiente |
| `vdc-gradient` | `linear-gradient(90deg, #E62429, #7B2FBE)` | Navbar, botões de ação, bordas de destaque |
| `vdc-gradient-hero` | `linear-gradient(135deg, #E62429 0%, #7B2FBE 100%)` | Hero banner |
| `vdc-whatsapp` | `#25D366` | Exclusivo para elementos de WhatsApp |
| `vdc-instagram` | `linear-gradient(45deg, #833AB4, #fd1d1d, #fcb045)` | Exclusivo para elementos de Instagram |
| `vdc-bg` | `#f7f7f7` | Fundo geral da página |
| `vdc-card` | `#FFFFFF` | Fundo dos cards |
| `vdc-text` | `#111111` | Texto principal |
| `vdc-muted` | `#888888` | Texto secundário/descritivo |

---

## 4. Tipografia

- **Títulos:** Montserrat Black (peso 900) — via Google Fonts
- **Corpo:** Inter (pesos 400, 500, 700) — via Google Fonts
- **Tamanho base mobile:** 14–16px

---

## 5. Estrutura da Página (Seções)

A página é mobile-first, largura máxima de `390px` centralizada, com scroll vertical.

### 5.1 Navbar
- Fundo: `vdc-gradient` horizontal
- Esquerda: logo (`logo.jpeg` em 32×32px, border-radius 8px) + nome "VAI DE CLICK" + subtítulo "Ofertas & Descontos"
- Direita: ícone do Instagram (abre `https://www.instagram.com/vai_declick/`) + ícone do WhatsApp (scroll para seção de grupos)
- Posição: fixa no topo (`position: sticky`)

### 5.2 Hero Banner
- Fundo: `vdc-gradient-hero`
- Badge pulsante: "🔥 NOVIDADES TODO DIA"
- Título: "As melhores ofertas estão aqui!" (Montserrat Black, 22px, branco)
- Subtítulo: "Grupos exclusivos, lojas selecionadas e muito desconto 💸"
- 2 CTAs em linha:
  - Primário (branco sólido, texto vermelho): "📱 Grupos VIP" → scroll para seção de grupos
  - Secundário (transparente com borda branca): "🛍️ Ver Lojas" → scroll para seção de lojas
- Ícone decorativo de fundo: `🛍️` em grande, opacidade 8%

### 5.3 Barra de Categorias
- Fundo branco, borda inferior cinza
- Chips scrolláveis horizontalmente (overflow-x: auto, sem scrollbar visível)
- Chips: "🌟 Todos", "💻 Eletrônicos", "🏠 Casa", "👗 Moda", "👟 Calçados", "🐾 Pet"
- Chip ativo: fundo `vdc-gradient`, texto branco. Estado inicial: "🌟 Todos" ativo
- Chip inativo: fundo `#f5f5f5`, texto cinza
- Comportamento: clique em categoria faz scroll suave até o card correspondente no grid e marca aquele chip como ativo. Clique em "Todos" reseta todos os chips para inativo (exceto "Todos") e faz scroll até o topo da seção de lojas

### 5.4 Grid de Lojas ("Nossas Lojas")
- Título de seção: "Nossas Lojas" com barra vertical gradiente à esquerda
- Grid de 3 colunas, gap 8px
- 5 cards de categoria + 1 card placeholder "Em breve"
- Cada card:
  - Fundo branco, border-radius 10px, sombra suave
  - Borda superior de 3px com cor rotativa do gradiente
  - Ícone emoji (24px)
  - Nome da categoria (bold, 11px)
  - Descrição curta (muted, 8px)
  - Botão "VER LOJA →" com fundo `vdc-gradient`
  - Link abre em `target="_blank"` para o subdomínio correspondente

| Categoria | Ícone | Subdomínio |
|---|---|---|
| Eletrônicos | 💻 | `https://tech.vaideclick.com/` |
| Casa & Decor | 🏠 | `https://casa.vaideclick.com/` |
| Moda | 👗 | `https://moda.vaideclick.com/` |
| Calçados | 👟 | `https://calcados.vaideclick.com/` |
| Mundo Pet | 🐾 | `https://pets.vaideclick.com/` |
| Em breve | 🛍️ | — (botão com fundo `#e5e7eb`, texto `#9ca3af`, cursor `not-allowed`, sem link) |

### 5.5 Grupos VIP — WhatsApp
- Título de seção: "Grupos VIP — WhatsApp" com barra vertical verde
- Banner principal verde escuro (`#075E54` → `#128C7E`) com ícone 📱, texto "Receba ofertas no WhatsApp" e botão "ENTRAR"
- Grid 2 colunas de mini-cards brancos com borda esquerda verde, um por grupo
- O último card (Pet) ocupa as 2 colunas
- Links abrem em `target="_blank"`

| Grupo | Link |
|---|---|
| Eletrônicos | `https://chat.whatsapp.com/LsBOhJUu09UG7BlNX1GhSZ` |
| Casa & Decor | `https://chat.whatsapp.com/H1V5sXKL4Ji0a93yAvAuZ7` |
| Moda Unissex | `https://chat.whatsapp.com/Ea3wnpLDL7GL4XDZZticoa` |
| Calçados | `https://chat.whatsapp.com/HMocwTuu24jFri5qwUeixT` |
| Mundo Pet | `https://chat.whatsapp.com/JQUj9ixaXBa4i71fm5Wbnq` |

### 5.6 Redes Sociais
- Título de seção: "Nos siga nas redes" com barra vertical gradiente
- Card do Instagram com fundo `vdc-instagram` (gradiente roxo-vermelho-laranja)
- Texto: "@vai_declick" + "Siga para ver stories de ofertas!"
- Botão "SEGUIR" → `https://www.instagram.com/vai_declick/` em `target="_blank"`

### 5.7 Footer
- Fundo `#111` (preto suave)
- Texto: "© 2026 Vai de Click · Todos os direitos reservados"
- Cor: branco com 40% de opacidade, 8px

---

## 6. Comportamento JS (Vanilla)

- **Scroll suave:** Chips da barra de categorias fazem `scrollIntoView({ behavior: 'smooth' })` no card correspondente no grid
- **Sticky navbar:** `position: sticky; top: 0; z-index: 50` via Tailwind
- Nenhum outro comportamento dinâmico necessário

---

## 7. Performance

- Comprimir `logo.jpeg` de 4.5 MB para ≤ 150 KB antes do deploy (usar squoosh.app ou similar)
- Tailwind via CDN (aceitável para este porte de projeto)
- Sem JavaScript de terceiros além das fontes do Google e Font Awesome

---

## 8. Tecnologia

- **Arquivo único:** `index.html`
- **CSS:** Tailwind CSS via CDN + `<style>` inline para customizações
- **Ícones:** Font Awesome 6.4 via CDN
- **Fontes:** Google Fonts (Montserrat + Inter)
- **JS:** Vanilla, embutido no `<script>` no final do body
- **Deploy:** Qualquer hosting estático (GitHub Pages, Netlify, etc.)
