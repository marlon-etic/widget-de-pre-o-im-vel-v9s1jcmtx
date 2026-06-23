import { Building, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ComparisonSectionProps {
  condo: number
  iptu: number
  condoAvg?: number
  iptuAvg?: number
}

export function ComparisonSection({ condo, iptu, condoAvg, iptuAvg }: ComparisonSectionProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <section className="pt-2" aria-label="Custos de moradia">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Condo Card */}
        <Card className="bg-slate-50/80 border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden rounded-xl">
          <CardContent className="p-4 flex flex-col h-full relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-primary group-hover:scale-110 transition-transform duration-300">
                <Building size={16} strokeWidth={2.5} />
              </div>
              <h4 className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-tight">
                Preço do condomínio
              </h4>
            </div>
            <div className="mt-auto">
              <p className="text-xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(condo)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-slate-200/50 text-slate-600 border-0 font-semibold px-2 py-0"
                >
                  Média: {condoAvg ? formatCurrency(condoAvg) : 'R$ 800'}
                </Badge>
              </div>
              <a
                href="#condo"
                className="block mt-3 text-xs text-blue-600 hover:underline font-semibold"
              >
                Mostrar condomínio
              </a>
            </div>
          </CardContent>
        </Card>

        {/* IPTU Card */}
        <Card className="bg-slate-50/80 border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden rounded-xl">
          <CardContent className="p-4 flex flex-col h-full relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-primary group-hover:scale-110 transition-transform duration-300">
                <FileText size={16} strokeWidth={2.5} />
              </div>
              <h4 className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-tight">
                Preço do IPTU
              </h4>
            </div>
            <div className="mt-auto">
              <p className="text-xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(iptu)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-slate-200/50 text-slate-600 border-0 font-semibold px-2 py-0"
                >
                  Média: {iptuAvg ? formatCurrency(iptuAvg) : 'R$ 100'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
