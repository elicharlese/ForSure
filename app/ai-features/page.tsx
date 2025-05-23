import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Zap,
  Fingerprint,
  Code,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Cpu,
  GitBranch,
  FileText,
} from "lucide-react"

export const metadata = {
  title: "AI Features - ForSure",
  description: "Explore the advanced neural network capabilities of ForSure's prompting programming language",
}

export default function AIFeaturesPage() {
  return (
    <div className="container py-12 max-w-6xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Neural Network & AI Features</h1>
          <p className="text-xl text-muted-foreground">
            ForSure's advanced neural network learns from your coding style to deliver personalized project structures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              Beta Feature
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Style Learning Engine</h2>
            <p className="text-muted-foreground">
              Our neural network analyzes your coding patterns and project structures to learn your unique style and
              preferences.
            </p>
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Fingerprint className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Style Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    Identifies your naming conventions, file organization patterns, and architectural preferences
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Adaptive Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    Continuously improves with each project you create, becoming more aligned with your preferences
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Personalized Output</h3>
                  <p className="text-sm text-muted-foreground">
                    Generates project structures that feel like they were created by you, following your established
                    patterns
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden border bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-lg">Neural Network Analysis</h3>
                </div>
                <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                  Real-time
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Naming Convention Analysis</span>
                    <span className="text-xs text-muted-foreground">98% confidence</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "98%" }}></div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Detected preference: camelCase for variables, PascalCase for components
                  </div>
                </div>

                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Directory Structure Pattern</span>
                    <span className="text-xs text-muted-foreground">87% confidence</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "87%" }}></div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Detected preference: feature-based organization with shared utilities
                  </div>
                </div>

                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Code Organization Style</span>
                    <span className="text-xs text-muted-foreground">92% confidence</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "92%" }}></div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Detected preference: modular components with clear separation of concerns
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button variant="outline" className="bg-background/50 backdrop-blur-sm">
                  View Full Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-8">
          <Tabs defaultValue="how-it-works">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            <TabsContent value="how-it-works" className="p-4 border rounded-lg mt-4 space-y-4">
              <h3 className="text-xl font-semibold">How Our Neural Network Works</h3>
              <p className="text-muted-foreground">
                ForSure's neural network uses a combination of pattern recognition, machine learning, and natural
                language processing to understand your coding style.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Code className="h-5 w-5 mr-2 text-primary" />
                      Initial Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      When you first use ForSure, our neural network analyzes your existing projects to establish a
                      baseline understanding of your style.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <GitBranch className="h-5 w-5 mr-2 text-primary" />
                      Continuous Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      As you create more projects with ForSure, the neural network refines its understanding of your
                      preferences and patterns.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-primary" />
                      Adaptive Output
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      When generating new project structures, the neural network applies your style preferences to
                      create personalized results.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-semibold mb-2">Technical Implementation</h4>
                <p className="text-sm text-muted-foreground">
                  Our neural network is built on a transformer-based architecture similar to GPT models, but specialized
                  for code and project structure analysis. It uses a combination of supervised learning from our
                  extensive dataset of project structures and reinforcement learning from user feedback.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="p-4 border rounded-lg mt-4 space-y-4">
              <h3 className="text-xl font-semibold">Benefits of Neural Network Integration</h3>
              <p className="text-muted-foreground">
                ForSure's neural network capabilities provide numerous advantages for developers and teams.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Cpu className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Time Savings</h4>
                    <p className="text-sm text-muted-foreground">
                      Reduce the time spent on project setup by up to 80% with structures that match your preferences
                      automatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Consistency</h4>
                    <p className="text-sm text-muted-foreground">
                      Maintain consistent project structures across your entire portfolio, even as your team grows.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Reduced Cognitive Load</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on solving problems instead of deciding where files should go or how they should be named.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Personalization</h4>
                    <p className="text-sm text-muted-foreground">
                      Get project structures that feel like they were created by you, not by a generic template.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Team Benefits</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Teams can create shared neural network profiles that learn the team's collective style, ensuring
                  consistency across all team members while still allowing for individual preferences where appropriate.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="p-4 border rounded-lg mt-4 space-y-4">
              <h3 className="text-xl font-semibold">Neural Network in Action</h3>
              <p className="text-muted-foreground">
                See how ForSure's neural network adapts to different coding styles and preferences.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Before Neural Network</Badge>
                    <h4 className="font-semibold">Generic Project Structure</h4>
                  </div>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-auto max-h-80">
                    <pre>{`root:
  - src/
    - components/
      - Button.jsx
      - Card.jsx
      - Input.jsx
    - pages/
      - Home.jsx
      - About.jsx
      - Contact.jsx
    - utils/
      - helpers.js
      - api.js
  - public/
    - images/
    - fonts/
  - package.json
  - README.md`}</pre>
                  </div>
                  <p className="text-xs text-muted-foreground">Standard project structure without personalization</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">
                      After Neural Network
                    </Badge>
                    <h4 className="font-semibold">Personalized Project Structure</h4>
                  </div>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-auto max-h-80 border-2 border-primary/20">
                    <pre>{`root:
  - src/
    - features/
      - home/
        - components/
          - HomeHero.tsx
          - FeatureList.tsx
        - hooks/
          - useHomeData.ts
        - HomePage.tsx
      - about/
        - components/
          - TeamSection.tsx
          - CompanyHistory.tsx
        - AboutPage.tsx
      - shared/
        - ui/
          - Button.tsx
          - Card.tsx
          - Input.tsx
        - utils/
          - formatters.ts
          - api-client.ts
    - types/
      - index.ts
  - public/
    - assets/
      - images/
      - fonts/
  - package.json
  - README.md`}</pre>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium">Neural network adaptations:</span> Feature-based
                    organization, TypeScript preference, custom naming conventions, and more detailed component
                    separation
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-semibold mb-2">Real User Testimonial</h4>
                <blockquote className="text-sm italic text-muted-foreground border-l-4 border-primary/20 pl-4">
                  "I was skeptical about the neural network feature at first, but after using ForSure for a few
                  projects, I'm amazed at how well it's learned my preferences. The structures it generates now feel
                  like they were created by me, saving me hours of setup time."
                </blockquote>
                <p className="text-right text-sm font-medium mt-2">— Alex Chen, Senior Frontend Developer</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="py-8">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 border">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <Badge variant="outline" className="bg-background/50 backdrop-blur-sm mb-4">
                Coming Soon
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Advanced Neural Network Features</h2>
              <p className="text-muted-foreground">
                We're constantly improving our neural network capabilities. Here's what's coming next:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Code Generation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Generate not just project structures, but actual code that matches your coding style
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Multi-Framework Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Neural network will learn your style across different frameworks and languages
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Style Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Receive suggestions for improving your project structure based on best practices
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/beta-program" className="flex items-center">
                    Join our beta program <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Ready to experience our neural network?</h2>
              <p className="text-muted-foreground">Try ForSure today and see how our AI adapts to your coding style.</p>
            </div>
            <div className="flex gap-4">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/download" className="flex items-center">
                  Download CLI <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app" className="flex items-center">
                  Try Web App <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
