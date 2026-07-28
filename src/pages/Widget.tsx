import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PriceAnalysisWidget } from '@/components/widget/PriceAnalysisWidget'
import { extractProperty } from '@/services/analises'

type PropertyData = {
  preco_imovel?: number | null
  area?: number | null
  quartos?: number | null
  suites?: number | null
  banheiros?: number | null
  vagas?: number | null
  condominio_atual?: number | null
  iptu_atual?: number | null
  tipo?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
}

const normalize = (value: string | null) =>
  value
    ? value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '-')
    : ''

const parseNumber = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value !== 'string' || !value.trim()) return 0

  const normalized = value.includes(',')
    ? value.replace(/\./g, '').replace(',', '.')
    : /^\d{1,3}(?:\.\d{3})+$/.test(value.trim())
      ? value.replace(/\./g, '')
      : value

  const parsed = Number(normalized)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

const numberParam = (params: URLSearchParams, key: string) => parseNumber(params.get(key))

export default function Widget() {
  const [searchParams] = useSearchParams()
  const propertyUrl = searchParams.get('url_imovel') || ''
  const [extracted, setExtracted] = useState<PropertyData | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState('')

  const needsExtraction = Boolean(
    propertyUrl &&
    ['tipo', 'cidade', 'bairro', 'area', 'quartos', 'preco'].some((key) => !searchParams.get(key)),
  )

  useEffect(() => {
    if (!needsExtraction) return

    let active = true
    setExtracting(true)
    setExtractError('')

    extractProperty(propertyUrl)
      .then((data) => {
        if (active) setExtracted(data as PropertyData)
      })
      .catch((error) => {
        if (active) {
          setExtractError(error?.message || 'Não foi possível ler os dados da página do imóvel.')
        }
      })
      .finally(() => {
        if (active) setExtracting(false)
      })

    return () => {
      active = false
    }
  }, [needsExtraction, propertyUrl])

  const data = useMemo(() => {
    const value = extracted || {}
    return {
      propertyType: normalize(searchParams.get('tipo') || value.tipo || ''),
      state: normalize(searchParams.get('estado') || value.estado || ''),
      city: normalize(searchParams.get('cidade') || value.cidade || ''),
      neighborhood: normalize(searchParams.get('bairro') || value.bairro || ''),
      area: numberParam(searchParams, 'area') || parseNumber(value.area),
      rooms: numberParam(searchParams, 'quartos') || parseNumber(value.quartos),
      suites: numberParam(searchParams, 'suites') || parseNumber(value.suites),
      bathrooms: numberParam(searchParams, 'banheiros') || parseNumber(value.banheiros),
      parkingSpots: numberParam(searchParams, 'vagas') || parseNumber(value.vagas),
      currentPrice: numberParam(searchParams, 'preco') || parseNumber(value.preco_imovel),
      businessType: Number(searchParams.get('negocio')) || 1,
      condo: numberParam(searchParams, 'condominio') || parseNumber(value.condominio_atual),
      iptu: numberParam(searchParams, 'iptu') || parseNumber(value.iptu_atual),
      url: propertyUrl || window.location.href,
    }
  }, [extracted, propertyUrl, searchParams])

  if (extracting) {
    return (
      <div className="w-full min-h-[240px] flex items-center justify-center bg-white rounded-2xl">
        <div className="text-center text-slate-600">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          Lendo os dados do imóvel…
        </div>
      </div>
    )
  }

  if (extractError) {
    return (
      <div className="w-full max-w-[500px] rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {extractError}
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center items-start min-h-screen bg-transparent p-0">
      <PriceAnalysisWidget {...data} />
    </div>
  )
}
