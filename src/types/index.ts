export interface PricingOption {
  id: string
  name: string
  description: string | null
  basePrice: number
  metadata?: unknown
  displayOrder: number
  isActive: boolean
}

export interface SelectOption {
  value: string
  label: string
}

export interface FormulaVariable {
  id: string
  name: string
  label: string
  type: string
  options?: SelectOption[]
  minValue: number | null
  maxValue: number | null
  defaultValue: string | null
  multiplier: number | null
  displayOrder: number
}