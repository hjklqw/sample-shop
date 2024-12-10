import emailjs from '@emailjs/nodejs'

emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY!,
  privateKey: process.env.EMAILJS_PRIVATE_KEY!,
})

export async function sendEmail(
  templateID: string,
  toEmail: string,
  data: any
) {
  try {
    await emailjs.send(process.env.EMAILJS_SERVICE_ID!, templateID, {
      ...data,
      toEmail,
    })
  } catch (error) {
    console.error(`[sendEmail] Failed!`, error)
  }
}
