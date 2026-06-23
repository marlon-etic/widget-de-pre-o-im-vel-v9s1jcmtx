import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'

export default function Register() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signUp(email, senha, nome)
    setLoading(false)
    if (!error) {
      toast({ title: 'Conta criada com sucesso!' })
      navigate('/')
    } else {
      toast({ title: 'Erro ao criar conta', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl rounded-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Criar conta
          </CardTitle>
          <CardDescription className="text-slate-500">
            Cadastre-se para ter acesso a dados exclusivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="font-semibold text-slate-700">
                Nome completo
              </Label>
              <Input
                id="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="h-12 rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-slate-700">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha" className="font-semibold text-slate-700">
                Senha
              </Label>
              <Input
                id="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="h-12 rounded-xl border-slate-200"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-[15px] font-bold rounded-xl shadow-md mt-2 bg-blue-600 hover:bg-blue-700"
            >
              Cadastrar
            </Button>
          </form>
          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Já possui conta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-bold">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
