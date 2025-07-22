'use client'

import { useState } from 'react'
import { deleteProfile } from '@/lib/profiles'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function ProfileCard({ profile, currentUserId, onDelete, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const isOwner = currentUserId === profile.user_id  // user_id로 비교

  const handleDelete = async () => {
    if (!confirm('정말 내 소개를 삭제할까요? 😢')) {
      return
    }

    setIsDeleting(true)
    try {
      const { error } = await deleteProfile(profile.id)  // bigint ID로 삭제
      if (error) {
        alert('삭제 중 문제가 생겼어요: ' + error)
      } else {
        onDelete?.(profile.id)  // bigint ID 전달
      }
    } catch (error) {
      alert('삭제 중 문제가 생겼어요.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card variant="hover">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {profile.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {profile.username || '익명의 동기'}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(profile.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(profile)}
              >
                수정
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? '삭제중...' : '삭제'}
              </Button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">
            {profile.intro || '아직 자기소개를 작성하지 않았어요.'}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>등록일: {new Date(profile.created_at).toLocaleString('ko-KR')}</span>
            {isOwner && (
              <span className="text-blue-600 font-medium">내 소개</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
} 