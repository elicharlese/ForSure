interface FormProgressProps {
  steps: string[]
  currentStep: number
}

export function FormProgress({ steps, currentStep }: FormProgressProps) {
  return <div className="w-full max-w-3xl mx-auto mb-8">{/* Progress counter removed as requested */}</div>
}
