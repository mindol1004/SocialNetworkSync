'use client'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from '@/lib/i18n'
import { PlusCircle, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPosts } from '@/lib/firebase'

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('home')}</h1>
        <Button variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('newPost')}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-semibold text-sm text-primary">ME</span>
            </div>
            <div className="flex-1">
              <div className="bg-muted rounded-full px-4 py-2 text-muted-foreground cursor-pointer hover:bg-muted/80 transition">
              {t('whatsOnYourMind')}
            </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2">{t('loading')}</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center text-destructive">
              <p>{t('error')}</p>
            </CardContent>
          </Card>
        ) : posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <Card key={post.id}>
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-sm text-primary">
                      {post.userId?.substring(0, 2) || 'UN'}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {post.userId}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="whitespace-pre-wrap">{post.content}</p>
                {post.imageUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt="게시물 이미지"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                  <Button variant="ghost" size="sm">
                    좋아요 ({Object.keys(post.likes || {}).length})
                  </Button>
                  <Button variant="ghost" size="sm">
                    댓글 ({Object.keys(post.comments || {}).length})
                  </Button>
                  <Button variant="ghost" size="sm">
                    공유하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>{t('noPostsYet')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}