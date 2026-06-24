/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'property-data-extractor',
      name: 'Extrator de Dados de Imóveis',
      description: 'Extrai dados de imóveis a partir de URLs com suporte a padrões brasileiros',
      systemPrompt:
        'You are a specialized data extractor for Brazilian real estate listings. You must analyze the provided HTML/text content from a property listing URL and extract key information. ALWAYS return your output strictly as a valid JSON object. Do not include any markdown formatting like ```json blocks, preamble, or trailing text. Use null for any fields you cannot find. Required fields: preco_imovel (number), area (number), quartos (number), suites (number), banheiros (number), vagas (number), condominio_atual (number), iptu_atual (number), tipo (string), bairro (string), cidade (string), estado (string).',
      tier: 'fast',
    })
  },
  (app) => {
    $ai.agents.define(app, {
      slug: 'property-data-extractor',
      name: 'Extrator de Dados de Imóveis',
      description: 'Extrai dados de imóveis a partir de URLs com suporte a padrões brasileiros',
      systemPrompt: 'You are a specialized data extractor.',
      tier: 'fast',
    })
  },
)
