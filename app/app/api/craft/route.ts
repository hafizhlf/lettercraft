import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData()
    const resume = formData.get('resume') as File
    const jobDescription = formData.get('jobDescription') as File
    const language = formData.get('language') as string
    const tone = formData.get('tone') as string
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      throw new Error('Missing GEMINI_API_KEY. Ensure it is defined in your .env file.')
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    if (!resume) {
      return NextResponse.json({ error: 'No resume provided' }, { status: 400 })
    }

    if (!jobDescription) {
      return NextResponse.json({ error: 'No job description provided' }, { status: 400 })
    }

    const resumeMimeType = resume.type || 'application/octet-stream'
    const jobDescriptionMimeType = jobDescription.type || 'application/octet-stream'

    const resumeBuffer = Buffer.from(await resume.arrayBuffer())
    const jobDescriptionBuffer = Buffer.from(await jobDescription.arrayBuffer())

    const result = await model.generateContent([
      {
        inlineData: {
          data: resumeBuffer.toString("base64"),
          mimeType: resumeMimeType,
        },
      },
      {
        inlineData: {
          data: jobDescriptionBuffer.toString("base64"),
          mimeType: jobDescriptionMimeType,
        },
      },
      `Write a professional email to HR showcasing your enthusiasm and resume-backed skills. Align it with the job listing's tone in ${language} and make it stand out in ${tone} manner. Include the recipient's email at the top in this format: Email: recipient. Do not explain your response.`
    ])

    return NextResponse.json({ coverletter: result.response.text() })
  } catch (error) {
    console.error('Error generating cover letter:', error)
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 })
  }
}
