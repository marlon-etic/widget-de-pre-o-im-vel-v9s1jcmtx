migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    let marlonId
    try {
      const r = app.findAuthRecordByEmail('_pb_users_auth_', 'marlon@eticimoveis.com.br')
      marlonId = r.id
    } catch (_) {
      const r = new Record(users)
      r.setEmail('marlon@eticimoveis.com.br')
      r.setPassword('Skip@Pass')
      r.setVerified(true)
      r.set('name', 'Marlon')
      app.save(r)
      marlonId = r.id
    }

    let testId
    try {
      const r = app.findAuthRecordByEmail('_pb_users_auth_', 'teste@teste.com')
      testId = r.id
    } catch (_) {
      const r = new Record(users)
      r.setEmail('teste@teste.com')
      r.setPassword('Skip@Pass')
      r.setVerified(true)
      r.set('name', 'Usuário Teste')
      app.save(r)
      testId = r.id
    }

    const analises = app.findCollectionByNameOrId('analises_imoveis')
    try {
      app.findFirstRecordByData('analises_imoveis', 'url_imovel', '/tatuape-70m')
    } catch (_) {
      const r = new Record(analises)
      r.set('usuario_id', marlonId)
      r.set('url_imovel', '/tatuape-70m')
      r.set('preco_imovel', 650000)
      r.set('area', 70)
      r.set('quartos', 2)
      r.set('suites', 1)
      r.set('banheiros', 1)
      r.set('vagas', 1)
      r.set('tipo', 1)
      r.set('bairro', 'Tatuapé')
      r.set('cidade', 'São Paulo')
      r.set('estado', 'SP')
      r.set('preco_inferido', 726000)
      r.set('faixa_minima', 550000)
      r.set('faixa_maxima', 920000)
      r.set('preco_medio', 700000)
      r.set('preco_unitario', 10000)
      r.set('liquidez', 'Alta')
      r.set('registros_usados', 1250)
      r.set('condominio_atual', 750)
      r.set('condominio_media', 820)
      r.set('iptu_atual', 84)
      r.set('iptu_media', 110)
      r.set('data_analise', new Date().toISOString())
      app.save(r)
    }
  },
  (app) => {
    // Can be removed with delete collection
  },
)
