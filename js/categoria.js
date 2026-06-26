(function () {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('cat') || 'eletronicos';
  var config = (window.VDC_CONFIG && window.VDC_CONFIG.categorias[slug]) ||
    { nome: slug, icone: '🛍️', categorias: [] };

  var REFRESH_INTERVAL = 5 * 60 * 1000; // refetch a cada 5min
  var MAX_PRODUTOS = 200;
  var PER_PAGE = 20;
  var CACHE_KEY = 'vdc_cat_' + slug;

  var todosProdutos = [];
  var paginaAtual = 1;
  var buscaAtual = '';
  var ordenacaoAtual = 'updated_at';
  var carregando = false;
  var destaquesCarregados = false;

  // ─── SEO ────────────────────────────────────────────────────────────────────
  document.title = 'Vai de Click — ' + config.nome + ' | Ofertas e Descontos';
  document.querySelectorAll('[data-cat-nome]').forEach(function (el) { el.textContent = config.nome; });
  document.querySelectorAll('[data-cat-icone]').forEach(function (el) { el.textContent = config.icone; });
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', 'As melhores ofertas de ' + config.nome + ' com os menores preços. Atualizado diariamente no Vai de Click.');
  var ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Vai de Click — ' + config.nome);
  var ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', 'As melhores ofertas de ' + config.nome + ' com os menores preços. Atualizado diariamente no Vai de Click.');

  // ─── Cache ──────────────────────────────────────────────────────────────────
  function lerCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function salvarCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data }));
    } catch (e) {}
  }

  function mesclar(antigos, novos) {
    var mapa = {};
    (antigos || []).forEach(function (p) { mapa[p.id] = p; });
    (novos || []).forEach(function (p) { mapa[p.id] = p; });
    return Object.keys(mapa).map(function (id) { return mapa[id]; }).slice(0, MAX_PRODUTOS);
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────
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
    var preco = formatarPreco(p.preco || p.price_value);
    var precoAntigo = formatarPreco(p.price_old_value);
    var url = escapar(p.link || p.url || '#');
    var titulo = escapar(p.nome || p.title || p.name || '');
    var imgSrc = p.image || p.thumbnail || '';
    var imgHtml = imgSrc
      ? '<img src="' + escapar(imgSrc) + '" alt="" class="w-full h-20 object-cover rounded-lg mb-2" loading="lazy">'
      : '<div class="w-full h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-3xl">' + config.icone + '</div>';
    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" ' +
      'class="flex-shrink-0 w-32 lg:w-auto bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow flex flex-col">' +
      imgHtml +
      '<p class="text-[10px] font-medium text-gray-800 leading-tight mb-0.5 line-clamp-2 flex-1">' + titulo + '</p>' +
      (preco ? '<p class="text-[11px] font-black text-vdc-red">' + preco + '</p>' : '') +
      (precoAntigo ? '<p class="text-[9px] text-gray-400 line-through -mt-0.5 mb-0.5">' + precoAntigo + '</p>' : '') +
      '<div class="mt-auto card-btn text-white text-[8px] font-bold px-2 py-1 rounded-md text-center">VER OFERTA</div></a>';
  }

  function cardGrade(p) {
    var preco = formatarPreco(p.preco || p.price_value);
    var precoAntigo = formatarPreco(p.price_old_value);
    var url = escapar(p.link || p.url || '#');
    var titulo = escapar(p.nome || p.title || p.name || '');
    var imgSrc = p.image || p.thumbnail || '';
    var imgHtml = imgSrc
      ? '<img src="' + escapar(imgSrc) + '" alt="" class="w-full aspect-square object-cover rounded-lg mb-2" loading="lazy">'
      : '<div class="w-full aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-4xl">' + config.icone + '</div>';
    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" ' +
      'class="bg-white rounded-xl p-2 lg:p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col">' +
      imgHtml +
      '<p class="text-[11px] lg:text-xs font-medium text-gray-800 leading-tight mb-1 line-clamp-2 flex-1">' + titulo + '</p>' +
      (preco ? '<p class="text-sm lg:text-base font-black text-vdc-red">' + preco + '</p>' : '') +
      (precoAntigo ? '<p class="text-[9px] text-gray-400 line-through -mt-0.5 mb-1">' + precoAntigo + '</p>' : '') +
      '<div class="mt-auto card-btn text-white text-[9px] lg:text-[10px] font-bold px-2 py-1.5 rounded-md text-center">VER OFERTA</div></a>';
  }

  // ─── Ordenação local ────────────────────────────────────────────────────────
  function ordenarLocal(lista, ordem) {
    var copia = lista.slice();
    if (ordem === 'price_value:asc') {
      copia.sort(function (a, b) { return parseFloat(a.preco || 0) - parseFloat(b.preco || 0); });
    } else if (ordem === 'price_value:desc') {
      copia.sort(function (a, b) { return parseFloat(b.preco || 0) - parseFloat(a.preco || 0); });
    }
    return copia;
  }

  // ─── Renderização ────────────────────────────────────────────────────────────
  function renderizarGrade(produtos) {
    var grade = document.getElementById('grade-produtos');
    var prevBtn = document.getElementById('btn-anterior');
    var nextBtn = document.getElementById('btn-proximo');
    var pageInfo = document.getElementById('pagina-info');

    var total = produtos.length;
    var inicio = (paginaAtual - 1) * PER_PAGE;
    var pagina = produtos.slice(inicio, inicio + PER_PAGE);

    if (grade) {
      grade.innerHTML = pagina.length
        ? pagina.map(cardGrade).join('')
        : '<p class="col-span-2 lg:col-span-4 text-center text-[11px] text-gray-400 py-8">Nenhum produto encontrado</p>';
    }
    if (prevBtn) prevBtn.disabled = paginaAtual <= 1;
    if (nextBtn) nextBtn.disabled = inicio + PER_PAGE >= total;
    if (pageInfo) {
      var totalPaginas = Math.max(1, Math.ceil(total / PER_PAGE));
      pageInfo.textContent = 'Página ' + paginaAtual + ' / ' + totalPaginas + ' (' + total + ' produtos)';
    }
  }

  // ─── Carregamento ────────────────────────────────────────────────────────────
  function carregarProdutos() {
    if (carregando) return;
    carregando = true;

    var destaques = document.getElementById('destaques-grid');
    var secaoDestaques = document.getElementById('secao-destaques');
    var grade = document.getElementById('grade-produtos');

    // Busca ativa: vai direto à API (sem acumular)
    if (buscaAtual) {
      if (secaoDestaques) secaoDestaques.style.display = 'none';
      if (grade) grade.innerHTML = skeletonGrade();
      fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slug, categorias: config.categorias, ordenacao: ordenacaoAtual, page: 1, buscar: buscaAtual }),
      })
      .then(function (resp) { return resp.json(); })
      .then(function (data) {
        var resultados = Array.isArray(data) ? data : (data.data || data.produtos || []);
        renderizarGrade(ordenarLocal(resultados, ordenacaoAtual));
      })
      .catch(function () {
        if (grade) grade.innerHTML = '<p class="col-span-2 lg:col-span-4 text-center text-[11px] text-red-400 py-8">Erro ao carregar produtos</p>';
      })
      .then(function () { carregando = false; });
      return;
    }

    // Sem busca: usa produtos acumulados em cache
    if (secaoDestaques) secaoDestaques.style.display = '';

    var cache = lerCache();
    var precisaRefresh = !cache || (Date.now() - cache.ts) > REFRESH_INTERVAL;

    // Exibe do cache imediatamente se disponível
    if (cache && cache.data && cache.data.length) {
      todosProdutos = cache.data;
      if (!destaquesCarregados && destaques) {
        destaquesCarregados = true;
        destaques.innerHTML = todosProdutos.slice(0, 3).map(cardHoriz).join('');
      }
      renderizarGrade(ordenarLocal(todosProdutos, ordenacaoAtual));
      if (!precisaRefresh) { carregando = false; return; }
    } else {
      if (!destaquesCarregados && destaques) destaques.innerHTML = skeletonHoriz();
      if (grade) grade.innerHTML = skeletonGrade();
    }

    // Busca novos produtos e acumula
    fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: slug, categorias: config.categorias, ordenacao: 'updated_at', page: 1 }),
    })
    .then(function (resp) { return resp.json(); })
    .then(function (data) {
      var novos = Array.isArray(data) ? data : (data.data || data.produtos || []);
      todosProdutos = mesclar(cache ? cache.data : [], novos);
      if (todosProdutos.length) salvarCache(todosProdutos);
      if (!destaquesCarregados && destaques) {
        destaquesCarregados = true;
        destaques.innerHTML = todosProdutos.length
          ? todosProdutos.slice(0, 3).map(cardHoriz).join('')
          : '<p class="text-[10px] text-gray-400 py-2">Nenhum destaque</p>';
      }
      renderizarGrade(ordenarLocal(todosProdutos, ordenacaoAtual));
    })
    .catch(function () {
      if (!destaquesCarregados && destaques) {
        destaquesCarregados = true;
        destaques.innerHTML = '';
      }
      if (!todosProdutos.length && grade) {
        grade.innerHTML = '<p class="col-span-2 lg:col-span-4 text-center text-[11px] text-red-400 py-8">Erro ao carregar produtos</p>';
      }
    })
    .then(function () { carregando = false; });
  }

  // ─── Eventos ─────────────────────────────────────────────────────────────────
  var inputBusca = document.getElementById('busca-input');
  if (inputBusca) {
    var debounceTimer;
    inputBusca.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        buscaAtual = inputBusca.value.trim();
        paginaAtual = 1;
        carregarProdutos();
      }, 400);
    });
  }

  var selectOrdenacao = document.getElementById('select-ordenacao');
  if (selectOrdenacao) {
    selectOrdenacao.addEventListener('change', function () {
      ordenacaoAtual = selectOrdenacao.value;
      paginaAtual = 1;
      if (buscaAtual) {
        carregarProdutos();
      } else {
        renderizarGrade(ordenarLocal(todosProdutos, ordenacaoAtual));
      }
    });
  }

  var prevBtn = document.getElementById('btn-anterior');
  var nextBtn = document.getElementById('btn-proximo');
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      if (paginaAtual > 1 && !carregando) {
        paginaAtual--;
        renderizarGrade(ordenarLocal(buscaAtual ? [] : todosProdutos, ordenacaoAtual));
        var grade = document.getElementById('grade-produtos');
        if (grade) grade.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (!carregando) {
        paginaAtual++;
        renderizarGrade(ordenarLocal(buscaAtual ? [] : todosProdutos, ordenacaoAtual));
        var grade = document.getElementById('grade-produtos');
        if (grade) grade.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  carregarProdutos();
}());
