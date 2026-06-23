routerAdd(
  'POST',
  '/backend/v1/nivu-analysis',
  (e) => {
    const body = e.requestInfo().body || {}
    const apiKey = $secrets.get('NIVU_API_KEY') || ''
    const url = $secrets.get('NIVU_API_URL') || 'https://api.nivu.com.br/v1/market'

    const mockData = {
      inference: 726000,
      price_lower_iqr: 550000,
      price_upper_iqr: 920000,
      price_q1: 620000,
      price_q3: 820000,
      price: 700000,
      unit_price: 10000,
      score_fit: 'Alta',
      records_total: 1250,
    }

    if (!apiKey) {
      return e.json(200, mockData)
    }

    try {
      const res = $http.send({
        url: url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'x-api-key': apiKey,
        },
        body: JSON.stringify(body),
        timeout: 15,
      })

      if (res.statusCode >= 400) {
        $app.logger().error('NIVU API Error', 'status', res.statusCode)
        return e.badRequestError('Não foi possível calcular a precificação no momento')
      }
      return e.json(200, res.json)
    } catch (err) {
      $app.logger().error('NIVU HTTP Error', 'error', err.message)
      return e.badRequestError('Não foi possível calcular a precificação no momento')
    }
  },
  $apis.requireAuth(),
)
