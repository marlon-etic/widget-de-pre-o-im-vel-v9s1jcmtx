import pb from '@/lib/pocketbase/client'

export const getAnalises = () => pb.collection('analises_imoveis').getFullList({ sort: '-created' })

export const createAnalise = (data: any) => pb.collection('analises_imoveis').create(data)

export const fetchNivuAnalysis = async (payload: any) => {
  return pb.send('/backend/v1/nivu-analysis', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}

export const extractProperty = async (url: string) => {
  return pb.send('/backend/v1/extract-property', {
    method: 'POST',
    body: JSON.stringify({ url }),
    headers: { 'Content-Type': 'application/json' },
  })
}
