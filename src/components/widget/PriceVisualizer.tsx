import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface PriceVisualizerProps {
  min: number
  max: number
  q1: number
  q3: number
  currentPrice: number
}

export function PriceVisualizer({ min, max, q1, q3, currentPrice }: PriceVisualizerProps) {
  const [markerPos, setMarkerPos] = useState(0)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const range = max - min
  const q1Pct = Math.max(0, Math.min(100, ((q1 - min) / range) * 100))
  const q3Pct = Math.max(0, Math.min(100, ((q3 - min) / range) * 100))
  const currentPct = ((currentPrice - min) / range) * 100

  useEffect(() => {
    const safePos = Math.max(2, Math.min(98, currentPct))
    const timer = setTimeout(() => setMarkerPos(safePos), 300)
    return () => clearTimeout(timer)
  }, [currentPct])

  const markerColorClass =
    markerPos <= q1Pct ? 'bg-green-600' : markerPos <= q3Pct ? 'bg-yellow-500' : 'bg-red-600'

  const markerArrowClass =
    markerPos <= q1Pct
      ? 'border-t-green-600'
      : markerPos <= q3Pct
        ? 'border-t-yellow-500'
        : 'border-t-red-600'

  return (
    <section className="mb-6 relative" aria-label="Visualizador de faixa de preço">
      <div className="relative mt-12 mb-6 px-1">
        <div
          className="absolute -top-[42px] flex flex-col items-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10"
          style={{ left: `${markerPos}%`, transform: 'translateX(-50%)' }}
        >
          <div
            className={cn(
              'text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap mb-1 animate-float transition-colors duration-1000',
              markerColorClass,
            )}
          >
            {formatCurrency(currentPrice)}
          </div>
          <div
            className={cn(
              'w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent relative -top-[5px] transition-colors duration-1000',
              markerArrowClass,
            )}
          />
        </div>

        <div
          className="h-3 w-full flex rounded-full overflow-hidden shadow-inner bg-slate-100 relative"
          role="progressbar"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentPrice}
        >
          <div
            className="bg-green-500 transition-all hover:brightness-110 h-full"
            style={{ width: `${q1Pct}%` }}
            title="Abaixo do mercado (até Q1)"
          />
          <div
            className="bg-yellow-400 transition-all hover:brightness-110 h-full"
            style={{ width: `${q3Pct - q1Pct}%` }}
            title="Média do mercado (Q1 até Q3)"
          />
          <div
            className="bg-red-500 transition-all hover:brightness-110 h-full"
            style={{ width: `${100 - q3Pct}%` }}
            title="Acima do mercado (após Q3)"
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-600 mb-2 px-1">
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Menor Valor</span>
          <span className="font-bold text-slate-700">{formatCurrency(min)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Maior Valor</span>
          <span className="font-bold text-slate-700">{formatCurrency(max)}</span>
        </div>
      </div>

      <div className="text-center mt-2">
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
              Calculamos o Interquartile Range (IQR) usando a API NIVU. Verde: Quartil 1 (Abaixo do
              mercado). Amarelo: IQR (Média). Vermelho: Quartil 3 (Acima).
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </section>
  )
}
