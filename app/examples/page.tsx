import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import CodeExample from '@/components/code-example'
import AnimateOnScroll from '@/components/animate-on-scroll'

export default function ExamplesPage() {
  return (
    <div className="container py-12 max-w-6xl">
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            ForSure Examples
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore real-world examples of ForSure in action across different
            project types.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimateOnScroll type="slideUp" delay={0.1}>
            <Link
              href="#web-app"
              className="bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 duration-300"
            >
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                Web Applications
              </h2>
              <p className="text-secondary/80 dark:text-primary-light/70 mb-4">
                Examples for React, Next.js, Vue, and other web frameworks.
              </p>
            </Link>
          </AnimateOnScroll>

          <AnimateOnScroll type="slideUp" delay={0.2}>
            <Link
              href="#backend"
              className="bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 duration-300"
            >
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                Backend Services
              </h2>
              <p className="text-secondary/80 dark:text-primary-light/70 mb-4">
                Examples for Node.js, Express, Django, and other backend
                frameworks.
              </p>
            </Link>
          </AnimateOnScroll>

          <AnimateOnScroll type="slideUp" delay={0.3}>
            <Link
              href="#mobile"
              className="bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 duration-300"
            >
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                Mobile Applications
              </h2>
              <p className="text-secondary/80 dark:text-primary-light/70 mb-4">
                Examples for React Native, Flutter, and native mobile
                development.
              </p>
            </Link>
          </AnimateOnScroll>
        </div>

        {/* Web Application Examples */}
        <section id="web-app" className="scroll-mt-20">
          <AnimateOnScroll type="fade">
            <div className="border-b pb-4 mb-8">
              <h2 className="text-3xl font-bold">Web Application Examples</h2>
              <p className="text-muted-foreground mt-2">
                ForSure files for common web application project structures.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="space-y-12">
            <AnimateOnScroll type="slideUp">
              <div className="bg-white dark:bg-secondary-dark/30 rounded-lg overflow-hidden border border-primary/10">
                <div className="bg-secondary/10 dark:bg-primary/10 p-4 border-b border-primary/10 flex justify-between items-center">
                  <h3 className="text-xl font-bold">
                    Next.js App Router Project
                  </h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/templates">View Template</Link>
                  </Button>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-6">
                    A modern Next.js project using the App Router, with a focus
                    on organization and scalability.
                  </p>
                  <CodeExample
                    code={`# nextjs-app.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the Next.js project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: Directory
    - Name: app/
    <description>
    Contains the app router structure for pages and layouts.
    </description>

    - Type: File
      - Name: layout.tsx
      <description>
      Root layout component that wraps all pages.
      </description>

    - Type: File
      - Name: page.tsx
      <description>
      The main landing page component.
      </description>

    - Type: Directory
      - Name: components/
      <description>
      Contains reusable UI components.
      </description>

      - Type: File
        - Name: button.tsx
        <description>
        Reusable button component.
        </description>

  - Type: Directory
    - Name: public/
    <description>
    Contains static assets like images and fonts.
    </description>`}
                    language="forsure"
                  />
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll type="slideUp">
              <div className="bg-white dark:bg-secondary-dark/30 rounded-lg overflow-hidden border border-primary/10">
                <div className="bg-secondary/10 dark:bg-primary/10 p-4 border-b border-primary/10 flex justify-between items-center">
                  <h3 className="text-xl font-bold">React Vite Project</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/templates">View Template</Link>
                  </Button>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-6">
                    A React project using Vite for fast development and
                    optimized production builds.
                  </p>
                  <CodeExample
                    code={`# react-vite.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the React Vite project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: File
    - Name: vite.config.js
    <description>
    Configuration for Vite bundler.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Contains the source code for the application.
    </description>

    - Type: File
      - Name: main.jsx
      <description>
      Entry point for the application.
      </description>

    - Type: File
      - Name: App.jsx
      <description>
      Root component of the application.
      </description>

    - Type: Directory
      - Name: components/
      <description>
      Contains reusable UI components.
      </description>

    - Type: Directory
      - Name: assets/
      <description>
      Contains static assets like images and styles.
      </description>`}
                    language="forsure"
                  />
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Backend Examples */}
        <section id="backend" className="scroll-mt-20">
          <AnimateOnScroll type="fade">
            <div className="border-b pb-4 mb-8">
              <h2 className="text-3xl font-bold">Backend Service Examples</h2>
              <p className="text-muted-foreground mt-2">
                ForSure files for common backend service project structures.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="space-y-12">
            <AnimateOnScroll type="slideUp">
              <div className="bg-white dark:bg-secondary-dark/30 rounded-lg overflow-hidden border border-primary/10">
                <div className="bg-secondary/10 dark:bg-primary/10 p-4 border-b border-primary/10 flex justify-between items-center">
                  <h3 className="text-xl font-bold">Express API Project</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/templates">View Template</Link>
                  </Button>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-6">
                    A Node.js API using Express, with a focus on modularity and
                    maintainability.
                  </p>
                  <CodeExample
                    code={`# express-api.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the Express API project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: File
    - Name: server.js
    <description>
    Entry point for the API server.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Contains the source code for the API.
    </description>

    - Type: Directory
      - Name: controllers/
      <description>
      Contains route controllers.
      </description>

      - Type: File
        - Name: userController.js
        <description>
        Controller for user-related endpoints.
        </description>

    - Type: Directory
      - Name: models/
      <description>
      Contains data models.
      </description>

      - Type: File
        - Name: userModel.js
        <description>
        User data model.
        </description>

    - Type: Directory
      - Name: routes/
      <description>
      Contains API route definitions.
      </description>

      - Type: File
        - Name: userRoutes.js
        <description>
        Routes for user-related endpoints.
        </description>

    - Type: Directory
      - Name: middleware/
      <description>
      Contains middleware functions.
      </description>

      - Type: File
        - Name: authMiddleware.js
        <description>
        Authentication middleware.
        </description>`}
                    language="forsure"
                  />
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll type="slideUp">
              <div className="bg-white dark:bg-secondary-dark/30 rounded-lg overflow-hidden border border-primary/10">
                <div className="bg-secondary/10 dark:bg-primary/10 p-4 border-b border-primary/10 flex justify-between items-center">
                  <h3 className="text-xl font-bold">Django REST API Project</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/templates">View Template</Link>
                  </Button>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-6">
                    A Python API using Django REST Framework, with a focus on
                    scalability and security.
                  </p>
                  <CodeExample
                    code={`# django-api.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the Django REST API project.
  </description>

  - Type: File
    - Name: manage.py
    <description>
    Django management script.
    </description>

  - Type: File
    - Name: requirements.txt
    <description>
    Lists Python dependencies.
    </description>

  - Type: Directory
    - Name: project/
    <description>
    Contains the Django project settings.
    </description>

    - Type: File
      - Name: settings.py
      <description>
      Django project settings.
      </description>

    - Type: File
      - Name: urls.py
      <description>
      Root URL configuration.
      </description>

  - Type: Directory
    - Name: api/
    <description>
    Contains the API application.
    </description>

    - Type: File
      - Name: models.py
      <description>
      Data models for the API.
      </description>

    - Type: File
      - Name: serializers.py
      <description>
      Serializers for the API.
      </description>

    - Type: File
      - Name: views.py
      <description>
      API views and viewsets.
      </description>

    - Type: File
      - Name: urls.py
      <description>
      API URL configuration.
      </description>`}
                    language="forsure"
                  />
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Mobile Examples */}
        <section id="mobile" className="scroll-mt-20">
          <AnimateOnScroll type="fade">
            <div className="border-b pb-4 mb-8">
              <h2 className="text-3xl font-bold">
                Mobile Application Examples
              </h2>
              <p className="text-muted-foreground mt-2">
                ForSure files for common mobile application project structures.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="space-y-12">
            <AnimateOnScroll type="slideUp">
              <div className="bg-white dark:bg-secondary-dark/30 rounded-lg overflow-hidden border border-primary/10">
                <div className="bg-secondary/10 dark:bg-primary/10 p-4 border-b border-primary/10 flex justify-between items-center">
                  <h3 className="text-xl font-bold">React Native Project</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/templates">View Template</Link>
                  </Button>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-6">
                    A React Native project for cross-platform mobile
                    development.
                  </p>
                  <CodeExample
                    code={`# react-native.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the React Native project.
  </description>

  - Type: File
    - Name: package.json
    <description>
    Lists project dependencies, scripts, and metadata.
    </description>

  - Type: File
    - Name: App.js
    <description>
    Entry point for the application.
    </description>

  - Type: Directory
    - Name: src/
    <description>
    Contains the source code for the application.
    </description>

    - Type: Directory
      - Name: screens/
      <description>
      Contains screen components.
      </description>

      - Type: File
        - Name: HomeScreen.js
        <description>
        Home screen component.
        </description>

      - Type: File
        - Name: ProfileScreen.js
        <description>
        Profile screen component.
        </description>

    - Type: Directory
      - Name: components/
      <description>
      Contains reusable UI components.
      </description>

      - Type: File
        - Name: Button.js
        <description>
        Reusable button component.
        </description>

    - Type: Directory
      - Name: navigation/
      <description>
      Contains navigation configuration.
      </description>

      - Type: File
        - Name: AppNavigator.js
        <description>
        Main navigation configuration.
        </description>

    - Type: Directory
      - Name: assets/
      <description>
      Contains static assets like images and fonts.
      </description>`}
                    language="forsure"
                  />
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll type="slideUp">
              <div className="bg-white dark:bg-secondary-dark/30 rounded-lg overflow-hidden border border-primary/10">
                <div className="bg-secondary/10 dark:bg-primary/10 p-4 border-b border-primary/10 flex justify-between items-center">
                  <h3 className="text-xl font-bold">Flutter Project</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/templates">View Template</Link>
                  </Button>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-6">
                    A Flutter project for cross-platform mobile development.
                  </p>
                  <CodeExample
                    code={`# flutter.forsure
root:
  - Type: Directory
  - Path: ./
  <description>
  Root directory of the Flutter project.
  </description>

  - Type: File
    - Name: pubspec.yaml
    <description>
    Lists project dependencies, assets, and metadata.
    </description>

  - Type: Directory
    - Name: lib/
    <description>
    Contains the source code for the application.
    </description>

    - Type: File
      - Name: main.dart
      <description>
      Entry point for the application.
      </description>

    - Type: Directory
      - Name: screens/
      <description>
      Contains screen widgets.
      </description>

      - Type: File
        - Name: home_screen.dart
        <description>
        Home screen widget.
        </description>

      - Type: File
        - Name: profile_screen.dart
        <description>
        Profile screen widget.
        </description>

    - Type: Directory
      - Name: widgets/
      <description>
      Contains reusable UI widgets.
      </description>

      - Type: File
        - Name: custom_button.dart
        <description>
        Reusable button widget.
        </description>

    - Type: Directory
      - Name: models/
      <description>
      Contains data models.
      </description>

      - Type: File
        - Name: user_model.dart
        <description>
        User data model.
        </description>

    - Type: Directory
      - Name: services/
      <description>
      Contains service classes for API calls, etc.
      </description>

      - Type: File
        - Name: api_service.dart
        <description>
        Service for API calls.
        </description>

  - Type: Directory
    - Name: assets/
    <description>
    Contains static assets like images and fonts.
    </description>`}
                    language="forsure"
                  />
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        <AnimateOnScroll type="fade">
          <div className="bg-muted dark:bg-muted/10 p-8 rounded-lg text-center space-y-4">
            <h2 className="text-2xl font-bold">
              Ready to Create Your Own Project Structure?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with ForSure today and define your project structure
              with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild>
                <Link href="/download" className="flex items-center">
                  Download ForSure CLI
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/templates" className="flex items-center">
                  Browse Templates <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
