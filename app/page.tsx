'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Download, AlertCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'

export default function Home() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [style, setStyle] = useState('realistic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const generateThumbnail = async () => {
    if (!title.trim()) {
      setError('タイトルを入力してください')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          style,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'エラーが発生しました')
      }

      setGeneratedImages([data.imageUrl, ...generatedImages])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `thumbnail-${index + 1}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('ダウンロードエラー:', err)
    }
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">YouTube サムネイル生成ツール</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>サムネイル設定</CardTitle>
              <CardDescription>
                動画のタイトルと説明を入力して、AIがサムネイルを生成します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">動画タイトル *</Label>
                <Input
                  id="title"
                  placeholder="例: 【検証】AIだけで1週間生活してみた結果..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">追加の説明（任意）</Label>
                <Textarea
                  id="description"
                  placeholder="サムネイルに含めたい要素、雰囲気、色合いなど"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="style">スタイル</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">リアル</SelectItem>
                    <SelectItem value="anime">アニメ風</SelectItem>
                    <SelectItem value="cartoon">カートゥーン</SelectItem>
                    <SelectItem value="digital-art">デジタルアート</SelectItem>
                    <SelectItem value="3d-render">3Dレンダー</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button
                onClick={generateThumbnail}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  'サムネイルを生成'
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                生成には約10-20秒かかります
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>生成履歴</CardTitle>
              <CardDescription>
                生成されたサムネイルが表示されます
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  まだサムネイルが生成されていません
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-video overflow-hidden rounded-lg border">
                        <Image
                          src={imageUrl}
                          alt={`Generated thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => downloadImage(imageUrl, index)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        ダウンロード
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
