import mailchimp from '@mailchimp/mailchimp_marketing'
import { NextResponse } from 'next/server'

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
})

export async function POST(req: Request) {
  const body = await req.json()
  const { email } = body

  if (!email) {
    return NextResponse.json(
      { error: 'Please enter your email.' },
      { status: 400 }
    )
  }

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID!, {
      email_address: email,
      status: 'subscribed',
    })

    return NextResponse.json({}, { status: 201 })
  } catch (error: any) {
    let errorMessage = ''
    try {
      errorMessage = JSON.parse(error.response.text).title
    } catch {
      errorMessage = error.toString()
    }

    if (errorMessage === 'Member Exists') {
      return NextResponse.json(
        {
          error: 'You have already signed up!',
          errorDetails: error,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: `Something weird happened! Send this to me: "${errorMessage}"`,
        errorDetails: error,
      },
      { status: 500 }
    )
  }
}
