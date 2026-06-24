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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Copy, ExternalLink, Check, Sparkles, Loader2, Calculator } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'
import { fetchNivuAnalysis, createAnalise } from '@/services/analises'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export default function TestIntegration() {
  const { user, isAuthenticated, loading } = useAuth()
  const [isExtracting, setIsExtracting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copied, setCopied] = useState(false)

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
      'https://marlon.sites.superadmin.ia.br/imoveis/apartamento-a-venda-2-quartos-tatuape-sao-paulo-lgap06',
  })

  const [nivuPayload, setNivuPayload] = useState<any>(null)
  const [nivuResult, setNivuResult] = useState<any>(null)

  const sanitize = (str: string) => {
    if (!str) return ''
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
  }

  const formatDisplay = (str: string) => {
    if (!str) return ''
    return str.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

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
      toast.error(getErrorMessage(err) || 'Erro ao extrair dados da URL')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleAnalyzeNivu = async () => {
    const requiredFields = ['estado', 'cidade', 'bairro', 'tipo', 'negocio', 'area', 'preco']
    const missing = requiredFields.filter((f) => !formData[f as keyof typeof formData])
    if (missing.length > 0) {
      toast.error(`Campos obrigatórios faltando: ${missing.join(', ')}`)
      return
    }

    const area = Number(formData.area)
    const currentPrice = Number(formData.preco)
    if (area <= 0 || currentPrice <= 0) {
      toast.error('Área e Preço devem ser maiores que zero.')
      return
    }

    const location = `${formData.estado.toUpperCase().trim()} > ${formData.cidade.trim()} > ${formData.bairro.trim()}`
    const unitPrice = currentPrice / area
    const tipoId = propertyTypeMap[sanitize(formData.tipo)] || 1

    const payload = {
      location,
      property_type: tipoId,
      business_type: Number(formData.negocio),
      area,
      area_margin: 0.5,
      unit_price: unitPrice,
      unit_price_margin: 0.5,
      rooms: Number(formData.quartos) || 0,
      suites: Number(formData.suites) || 0,
      bathrooms: Number(formData.banheiros) || 0,
      parking_spots: Number(formData.vagas) || 0,
    }

    setNivuPayload(payload)
    setIsAnalyzing(true)

    try {
      const data = await fetchNivuAnalysis(payload)
      setNivuResult(data)

      const condo = Number(formData.condominio) || 0
      const iptu = Number(formData.iptu) || 0

      await createAnalise({
        usuario_id: user?.id,
        url_imovel: formData.url_imovel || '',
        preco_imovel: currentPrice,
        area,
        quartos: payload.rooms,
        suites: payload.suites,
        banheiros: payload.bathrooms,
        vagas: payload.parking_spots,
        tipo: tipoId,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        preco_inferido: data.inference || data.price,
        faixa_minima: data.price_lower_iqr,
        faixa_maxima: data.price_upper_iqr,
        preco_medio: data.price,
        preco_unitario: data.unit_price,
        liquidez: String(data.score_fit),
        registros_usados: data.records_total,
        condominio_atual: condo,
        condominio_media: data.unit_price * area * 0.001,
        iptu_atual: iptu,
        iptu_media: data.unit_price * area * 0.0001,
        data_analise: new Date().toISOString(),
      })

      toast.success('Análise concluída e salva com sucesso!')
    } catch (err: any) {
      console.error(err)
      toast.error(getErrorMessage(err) || 'Falha ao analisar dados na API NIVU')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  if (loading) return <div className="p-12 text-center text-slate-500">Carregando...</div>
  if (!isAuthenticated) return <Navigate to="/login" />

  return (
    <div className="container max-w-6xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Testar Integração</h1>
        <p className="text-muted-foreground">
          Preencha os dados manualmente ou extraia a partir de uma URL para testar as ferramentas.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extração de Dados</CardTitle>
              <CardDescription>
                Cole a URL do imóvel para preencher os dados automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>URL do Imóvel</Label>
                <div className="flex gap-2">
                  <Input
                    name="url_imovel"
                    value={formData.url_imovel}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                  <Button onClick={handleExtract} disabled={isExtracting} className="w-32 shrink-0">
                    {isExtracting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Extrair
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados do Imóvel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Estado (UF)</Label>
                  <Input name="estado" value={formData.estado} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input name="cidade" value={formData.cidade} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input name="bairro" value={formData.bairro} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo do Imóvel</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(v) => handleSelectChange('tipo', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(propertyTypeMap).map((k) => (
                        <SelectItem key={k} value={k}>
                          {formatDisplay(k)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Negócio</Label>
                  <Select
                    value={formData.negocio}
                    onValueChange={(v) => handleSelectChange('negocio', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Venda</SelectItem>
                      <SelectItem value="2">Aluguel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Área (m²)</Label>
                  <Input name="area" type="number" value={formData.area} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Quartos</Label>
                  <Input
                    name="quartos"
                    type="number"
                    value={formData.quartos}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Suítes</Label>
                  <Input
                    name="suites"
                    type="number"
                    value={formData.suites}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Banheiros</Label>
                  <Input
                    name="banheiros"
                    type="number"
                    value={formData.banheiros}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vagas</Label>
                  <Input
                    name="vagas"
                    type="number"
                    value={formData.vagas}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input
                    name="preco"
                    type="number"
                    value={formData.preco}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Condomínio</Label>
                  <Input
                    name="condominio"
                    type="number"
                    value={formData.condominio}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>IPTU</Label>
                  <Input name="iptu" type="number" value={formData.iptu} onChange={handleChange} />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button onClick={handleAnalyzeNivu} disabled={isAnalyzing} className="flex-1">
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Calculator className="w-4 h-4 mr-2" />
                  )}
                  Analisar com NIVU
                </Button>
                <Button variant="outline" onClick={handleTest} className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Testar Widget
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Código de Integração</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                <code>{iframeCode}</code>
              </pre>
            </CardContent>
          </Card>

          {nivuPayload && (
            <Card>
              <CardHeader>
                <CardTitle>Dados Enviados (Payload Nivu)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="w-1/2">Localização</TableHead>
                      <TableCell>{nivuPayload.location}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Tipo de Imóvel ID</TableHead>
                      <TableCell>{nivuPayload.property_type}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Preço Unitário Calculado</TableHead>
                      <TableCell>{formatCurrency(nivuPayload.unit_price)}/m²</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Quartos / Suítes / Banh. / Vagas</TableHead>
                      <TableCell>
                        {nivuPayload.rooms} / {nivuPayload.suites} / {nivuPayload.bathrooms} /{' '}
                        {nivuPayload.parking_spots}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {nivuResult && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados da Análise (Nivu API)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="w-1/2">Preço Inferido</TableHead>
                      <TableCell className="font-medium text-primary">
                        {formatCurrency(nivuResult.inference || nivuResult.price)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Faixa de Preço (Mín - Máx)</TableHead>
                      <TableCell>
                        {formatCurrency(nivuResult.price_lower_iqr)} -{' '}
                        {formatCurrency(nivuResult.price_upper_iqr)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Preço Médio / Preço Unitário</TableHead>
                      <TableCell>
                        {formatCurrency(nivuResult.price)} / {formatCurrency(nivuResult.unit_price)}
                        /m²
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Nível de Liquidez</TableHead>
                      <TableCell>{nivuResult.score_fit}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Tamanho da Amostra</TableHead>
                      <TableCell>{nivuResult.records_total} registros</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Condomínio / IPTU (Estimado)</TableHead>
                      <TableCell>
                        {formatCurrency(nivuResult.unit_price * nivuPayload.area * 0.001)} /{' '}
                        {formatCurrency(nivuResult.unit_price * nivuPayload.area * 0.0001)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
