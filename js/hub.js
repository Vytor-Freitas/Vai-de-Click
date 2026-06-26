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
