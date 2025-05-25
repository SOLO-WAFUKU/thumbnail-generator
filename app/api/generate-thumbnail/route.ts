import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { title, description, style } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'タイトルは必須です' },
        { status: 400 }
      )
    }

    // スタイルに応じたプロンプトの調整
    const stylePrompts = {
      realistic: 'photorealistic, high quality photography',
      anime: 'anime style, manga style, japanese animation',
      cartoon: 'cartoon style, animated, colorful',
      'digital-art': 'digital art, artistic, creative design',
      '3d-render': '3D rendered, CGI, three dimensional'
    }

    // プロンプトの構築
    const basePrompt = `Create a YouTube thumbnail image with the following title prominently displayed: "${title}". 
    The image should be eye-catching, clickable, and optimized for YouTube thumbnails (16:9 aspect ratio).
    Include bold, readable text overlay.
    ${description ? `Additional details: ${description}` : ''}
    Style: ${stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.realistic}`

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: basePrompt,
      n: 1,
      size: '1792x1024', // 16:9に最も近いDALL-E 3のサイズ
      quality: 'standard',
      style: 'vivid',
    })

    const imageUrl = response.data[0].url

    if (!imageUrl) {
      throw new Error('画像URLが取得できませんでした')
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('サムネイル生成エラー:', error)
    
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API エラー: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'サムネイルの生成に失敗しました' },
      { status: 500 }
    )
  }
}
