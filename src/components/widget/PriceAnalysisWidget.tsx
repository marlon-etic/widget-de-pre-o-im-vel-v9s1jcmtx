import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react'
import { PriceVisualizer } from './PriceVisualizer'
import { ComparisonSection } from './ComparisonSection'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export function PriceAnalysisWidget() {
  const [viewIndex, setViewIndex] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showLeadCapture, setShowLeadCapture] = useState(false)

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

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowLeadCapture(false)
    setIsUnlocked(true)
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

      {/* Lead Capture Overlay */}
      {showLeadCapture && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="w-full bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowLeadCapture(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
            <h4 className="text-xl font-extrabold text-slate-900 mb-2">Libere sua análise</h4>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Preencha os dados abaixo para acessar os valores completos do imóvel e comparativos da
              região.
            </p>
            <form onSubmit={handleLeadSubmit} className="space-y-3.5">
              <Input type="text" placeholder="Nome completo" required className="h-11" />
              <Input type="email" placeholder="E-mail" required className="h-11" />
              <Input type="tel" placeholder="Telefone" required className="h-11" />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 mt-2 text-[15px]"
              >
                Ver análise grátis
              </Button>
            </form>
          </div>
        </div>
      )}

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

        {!isUnlocked && (
          <div className="mt-1 flex flex-col gap-4 animate-fade-in">
            <p className="text-[14px] text-slate-600 font-medium leading-relaxed">
              Tenha acesso a informações exclusivas sobre o mercado imobiliário para tomar a melhor
              decisão.
            </p>
            <Button
              onClick={() => setShowLeadCapture(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-[15px] shadow-md hover:shadow-lg transition-all"
            >
              Acessar análise completa
            </Button>
          </div>
        )}
      </header>

      {/* Dynamic Content Area */}
      <div className="p-6 flex-1 min-h-[340px] bg-white relative overflow-hidden">
        <div
          className={cn(
            'transition-all duration-700 h-full',
            viewIndex === 0 ? 'opacity-100 animate-fade-in block' : 'hidden',
            !isUnlocked && 'blur-[6px] opacity-40 select-none pointer-events-none scale-[0.98]',
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
            !isUnlocked && 'blur-[6px] opacity-40 select-none pointer-events-none scale-[0.98]',
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
