routerAdd('POST', '/backend/v1/nivu-analysis', (e) => {
  const body = e.requestInfo().body || {}
  const apiKey = $secrets.get('NIVU_API_KEY')

  const toNivuCategory = (value) => {
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue) || numericValue <= 0) return 0
    if (numericValue === 1) return 2
    if (numericValue === 2) return 3
    if (numericValue === 3) return 4
    return 5
  }

  const mappedPayload = {
    location: typeof body.location === 'string' ? body.location.replace(/\s*>\s*/g, '>') : '',
    type: body.property_type,
    business: body.business_type,
    area: body.area,
    areaRange: body.area_margin,
    unitPrice: body.unit_price,
    unitPriceRange: body.unit_price_margin,
    bedrooms: toNivuCategory(body.rooms),
    suites: toNivuCategory(body.suites),
    bathrooms: toNivuCategory(body.bathrooms),
    parkingSpaces: toNivuCategory(body.parking_spots),
  }

  if (!apiKey) {
    return e.internalServerError('NIVU_API_KEY is not configured')
  }

  const res = $http.send({
    url: 'https://api.nivu.com.br/v1/pricing-app/inference/udata-api/' + apiKey,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mappedPayload),
    timeout: 15,
  })

  if (res.statusCode !== 200) {
    let errorMessage = 'Falha ao comunicar com a API NIVU'
    if (res.json) {
      if (typeof res.json.message === 'string') errorMessage = res.json.message
      else if (typeof res.json.error === 'string') errorMessage = res.json.error
      else errorMessage = JSON.stringify(res.json)
    }
    return e.badRequestError(errorMessage)
  }

  const response = res.json || {}
  const pricing = response.pricing || {}
  const score = response.score || {}
  const records = response.records || {}

  return e.json(200, {
    inference: pricing.inference,
    price_lower_iqr: pricing.price_lower_iqr,
    price_upper_iqr: pricing.price_upper_iqr,
    price_q1: pricing.price_q1,
    price_q3: pricing.price_q3,
    price: pricing.price,
    unit_price: pricing.unit_price,
    score_fit: score.fit,
    score_value: score.value,
    records_total: records.total,
    active_weeks: pricing.active_weeks,
    area_usable: pricing.area_usable,
    unit_price_lower_iqr: pricing.unit_price_lower_iqr,
    unit_price_q1: pricing.unit_price_q1,
    unit_price_q3: pricing.unit_price_q3,
    unit_price_upper_iqr: pricing.unit_price_upper_iqr,
  })
})
