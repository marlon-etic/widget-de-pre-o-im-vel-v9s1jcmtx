import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { PriceVisualizer } from './PriceVisualizer'
import { ComparisonSection } from './ComparisonSection'
import { cn } from '@/lib/utils'

export function PriceAnalysisWidget() {
  const [viewIndex, setViewIndex] = useState(0)

  // Hardcoded sample data per specification
  const propertyData = {
    location: 'São Paulo, Tatuapé',
    specs: '70m² • 2 quartos • 1 suíte • 1 banheiro • 1 vaga',
    currentPrice: 650000,
    estimate: 726000,
    min: 550000,
    max: 920000,
    condo: 750,
    iptu: 84,
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
      className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl"
    >
      {/* Hidden JSON-LD block for SEO crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Widget Header */}
      <header className="p-6 pb-5 border-b border-slate-100 flex flex-col gap-3.5 bg-white">
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
        <p className="text-[13px] text-slate-500 font-medium">{propertyData.specs}</p>
      </header>

      {/* Dynamic Content Area */}
      <div className="p-6 flex-1 min-h-[340px] bg-white">
        <div
          className={cn(
            'transition-opacity duration-500',
            viewIndex === 0 ? 'opacity-100 animate-fade-in block' : 'hidden',
          )}
        >
          {viewIndex === 0 && (
            <>
              <PriceVisualizer
                min={propertyData.min}
                max={propertyData.max}
                estimate={propertyData.estimate}
              />
              <ComparisonSection condo={propertyData.condo} iptu={propertyData.iptu} />
            </>
          )}
        </div>

        {/* Placeholder for secondary view to demonstrate slider functionality */}
        <div
          className={cn(
            'transition-opacity duration-500 h-full flex flex-col items-center justify-center text-center',
            viewIndex === 1 ? 'opacity-100 animate-fade-in flex' : 'hidden',
          )}
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
      <footer className="bg-slate-50 p-3.5 px-6 flex justify-end items-center border-t border-slate-100 space-x-2">
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
