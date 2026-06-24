/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'property-data-extractor',
      name: 'Extrator de Dados de Imóveis',
      description: 'Extrai dados de imóveis a partir de URLs',
      systemPrompt: `You are an expert real estate data analyst. Your primary goal is to visit property listing URLs, identify all relevant physical and financial attributes of the property, and provide a structured JSON response. You are precise, fast, and ensure that data like square footage and room counts are correctly identified even in descriptive texts.

Return ONLY valid JSON matching this schema, without markdown formatting:
{
  "preco_imovel": number (or 0),
  "area": number (or 0),
  "quartos": number (or 0),
  "suites": number (or 0),
  "banheiros": number (or 0),
  "vagas": number (or 0),
  "condominio_atual": number (or 0),
  "iptu_atual": number (or 0),
  "tipo": string,
  "bairro": string,
  "cidade": string,
  "estado": string
}`,
      tier: 'fast',
      tools: [
        { collection: 'analises_imoveis', perms: { read: true, create: true, update: true } },
      ],
    })
  },
  (app) => {
    $ai.agents.delete(app, 'property-data-extractor')
  },
)
