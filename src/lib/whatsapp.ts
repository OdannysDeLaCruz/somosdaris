import { WhatsAppClient } from '@kapso/whatsapp-cloud-api'

const client = new WhatsAppClient({
  baseUrl: 'https://api.kapso.ai/meta/whatsapp',
  kapsoApiKey: process.env.KAPSO_API_KEY!
})

export async function sendOTP(phone: string, code: string) {
  console.log("phone", phone)
  console.log("process.env.KAPSO_API_KEY", process.env.KAPSO_API_KEY)
  console.log("process.env.KAPSO_PHONE_NUMBER_ID", process.env.KAPSO_PHONE_NUMBER_ID)

  await client.messages.sendText({
    phoneNumberId: process.env.KAPSO_PHONE_NUMBER_ID!,
    to: phone,
    body: `Tu código de verificación de SomosDaris es: ${code}\n\nNo lo comparta con nadie.`
  })
}
