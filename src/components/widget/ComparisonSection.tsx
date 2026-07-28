import { Building, FileText, Database, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ComparisonSectionProps {
  condo: number
  iptu: number
  condoAvg?: number
  iptuAvg?: number
  recordsTotal?: number
  scoreFit?: string | number
}

export function ComparisonSection({
  condo,
  iptu,
  condoAvg,
  iptuAvg,
  recordsTotal,
  scoreFit,
}: ComparisonSectionProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <section className="pt-0" aria-label="Custos e Insights de mercado">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Card className="bg-slate-50/80 border-slate-200/60 shadow-sm rounded-xl">
          <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
            <Database size={16} className="text-blue-500 mb-1" />
            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight mb-0.5">
              Registros usados
            </h4>
            <p className="text-lg font-black text-slate-900 leading-none">{recordsTotal || '-'}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-50/80 border-slate-200/60 shadow-sm rounded-xl">
          <CardContent className="p-3.5 flex flex-col items-center justify-center text-center">
            <Activity size={16} className="text-emerald-500 mb-1" />
            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight mb-0.5">
              Liquidez
            </h4>
            <p className="text-lg font-black text-slate-900 leading-none">{scoreFit || '-'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  {condoAvg ? `Média: ${formatCurrency(condoAvg)}` : 'Média não informada pela API'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  {iptuAvg ? `Média: ${formatCurrency(iptuAvg)}` : 'Média não informada pela API'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
