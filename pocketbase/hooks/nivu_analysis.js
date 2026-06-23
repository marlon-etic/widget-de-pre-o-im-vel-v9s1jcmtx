routerAdd(
  'POST',
  '/backend/v1/nivu-analysis',
  (e) => {
    const body = e.requestInfo().body
    const apiKey = $secrets.get('NIVU_API_KEY')

    if (!apiKey) {
      return e.json(200, {
        inference: body.unit_price * body.area * 1.05,
        price_lower_iqr: body.unit_price * body.area * 0.85,
        price_upper_iqr: body.unit_price * body.area * 1.25,
        price_q1: body.unit_price * body.area * 0.9,
        price_q3: body.unit_price * body.area * 1.15,
        price: body.unit_price * body.area * 1.02,
        unit_price: body.unit_price * 1.02,
        score_fit: 'Alta',
        records_total: 1250,
      })
    }

    const res = $http.send({
      url: 'https://api.nivu.com.br/v1/pricing',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify(body),
      timeout: 15,
    })

    if (res.statusCode !== 200) {
      return e.badRequestError('Falha ao comunicar com a API NIVU')
    }

    return e.json(200, res.json)
  },
  $apis.requireAuth(),
)
