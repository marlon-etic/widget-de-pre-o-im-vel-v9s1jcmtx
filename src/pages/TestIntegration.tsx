import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Copy, ExternalLink, Check, Code2, Sparkles, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'

export default function TestIntegration() {
  const { isAuthenticated, loading } = useAuth()
  const [isExtracting, setIsExtracting] = useState(false)
  const [formData, setFormData] = useState({
    estado: 'SP',
    cidade: 'São Paulo',
    bairro: 'Tatuapé',
    tipo: 'apartamento',
    negocio: '1',
    area: '70',
    quartos: '2',
    suites: '1',
    banheiros: '1',
    vagas: '1',
    preco: '650000',
    condominio: '750',
    iptu: '84',
    url_imovel:
      'https://marlon.sites.superadmin.ia.br/imoveis/apartamento-a-venda-2-quartos-tatuape-sao-paulo',
  })

  const [copied, setCopied] = useState(false)

  const sanitize = (str: string) => {
    if (!str) return ''
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
  }

  const buildUrl = () => {
    const params = new URLSearchParams()
    Object.entries(formData).forEach(([key, value]) => {
      if (['estado', 'cidade', 'bairro'].includes(key)) {
        params.append(key, sanitize(value))
      } else {
        params.append(key, value)
      }
    })
    return `${window.location.origin}/widget?${params.toString()}`
  }

  const iframeCode = `<iframe 
  src="${buildUrl()}" 
  width="100%" 
  height="600" 
  frameborder="0" 
  style="border:none; max-width: 500px; border-radius: 16px; overflow: hidden;"
></iframe>`

  const handleTest = () => {
    window.open(buildUrl(), '_blank')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleExtract = async () => {
    if (!formData.url_imovel) {
      toast.error('Informe a URL do imóvel primeiro')
      return
    }

    setIsExtracting(true)
    try {
      const res = await pb.send('/backend/v1/extract-property', {
        method: 'POST',
        body: JSON.stringify({ url: formData.url_imovel }),
        headers: { 'Content-Type': 'application/json' },
      })

      setFormData((prev) => ({
        ...prev,
        preco: res.preco_imovel != null && res.preco_imovel !== 0 ? String(res.preco_imovel) : '',
        area: res.area != null && res.area !== 0 ? String(res.area) : '',
        quartos: res.quartos != null && res.quartos !== 0 ? String(res.quartos) : '',
        suites: res.suites != null && res.suites !== 0 ? String(res.suites) : '',
        banheiros: res.banheiros != null && res.banheiros !== 0 ? String(res.banheiros) : '',
        vagas: res.vagas != null && res.vagas !== 0 ? String(res.vagas) : '',
        condominio:
          res.condominio_atual != null && res.condominio_atual !== 0
            ? String(res.condominio_atual)
            : '',
        iptu: res.iptu_atual != null && res.iptu_atual !== 0 ? String(res.iptu_atual) : '',
        tipo: res.tipo ? res.tipo.toLowerCase() : prev.tipo,
        bairro: res.bairro || prev.bairro,
        cidade: res.cidade || prev.cidade,
        estado: res.estado || prev.estado,
      }))

      const missingFields = []
      if (res.preco_imovel == null || res.preco_imovel === 0) missingFields.push('Preço')
      if (res.area == null || res.area === 0) missingFields.push('Área')
      if (res.quartos == null || res.quartos === 0) missingFields.push('Quartos')
      if (res.banheiros == null || res.banheiros === 0) missingFields.push('Banheiros')
      if (res.vagas == null || res.vagas === 0) missingFields.push('Vagas')
      if (res.condominio_atual == null || res.condominio_atual === 0)
        missingFields.push('Condomínio')
      if (res.iptu_atual == null || res.iptu_atual === 0) missingFields.push('IPTU')

      if (missingFields.length > 0) {
        toast.warning(
          `Alguns campos não foram encontrados: ${missingFields.join(', ')}. Por favor, preencha-os manualmente.`,
        )
      } else {
        toast.success(
          res._cached ? 'Dados recuperados do cache com sucesso!' : 'Dados extraídos com sucesso!',
        )
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao extrair dados da URL')
    } finally {
      setIsExtracting(false)
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-500">Carregando...</div>
  if (!isAuthenticated) return <Navigate to="/login" />

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Testar Integração do Widget</h1>
        <p className="text-slate-600">
          Preencha os dados do imóvel abaixo para gerar a URL com parâmetros e testar a exibição do
          widget.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Section */}
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
            <Label htmlFor="url_imovel" className="text-slate-700 font-semibold">
              URL do Imóvel
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="url_imovel"
                name="url_imovel"
                value={formData.url_imovel}
                onChange={handleChange}
                placeholder="https://exemplo.com/imovel"
                className="flex-1 bg-white"
              />
              <Button
                onClick={handleExtract}
                disabled={isExtracting || !formData.url_imovel}
                className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extraindo...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 text-amber-300" /> Preencher com IA
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cole a URL e deixe nossa IA identificar e preencher os dados do imóvel
              automaticamente.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" name="estado" value={formData.estado} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Imóvel</Label>
              <Select value={formData.tipo} onValueChange={(v) => handleSelectChange('tipo', v)}>
                <SelectTrigger id="tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="sobrado">Sobrado</SelectItem>
                  <SelectItem value="casa-em-condominio">Casa em Condomínio</SelectItem>
                  <SelectItem value="sala">Sala</SelectItem>
                  <SelectItem value="predio">Prédio</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="chacara">Chácara</SelectItem>
                  <SelectItem value="fazenda">Fazenda</SelectItem>
                  <SelectItem value="loja">Loja</SelectItem>
                  <SelectItem value="deposito">Depósito/Pavilhão</SelectItem>
                  <SelectItem value="vaga">Vaga de estacionamento</SelectItem>
                  <SelectItem value="andar">Andar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="negocio">Negócio</Label>
              <Select
                value={formData.negocio}
                onValueChange={(v) => handleSelectChange('negocio', v)}
              >
                <SelectTrigger id="negocio">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Venda (1)</SelectItem>
                  <SelectItem value="2">Aluguel (2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                name="preco"
                type="number"
                value={formData.preco}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quartos">Quartos</Label>
              <Input
                id="quartos"
                name="quartos"
                type="number"
                value={formData.quartos}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suites">Suítes</Label>
              <Input
                id="suites"
                name="suites"
                type="number"
                value={formData.suites}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banheiros">Banheiros</Label>
              <Input
                id="banheiros"
                name="banheiros"
                type="number"
                value={formData.banheiros}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vagas">Vagas</Label>
              <Input
                id="vagas"
                name="vagas"
                type="number"
                value={formData.vagas}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condominio">Condomínio (R$)</Label>
              <Input
                id="condominio"
                name="condominio"
                type="number"
                value={formData.condominio}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iptu">IPTU (R$)</Label>
              <Input
                id="iptu"
                name="iptu"
                type="number"
                value={formData.iptu}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button onClick={handleTest} className="w-full mt-4 h-12 text-md" variant="default">
            <ExternalLink className="mr-2 h-5 w-5" /> Testar Widget em Nova Aba
          </Button>
        </div>

        {/* Snippet Section */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg flex flex-col">
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center text-slate-300 font-medium text-sm">
                <Code2 className="mr-2 h-4 w-4" />
                Snippet de Integração (Iframe)
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-slate-300 hover:text-white hover:bg-slate-700"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="mr-1.5 h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="mr-1.5 h-4 w-4" />
                )}
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
            <div className="p-4 bg-slate-900 overflow-x-auto">
              <pre className="text-sm text-slate-300 font-mono">
                <code>{iframeCode}</code>
              </pre>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h3 className="font-semibold text-blue-900 mb-2">Como integrar</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              O widget pode ser incorporado em qualquer site de e-commerce imobiliário utilizando um
              iframe. Ao utilizar os parâmetros via URL, os valores informados sobrescrevem os dados
              padrão de demonstração. O tamanho máximo recomendado para o iframe é de 500px de
              largura.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
