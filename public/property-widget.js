;(function () {
  'use strict'

  var WIDGET_URL = 'https://widget-de-preco-imovel-816eb.goskip.app/widget'
  var SELECTOR = '[data-imovel-widget]'

  function numberValue(value) {
    if (value === undefined || value === null || value === '') return ''
    var parsed = Number(String(value).replace(',', '.'))
    return Number.isFinite(parsed) ? String(parsed) : ''
  }

  function init(root) {
    var targets = root ? [root] : Array.from(document.querySelectorAll(SELECTOR))

    targets.forEach(function (element) {
      if (element.dataset.widgetLoaded === 'true') return

      var data = element.dataset
      var params = new URLSearchParams()
      var fields = {
        tipo: data.tipo || data.propertyType,
        estado: data.estado || data.state,
        cidade: data.cidade || data.city,
        bairro: data.bairro || data.neighborhood,
        area: numberValue(data.area),
        quartos: numberValue(data.quartos || data.rooms),
        suites: numberValue(data.suites),
        banheiros: numberValue(data.banheiros || data.bathrooms),
        vagas: numberValue(data.vagas || data.parkingSpots),
        preco: numberValue(data.preco || data.price),
        negocio: numberValue(data.negocio || data.businessType || 1),
        condominio: numberValue(data.condominio || data.condo),
        iptu: numberValue(data.iptu),
        url_imovel: data.url || window.location.href,
      }

      Object.keys(fields).forEach(function (key) {
        if (fields[key] !== '') params.set(key, fields[key])
      })

      var iframe = document.createElement('iframe')
      iframe.src = (data.widgetUrl || WIDGET_URL) + '?' + params.toString()
      iframe.title = 'Análise de preço do imóvel'
      iframe.loading = 'lazy'
      iframe.style.width = '100%'
      iframe.style.height = data.height || '620px'
      iframe.style.border = '0'
      iframe.style.borderRadius = '16px'
      iframe.style.display = 'block'
      iframe.setAttribute('aria-label', 'Análise de preço do imóvel')

      element.replaceChildren(iframe)
      element.dataset.widgetLoaded = 'true'
    })
  }

  window.EticPriceWidget = { init: init }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init()
    })
  } else {
    init()
  }
})()
