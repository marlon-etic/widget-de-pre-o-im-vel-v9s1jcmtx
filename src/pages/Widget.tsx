import { useSearchParams } from 'react-router-dom'
import { PriceAnalysisWidget } from '@/components/widget/PriceAnalysisWidget'

export default function Widget() {
  const [searchParams] = useSearchParams()

  const sanitize = (str: string | null) => {
    if (!str) return ''
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
  }

  const propertyType = sanitize(searchParams.get('tipo')) || 'apartamento'
  const state = sanitize(searchParams.get('estado')) || 'sp'
  const city = sanitize(searchParams.get('cidade')) || 'sao-paulo'
  const neighborhood = sanitize(searchParams.get('bairro')) || 'tatuape'
  const area = Number(searchParams.get('area')) || 70
  const rooms = Number(searchParams.get('quartos')) || 2
  const suites = Number(searchParams.get('suites')) || 1
  const bathrooms = Number(searchParams.get('banheiros')) || 1
  const parkingSpots = Number(searchParams.get('vagas')) || 1
  const currentPrice = Number(searchParams.get('preco')) || 650000
  const businessType = Number(searchParams.get('negocio')) || 1
  const condo = Number(searchParams.get('condominio')) || 750
  const iptu = Number(searchParams.get('iptu')) || 84
  const url_imovel = searchParams.get('url_imovel') || window.location.href

  return (
    <div className="w-full flex justify-center items-start min-h-screen bg-transparent p-0">
      <PriceAnalysisWidget
        propertyType={propertyType}
        state={state}
        city={city}
        neighborhood={neighborhood}
        area={area}
        rooms={rooms}
        suites={suites}
        bathrooms={bathrooms}
        parkingSpots={parkingSpots}
        currentPrice={currentPrice}
        businessType={businessType}
        condo={condo}
        iptu={iptu}
        url={url_imovel}
      />
    </div>
  )
}
