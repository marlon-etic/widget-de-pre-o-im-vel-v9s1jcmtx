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

const numberParam = (params: URLSearchParams, key: string) => {
  const value = Number(params.get(key))
  return Number.isFinite(value) && value > 0 ? value : 0
}

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
      area: numberParam(searchParams, 'area') || Number(value.area) || 0,
      rooms: numberParam(searchParams, 'quartos') || Number(value.quartos) || 0,
      suites: numberParam(searchParams, 'suites') || Number(value.suites) || 0,
      bathrooms: numberParam(searchParams, 'banheiros') || Number(value.banheiros) || 0,
      parkingSpots: numberParam(searchParams, 'vagas') || Number(value.vagas) || 0,
      currentPrice: numberParam(searchParams, 'preco') || Number(value.preco_imovel) || 0,
      businessType: Number(searchParams.get('negocio')) || 1,
      condo: numberParam(searchParams, 'condominio') || Number(value.condominio_atual) || 0,
      iptu: numberParam(searchParams, 'iptu') || Number(value.iptu_atual) || 0,
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
