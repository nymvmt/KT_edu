'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp, signIn } from '@/lib/auth'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)
    setError('')

    // 회원가입 시도
    const { data: signUpData, error: signUpError } = await signUp(email, password)
    
    if (signUpError) {
      setError(signUpError)
      setLoading(false)
      return
    }

    // 회원가입 후 바로 로그인
    const { data: signInData, error: signInError } = await signIn(email, password)
    
    if (signInError) {
      setError('가입은 완료되었습니다! 로그인 페이지에서 다시 시도해주세요.')
      setLoading(false)
      return
    }

    // 성공시 방명록 페이지로 이동
    router.push(ROUTES.PROFILES)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">새로운 동기를 환영해요! 🎊</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="회사 이메일을 입력하세요"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호를 설정하세요"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? '가입 중...' : '동기들과 친해지기 시작! 🚀'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-600">이미 등록하셨나요? </span>
          <Button
            variant="link"
            href={ROUTES.LOGIN}
            className="text-blue-600 hover:underline"
          >
            로그인하기
          </Button>
        </div>
      </Card>
    </div>
  )
} 