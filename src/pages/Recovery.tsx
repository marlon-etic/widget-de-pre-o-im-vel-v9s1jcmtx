import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'

export default function Recovery() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'E-mail enviado',
      description:
        'Se o e-mail existir em nossa base, você receberá um link para redefinir sua senha.',
    })
    setEmail('')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl rounded-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Recuperar senha
          </CardTitle>
          <CardDescription className="text-slate-500">
            Digite seu e-mail para receber um link de recuperação
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
            <Button
              type="submit"
              className="w-full h-12 text-[15px] font-bold rounded-xl shadow-md mt-2 bg-blue-600 hover:bg-blue-700"
            >
              Enviar
            </Button>
          </form>
          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Lembrou a senha?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-bold">
              Voltar para login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
