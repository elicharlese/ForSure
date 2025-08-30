'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import {
  ArrowLeft,
  Settings,
  Palette,
  Code,
  Globe,
  Bell,
  Shield,
  Keyboard,
  Database,
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Editor settings
  const [editorSettings, setEditorSettings] = useState({
    theme: 'vs-dark',
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    lineNumbers: true,
    minimap: true,
    autoSave: true,
    formatOnSave: true,
    autoIndent: true,
    bracketPairs: true,
    snippets: true,
    autoClosingBrackets: true,
    autoClosingQuotes: true,
  })

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    accentColor: 'blue',
    density: 'comfortable',
    animationsEnabled: true,
    sidebarPosition: 'left',
    showStatusBar: true,
  })

  // Formatter settings
  const [formatterSettings, setFormatterSettings] = useState({
    defaultFormatter: 'prettier',
    semiColons: true,
    trailingComma: 'es5',
    singleQuote: true,
    tabWidth: 2,
    printWidth: 80,
    arrowParens: 'always',
    endOfLine: 'lf',
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    browserNotifications: true,
    formatCompletedNotifications: true,
    validationErrorNotifications: true,
    teamInviteNotifications: true,
    updateNotifications: true,
  })

  // Keyboard shortcuts
  const [keyboardSettings, setKeyboardSettings] = useState({
    formatShortcut: 'Ctrl+Alt+F',
    validateShortcut: 'Ctrl+Alt+V',
    saveShortcut: 'Ctrl+S',
    newFileShortcut: 'Ctrl+N',
    findShortcut: 'Ctrl+F',
    replaceShortcut: 'Ctrl+H',
  })

  // Integration settings
  const [integrationSettings, setIntegrationSettings] = useState({
    githubConnected: false,
    vercelConnected: false,
    slackConnected: false,
    vscodeConnected: false,
  })

  // Storage settings
  const [storageSettings, setStorageSettings] = useState({
    localStorageEnabled: true,
    cloudSyncEnabled: true,
    autoBackup: true,
    backupFrequency: 'daily',
    maxBackupSize: 100,
    compressionEnabled: true,
  })

  const handleSaveSettings = () => {
    setIsLoading(true)

    // Simulate saving settings
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
      })
    }, 1000)
  }

  const handleResetSettings = () => {
    // Confirmation dialog would be here in a real app
    toast({
      title: 'Settings reset',
      description: 'Your settings have been reset to default values.',
      variant: 'destructive',
    })
  }

  const handleEditorChange = (key, value) => {
    setEditorSettings(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/app')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Customize your ForSure experience
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Editor</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="formatter" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Formatter</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="keyboard" className="flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            <span className="hidden sm:inline">Keyboard</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Storage</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Editor Settings */}
        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>Editor Settings</CardTitle>
              <CardDescription>
                Customize your code editing experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="editor-theme">Editor Theme</Label>
                  <Select
                    value={editorSettings.theme}
                    onValueChange={value => handleEditorChange('theme', value)}
                  >
                    <SelectTrigger id="editor-theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vs">Light</SelectItem>
                      <SelectItem value="vs-dark">Dark</SelectItem>
                      <SelectItem value="hc-black">High Contrast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">
                    Font Size ({editorSettings.fontSize}px)
                  </Label>
                  <Slider
                    id="font-size"
                    min={10}
                    max={24}
                    step={1}
                    value={[editorSettings.fontSize]}
                    onValueChange={value =>
                      handleEditorChange('fontSize', value[0])
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tab-size">Tab Size</Label>
                  <Select
                    value={editorSettings.tabSize.toString()}
                    onValueChange={value =>
                      handleEditorChange('tabSize', Number.parseInt(value))
                    }
                  >
                    <SelectTrigger id="tab-size">
                      <SelectValue placeholder="Select tab size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 spaces</SelectItem>
                      <SelectItem value="4">4 spaces</SelectItem>
                      <SelectItem value="8">8 spaces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="print-width">
                    Print Width ({formatterSettings.printWidth} chars)
                  </Label>
                  <Slider
                    id="print-width"
                    min={40}
                    max={120}
                    step={1}
                    value={[formatterSettings.printWidth]}
                    onValueChange={value =>
                      setFormatterSettings(prev => ({
                        ...prev,
                        printWidth: value[0],
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Word Wrap</Label>
                    <p className="text-sm text-muted-foreground">
                      Wrap long lines in the editor
                    </p>
                  </div>
                  <Switch
                    checked={editorSettings.wordWrap}
                    onCheckedChange={checked =>
                      handleEditorChange('wordWrap', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Line Numbers</Label>
                    <p className="text-sm text-muted-foreground">
                      Show line numbers in the editor
                    </p>
                  </div>
                  <Switch
                    checked={editorSettings.lineNumbers}
                    onCheckedChange={checked =>
                      handleEditorChange('lineNumbers', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Minimap</Label>
                    <p className="text-sm text-muted-foreground">
                      Show code overview on the right side
                    </p>
                  </div>
                  <Switch
                    checked={editorSettings.minimap}
                    onCheckedChange={checked =>
                      handleEditorChange('minimap', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes
                    </p>
                  </div>
                  <Switch
                    checked={editorSettings.autoSave}
                    onCheckedChange={checked =>
                      handleEditorChange('autoSave', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Format On Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically format code when saving
                    </p>
                  </div>
                  <Switch
                    checked={editorSettings.formatOnSave}
                    onCheckedChange={checked =>
                      handleEditorChange('formatOnSave', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto Indent</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically indent code
                    </p>
                  </div>
                  <Switch
                    checked={editorSettings.autoIndent}
                    onCheckedChange={checked =>
                      handleEditorChange('autoIndent', checked)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">
                      Bracket Pair Colorization
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Colorize matching brackets
                    </p>
                  </div>
                  <Switch
                    checked={editorSettings.bracketPairs}
                    onCheckedChange={checked =>
                      handleEditorChange('bracketPairs', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Snippets</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable code snippets
                    </p>
                  </div>
                  <Switch
                    checked={editorSettings.snippets}
                    onCheckedChange={checked =>
                      handleEditorChange('snippets', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto Closing Brackets</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically close brackets
                    </p>
                  </div>
                  <Switch
                    checked={editorSettings.autoClosingBrackets}
                    onCheckedChange={checked =>
                      handleEditorChange('autoClosingBrackets', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto Closing Quotes</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically close quotes
                    </p>
                  </div>
                  <Switch
                    checked={editorSettings.autoClosingQuotes}
                    onCheckedChange={checked =>
                      handleEditorChange('autoClosingQuotes', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetSettings}>
                Reset Editor Settings
              </Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of ForSure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="app-theme">Application Theme</Label>
                  <Select
                    value={appearanceSettings.theme}
                    onValueChange={value =>
                      setAppearanceSettings(prev => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger id="app-theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="density">UI Density</Label>
                  <Select
                    value={appearanceSettings.density}
                    onValueChange={value =>
                      setAppearanceSettings(prev => ({
                        ...prev,
                        density: value,
                      }))
                    }
                  >
                    <SelectTrigger id="density">
                      <SelectValue placeholder="Select density" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {['blue', 'purple', 'green', 'red', 'orange'].map(color => (
                    <div
                      key={color}
                      className={`w-full aspect-square rounded-md cursor-pointer transition-all ${
                        appearanceSettings.accentColor === color
                          ? 'ring-2 ring-offset-2 ring-primary'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: `var(--${color}-500, ${color})`,
                      }}
                      onClick={() =>
                        setAppearanceSettings(prev => ({
                          ...prev,
                          accentColor: color,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable UI animations
                    </p>
                  </div>
                  <Switch
                    checked={appearanceSettings.animationsEnabled}
                    onCheckedChange={checked =>
                      setAppearanceSettings(prev => ({
                        ...prev,
                        animationsEnabled: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Status Bar</Label>
                    <p className="text-sm text-muted-foreground">
                      Show status bar at the bottom
                    </p>
                  </div>
                  <Switch
                    checked={appearanceSettings.showStatusBar}
                    onCheckedChange={checked =>
                      setAppearanceSettings(prev => ({
                        ...prev,
                        showStatusBar: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sidebar Position</Label>
                <RadioGroup
                  value={appearanceSettings.sidebarPosition}
                  onValueChange={value =>
                    setAppearanceSettings(prev => ({
                      ...prev,
                      sidebarPosition: value,
                    }))
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="sidebar-left" />
                    <Label htmlFor="sidebar-left">Left</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="right" id="sidebar-right" />
                    <Label htmlFor="sidebar-right">Right</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetSettings}>
                Reset Appearance
              </Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Formatter Settings */}
        <TabsContent value="formatter">
          <Card>
            <CardHeader>
              <CardTitle>Formatter Settings</CardTitle>
              <CardDescription>
                Configure code formatting preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="default-formatter">Default Formatter</Label>
                <Select
                  value={formatterSettings.defaultFormatter}
                  onValueChange={value =>
                    setFormatterSettings(prev => ({
                      ...prev,
                      defaultFormatter: value,
                    }))
                  }
                >
                  <SelectTrigger id="default-formatter">
                    <SelectValue placeholder="Select formatter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prettier">Prettier</SelectItem>
                    <SelectItem value="eslint">ESLint</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Semi Colons</Label>
                    <p className="text-sm text-muted-foreground">
                      Add semicolons at the end of statements
                    </p>
                  </div>
                  <Switch
                    checked={formatterSettings.semiColons}
                    onCheckedChange={checked =>
                      setFormatterSettings(prev => ({
                        ...prev,
                        semiColons: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Single Quotes</Label>
                    <p className="text-sm text-muted-foreground">
                      Use single quotes instead of double quotes
                    </p>
                  </div>
                  <Switch
                    checked={formatterSettings.singleQuote}
                    onCheckedChange={checked =>
                      setFormatterSettings(prev => ({
                        ...prev,
                        singleQuote: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trailing-comma">Trailing Comma</Label>
                <Select
                  value={formatterSettings.trailingComma}
                  onValueChange={value =>
                    setFormatterSettings(prev => ({
                      ...prev,
                      trailingComma: value,
                    }))
                  }
                >
                  <SelectTrigger id="trailing-comma">
                    <SelectValue placeholder="Select trailing comma option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="es5">ES5</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrow-parens">Arrow Function Parentheses</Label>
                <Select
                  value={formatterSettings.arrowParens}
                  onValueChange={value =>
                    setFormatterSettings(prev => ({
                      ...prev,
                      arrowParens: value,
                    }))
                  }
                >
                  <SelectTrigger id="arrow-parens">
                    <SelectValue placeholder="Select arrow parens option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always</SelectItem>
                    <SelectItem value="avoid">Avoid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-of-line">End of Line</Label>
                <Select
                  value={formatterSettings.endOfLine}
                  onValueChange={value =>
                    setFormatterSettings(prev => ({
                      ...prev,
                      endOfLine: value,
                    }))
                  }
                >
                  <SelectTrigger id="end-of-line">
                    <SelectValue placeholder="Select end of line option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lf">LF</SelectItem>
                    <SelectItem value="crlf">CRLF</SelectItem>
                    <SelectItem value="cr">CR</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-rules">Custom Formatting Rules</Label>
                <Textarea
                  id="custom-rules"
                  placeholder="Enter custom formatting rules in JSON format"
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetSettings}>
                Reset Formatter
              </Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={checked =>
                      setNotificationSettings(prev => ({
                        ...prev,
                        emailNotifications: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.browserNotifications}
                    onCheckedChange={checked =>
                      setNotificationSettings(prev => ({
                        ...prev,
                        browserNotifications: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base">Notification Types</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="format-completed"
                      checked={
                        notificationSettings.formatCompletedNotifications
                      }
                      onCheckedChange={checked =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          formatCompletedNotifications: checked === true,
                        }))
                      }
                    />
                    <Label htmlFor="format-completed">
                      Format completed notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="validation-error"
                      checked={
                        notificationSettings.validationErrorNotifications
                      }
                      onCheckedChange={checked =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          validationErrorNotifications: checked === true,
                        }))
                      }
                    />
                    <Label htmlFor="validation-error">
                      Validation error notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="team-invite"
                      checked={notificationSettings.teamInviteNotifications}
                      onCheckedChange={checked =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          teamInviteNotifications: checked === true,
                        }))
                      }
                    />
                    <Label htmlFor="team-invite">
                      Team invite notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="update-notifications"
                      checked={notificationSettings.updateNotifications}
                      onCheckedChange={checked =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          updateNotifications: checked === true,
                        }))
                      }
                    />
                    <Label htmlFor="update-notifications">
                      Product update notifications
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input
                  id="notification-email"
                  type="email"
                  placeholder="Enter email address for notifications"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetSettings}>
                Reset Notifications
              </Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Keyboard Shortcuts */}
        <TabsContent value="keyboard">
          <Card>
            <CardHeader>
              <CardTitle>Keyboard Shortcuts</CardTitle>
              <CardDescription>
                Customize keyboard shortcuts for common actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="format-shortcut">Format Code</Label>
                  <Input
                    id="format-shortcut"
                    value={keyboardSettings.formatShortcut}
                    onChange={e =>
                      setKeyboardSettings(prev => ({
                        ...prev,
                        formatShortcut: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validate-shortcut">Validate Code</Label>
                  <Input
                    id="validate-shortcut"
                    value={keyboardSettings.validateShortcut}
                    onChange={e =>
                      setKeyboardSettings(prev => ({
                        ...prev,
                        validateShortcut: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="save-shortcut">Save File</Label>
                  <Input
                    id="save-shortcut"
                    value={keyboardSettings.saveShortcut}
                    onChange={e =>
                      setKeyboardSettings(prev => ({
                        ...prev,
                        saveShortcut: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-file-shortcut">New File</Label>
                  <Input
                    id="new-file-shortcut"
                    value={keyboardSettings.newFileShortcut}
                    onChange={e =>
                      setKeyboardSettings(prev => ({
                        ...prev,
                        newFileShortcut: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="find-shortcut">Find</Label>
                  <Input
                    id="find-shortcut"
                    value={keyboardSettings.findShortcut}
                    onChange={e =>
                      setKeyboardSettings(prev => ({
                        ...prev,
                        findShortcut: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="replace-shortcut">Replace</Label>
                  <Input
                    id="replace-shortcut"
                    value={keyboardSettings.replaceShortcut}
                    onChange={e =>
                      setKeyboardSettings(prev => ({
                        ...prev,
                        replaceShortcut: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Reset to Default Shortcuts
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Common Shortcuts Reference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Undo</span>
                    <code className="bg-muted px-1 rounded">Ctrl+Z</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Redo</span>
                    <code className="bg-muted px-1 rounded">Ctrl+Y</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Cut</span>
                    <code className="bg-muted px-1 rounded">Ctrl+X</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Copy</span>
                    <code className="bg-muted px-1 rounded">Ctrl+C</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Paste</span>
                    <code className="bg-muted px-1 rounded">Ctrl+V</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Select All</span>
                    <code className="bg-muted px-1 rounded">Ctrl+A</code>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetSettings}>
                Reset Shortcuts
              </Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect ForSure with external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">GitHub</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your GitHub account for repository management
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={
                      integrationSettings.githubConnected
                        ? 'outline'
                        : 'default'
                    }
                  >
                    {integrationSettings.githubConnected
                      ? 'Disconnect'
                      : 'Connect'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                      >
                        <path d="M24 12l-5.72 5.746-5.724-5.741 5.724-5.75L24 12zM5.72 6.254 0 12l5.72 5.746h11.44L5.72 6.254z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Vercel</h3>
                      <p className="text-sm text-muted-foreground">
                        Deploy your projects directly to Vercel
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={
                      integrationSettings.vercelConnected
                        ? 'outline'
                        : 'default'
                    }
                  >
                    {integrationSettings.vercelConnected
                      ? 'Disconnect'
                      : 'Connect'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                      >
                        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Slack</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notifications in your Slack workspace
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={
                      integrationSettings.slackConnected ? 'outline' : 'default'
                    }
                  >
                    {integrationSettings.slackConnected
                      ? 'Disconnect'
                      : 'Connect'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                      >
                        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">VS Code</h3>
                      <p className="text-sm text-muted-foreground">
                        Integrate with VS Code editor
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={
                      integrationSettings.vscodeConnected
                        ? 'outline'
                        : 'default'
                    }
                  >
                    {integrationSettings.vscodeConnected
                      ? 'Disconnect'
                      : 'Connect'}
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Browse More Integrations
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetSettings}>
                Reset Integrations
              </Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Storage Settings */}
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>
                Configure how your projects and files are stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Local Storage</Label>
                    <p className="text-sm text-muted-foreground">
                      Store projects in browser local storage
                    </p>
                  </div>
                  <Switch
                    checked={storageSettings.localStorageEnabled}
                    onCheckedChange={checked =>
                      setStorageSettings(prev => ({
                        ...prev,
                        localStorageEnabled: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Cloud Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Sync projects to cloud storage
                    </p>
                  </div>
                  <Switch
                    checked={storageSettings.cloudSyncEnabled}
                    onCheckedChange={checked =>
                      setStorageSettings(prev => ({
                        ...prev,
                        cloudSyncEnabled: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup your projects
                    </p>
                  </div>
                  <Switch
                    checked={storageSettings.autoBackup}
                    onCheckedChange={checked =>
                      setStorageSettings(prev => ({
                        ...prev,
                        autoBackup: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Compression</Label>
                    <p className="text-sm text-muted-foreground">
                      Compress files to save storage space
                    </p>
                  </div>
                  <Switch
                    checked={storageSettings.compressionEnabled}
                    onCheckedChange={checked =>
                      setStorageSettings(prev => ({
                        ...prev,
                        compressionEnabled: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select
                  value={storageSettings.backupFrequency}
                  onValueChange={value =>
                    setStorageSettings(prev => ({
                      ...prev,
                      backupFrequency: value,
                    }))
                  }
                  disabled={!storageSettings.autoBackup}
                >
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select backup frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-backup-size">
                  Maximum Backup Size ({storageSettings.maxBackupSize} MB)
                </Label>
                <Slider
                  id="max-backup-size"
                  min={10}
                  max={500}
                  step={10}
                  value={[storageSettings.maxBackupSize]}
                  onValueChange={value =>
                    setStorageSettings(prev => ({
                      ...prev,
                      maxBackupSize: value[0],
                    }))
                  }
                  disabled={!storageSettings.autoBackup}
                />
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Storage Usage</h3>
                  <span className="text-sm text-muted-foreground">
                    245 MB of 1 GB used
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: '24.5%' }}
                  ></div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Projects</p>
                    <p className="font-medium">125 MB</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Backups</p>
                    <p className="font-medium">100 MB</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Templates</p>
                    <p className="font-medium">20 MB</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  Clear Local Storage
                </Button>
                <Button variant="outline" className="w-full">
                  Export All Projects
                </Button>
                <Button variant="outline" className="w-full">
                  Import Projects
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetSettings}>
                Reset Storage
              </Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and privacy options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after inactivity
                    </p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base">Privacy</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="analytics" defaultChecked />
                    <Label htmlFor="analytics">
                      Allow anonymous usage analytics
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="crash-reports" defaultChecked />
                    <Label htmlFor="crash-reports">Send crash reports</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="telemetry" defaultChecked />
                    <Label htmlFor="telemetry">
                      Allow telemetry data collection
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type="password"
                    value="••••••••••••••••••••••••••••••"
                    readOnly
                  />
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Used for programmatic access to the ForSure API
                </p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Active Sessions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome on Windows • IP: 192.168.1.1
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mobile App</p>
                      <p className="text-sm text-muted-foreground">
                        iPhone • Last active: 2 days ago
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  Logout from all devices
                </Button>
              </div>

              <div className="pt-4">
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetSettings}>
                Reset Security
              </Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
