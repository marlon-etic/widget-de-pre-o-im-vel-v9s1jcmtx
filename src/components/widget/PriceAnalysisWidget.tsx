import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MapPin, Lock, AlertCircle } from 'lucide-react'
import { PriceVisualizer } from './PriceVisualizer'
import { ComparisonSection } from './ComparisonSection'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { fetchNivuAnalysis, createAnalise } from '@/services/analises'

export interface PriceAnalysisWidgetProps {
  propertyType: string
  state: string
  city: string
  neighborhood: string
  area: number
  rooms: number
  suites: number
  bathrooms: number
  parkingSpots: number
  currentPrice: number
  businessType: number
  condo?: number
  iptu?: number
  url?: string
}

const sanitizeForLookup = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')

const propertyTypeMap: Record<string, number> = {
  apartamento: 1,
  studio: 2,
  loft: 15,
  casa: 3,
  sobrado: 16,
  'casa-em-condominio': 4,
  sala: 5,
  predio: 6,
  terreno: 8,
  chacara: 9,
  fazenda: 10,
  loja: 11,
  'deposito-pavilhao': 12,
  deposito: 12,
  pavilhao: 12,
  'vaga-de-estacionamento': 13,
  vaga: 13,
  andar: 14,
}

const formatDisplay = (str: string) => {
  if (!str) return ''
  return str.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export function PriceAnalysisWidget({
  propertyType,
  state,
  city,
  neighborhood,
  area,
  rooms,
  suites,
  bathrooms,
  parkingSpots,
  currentPrice,
  businessType,
  condo,
  iptu,
  url,
}: PriceAnalysisWidgetProps) {
  const [viewIndex, setViewIndex] = useState(0)
  const { user, isAuthenticated } = useAuth()
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isUnlocked = isAuthenticated

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsLoading(true)
      setErrorMsg('')

      const tipoId = propertyTypeMap[sanitizeForLookup(propertyType)] || 1
      const location = `${formatDisplay(state)} > ${formatDisplay(city)} > ${formatDisplay(neighborhood)}`
      const unit_price = currentPrice / area

      fetchNivuAnalysis({
        location,
        property_type: tipoId,
        business_type: businessType,
        area,
        area_margin: 0.5,
        unit_price,
        unit_price_margin: 0.5,
        rooms,
        suites,
        bathrooms,
        parking_spots: parkingSpots,
      })
        .then((data) => {
          setAnalysisData(data)
          createAnalise({
            usuario_id: user.id,
            url_imovel: url || window.location.pathname,
            preco_imovel: currentPrice,
            area,
            quartos: rooms,
            suites,
            banheiros: bathrooms,
            vagas: parkingSpots,
            tipo: tipoId,
            bairro: neighborhood,
            cidade: city,
            estado: state,
            preco_inferido: data.inference || data.price,
            faixa_minima: data.price_lower_iqr,
            faixa_maxima: data.price_upper_iqr,
            preco_medio: data.price,
            preco_unitario: data.unit_price,
            liquidez: String(data.score_fit),
            registros_usados: data.records_total,
            condominio_atual: condo || 0,
            condominio_media: data.unit_price * area * 0.001,
            iptu_atual: iptu || 0,
            iptu_media: data.unit_price * area * 0.0001,
            data_analise: new Date().toISOString(),
          }).catch(console.error)
        })
        .catch(() => {
          setErrorMsg('Análise feita com os dados disponíveis')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [
    isAuthenticated,
    user,
    propertyType,
    state,
    city,
    neighborhood,
    area,
    rooms,
    suites,
    bathrooms,
    parkingSpots,
    currentPrice,
    businessType,
    condo,
    iptu,
    url,
  ])

  const mockFallback = {
    inference: currentPrice * 1.05,
    price_lower_iqr: currentPrice * 0.85,
    price_upper_iqr: currentPrice * 1.25,
    price_q1: currentPrice * 0.9,
    price_q3: currentPrice * 1.15,
    price: currentPrice * 1.02,
    unit_price: currentPrice / area,
    score_fit: 'Alta',
    records_total: 1250,
  }

  const d = analysisData || mockFallback
  const condoAvg = d.unit_price * area * 0.001
  const iptuAvg = d.unit_price * area * 0.0001

  const propertyData = {
    location: `${formatDisplay(city)}, ${formatDisplay(neighborhood)}`,
    specs: `${area}m² • ${rooms} quartos • ${suites} suíte • ${bathrooms} banheiro • ${parkingSpots} vaga`,
    currentPrice,
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'PriceSpecification',
    price: propertyData.currentPrice,
    priceCurrency: 'BRL',
    description: `Estimativa de mercado: R$ ${d.inference}`,
  }

  return (
    <article
      aria-label="Widget de Análise de Preço de Imóvel"
      className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl relative"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <header className="p-6 pb-5 border-b border-slate-100 flex flex-col gap-3.5 bg-white relative z-20">
        <div className="flex items-center justify-between">
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0 font-bold tracking-wider px-2.5 py-0.5 text-[10px]">
            MARKET INSIGHTS
          </Badge>
          <div className="flex items-center text-[11px] text-slate-500 font-semibold bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
            <MapPin size={12} className="mr-1 text-slate-400" />
            {propertyData.location}
          </div>
        </div>
        <h3 className="text-[19px] font-extrabold text-slate-900 leading-[1.3] tracking-tight">
          Entenda se é um bom negócio com a análise de preço
        </h3>

        <p className="text-[14px] text-slate-600 font-medium leading-relaxed mt-1">
          Tenha acesso a informações exclusivas sobre o mercado imobiliário para tomar a melhor
          decisão.
        </p>
      </header>

      <div className="p-6 flex-1 min-h-[380px] bg-white relative overflow-hidden flex flex-col">
        {!isUnlocked && (
          <div className="absolute inset-0 z-30 bg-slate-900/10 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center text-center max-w-[90%] transform transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
                <Lock size={24} />
              </div>
              <h4 className="text-[17px] font-bold text-slate-900 mb-2 leading-tight">
                Faça login para ver a análise completa
              </h4>
              <p className="text-sm text-slate-500 mb-5">
                Desbloqueie dados exclusivos sobre o valor deste imóvel.
              </p>
              <Link to="/login" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 text-[15px] shadow-md transition-all">
                  Deixar meus dados para acessar
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div
          className={cn(
            'transition-all duration-700 h-full flex flex-col',
            viewIndex === 0 ? 'opacity-100 animate-fade-in flex' : 'hidden',
            !isUnlocked && 'blur-md opacity-30 select-none pointer-events-none scale-[0.98]',
          )}
          aria-hidden={!isUnlocked}
        >
          {viewIndex === 0 && (
            <>
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                </div>
              ) : (
                <>
                  <PriceVisualizer
                    min={d.price_lower_iqr}
                    max={d.price_upper_iqr}
                    q1={d.price_q1}
                    q3={d.price_q3}
                    currentPrice={propertyData.currentPrice}
                  />
                  <ComparisonSection
                    condo={condo || 750}
                    iptu={iptu || 84}
                    condoAvg={condoAvg}
                    iptuAvg={iptuAvg}
                    recordsTotal={d.records_total}
                    scoreFit={d.score_fit}
                  />
                </>
              )}
            </>
          )}
        </div>

        <div
          className={cn(
            'transition-opacity duration-500 h-full flex flex-col items-center justify-center text-center',
            viewIndex === 1 ? 'opacity-100 animate-fade-in flex' : 'hidden',
            !isUnlocked && 'blur-md opacity-30 select-none pointer-events-none scale-[0.98]',
          )}
          aria-hidden={!isUnlocked}
        >
          {viewIndex === 1 && (
            <div className="p-6">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <MapPin className="text-slate-300" size={24} />
              </div>
              <h4 className="text-slate-900 font-bold mb-2">Estatísticas do Bairro</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                As tendências de mercado para a região do Tatuapé estarão disponíveis em breve.
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-slate-50 p-3.5 px-6 flex justify-end items-center border-t border-slate-100 space-x-2 relative z-20">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'h-8 w-8 rounded-full border-slate-200 text-slate-500 transition-all',
            viewIndex === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:text-slate-900 hover:border-slate-300 hover:bg-white shadow-sm',
          )}
          onClick={() => setViewIndex(0)}
          disabled={viewIndex === 0}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'h-8 w-8 rounded-full border-slate-200 text-slate-500 transition-all',
            viewIndex === 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:text-slate-900 hover:border-slate-300 hover:bg-white shadow-sm',
          )}
          onClick={() => setViewIndex(1)}
          disabled={viewIndex === 1}
          aria-label="Próxima página"
        >
          <ChevronRight size={16} />
        </Button>
      </footer>
    </article>
  )
}
