import { useState } from 'react'
import { Building, FileText, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ComparisonSectionProps {
  condo: number
  iptu: number
}

export function ComparisonSection({ condo, iptu }: ComparisonSectionProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <section className="relative rounded-xl overflow-hidden pt-2" aria-label="Custos de moradia">
      {/*
        Background Content 
        Blurs and scales slightly when locked to emphasize the overlay
      */}
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-700 ease-in-out',
          !isUnlocked && 'blur-[6px] opacity-40 select-none scale-[0.98] pointer-events-none',
        )}
      >
        {/* Condo Card */}
        <Card className="bg-slate-50/80 border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden">
          <CardContent className="p-4 flex items-start space-x-3.5 relative">
            <div className="p-2.5 bg-white rounded-xl shadow-sm text-primary group-hover:scale-110 transition-transform duration-300">
              <Building size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h4 className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">
                Condomínio
              </h4>
              <p className="text-[17px] font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(condo)}
              </p>
              <Badge
                variant="secondary"
                className="mt-1 text-[10px] bg-slate-200/50 text-slate-600 hover:bg-slate-200/50 border-0 font-semibold px-2 py-0"
              >
                Média da região
              </Badge>
              <a
                href="#condo"
                className="block mt-2.5 text-xs text-primary hover:underline font-semibold relative z-10 w-fit"
              >
                Mostrar condomínio
              </a>
            </div>
          </CardContent>
        </Card>

        {/* IPTU Card */}
        <Card className="bg-slate-50/80 border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden">
          <CardContent className="p-4 flex items-start space-x-3.5">
            <div className="p-2.5 bg-white rounded-xl shadow-sm text-primary group-hover:scale-110 transition-transform duration-300">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">
                IPTU / Ano
              </h4>
              <p className="text-[17px] font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(iptu)}
              </p>
              <Badge
                variant="secondary"
                className="mt-1 text-[10px] bg-slate-200/50 text-slate-600 hover:bg-slate-200/50 border-0 font-semibold px-2 py-0"
              >
                Média da região
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Locked State Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 animate-fade-in">
          {/* Subtle gradient backdrop to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-white/10" />

          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/60 p-5 rounded-2xl shadow-xl max-w-[320px] w-full text-center flex flex-col items-center relative z-20 transition-transform duration-300 hover:scale-[1.01]">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
              <Lock size={18} strokeWidth={2.5} />
            </div>
            <p className="mb-5 text-[13px] font-semibold text-slate-800 leading-relaxed px-2">
              Tenha acesso a informações exclusivas sobre o mercado imobiliário para tomar a melhor
              decisão
            </p>
            <Button
              onClick={() => setIsUnlocked(true)}
              className="w-full h-11 font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Acessar análise completa
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
