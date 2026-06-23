import { createContext, useContext, useState, ReactNode } from 'react'

export type AnaliseImovel = {
  id: string
  usuario_id: string | null
  url_imovel: string
  preco_imovel: number
  area: number
  quartos: number
  suites: number
  banheiros: number
  vagas: number
  tipo: string
  bairro: string
  cidade: string
  estado: string
  preco_inferido: number
  faixa_minima: number
  faixa_maxima: number
  condominio_atual: number
  condominio_media: number
  iptu_atual: number
  iptu_media: number
  data_analise: string
}

// Mock Skip Cloud Analyses Collection
const mockAnalises: AnaliseImovel[] = [
  {
    id: 'prop-1',
    usuario_id: null,
    url_imovel: '/tatuape-70m',
    preco_imovel: 650000,
    area: 70,
    quartos: 2,
    suites: 1,
    banheiros: 2,
    vagas: 1,
    tipo: 'Apartamento',
    bairro: 'Tatuapé',
    cidade: 'São Paulo',
    estado: 'SP',
    preco_inferido: 726000,
    faixa_minima: 550000,
    faixa_maxima: 920000,
    condominio_atual: 750,
    condominio_media: 820,
    iptu_atual: 84,
    iptu_media: 110,
    data_analise: '2023-10-01',
  },
  {
    id: 'prop-2',
    usuario_id: '1',
    url_imovel: '/pinheiros-90m',
    preco_imovel: 1200000,
    area: 90,
    quartos: 3,
    suites: 2,
    banheiros: 3,
    vagas: 2,
    tipo: 'Apartamento',
    bairro: 'Pinheiros',
    cidade: 'São Paulo',
    estado: 'SP',
    preco_inferido: 1150000,
    faixa_minima: 1000000,
    faixa_maxima: 1400000,
    condominio_atual: 1200,
    condominio_media: 1100,
    iptu_atual: 250,
    iptu_media: 200,
    data_analise: '2023-10-05',
  },
]

type DataContextType = {
  analises: AnaliseImovel[]
  getAnalise: (id: string) => AnaliseImovel | undefined
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [analises] = useState<AnaliseImovel[]>(mockAnalises)

  const getAnalise = (id: string) => analises.find((a) => a.id === id)

  return <DataContext.Provider value={{ analises, getAnalise }}>{children}</DataContext.Provider>
}

export default function useDataStore() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useDataStore must be used within DataProvider')
  return context
}
