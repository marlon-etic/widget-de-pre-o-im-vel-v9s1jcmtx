import { createContext, useContext, useState, ReactNode } from 'react'
import { toast } from '@/components/ui/use-toast'

export type User = {
  id: string
  email: string
  nome_completo: string
  data_criacao: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, senha: string) => boolean
  register: (nome_completo: string, email: string, senha: string) => boolean
  logout: () => void
}

// Mock Skip Cloud Users Collection
const initialUsers = [
  {
    id: '1',
    email: 'teste@teste.com',
    senha: '123',
    nome_completo: 'Usuário Teste',
    data_criacao: '2023-01-01',
  },
  {
    id: '2',
    email: 'admin@skip.com',
    senha: 'admin',
    nome_completo: 'Administrador Skip',
    data_criacao: '2023-01-02',
  },
]

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState(initialUsers)
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, senha: string) => {
    const foundUser = users.find((u) => u.email === email && u.senha === senha)
    if (foundUser) {
      setUser({
        id: foundUser.id,
        email: foundUser.email,
        nome_completo: foundUser.nome_completo,
        data_criacao: foundUser.data_criacao,
      })
      toast({ title: 'Login realizado com sucesso!' })
      return true
    }
    toast({ title: 'Credenciais inválidas', variant: 'destructive' })
    return false
  }

  const register = (nome_completo: string, email: string, senha: string) => {
    if (users.find((u) => u.email === email)) {
      toast({ title: 'Email já cadastrado', variant: 'destructive' })
      return false
    }
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      senha,
      nome_completo,
      data_criacao: new Date().toISOString(),
    }
    setUsers([...users, newUser])
    toast({ title: 'Conta criada com sucesso!' })
    return true
  }

  const logout = () => {
    setUser(null)
    toast({ title: 'Você saiu da sua conta.' })
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuthStore() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthStore must be used within AuthProvider')
  return context
}
