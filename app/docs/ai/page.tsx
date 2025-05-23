import Link from "next/link"
import { ArrowRight, Brain, Code, FileText, Lightbulb, Layers, GitBranch, Cpu, Settings, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DocsCodeBlock from "@/components/docs-code-block"
import DocsSearch from "@/components/docs-search"
import DocsToc from "@/components/docs-toc"
import DocsFeedback from "@/components/docs-feedback"

export const metadata = {
  title: "Neural Network Documentation - ForSure",
  description: "Comprehensive documentation for ForSure's neural network and AI capabilities",
}

export default function AIDocsPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1 max-w-3xl">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm font-medium">
                Documentation
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Beta
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Neural Network Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Learn how ForSure's neural network learns from your coding style to create personalized project structures
            </p>
            <div className="pt-2">
              <DocsSearch />
            </div>
          </div>

          {/* Introduction */}
          <div className="space-y-4">
            <h2 id="introduction" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Introduction
            </h2>
            <p>
              ForSure's neural network is an advanced AI system designed to learn from your coding style and project
              structures. As you use ForSure to create and manage projects, the neural network analyzes your patterns,
              preferences, and conventions to deliver increasingly personalized results.
            </p>
            <p>
              This adaptive learning system helps maintain consistency across projects while reducing the cognitive load
              of decision-making around project organization. The more you use ForSure, the better it understands your
              style.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 my-6 border">
              <div className="flex items-start">
                <Lightbulb className="h-6 w-6 text-yellow-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">Beta Feature</h3>
                  <p className="text-muted-foreground">
                    The neural network feature is currently in beta. While it's fully functional, we're continuously
                    improving its capabilities and performance based on user feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-4">
            <h2 id="how-it-works" className="text-2xl font-semibold tracking-tight scroll-m-20">
              How It Works
            </h2>
            <p>
              ForSure's neural network operates through a multi-stage process that combines analysis, learning, and
              application to deliver personalized project structures.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      1
                    </div>
                    <CardTitle>Initial Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    When you first use ForSure, the neural network analyzes your existing projects (if you choose to
                    share them) or starts with a neutral baseline. It examines:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>File and directory naming conventions</li>
                    <li>Project structure organization</li>
                    <li>Code formatting preferences</li>
                    <li>Common patterns in your projects</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      2
                    </div>
                    <CardTitle>Pattern Recognition</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The neural network identifies recurring patterns in your work using advanced machine learning
                    algorithms:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Consistent naming patterns (camelCase, PascalCase, etc.)</li>
                    <li>Directory organization strategies</li>
                    <li>File grouping preferences</li>
                    <li>Common project structures you favor</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      3
                    </div>
                    <CardTitle>Continuous Learning</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    As you create more projects with ForSure, the neural network refines its understanding:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Updates its model with each new project you create</li>
                    <li>Learns from your modifications to suggested structures</li>
                    <li>Adapts to evolving preferences over time</li>
                    <li>Builds a comprehensive style profile unique to you</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      4
                    </div>
                    <CardTitle>Personalized Generation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    When generating new project structures, the neural network applies your style profile:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Creates structures that match your organizational preferences</li>
                    <li>Applies your naming conventions consistently</li>
                    <li>Suggests appropriate file groupings based on your patterns</li>
                    <li>Balances your preferences with project-specific requirements</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="space-y-4">
            <h2 id="technical-architecture" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Technical Architecture
            </h2>
            <p>
              ForSure's neural network is built on a sophisticated architecture designed specifically for code and
              project structure analysis.
            </p>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Core Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-primary" />
                      Neural Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      A transformer-based architecture optimized for code structure analysis, with specialized attention
                      mechanisms for hierarchical data.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Layers className="h-5 w-5 mr-2 text-primary" />
                      Style Encoder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Converts project structures into vector representations that capture organizational patterns and
                      naming conventions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <GitBranch className="h-5 w-5 mr-2 text-primary" />
                      Pattern Extractor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Identifies recurring patterns in project structures and extracts rules that define your personal
                      style.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Learning Process</h3>
                <div className="bg-muted p-6 rounded-lg">
                  <DocsCodeBlock
                    code={`// Simplified representation of the neural network learning process
                    
// 1. Encode project structure
function encodeProjectStructure(project) {
  const structureVector = styleEncoder.encode(project.fileStructure);
  const namingVector = styleEncoder.encode(project.namingConventions);
  const organizationVector = styleEncoder.encode(project.organization);
  
  return {
    structureVector,
    namingVector,
    organizationVector
  };
}

// 2. Extract patterns
function extractPatterns(encodedProjects) {
  const patterns = patternExtractor.analyze(encodedProjects);
  return patterns;
}

// 3. Update neural model
function updateModel(patterns, userFeedback) {
  const learningRate = calculateAdaptiveRate(userHistory);
  neuralModel.update(patterns, userFeedback, learningRate);
  return neuralModel.getUpdatedWeights();
}

// 4. Generate personalized structure
function generateStructure(projectRequirements) {
  const userStyleProfile = neuralModel.getUserProfile();
  const baseStructure = templateEngine.getBaseStructure(projectRequirements);
  
  return structureGenerator.apply(baseStructure, userStyleProfile);
}`}
                    language="javascript"
                    fileName="neural-network-process.js"
                    showLineNumbers={true}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Data Processing Pipeline</h3>
              <div className="relative overflow-hidden rounded-xl border bg-muted p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg border w-full md:w-1/4">
                    <Code className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold">Input</h4>
                    <p className="text-xs text-muted-foreground mt-1">Project files, structures, and user feedback</p>
                  </div>
                  <div className="hidden md:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="block md:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-muted-foreground"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg border w-full md:w-1/4">
                    <Brain className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold">Processing</h4>
                    <p className="text-xs text-muted-foreground mt-1">Pattern extraction and style analysis</p>
                  </div>
                  <div className="hidden md:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="block md:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-muted-foreground"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg border w-full md:w-1/4">
                    <Layers className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold">Model Update</h4>
                    <p className="text-xs text-muted-foreground mt-1">Neural network training and adaptation</p>
                  </div>
                  <div className="hidden md:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="block md:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-muted-foreground"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg border w-full md:w-1/4">
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold">Output</h4>
                    <p className="text-xs text-muted-foreground mt-1">Personalized project structures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Using the Neural Network */}
          <div className="space-y-4">
            <h2 id="using-neural-network" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Using the Neural Network
            </h2>
            <p>
              ForSure's neural network is designed to work seamlessly in the background, but you can also configure and
              interact with it directly.
            </p>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
              <p className="mb-4">
                The neural network is enabled by default for all users. As you create projects with ForSure, it will
                automatically begin learning your style preferences.
              </p>

              <Alert>
                <Brain className="h-4 w-4" />
                <AlertTitle>First-time users</AlertTitle>
                <AlertDescription>
                  For new users, the neural network will start with a neutral baseline and gradually adapt as you create
                  more projects. You'll notice increasing personalization after 3-5 projects.
                </AlertDescription>
              </Alert>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Initial Setup</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  To accelerate the learning process, you can provide existing projects for analysis:
                </p>

                <DocsCodeBlock
                  code={`# Analyze existing projects to train the neural network
forsure analyze --path ./my-projects --recursive

# Check the neural network's learning status
forsure ai status

# Generate a new project with neural network assistance
forsure new my-new-project --ai-enhanced`}
                  language="bash"
                />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Configuration Options</h3>
              <p className="mb-4">
                You can configure the neural network's behavior through the ForSure CLI or web application settings.
              </p>

              <Tabs defaultValue="cli">
                <TabsList className="mb-4">
                  <TabsTrigger value="cli">CLI Configuration</TabsTrigger>
                  <TabsTrigger value="web">Web App Configuration</TabsTrigger>
                  <TabsTrigger value="config">Config File</TabsTrigger>
                </TabsList>

                <TabsContent value="cli">
                  <DocsCodeBlock
                    code={`# Enable or disable the neural network
forsure config set ai.enabled true

# Set the learning rate (0.1-1.0, higher values adapt faster)
forsure config set ai.learningRate 0.5

# Configure which aspects to analyze
forsure config set ai.analyze.naming true
forsure config set ai.analyze.structure true
forsure config set ai.analyze.formatting true

# Reset the neural network to start fresh
forsure ai reset`}
                    language="bash"
                  />
                </TabsContent>

                <TabsContent value="web">
                  <p className="text-sm text-muted-foreground mb-4">
                    In the web application, navigate to Settings → AI & Neural Network to access configuration options:
                  </p>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-4 border-b">
                      <h4 className="font-medium">AI & Neural Network Settings</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Enable Neural Network</h5>
                          <p className="text-xs text-muted-foreground">
                            Allow the AI to learn from your projects and apply personalization
                          </p>
                        </div>
                        <div className="h-6 w-12 bg-primary rounded-full relative">
                          <div className="h-5 w-5 rounded-full bg-white absolute top-0.5 right-0.5"></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium">Learning Rate</h5>
                        <p className="text-xs text-muted-foreground">
                          How quickly the neural network adapts to your style (higher = faster adaptation)
                        </p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "50%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Conservative</span>
                          <span>Balanced</span>
                          <span>Aggressive</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium">Analysis Components</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="naming" className="rounded" checked readOnly />
                            <label htmlFor="naming" className="text-sm">
                              Naming Conventions
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="structure" className="rounded" checked readOnly />
                            <label htmlFor="structure" className="text-sm">
                              Project Structure
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="formatting" className="rounded" checked readOnly />
                            <label htmlFor="formatting" className="text-sm">
                              Code Formatting
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="comments" className="rounded" checked readOnly />
                            <label htmlFor="comments" className="text-sm">
                              Documentation Style
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="config">
                  <p className="text-sm text-muted-foreground mb-4">
                    You can also configure the neural network by editing the <code>.forsurerc</code> configuration file:
                  </p>
                  <DocsCodeBlock
                    code={`{
  "ai": {
    "enabled": true,
    "learningRate": 0.5,
    "analyze": {
      "naming": true,
      "structure": true,
      "formatting": true,
      "comments": true
    },
    "storage": {
      "local": true,
      "cloud": false
    },
    "privacy": {
      "shareAnonymousData": false,
      "collectFeedback": true
    }
  }
}`}
                    language="json"
                    fileName=".forsurerc"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Viewing Neural Network Insights</h3>
              <p className="mb-4">
                ForSure provides tools to view insights about what the neural network has learned about your style.
              </p>

              <DocsCodeBlock
                code={`# View a summary of your style profile
forsure ai profile

# Output:
# Style Profile Summary
# --------------------
# Naming Convention: Primarily camelCase (87% confidence)
# Directory Structure: Feature-based organization (92% confidence)
# File Grouping: Co-located tests and components (78% confidence)
# Common Patterns: 
#   - Components in separate directories
#   - Utility functions grouped by domain
#   - Configuration files at root level

# View detailed analysis of a specific aspect
forsure ai profile --aspect naming

# Export your style profile (can be imported on another machine)
forsure ai profile export --output my-style-profile.json`}
                language="bash"
              />

              <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Web Dashboard</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  The web application includes a neural network dashboard that provides visualizations of your style
                  profile, learning progress, and personalization insights. Access it at Settings → AI & Neural Network
                  → View Dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="space-y-4">
            <h2 id="best-practices" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Best Practices
            </h2>
            <p>Follow these recommendations to get the most out of ForSure's neural network capabilities.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Zap className="h-5 w-5 mr-2 text-primary" />
                    Initial Training
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Analyze at least 3-5 existing projects to establish a baseline</li>
                    <li>Include diverse project types for more comprehensive learning</li>
                    <li>Manually review and correct initial suggestions to accelerate learning</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Cpu className="h-5 w-5 mr-2 text-primary" />
                    Ongoing Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Provide feedback on generated structures to improve accuracy</li>
                    <li>Periodically check the neural network insights to understand its learning</li>
                    <li>Use the `--ai-enhanced` flag consistently for best results</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <GitBranch className="h-5 w-5 mr-2 text-primary" />
                    Team Environments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Create a shared team profile for consistent project structures</li>
                    <li>Export and share style profiles with new team members</li>
                    <li>Use project templates alongside neural network for standardization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Settings className="h-5 w-5 mr-2 text-primary" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Adjust learning rate based on how quickly you want adaptation</li>
                    <li>Focus analysis on aspects most important to your workflow</li>
                    <li>Reset the neural network if your style preferences change significantly</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/10">
              <h3 className="text-lg font-semibold mb-2">Pro Tip: Balancing AI and Manual Control</h3>
              <p className="text-sm text-muted-foreground">
                For optimal results, use the neural network as a starting point but maintain manual control over
                critical aspects of your project structure. This hybrid approach ensures you get the benefits of AI
                assistance while preserving your specific requirements for each project.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <div className="text-green-500 mt-0.5">✓</div>
                  <p className="text-sm">
                    <span className="font-medium">Do:</span> Review and adjust AI-generated structures before finalizing
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-red-500 mt-0.5">✗</div>
                  <p className="text-sm">
                    <span className="font-medium">Don't:</span> Rely solely on AI without reviewing the output
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-500 mt-0.5">✓</div>
                  <p className="text-sm">
                    <span className="font-medium">Do:</span> Provide feedback to improve future suggestions
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-red-500 mt-0.5">✗</div>
                  <p className="text-sm">
                    <span className="font-medium">Don't:</span> Ignore the learning process by constantly overriding
                    without feedback
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="space-y-4">
            <h2 id="troubleshooting" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Troubleshooting
            </h2>
            <p>
              If you encounter issues with the neural network feature, here are some common problems and their
              solutions.
            </p>

            <div className="mt-6 space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 border-b">
                  <h3 className="font-medium">Neural Network Not Learning My Style</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    If the neural network doesn't seem to be adapting to your style preferences:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Verify that the neural network is enabled in your settings</li>
                    <li>Check that you've created enough projects (at least 3-5) for effective learning</li>
                    <li>Try increasing the learning rate in your configuration</li>
                    <li>Run `forsure analyze` on your existing projects to provide more training data</li>
                    <li>
                      Ensure you're using the `--ai-enhanced` flag when generating new projects to apply personalization
                    </li>
                  </ul>
                  <DocsCodeBlock
                    code={`# Verify neural network status
forsure ai status

# Analyze existing projects to improve learning
forsure analyze --path ./my-projects --recursive

# Increase learning rate for faster adaptation
forsure config set ai.learningRate 0.8`}
                    language="bash"
                  />
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 border-b">
                  <h3 className="font-medium">Incorrect Style Predictions</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    If the neural network is generating structures that don't match your preferences:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>View your style profile to understand what the AI has learned</li>
                    <li>Provide explicit feedback on generated structures</li>
                    <li>Consider resetting the neural network if your preferences have changed significantly</li>
                    <li>Focus the analysis on specific aspects that are most important to you</li>
                  </ul>
                  <DocsCodeBlock
                    code={`# View your current style profile
forsure ai profile

# Provide feedback on a generated structure
forsure feedback --project my-project --rating 3 --comments "Directory structure is good, but naming needs improvement"

# Reset the neural network to start fresh
forsure ai reset`}
                    language="bash"
                  />
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 border-b">
                  <h3 className="font-medium">Performance Issues</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    If you experience slowdowns or performance issues with the neural network:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Reduce the scope of analysis by focusing on fewer aspects</li>
                    <li>Use local storage instead of cloud storage for the neural network model</li>
                    <li>Update to the latest version of ForSure for performance improvements</li>
                    <li>Consider disabling the neural network for very large projects if necessary</li>
                  </ul>
                  <DocsCodeBlock
                    code={`# Focus analysis on specific aspects only
forsure config set ai.analyze.naming true
forsure config set ai.analyze.structure true
forsure config set ai.analyze.formatting false
forsure config set ai.analyze.comments false

# Use local storage only
forsure config set ai.storage.cloud false

# Temporarily disable for a specific project
forsure new large-project --no-ai`}
                    language="bash"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h2 id="faq" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Frequently Asked Questions
            </h2>

            <div className="mt-6 space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Is my code or project data shared with others?</h3>
                <p className="text-sm text-muted-foreground">
                  No. Your code and project data remain private. The neural network runs locally on your machine by
                  default. You can optionally enable anonymous data sharing to help improve the system, but this is
                  disabled by default and only shares non-identifying pattern information, never your actual code.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">How long does it take for the neural network to learn my style?</h3>
                <p className="text-sm text-muted-foreground">
                  The neural network begins learning immediately, but you'll typically see noticeable personalization
                  after creating 3-5 projects. The more projects you create, the more refined the personalization
                  becomes. You can accelerate this process by analyzing existing projects.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">
                  Can I have multiple style profiles for different types of projects?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes. You can create and switch between multiple style profiles. This is useful if you work on
                  different types of projects (e.g., frontend vs. backend) that require different organizational
                  approaches.
                </p>
                <DocsCodeBlock
                  code={`# Create a new profile
forsure ai profile create frontend-profile

# Switch to a different profile
forsure ai profile use backend-profile

# List available profiles
forsure ai profile list`}
                  language="bash"
                />
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Can I export my style profile to use on another machine?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. You can export your style profile and import it on another machine or share it with team members.
                </p>
                <DocsCodeBlock
                  code={`# Export your style profile
forsure ai profile export --output my-style.json

# Import a style profile
forsure ai profile import --input my-style.json`}
                  language="bash"
                />
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Does the neural network work with all programming languages?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. The neural network focuses on project structure and naming conventions, which are
                  language-agnostic. It works with any programming language or framework that ForSure supports.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">What if I want to override the neural network's suggestions?</h3>
                <p className="text-sm text-muted-foreground">
                  You always have full control. The neural network provides suggestions, but you can modify or override
                  them at any time. You can also provide feedback to help the system learn from your corrections.
                </p>
              </div>
            </div>
          </div>

          {/* Advanced Topics */}
          <div className="space-y-4">
            <h2 id="advanced-topics" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Advanced Topics
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Team Collaboration</h3>
                <p className="mb-4">
                  ForSure's neural network can be used in team environments to maintain consistency across projects
                  while still respecting individual preferences.
                </p>

                <Card>
                  <CardHeader>
                    <CardTitle>Team Style Profiles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Teams can create shared style profiles that combine the preferences of all team members or enforce
                      team standards.
                    </p>
                    <DocsCodeBlock
                      code={`# Create a team profile
forsure team create dev-team

# Add members to the team
forsure team add-member dev-team --user alice@example.com
forsure team add-member dev-team --user bob@example.com

# Create a shared style profile for the team
forsure ai profile create --team dev-team

# Analyze team projects to build the shared profile
forsure analyze --team dev-team --path ./team-projects

# Use the team profile for a new project
forsure new project-name --team dev-team`}
                      language="bash"
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Custom Neural Network Training</h3>
                <p className="mb-4">
                  Advanced users can customize how the neural network learns and what aspects of your style it focuses
                  on.
                </p>

                <Card>
                  <CardHeader>
                    <CardTitle>Custom Training Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      You can create a custom training configuration to focus on specific aspects of your coding style.
                    </p>
                    <DocsCodeBlock
                      code={`{
  "training": {
    "focus": {
      "naming": 0.8,
      "structure": 1.0,
      "formatting": 0.4,
      "comments": 0.2
    },
    "weights": {
      "consistency": 0.7,
      "innovation": 0.3
    },
    "adaptationRate": {
      "initial": 0.5,
      "decay": 0.05,
      "minimum": 0.1
    }
  }
}`}
                      language="json"
                      fileName="ai-training-config.json"
                    />
                    <p className="text-sm text-muted-foreground">Apply the custom configuration:</p>
                    <DocsCodeBlock code={`forsure ai configure --config ai-training-config.json`} language="bash" />
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Integration with CI/CD Pipelines</h3>
                <p className="mb-4">
                  You can integrate ForSure's neural network capabilities into your CI/CD pipelines to ensure consistent
                  project structures across your organization.
                </p>

                <Card>
                  <CardHeader>
                    <CardTitle>CI/CD Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Example of integrating ForSure with GitHub Actions:</p>
                    <DocsCodeBlock
                      code={`name: ForSure Project Structure Check

on:
  pull_request:
    branches: [ main ]

jobs:
  structure-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install ForSure
        run: npm install -g forsure-cli
      
      - name: Import team style profile
        run: |
          echo "\${{ secrets.FORSURE_TEAM_PROFILE }}" > team-profile.json
          forsure ai profile import --input team-profile.json
      
      - name: Analyze project structure
        run: |
          forsure analyze --path ./ --output analysis.json

      - name: Check compliance with team standards
        run: |
          forsure validate --profile team --input analysis.json --threshold 0.8`}
                      language="yaml"
                      fileName=".github/workflows/forsure-check.yml"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* API Reference */}
          <div className="space-y-4">
            <h2 id="api-reference" className="text-2xl font-semibold tracking-tight scroll-m-20">
              API Reference
            </h2>
            <p>
              ForSure provides a comprehensive API for programmatic interaction with the neural network capabilities.
            </p>

            <div className="mt-6">
              <Tabs defaultValue="node">
                <TabsList className="mb-4">
                  <TabsTrigger value="node">Node.js API</TabsTrigger>
                  <TabsTrigger value="rest">REST API</TabsTrigger>
                </TabsList>

                <TabsContent value="node">
                  <DocsCodeBlock
                    code={`const { ForSure, NeuralNetwork } = require('forsure');

// Initialize ForSure with neural network enabled
const forsure = new ForSure({
  neuralNetwork: {
    enabled: true,
    learningRate: 0.5
  }
});

// Analyze existing projects
async function analyzeProjects() {
  const results = await forsure.neuralNetwork.analyze({
    path: './my-projects',
    recursive: true
  });
  
  console.log('Analysis complete:', results);
}

// Generate a project with neural network assistance
async function generateProject() {
  const project = await forsure.generate({
    name: 'my-new-project',
    template: 'react-app',
    aiEnhanced: true
  });
  
  console.log('Project generated at:', project.path);
}

// Get the current style profile
async function getStyleProfile() {
  const profile = await forsure.neuralNetwork.getProfile();
  console.log('Style profile:', profile);
}

// Provide feedback to improve learning
async function provideFeedback() {
  await forsure.neuralNetwork.feedback({
    projectPath: './my-project',
    rating: 4,
    comments: 'Good structure, but naming could be improved'
  });
}

// Export the neural network model
async function exportModel() {
  const modelData = await forsure.neuralNetwork.export();
  fs.writeFileSync('my-model.json', JSON.stringify(modelData));
}

// Import a neural network model
async function importModel() {
  const modelData = JSON.parse(fs.readFileSync('my-model.json'));
  await forsure.neuralNetwork.import(modelData);
}`}
                    language="javascript"
                    fileName="forsure-api-example.js"
                    showLineNumbers={true}
                  />
                </TabsContent>

                <TabsContent value="rest">
                  <p className="text-sm text-muted-foreground mb-4">
                    ForSure also provides a REST API for interacting with the neural network capabilities:
                  </p>
                  <DocsCodeBlock
                    code={`# Start the ForSure API server
forsure api start --port 3000

# API is now available at http://localhost:3000`}
                    language="bash"
                  />
                  <div className="mt-4 space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted p-4 border-b flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">GET</span>
                          <code>/api/neural-network/status</code>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Get the current status of the neural network
                        </p>
                        <DocsCodeBlock
                          code={`{
  "enabled": true,
  "version": "1.2.0",
  "learningRate": 0.5,
  "projectsAnalyzed": 12,
  "lastUpdated": "2023-05-15T14:32:10Z",
  "confidence": 0.87
}`}
                          language="json"
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted p-4 border-b flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">POST</span>
                          <code>/api/neural-network/analyze</code>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-2">Analyze a project structure</p>
                        <p className="text-xs text-muted-foreground mb-2">Request:</p>
                        <DocsCodeBlock
                          code={`{
  "path": "./my-project",
  "recursive": true,
  "includeContent": false
}`}
                          language="json"
                        />
                        <p className="text-xs text-muted-foreground mt-2 mb-2">Response:</p>
                        <DocsCodeBlock
                          code={`{
  "analysisId": "a1b2c3d4",
  "status": "complete",
  "patterns": {
    "naming": {
      "convention": "camelCase",
      "confidence": 0.92
    },
    "structure": {
      "type": "feature-based",
      "confidence": 0.87
    }
  }
}`}
                          language="json"
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted p-4 border-b flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">POST</span>
                          <code>/api/neural-network/generate</code>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Generate a project structure with AI assistance
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">Request:</p>
                        <DocsCodeBlock
                          code={`{
  "name": "my-new-project",
  "template": "react-app",
  "aiEnhanced": true,
  "outputPath": "./projects"
}`}
                          language="json"
                        />
                        <p className="text-xs text-muted-foreground mt-2 mb-2">Response:</p>
                        <DocsCodeBlock
                          code={`{
  "projectId": "p1q2r3s4",
  "path": "./projects/my-new-project",
  "aiConfidence": 0.89,
  "structure": {
    "files": 42,
    "directories": 15,
    "aiModifications": 8
  }
}`}
                          language="json"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h2 id="next-steps" className="text-2xl font-semibold tracking-tight scroll-m-20">
              Next Steps
            </h2>
            <p>Now that you understand ForSure's neural network capabilities, here are some next steps to explore:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Link href="/docs/ai/examples" className="block p-6 border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <div className="font-semibold">AI Examples</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  See real-world examples of neural network adaptation
                </div>
              </Link>

              <Link href="/docs/ai/advanced" className="block p-6 border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center mb-2">
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  <div className="font-semibold">Advanced AI Features</div>
                </div>
                <div className="text-sm text-muted-foreground">Explore advanced neural network capabilities</div>
              </Link>

              <Link href="/docs/ai/team-usage" className="block p-6 border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center mb-2">
                  <GitBranch className="h-5 w-5 mr-2 text-primary" />
                  <div className="font-semibold">Team Usage Guide</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Learn how to use neural networks in team environments
                </div>
              </Link>

              <Link href="/docs/ai/api" className="block p-6 border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center mb-2">
                  <Code className="h-5 w-5 mr-2 text-primary" />
                  <div className="font-semibold">Complete API Reference</div>
                </div>
                <div className="text-sm text-muted-foreground">Full documentation of the neural network API</div>
              </Link>
            </div>
          </div>

          {/* Feedback Section */}
          <DocsFeedback />
        </div>
      </div>

      {/* Table of Contents Sidebar */}
      <DocsToc className="w-64 flex-shrink-0" />
    </div>
  )
}
