export function normalizePhone(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // If it already starts with 57 (Colombia code), prepend +
  if (cleaned.startsWith('57')) {
    return `+${cleaned}`
  }

  // Otherwise, prepend +57 (Colombia)
  return `+57${cleaned}`
}

export function validatePhone(phone: string): boolean {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // Colombian mobile numbers are typically 10 digits (without country code)
  // With country code: +57 followed by 10 digits
  if (cleaned.length === 10) {
    return true
  }

  if (cleaned.length === 12 && cleaned.startsWith('57')) {
    return true
  }

  return false
}
