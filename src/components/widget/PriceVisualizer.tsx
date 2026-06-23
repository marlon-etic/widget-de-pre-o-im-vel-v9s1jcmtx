import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface PriceVisualizerProps {
  min: number
  max: number
  estimate: number
}

export function PriceVisualizer({ min, max, estimate }: PriceVisualizerProps) {
  const [markerPos, setMarkerPos] = useState(0)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)
  }

  useEffect(() => {
    // Calculate position based on min and max
    const range = max - min
    const percentage = ((estimate - min) / range) * 100
    // Keep marker within visual bounds (5% to 95%)
    const safePos = Math.max(5, Math.min(95, percentage))

    // Slight delay to allow component to render before animating
    const timer = setTimeout(() => setMarkerPos(safePos), 300)
    return () => clearTimeout(timer)
  }, [min, max, estimate])

  return (
    <section className="mb-8 relative" aria-label="Visualizador de faixa de preço">
      <div className="relative mt-14 mb-6 px-1">
        {/* Dynamic Marker */}
        <div
          className="absolute -top-[42px] flex flex-col items-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10"
          style={{ left: `${markerPos}%`, transform: 'translateX(-50%)' }}
        >
          <div
            className={cn(
              'text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap mb-1 animate-float transition-colors duration-1000',
              markerPos < 33.3 ? 'bg-green-600' : markerPos < 66.6 ? 'bg-yellow-500' : 'bg-red-600',
            )}
          >
            {formatCurrency(estimate)}
          </div>
          {/* Arrow Point */}
          <div
            className={cn(
              'w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent relative -top-[5px] transition-colors duration-1000',
              markerPos < 33.3
                ? 'border-t-green-600'
                : markerPos < 66.6
                  ? 'border-t-yellow-500'
                  : 'border-t-red-600',
            )}
          />
        </div>

        {/* 3-Segment Bar */}
        <div
          className="h-3.5 w-full flex rounded-full overflow-hidden shadow-inner bg-slate-100"
          role="progressbar"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={estimate}
        >
          <div
            className={cn(
              'w-1/3 transition-colors hover:brightness-110',
              markerPos < 33.3 ? 'bg-green-500' : 'bg-green-500/40',
            )}
            title="Abaixo do mercado"
          />
          <div
            className={cn(
              'w-1/3 transition-colors hover:brightness-110',
              markerPos >= 33.3 && markerPos < 66.6 ? 'bg-yellow-400' : 'bg-yellow-400/40',
            )}
            title="Média do mercado"
          />
          <div
            className={cn(
              'w-1/3 transition-colors hover:brightness-110',
              markerPos >= 66.6 ? 'bg-red-500' : 'bg-red-500/40',
            )}
            title="Acima do mercado"
          />
        </div>
      </div>

      {/* Min / Max Labels */}
      <div className="flex justify-between items-center text-xs text-slate-600 mb-4 px-1">
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Valor mínimo</span>
          <span className="font-bold text-slate-700">{formatCurrency(min)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Valor máximo</span>
          <span className="font-bold text-slate-700">{formatCurrency(max)}</span>
        </div>
      </div>

      {/* Info Tooltip */}
      <div className="text-center">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              className="text-xs text-primary hover:text-primary/80 hover:underline inline-flex items-center transition-colors font-medium cursor-help"
              type="button"
            >
              <Info size={14} className="mr-1.5" />
              Saiba como estimamos os valores
            </button>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={5}
            className="bg-slate-900 text-white p-3.5 rounded-lg max-w-[280px] text-xs leading-relaxed shadow-xl border-0 z-50"
          >
            <p>
              Nossa estimativa é calculada usando um algoritmo proprietário que analisa milhares de
              transações recentes de imóveis semelhantes na sua região.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </section>
  )
}
