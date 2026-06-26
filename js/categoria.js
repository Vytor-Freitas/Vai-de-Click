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

  document.title = 'Vai de Click — ' + config.nome + ' | Ofertas e Descontos';
  document.querySelectorAll('[data-cat-nome]').forEach(function (el) { el.textContent = config.nome; });
  document.querySelectorAll('[data-cat-icone]').forEach(function (el) { el.textContent = config.icone; });

  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', 'As melhores ofertas de ' + config.nome + ' com os menores preços. Atualizado diariamente no Vai de Click.');
  var ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Vai de Click — ' + config.nome);
  var ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', 'As melhores ofertas de ' + config.nome + ' com os menores preços. Atualizado diariamente no Vai de Click.');

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
        slug: slug,
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
