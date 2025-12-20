import { supabaseServerClient } from './server'

export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabaseServerClient.auth.signInWithOtp({
      phone,
      options: {
        channel: 'sms',
      },
    })

    if (error) {
      console.error('Error sending OTP:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error sending OTP:', error)
    return { success: false, error: 'Failed to send OTP' }
  }
}

export async function verifyOTP(
  phone: string,
  code: string
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    const { data, error } = await supabaseServerClient.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    })

    if (error) {
      console.error('Error verifying OTP:', error)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'Invalid OTP' }
    }

    return { success: true, userId: data.user.id }
  } catch (error) {
    console.error('Unexpected error verifying OTP:', error)
    return { success: false, error: 'Failed to verify OTP' }
  }
}
