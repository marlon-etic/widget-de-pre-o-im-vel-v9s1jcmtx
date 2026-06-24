routerAdd(
  'POST',
  '/backend/v1/extract-property',
  (e) => {
    const body = e.requestInfo().body || {}
    const url = body.url
    const userId = e.auth?.id

    if (!userId) return e.unauthorizedError('Auth required')
    if (!url) return e.badRequestError('URL is required')

    // Check for cached analysis in the last 24 hours to optimize performance
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().replace('T', ' ')
      const cached = $app.findFirstRecordByFilter(
        'analises_imoveis',
        'url_imovel = {:url} && created >= {:date}',
        { url, date: yesterday },
      )
      if (cached) {
        return e.json(200, {
          preco_imovel: cached.getFloat('preco_imovel') || null,
          area: cached.getFloat('area') || null,
          quartos: cached.getInt('quartos') || null,
          suites: cached.getInt('suites') || null,
          banheiros: cached.getInt('banheiros') || null,
          vagas: cached.getInt('vagas') || null,
          condominio_atual: cached.getFloat('condominio_atual') || null,
          iptu_atual: cached.getFloat('iptu_atual') || null,
          tipo: cached.getString('tipo') || null,
          bairro: cached.getString('bairro') || null,
          cidade: cached.getString('cidade') || null,
          estado: cached.getString('estado') || null,
          _cached: true,
        })
      }
    } catch (_) {
      // not found, proceed
    }

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

    const agentMessage = `Extract the property data from this URL: ${url}\n\nPage Content:\n${text || 'No page content could be retrieved. Please try to deduce any info from the URL.'}`

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

    return e.json(200, parsed)
  },
  $apis.requireAuth(),
)
