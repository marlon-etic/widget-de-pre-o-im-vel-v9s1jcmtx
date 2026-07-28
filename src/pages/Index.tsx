import { PriceAnalysisWidget } from '@/components/widget/PriceAnalysisWidget'
import { MapPin, Bed, Bath, Square, Car, Share, Heart, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export default function Index() {
  const { user, signOut } = useAuth()
  const [searchParams] = useSearchParams()

  const propertyType = searchParams.get('tipo') || 'Apartamento'
  const state = searchParams.get('estado') || 'SP'
  const city = searchParams.get('cidade') || 'São Paulo'
  const neighborhood = searchParams.get('bairro') || 'Tatuapé'
  const area = Number(searchParams.get('area')) || 70
  const rooms = Number(searchParams.get('quartos')) || 2
  const suites = Number(searchParams.get('suites')) || 1
  const bathrooms = Number(searchParams.get('banheiros')) || 1
  const parkingSpots = Number(searchParams.get('vagas')) || 1
  const currentPrice = Number(searchParams.get('preco')) || 650000
  const businessType = Number(searchParams.get('negocio')) || 1
  const condo = Number(searchParams.get('condominio')) || 750
  const iptu = Number(searchParams.get('iptu')) || 84
  const url_imovel = searchParams.get('url_imovel') || window.location.pathname

  const formatDisplay = (str: string) =>
    str.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Mock Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-primary tracking-tighter">SkipImóveis.</div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-primary">
              Comprar
            </a>
            <a href="#" className="hover:text-primary">
              Alugar
            </a>
            <a href="#" className="hover:text-primary">
              Lançamentos
            </a>
            <Link to="/teste-integracao" className="hover:text-primary font-bold text-blue-600">
              Testar Integração
            </Link>
          </nav>
          <div className="flex gap-2 items-center">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">
                  Olá, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  title="Sair"
                  className="text-slate-500 hover:text-red-600"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="font-semibold text-slate-600">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-4">
        {/* Left Column: Property Details Content */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Main Image Gallery Placeholder */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm group">
            <img
              src="https://img.usecurling.com/p/800/500?q=modern%20apartment%20living%20room"
              className="w-full h-[350px] sm:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Sala de estar do apartamento"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-slate-900/80 backdrop-blur-md text-white border-0 font-medium">
                Lançamento
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white text-slate-700"
              >
                <Share size={16} />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white text-slate-700"
              >
                <Heart size={16} />
              </Button>
            </div>
          </div>

          {/* Property Info Head */}
          <div>
            <div className="flex items-center text-sm font-medium text-slate-500 mb-2">
              <MapPin size={16} className="mr-1.5" />
              {formatDisplay(neighborhood)}, {formatDisplay(city)} -{' '}
              {formatDisplay(state).toUpperCase()}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {formatDisplay(propertyType)} moderno com varanda gourmet no{' '}
              {formatDisplay(neighborhood)}
            </h1>

            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-200 mt-6">
              <div className="flex items-center text-slate-700 font-medium">
                <Square size={20} className="mr-2 text-slate-400" /> {area}m² úteis
              </div>
              <div className="flex items-center text-slate-700 font-medium">
                <Bed size={20} className="mr-2 text-slate-400" /> {rooms} Quartos
              </div>
              <div className="flex items-center text-slate-700 font-medium">
                <Bath size={20} className="mr-2 text-slate-400" /> {suites} Suíte
              </div>
              <div className="flex items-center text-slate-700 font-medium">
                <Car size={20} className="mr-2 text-slate-400" /> {parkingSpots} Vaga
              </div>
            </div>
          </div>

          {/* Description Snippet */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Sobre o imóvel</h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Lindo apartamento em localização privilegiada no Tatuapé. Acabamento de primeira
              linha, varanda envidraçada integrada à sala, móveis planejados em todos os ambientes e
              lazer completo. Próximo à estação de metrô e aos principais shoppings da região.
            </p>
          </div>
        </div>

        {/* Right Column: Price Analysis Widget (Sticky Sidebar) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24 space-y-6 flex flex-col items-center lg:items-start">
            {/* Direct Context Price Tag */}
            <div className="w-full max-w-[500px] bg-white rounded-xl p-6 shadow-sm border border-slate-200/60 mb-2">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">
                Preço do Imóvel
              </p>
              <h2 className="text-4xl font-black text-slate-900 mb-4">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  currentPrice,
                )}
              </h2>
              <a
                href={`https://wa.me/5511970932722?text=${encodeURIComponent(
                  `Olá! Gostaria de falar com um especialista sobre este imóvel: ${url_imovel}`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-12 inline-flex items-center justify-center text-md font-bold rounded-xl shadow-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Falar com o corretor
              </a>
            </div>

            {/* The Target Component */}
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
        </div>
      </main>
    </div>
  )
}
