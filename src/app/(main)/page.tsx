import { redirect } from 'next/navigation'

export default function MainPage() {
  // 기본 경로는 dashboard로 리디렉션
  redirect('/dashboard')
}