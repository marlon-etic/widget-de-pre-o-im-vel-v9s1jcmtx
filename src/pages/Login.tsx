import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useAuthStore from '@/stores/useAuthStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(email, senha)) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl rounded-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Entrar
          </CardTitle>
          <CardDescription className="text-slate-500">
            Acesse sua conta para ver análises completas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="senha" className="font-semibold text-slate-700">
                  Senha
                </Label>
                <Link
                  to="/recovery"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <Input
                id="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-[15px] font-bold rounded-xl shadow-md mt-2 bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Button>
          </form>
          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Ainda não tem conta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-bold">
              Criar conta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
