import { cn } from "@/lib/utils"

interface FormProgressProps {
  steps: string[]
  currentStep: number
}

export function FormProgress({ steps, currentStep }: FormProgressProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium text-sm",
              currentStep >= index
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30 text-muted-foreground",
            )}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={cn("w-12 h-1 mx-1", currentStep > index ? "bg-primary" : "bg-muted-foreground/30")} />
          )}
        </div>
      ))}
    </div>
  )
}
