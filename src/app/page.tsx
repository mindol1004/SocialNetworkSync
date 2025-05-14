import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UserPlus, LogIn, Users, MessageCircle, Image as ImageIcon, Heart } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-col items-center">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            MiniMeet
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Connect with friends and the world around you in a clean, minimalist experience
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs justify-center mb-16">
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg" variant="default">
              <LogIn className="mr-2 h-5 w-5" />
              Log in
            </Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button className="w-full" size="lg" variant="outline">
              <UserPlus className="mr-2 h-5 w-5" />
              Sign up
            </Button>
          </Link>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10">
          <Card className="bg-background/60 backdrop-blur border-primary/10 hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Connect with Friends</h3>
              <p className="text-muted-foreground">Find and follow friends to stay updated with their activities</p>
            </CardContent>
          </Card>
          
          <Card className="bg-background/60 backdrop-blur border-primary/10 hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Instant Messaging</h3>
              <p className="text-muted-foreground">Chat with your connections in real-time messaging</p>
            </CardContent>
          </Card>
          
          <Card className="bg-background/60 backdrop-blur border-primary/10 hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Share Moments</h3>
              <p className="text-muted-foreground">Post updates, photos and stories with your network</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Screenshot Mockup */}
        <div className="mt-20 relative w-full max-w-4xl mx-auto">
          <div className="relative bg-background rounded-xl shadow-2xl overflow-hidden border border-muted">
            <div className="bg-muted h-10 w-full flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="h-80 flex items-center justify-center bg-gradient-to-tr from-muted/50 to-background p-8">
              <div className="text-center">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">App screenshot preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 border-t border-border mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 MiniMeet. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}