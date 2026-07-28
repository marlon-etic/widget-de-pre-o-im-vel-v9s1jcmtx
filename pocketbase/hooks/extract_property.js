routerAdd('POST', '/backend/v1/extract-property', (e) => {
  const body = e.requestInfo().body || {}
  const url = body.url
  const userId = e.auth?.id || 'public-widget'

  if (!url) return e.badRequestError('URL is required')

  let parsedUrl
  try {
    parsedUrl = new URL(url)
  } catch (_) {
    return e.badRequestError('URL inválida')
  }

  const hostname = parsedUrl.hostname.toLowerCase()
  const allowedHost = hostname === 'eticimoveis.com.br' || hostname.endsWith('.eticimoveis.com.br')

  if (parsedUrl.protocol !== 'https:' || !allowedHost) {
    return e.badRequestError('A extração automática está limitada ao domínio eticimoveis.com.br')
  }

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
      text = typeof res.body === 'string' ? res.body : new TextDecoder().decode(res.body)
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

  const agentMessage = `Extract the property data from this URL: ${url}

Page Content:
${text || 'No page content could be retrieved. Please try to deduce any info from the URL.'}

IMPORTANT: You MUST return ONLY a valid JSON object. Do NOT wrap it in markdown blocks (like \`\`\`json). Do NOT add any preamble or trailing text. If a value is missing or unknown, use null. All numeric fields should be numbers, not strings.

Expected JSON format:
{
  "preco_imovel": number | null,
  "area": number | null,
  "quartos": number | null,
  "suites": number | null,
  "banheiros": number | null,
  "vagas": number | null,
  "condominio_atual": number | null,
  "iptu_atual": number | null,
  "tipo": string | null,
  "bairro": string | null,
  "cidade": string | null,
  "estado": string | null
}`

  const result = $ai.agent('property-data-extractor').chat({
    user_id: userId,
    message: agentMessage,
  })

  let parsed = {}
  try {
    let jsonStr = result.content
    const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (match) {
      jsonStr = match[1]
    } else {
      const start = jsonStr.indexOf('{')
      const end = jsonStr.lastIndexOf('}')
      if (start !== -1 && end !== -1) {
        jsonStr = jsonStr.substring(start, end + 1)
      }
    }
    parsed = JSON.parse(jsonStr)
  } catch (err) {
    console.log(`[Extrator] Failed to parse AI JSON. Raw output: ${result.content}`)
    return e.internalServerError('Failed to parse AI response.')
  }

  return e.json(200, parsed)
})
