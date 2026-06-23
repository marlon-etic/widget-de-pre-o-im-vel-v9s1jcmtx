import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MapPin, Lock } from 'lucide-react'
import { PriceVisualizer } from './PriceVisualizer'
import { ComparisonSection } from './ComparisonSection'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import useAuthStore from '@/stores/useAuthStore'
import useDataStore from '@/stores/useDataStore'

export function PriceAnalysisWidget() {
  const [viewIndex, setViewIndex] = useState(0)
  const { user } = useAuthStore()
  const { getAnalise } = useDataStore()

  const isUnlocked = !!user

  // Get data from mock store or fallback
  const analise = getAnalise('prop-1')

  const propertyData = {
    location: `${analise?.cidade || 'São Paulo'}, ${analise?.bairro || 'Tatuapé'}`,
    specs: `${analise?.area || 70}m² • ${analise?.quartos || 2} quartos • ${analise?.suites || 1} suíte • ${analise?.banheiros || 1} banheiro • ${analise?.vagas || 1} vaga`,
    currentPrice: analise?.preco_imovel || 650000,
    estimate: analise?.preco_inferido || 726000,
    min: analise?.faixa_minima || 550000,
    max: analise?.faixa_maxima || 920000,
    condo: analise?.condominio_atual || 750,
    iptu: analise?.iptu_atual || 84,
  }

  // Schema.org structured data for SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'PriceSpecification',
    price: propertyData.currentPrice,
    priceCurrency: 'BRL',
    description: `Estimativa de mercado: R$ ${propertyData.estimate}`,
  }

  return (
    <article
      aria-label="Widget de Análise de Preço de Imóvel"
      className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl relative"
    >
      {/* Hidden JSON-LD block for SEO crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Widget Header */}
      <header className="p-6 pb-5 border-b border-slate-100 flex flex-col gap-3.5 bg-white relative z-20">
        <div className="flex items-center justify-between">
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0 font-bold tracking-wider px-2.5 py-0.5 text-[10px]">
            GRATUITO
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

      {/* Dynamic Content Area */}
      <div className="p-6 flex-1 min-h-[340px] bg-white relative overflow-hidden flex flex-col">
        {/* Auth Overlay */}
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
                  Acessar análise completa
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div
          className={cn(
            'transition-all duration-700 h-full flex flex-col',
            viewIndex === 0 ? 'opacity-100 animate-fade-in flex' : 'hidden',
            !isUnlocked && 'blur-[8px] opacity-30 select-none pointer-events-none scale-[0.98]',
          )}
          aria-hidden={!isUnlocked}
        >
          {viewIndex === 0 && (
            <>
              <PriceVisualizer
                min={propertyData.min}
                max={propertyData.max}
                estimate={propertyData.estimate}
              />
              <ComparisonSection
                condo={propertyData.condo}
                iptu={propertyData.iptu}
                condoAvg={analise?.condominio_media || 800}
                iptuAvg={analise?.iptu_media || 100}
              />
            </>
          )}
        </div>

        {/* Placeholder for secondary view to demonstrate slider functionality */}
        <div
          className={cn(
            'transition-opacity duration-500 h-full flex flex-col items-center justify-center text-center',
            viewIndex === 1 ? 'opacity-100 animate-fade-in flex' : 'hidden',
            !isUnlocked && 'blur-[8px] opacity-30 select-none pointer-events-none scale-[0.98]',
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

      {/* Widget Footer / Controls */}
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
