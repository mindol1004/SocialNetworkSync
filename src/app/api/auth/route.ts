import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase'

export async function GET() {
  const currentUser = auth.currentUser
  
  if (!currentUser) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  
  return NextResponse.json({
    user: {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
    }
  })
}