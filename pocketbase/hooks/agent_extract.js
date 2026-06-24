routerAdd(
  'POST',
  '/backend/v1/extract-property',
  (e) => {
    const body = e.requestInfo().body || {}
    const url = body.url
    const userId = e.auth?.id

    if (!userId) return e.unauthorizedError('Auth required')
    if (!url) return e.badRequestError('URL is required')

    let text = ''
    try {
      const res = $http.send({
        url: url,
        method: 'GET',
        timeout: 15,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      })

      if (res.statusCode === 200 && res.body) {
        text = new TextDecoder().decode(res.body)
        text = text
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .slice(0, 30000)
      } else {
        console.log(`[Extrator] Fallback for ${url}. HTTP Status: ${res.statusCode}`)
      }
    } catch (err) {
      console.log(`[Extrator] HTTP fetch error for ${url}: ${err.message}`)
    }

    const agentMessage = `Extract the property data from this URL: ${url}\n\nPage Content:\n${text || 'No page content could be retrieved. Please try to deduce any info from the URL or return default zeros/empty strings.'}`

    const result = $ai.agent('property-data-extractor').chat({
      user_id: userId,
      message: agentMessage,
    })

    let parsed = {}
    try {
      const jsonStr = result.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      parsed = JSON.parse(jsonStr)
    } catch (err) {
      console.log(`[Extrator] Failed to parse AI JSON. Raw output: ${result.content}`)
      return e.internalServerError('Failed to parse AI response.')
    }

    const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const yesterdayStr = yesterdayDate.toISOString().replace('T', ' ').substring(0, 19) + 'Z'

    let existingRecord = null
    try {
      existingRecord = $app.findFirstRecordByFilter(
        'analises_imoveis',
        'usuario_id = {:userId} && url_imovel = {:url} && created >= {:yesterday}',
        { userId: userId, url: url, yesterday: yesterdayStr },
      )
    } catch (_) {}

    const tipoMapping = {
      apartamento: 1,
      casa: 2,
      studio: 3,
      loja: 4,
    }
    const parsedTipo = String(parsed.tipo || '').toLowerCase()
    const tipoNum = tipoMapping[parsedTipo] || 1

    if (existingRecord) {
      existingRecord.set('preco_imovel', parsed.preco_imovel || 0)
      existingRecord.set('area', parsed.area || 0)
      existingRecord.set('quartos', parsed.quartos || 0)
      existingRecord.set('suites', parsed.suites || 0)
      existingRecord.set('banheiros', parsed.banheiros || 0)
      existingRecord.set('vagas', parsed.vagas || 0)
      existingRecord.set('condominio_atual', parsed.condominio_atual || 0)
      existingRecord.set('iptu_atual', parsed.iptu_atual || 0)
      existingRecord.set('bairro', parsed.bairro || '')
      existingRecord.set('cidade', parsed.cidade || '')
      existingRecord.set('estado', parsed.estado || '')
      existingRecord.set('tipo', tipoNum)
      $app.save(existingRecord)
    } else {
      const col = $app.findCollectionByNameOrId('analises_imoveis')
      const record = new Record(col)
      record.set('usuario_id', userId)
      record.set('url_imovel', url)
      record.set('preco_imovel', parsed.preco_imovel || 0)
      record.set('area', parsed.area || 0)
      record.set('quartos', parsed.quartos || 0)
      record.set('suites', parsed.suites || 0)
      record.set('banheiros', parsed.banheiros || 0)
      record.set('vagas', parsed.vagas || 0)
      record.set('condominio_atual', parsed.condominio_atual || 0)
      record.set('iptu_atual', parsed.iptu_atual || 0)
      record.set('bairro', parsed.bairro || '')
      record.set('cidade', parsed.cidade || '')
      record.set('estado', parsed.estado || '')
      record.set('tipo', tipoNum)
      $app.save(record)
    }

    return e.json(200, parsed)
  },
  $apis.requireAuth(),
)
