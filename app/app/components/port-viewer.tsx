"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  RefreshCw,
  ExternalLink,
  Search,
  X,
  Filter,
  Download,
  Cpu,
  HardDrive,
  Activity,
  Zap,
  Clock,
  Database,
  Layers,
  Wifi,
  WifiOff,
  AlertTriangle,
  BarChart2,
  Maximize2,
  Minimize2,
  Save,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"
import type { ProjectDetails } from "./project-details-form"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Types for console logs
type LogLevel = "info" | "warn" | "error" | "debug"

interface ConsoleLog {
  id: string
  timestamp: Date
  level: LogLevel
  message: string
  source: string
  stack?: string
  repeated?: number
}

// Types for network requests
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD"
type StatusCategory = "informational" | "success" | "redirect" | "clientError" | "serverError"

interface NetworkRequest {
  id: string
  url: string
  method: RequestMethod
  status: number
  statusText: string
  time: number // in ms
  size: number // in bytes
  type: string // e.g., "fetch", "xhr", "document"
  initiator: string
  timestamp: Date
  request: {
    headers: Record<string, string>
    body?: string
  }
  response: {
    headers: Record<string, string>
    body?: string
  }
  timing?: {
    dns: number
    connect: number
    ssl: number
    send: number
    wait: number
    receive: number
  }
}

// New types for performance metrics
interface PerformanceMetric {
  id: string
  timestamp: Date
  name: string
  value: number
  unit: string
  category: "network" | "rendering" | "memory" | "cpu" | "custom"
}

interface ResourceUsage {
  timestamp: Date
  cpu: number // percentage
  memory: number // in MB
  fps: number
  networkIn: number // in KB/s
  networkOut: number // in KB/s
  domNodes: number
  jsHeapSize: number // in MB
}

function getStatusCategory(status: number): StatusCategory {
  if (status >= 100 && status < 200) return "informational"
  if (status >= 200 && status < 300) return "success"
  if (status >= 300 && status < 400) return "redirect"
  if (status >= 400 && status < 500) return "clientError"
  return "serverError"
}

interface PortViewerProps {
  projectDetails: ProjectDetails | null
}

export function PortViewer({ projectDetails }: PortViewerProps) {
  const [url, setUrl] = useState("http://localhost:3000")
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([])
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([])
  const [consoleFilter, setConsoleFilter] = useState<LogLevel | "all">("all")
  const [networkFilter, setNetworkFilter] = useState<StatusCategory | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isConsoleFilterOpen, setIsConsoleFilterOpen] = useState(false)
  const [isNetworkFilterOpen, setIsNetworkFilterOpen] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedLogs, setRecordedLogs] = useState<ConsoleLog[]>([])
  const [recordedRequests, setRecordedRequests] = useState<NetworkRequest[]>([])
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [resourceUsage, setResourceUsage] = useState<ResourceUsage[]>([])
  const [showPerformancePanel, setShowPerformancePanel] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "error">(
    "disconnected",
  )
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [refreshInterval, setRefreshInterval] = useState<number>(5000)
  const [isAutomaticRefresh, setIsAutomaticRefresh] = useState(true)
  const [groupSimilarLogs, setGroupSimilarLogs] = useState(true)
  const [showTimestamps, setShowTimestamps] = useState(true)
  const [preserveLogs, setPreserveLogs] = useState(false)
  const [slowRequestThreshold, setSlowRequestThreshold] = useState(1000) // ms
  const [largeResponseThreshold, setLargeResponseThreshold] = useState(500) // KB
  const [resourceMetricsHistory, setResourceMetricsHistory] = useState(100) // number of data points to keep

  // Refs for auto-scrolling
  const consoleContainerRef = useRef<HTMLDivElement>(null)
  const networkContainerRef = useRef<HTMLDivElement>(null)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const resourceIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && activeTab === "console" && consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight
    }
    if (autoScroll && activeTab === "network" && networkContainerRef.current) {
      networkContainerRef.current.scrollTop = networkContainerRef.current.scrollHeight
    }
  }, [consoleLogs, networkRequests, activeTab, autoScroll])

  // Fullscreen effect
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isFullscreen])

  // Recording effect
  useEffect(() => {
    if (isRecording) {
      setRecordedLogs([])
      setRecordedRequests([])
      setRecordingStartTime(new Date())
    } else {
      setRecordingStartTime(null)
    }
  }, [isRecording])

  // Update recorded data when recording
  useEffect(() => {
    if (isRecording) {
      setRecordedLogs((prev) => [...prev, ...consoleLogs.slice(prev.length)])
      setRecordedRequests((prev) => [...prev, ...networkRequests.slice(prev.length)])
    }
  }, [consoleLogs, networkRequests, isRecording])

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
      if (resourceIntervalRef.current) {
        clearInterval(resourceIntervalRef.current)
      }
    }
  }, [])

  // Handle automatic refresh
  useEffect(() => {
    if (isAutomaticRefresh && isConnected) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }

      refreshIntervalRef.current = setInterval(() => {
        generateMockData(false)
      }, refreshInterval)
    } else if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [isAutomaticRefresh, refreshInterval, isConnected])

  const handleConnect = () => {
    setIsLoading(true)
    setConnectionStatus("connecting")
    setConnectionError(null)

    // Simulate connection attempt with potential failure
    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate for demo

      if (success) {
        setIsLoading(false)
        setIsConnected(true)
        setConnectionStatus("connected")
        generateMockData(true)
        startResourceMonitoring()
      } else {
        setIsLoading(false)
        setIsConnected(false)
        setConnectionStatus("error")
        setConnectionError("Failed to connect to server. Please check if the server is running and the URL is correct.")
      }
    }, 1500)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectionStatus("disconnected")

    // Clear intervals
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }

    if (resourceIntervalRef.current) {
      clearInterval(resourceIntervalRef.current)
      resourceIntervalRef.current = null
    }

    // Optionally preserve logs based on settings
    if (!preserveLogs) {
      setConsoleLogs([])
      setNetworkRequests([])
      setPerformanceMetrics([])
      setResourceUsage([])
    }
  }

  const startResourceMonitoring = () => {
    // Clear any existing interval
    if (resourceIntervalRef.current) {
      clearInterval(resourceIntervalRef.current)
    }

    // Initialize with first data point
    const initialResourceUsage: ResourceUsage = {
      timestamp: new Date(),
      cpu: Math.floor(Math.random() * 30) + 10, // 10-40%
      memory: Math.floor(Math.random() * 200) + 100, // 100-300 MB
      fps: 60,
      networkIn: Math.floor(Math.random() * 50), // 0-50 KB/s
      networkOut: Math.floor(Math.random() * 30), // 0-30 KB/s
      domNodes: 1200 + Math.floor(Math.random() * 300), // 1200-1500 nodes
      jsHeapSize: Math.floor(Math.random() * 100) + 50, // 50-150 MB
    }

    setResourceUsage([initialResourceUsage])

    // Set up interval for resource monitoring
    resourceIntervalRef.current = setInterval(() => {
      const lastUsage = resourceUsage[resourceUsage.length - 1]

      // Generate new values with some correlation to previous values
      const newUsage: ResourceUsage = {
        timestamp: new Date(),
        cpu: Math.max(5, Math.min(95, lastUsage.cpu + (Math.random() * 10 - 5))), // +/- 5%
        memory: Math.max(50, Math.min(500, lastUsage.memory + (Math.random() * 20 - 10))), // +/- 10 MB
        fps: Math.max(30, Math.min(60, lastUsage.fps + (Math.random() * 6 - 3))), // +/- 3 fps
        networkIn: Math.max(0, lastUsage.networkIn + (Math.random() * 20 - 5)), // more likely to increase
        networkOut: Math.max(0, lastUsage.networkOut + (Math.random() * 15 - 5)), // more likely to increase
        domNodes: lastUsage.domNodes + (Math.random() > 0.7 ? 1 : 0), // occasionally increase
        jsHeapSize: Math.max(30, Math.min(300, lastUsage.jsHeapSize + (Math.random() * 10 - 4))), // +/- 4 MB
      }

      setResourceUsage((prev) => {
        const updated = [...prev, newUsage]
        // Keep only the last N data points
        return updated.length > resourceMetricsHistory ? updated.slice(-resourceMetricsHistory) : updated
      })

      // Add some performance metrics occasionally
      if (Math.random() > 0.8) {
        const metricTypes = [
          { name: "First Contentful Paint", category: "rendering", min: 100, max: 500, unit: "ms" },
          { name: "DOM Complete", category: "rendering", min: 300, max: 1200, unit: "ms" },
          { name: "JS Heap Size", category: "memory", min: 30, max: 200, unit: "MB" },
          { name: "DOM Nodes", category: "rendering", min: 1000, max: 2000, unit: "count" },
          { name: "Script Evaluation", category: "cpu", min: 50, max: 300, unit: "ms" },
          { name: "Layout Time", category: "rendering", min: 10, max: 100, unit: "ms" },
          { name: "Resource Load Time", category: "network", min: 200, max: 800, unit: "ms" },
        ]

        const metricType = metricTypes[Math.floor(Math.random() * metricTypes.length)]
        const newMetric: PerformanceMetric = {
          id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          name: metricType.name,
          value: metricType.min + Math.random() * (metricType.max - metricType.min),
          unit: metricType.unit,
          category: metricType.category as any,
        }

        setPerformanceMetrics((prev) => [...prev, newMetric])
      }
    }, 1000)
  }

  const generateMockData = (isInitial = false) => {
    // Generate mock console logs
    if (isInitial) {
      const mockLogs: ConsoleLog[] = [
        {
          id: "log1",
          timestamp: new Date(Date.now() - 5000),
          level: "info",
          message: "Application started",
          source: "main.js:12",
        },
        {
          id: "log2",
          timestamp: new Date(Date.now() - 4500),
          level: "debug",
          message: "Debug: Loading configuration",
          source: "config.js:45",
        },
        {
          id: "log3",
          timestamp: new Date(Date.now() - 4000),
          level: "info",
          message: "User authentication successful",
          source: "auth.js:78",
        },
        {
          id: "log4",
          timestamp: new Date(Date.now() - 3500),
          level: "warn",
          message: "Deprecated function used: createUser()",
          source: "users.js:23",
        },
        {
          id: "log5",
          timestamp: new Date(Date.now() - 3000),
          level: "error",
          message: "Failed to load resource: the server responded with a status of 404 (Not Found)",
          source: "api.js:56",
          stack:
            "Error: Failed to load resource\n    at fetchData (api.js:56)\n    at loadUserData (users.js:34)\n    at Component (App.js:12)",
        },
        {
          id: "log6",
          timestamp: new Date(Date.now() - 2500),
          level: "info",
          message: "Component mounted",
          source: "App.js:89",
        },
        {
          id: "log7",
          timestamp: new Date(Date.now() - 2000),
          level: "debug",
          message: 'Props updated: {"user":{"id":1,"name":"John"}}',
          source: "UserProfile.js:45",
        },
        {
          id: "log8",
          timestamp: new Date(Date.now() - 1500),
          level: "warn",
          message: "Memory usage high: 85%",
          source: "performance.js:12",
        },
      ]

      // Generate mock network requests
      const mockRequests: NetworkRequest[] = [
        {
          id: "req1",
          url: "http://localhost:3000/api/users",
          method: "GET",
          status: 200,
          statusText: "OK",
          time: 120,
          size: 1240,
          type: "fetch",
          initiator: "app.js:45",
          timestamp: new Date(Date.now() - 4800),
          request: {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer token123",
            },
          },
          response: {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "max-age=3600",
            },
            body: '{"users":[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]}',
          },
          timing: {
            dns: 10,
            connect: 25,
            ssl: 15,
            send: 5,
            wait: 50,
            receive: 15,
          },
        },
        {
          id: "req2",
          url: "http://localhost:3000/api/auth/login",
          method: "POST",
          status: 200,
          statusText: "OK",
          time: 350,
          size: 520,
          type: "xhr",
          initiator: "auth.js:23",
          timestamp: new Date(Date.now() - 4200),
          request: {
            headers: {
              "Content-Type": "application/json",
            },
            body: '{"username":"user","password":"****"}',
          },
          response: {
            headers: {
              "Content-Type": "application/json",
            },
            body: '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}',
          },
          timing: {
            dns: 5,
            connect: 30,
            ssl: 20,
            send: 15,
            wait: 250,
            receive: 30,
          },
        },
        {
          id: "req3",
          url: "http://localhost:3000/api/products",
          method: "GET",
          status: 200,
          statusText: "OK",
          time: 180,
          size: 2450,
          type: "fetch",
          initiator: "products.js:12",
          timestamp: new Date(Date.now() - 3600),
          request: {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer token123",
            },
          },
          response: {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "max-age=3600",
            },
            body: '{"products":[{"id":1,"name":"Product 1"},{"id":2,"name":"Product 2"}]}',
          },
          timing: {
            dns: 8,
            connect: 22,
            ssl: 18,
            send: 5,
            wait: 110,
            receive: 17,
          },
        },
        {
          id: "req4",
          url: "http://localhost:3000/api/images/logo.png",
          method: "GET",
          status: 404,
          statusText: "Not Found",
          time: 90,
          size: 0,
          type: "img",
          initiator: "index.html:34",
          timestamp: new Date(Date.now() - 3000),
          request: {
            headers: {},
          },
          response: {
            headers: {
              "Content-Type": "text/plain",
            },
            body: "Not Found",
          },
          timing: {
            dns: 5,
            connect: 20,
            ssl: 15,
            send: 2,
            wait: 40,
            receive: 8,
          },
        },
        {
          id: "req5",
          url: "http://localhost:3000/api/orders",
          method: "POST",
          status: 201,
          statusText: "Created",
          time: 420,
          size: 680,
          type: "fetch",
          initiator: "checkout.js:78",
          timestamp: new Date(Date.now() - 2400),
          request: {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer token123",
            },
            body: '{"items":[{"id":1,"quantity":2},{"id":3,"quantity":1}]}',
          },
          response: {
            headers: {
              "Content-Type": "application/json",
            },
            body: '{"orderId":"ORD-12345","status":"pending"}',
          },
          timing: {
            dns: 12,
            connect: 35,
            ssl: 25,
            send: 18,
            wait: 300,
            receive: 30,
          },
        },
        {
          id: "req6",
          url: "http://localhost:3000/api/invalid-endpoint",
          method: "GET",
          status: 500,
          statusText: "Internal Server Error",
          time: 150,
          size: 320,
          type: "fetch",
          initiator: "app.js:102",
          timestamp: new Date(Date.now() - 1800),
          request: {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer token123",
            },
          },
          response: {
            headers: {
              "Content-Type": "application/json",
            },
            body: '{"error":"Internal server error","message":"An unexpected error occurred"}',
          },
          timing: {
            dns: 6,
            connect: 25,
            ssl: 18,
            send: 4,
            wait: 85,
            receive: 12,
          },
        },
      ]

      // Initialize performance metrics
      const initialMetrics: PerformanceMetric[] = [
        {
          id: "metric1",
          timestamp: new Date(Date.now() - 5000),
          name: "First Contentful Paint",
          value: 245,
          unit: "ms",
          category: "rendering",
        },
        {
          id: "metric2",
          timestamp: new Date(Date.now() - 4800),
          name: "DOM Complete",
          value: 780,
          unit: "ms",
          category: "rendering",
        },
        {
          id: "metric3",
          timestamp: new Date(Date.now() - 4600),
          name: "Total Blocking Time",
          value: 120,
          unit: "ms",
          category: "cpu",
        },
        {
          id: "metric4",
          timestamp: new Date(Date.now() - 4400),
          name: "Largest Contentful Paint",
          value: 1250,
          unit: "ms",
          category: "rendering",
        },
        {
          id: "metric5",
          timestamp: new Date(Date.now() - 4200),
          name: "Cumulative Layout Shift",
          value: 0.05,
          unit: "score",
          category: "rendering",
        },
      ]

      setConsoleLogs(mockLogs)
      setNetworkRequests(mockRequests)
      setPerformanceMetrics(initialMetrics)
    } else {
      // Add new logs and requests to simulate real-time updates
      const newLog: ConsoleLog = {
        id: `log${Date.now()}`,
        timestamp: new Date(),
        level: ["info", "warn", "error", "debug"][Math.floor(Math.random() * 4)] as LogLevel,
        message: `New log message at ${new Date().toLocaleTimeString()}`,
        source: "live-update.js:34",
      }

      // Check if we should group similar logs
      if (groupSimilarLogs) {
        const lastLog = consoleLogs[0]
        if (lastLog && lastLog.message === newLog.message && lastLog.level === newLog.level) {
          // Update the repeated count instead of adding a new log
          const updatedLogs = [...consoleLogs]
          updatedLogs[0] = {
            ...lastLog,
            repeated: (lastLog.repeated || 1) + 1,
          }
          setConsoleLogs(updatedLogs)
        } else {
          setConsoleLogs((prev) => [newLog, ...prev])
        }
      } else {
        setConsoleLogs((prev) => [newLog, ...prev])
      }

      const methods: RequestMethod[] = ["GET", "POST", "PUT", "DELETE"]
      const statuses = [200, 201, 204, 400, 401, 404, 500]
      const selectedStatus = statuses[Math.floor(Math.random() * statuses.length)]
      const responseTime = Math.floor(Math.random() * 500)
      const responseSize = Math.floor(Math.random() * 5000)

      const newRequest: NetworkRequest = {
        id: `req${Date.now()}`,
        url: `http://localhost:3000/api/endpoint${Math.floor(Math.random() * 10)}`,
        method: methods[Math.floor(Math.random() * methods.length)],
        status: selectedStatus,
        statusText:
          selectedStatus === 200
            ? "OK"
            : selectedStatus === 201
              ? "Created"
              : selectedStatus === 204
                ? "No Content"
                : selectedStatus === 400
                  ? "Bad Request"
                  : selectedStatus === 401
                    ? "Unauthorized"
                    : selectedStatus === 404
                      ? "Not Found"
                      : "Internal Server Error",
        time: responseTime,
        size: responseSize,
        type: "fetch",
        initiator: "app.js:45",
        timestamp: new Date(),
        request: {
          headers: {
            "Content-Type": "application/json",
          },
        },
        response: {
          headers: {
            "Content-Type": "application/json",
          },
        },
        timing: {
          dns: Math.floor(Math.random() * 15),
          connect: Math.floor(Math.random() * 40) + 10,
          ssl: Math.floor(Math.random() * 30) + 5,
          send: Math.floor(Math.random() * 10) + 2,
          wait: Math.floor(responseTime * 0.6),
          receive: Math.floor(responseTime * 0.2),
        },
      }

      setNetworkRequests((prev) => [newRequest, ...prev])
    }
  }

  const filteredLogs = consoleLogs.filter((log) => {
    if (consoleFilter !== "all" && log.level !== consoleFilter) return false
    if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const filteredRequests = networkRequests.filter((req) => {
    if (networkFilter !== "all" && getStatusCategory(req.status) !== networkFilter) return false
    if (searchTerm && !req.url.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const clearConsoleLogs = () => {
    setConsoleLogs([])
  }

  const clearNetworkRequests = () => {
    setNetworkRequests([])
  }

  const getLogBadgeColor = (level: LogLevel) => {
    switch (level) {
      case "error":
        return "bg-red-500 hover:bg-red-600"
      case "warn":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "info":
        return "bg-blue-500 hover:bg-blue-600"
      case "debug":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getStatusBadgeColor = (status: number) => {
    const category = getStatusCategory(status)
    switch (category) {
      case "informational":
        return "bg-blue-500 hover:bg-blue-600"
      case "success":
        return "bg-green-500 hover:bg-green-600"
      case "redirect":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "clientError":
        return "bg-orange-500 hover:bg-orange-600"
      case "serverError":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const toggleConsoleFilter = () => {
    setIsConsoleFilterOpen(!isConsoleFilterOpen)
  }

  const toggleNetworkFilter = () => {
    setIsNetworkFilterOpen(!isNetworkFilterOpen)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const saveRecording = () => {
    if (recordedLogs.length === 0 && recordedRequests.length === 0) return

    const recordingData = {
      startTime: recordingStartTime,
      endTime: new Date(),
      logs: recordedLogs,
      requests: recordedRequests,
    }

    // Create a blob and download it
    const blob = new Blob([JSON.stringify(recordingData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `port-viewer-recording-${new Date().toISOString().replace(/:/g, "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportNetworkHAR = () => {
    if (networkRequests.length === 0) return

    // Create HAR format
    const harData = {
      log: {
        version: "1.2",
        creator: {
          name: "ForSure Port Viewer",
          version: "1.0",
        },
        pages: [
          {
            startedDateTime: new Date().toISOString(),
            id: "page_1",
            title: url,
            pageTimings: {
              onContentLoad: -1,
              onLoad: -1,
            },
          },
        ],
        entries: networkRequests.map((req) => ({
          startedDateTime: req.timestamp.toISOString(),
          time: req.time,
          request: {
            method: req.method,
            url: req.url,
            httpVersion: "HTTP/1.1",
            cookies: [],
            headers: Object.entries(req.request.headers).map(([name, value]) => ({ name, value })),
            queryString: [],
            postData: req.request.body
              ? {
                  mimeType: req.request.headers["Content-Type"] || "application/json",
                  text: req.request.body,
                }
              : undefined,
            headersSize: -1,
            bodySize: req.request.body ? req.request.body.length : 0,
          },
          response: {
            status: req.status,
            statusText: req.statusText,
            httpVersion: "HTTP/1.1",
            cookies: [],
            headers: Object.entries(req.response.headers).map(([name, value]) => ({ name, value })),
            content: {
              size: req.size,
              mimeType: req.response.headers["Content-Type"] || "application/json",
              text: req.response.body || "",
            },
            redirectURL: "",
            headersSize: -1,
            bodySize: req.size,
          },
          cache: {},
          timings: req.timing || {
            blocked: -1,
            dns: -1,
            connect: -1,
            ssl: -1,
            send: -1,
            wait: -1,
            receive: -1,
          },
          serverIPAddress: "127.0.0.1",
          connection: "123456",
        })),
      },
    }

    // Create a blob and download it
    const blob = new Blob([JSON.stringify(harData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `network-requests-${new Date().toISOString().replace(/:/g, "-")}.har`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const renderPerformancePanel = () => {
    if (!showPerformancePanel) return null

    // Get the latest resource usage
    const latestUsage = resourceUsage.length > 0 ? resourceUsage[resourceUsage.length - 1] : null

    return (
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Performance Metrics</h3>
          <Button variant="outline" size="sm" onClick={() => setShowPerformancePanel(false)}>
            <Minimize2 className="h-3.5 w-3.5 mr-1" />
            Hide
          </Button>
        </div>

        {latestUsage && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">CPU Usage</p>
                    <h4 className="text-2xl font-bold">{latestUsage.cpu.toFixed(1)}%</h4>
                  </div>
                  <Cpu className="h-5 w-5 text-blue-500" />
                </div>
                <Progress value={latestUsage.cpu} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Memory</p>
                    <h4 className="text-2xl font-bold">{latestUsage.memory.toFixed(1)} MB</h4>
                  </div>
                  <HardDrive className="h-5 w-5 text-green-500" />
                </div>
                <Progress value={(latestUsage.memory / 500) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">FPS</p>
                    <h4 className="text-2xl font-bold">{latestUsage.fps.toFixed(1)}</h4>
                  </div>
                  <Activity className="h-5 w-5 text-purple-500" />
                </div>
                <Progress value={(latestUsage.fps / 60) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Network</p>
                    <h4 className="text-2xl font-bold">
                      {(latestUsage.networkIn + latestUsage.networkOut).toFixed(1)} KB/s
                    </h4>
                  </div>
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="flex gap-1 mt-2 text-xs">
                  <span className="text-green-500">↓ {latestUsage.networkIn.toFixed(1)}</span>
                  <span className="text-red-500">↑ {latestUsage.networkOut.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Resource Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-[200px] flex items-end">
                {resourceUsage.map((usage, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col justify-end items-center h-full"
                    style={{ minWidth: `${100 / Math.min(resourceUsage.length, 30)}%` }}
                  >
                    <div
                      className="w-full bg-blue-500 mx-px rounded-t"
                      style={{ height: `${usage.cpu}%` }}
                      title={`CPU: ${usage.cpu.toFixed(1)}%`}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>-{resourceUsage.length}s</span>
                <span>Now</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Recent Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2 max-h-[200px] overflow-auto">
                {performanceMetrics
                  .slice(-5)
                  .reverse()
                  .map((metric) => (
                    <div key={metric.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">{metric.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(metric.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          metric.category === "rendering"
                            ? "default"
                            : metric.category === "network"
                              ? "secondary"
                              : metric.category === "cpu"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {metric.value.toFixed(2)} {metric.unit}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1"
          >
            <Wifi className="h-3 w-3" />
            Connected
          </Badge>
        )
      case "connecting":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3 animate-spin" />
            Connecting
          </Badge>
        )
      case "error":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            Connection Error
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 flex items-center gap-1"
          >
            <WifiOff className="h-3 w-3" />
            Disconnected
          </Badge>
        )
    }
  }

  if (!projectDetails) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No project available. Create a project to use the port viewer.
      </div>
    )
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-background" : "h-full"} flex flex-col`}>
      <div className="mb-4 flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter localhost URL (e.g., http://localhost:3000)"
          className="flex-grow"
          disabled={isConnected}
        />
        {!isConnected ? (
          <Button onClick={handleConnect} disabled={isLoading} className="gap-2">
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Connect"}
          </Button>
        ) : (
          <Button onClick={handleDisconnect} variant="outline" className="gap-2">
            Disconnect
          </Button>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {connectionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{connectionError}</AlertDescription>
        </Alert>
      )}

      {isConnected ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="console">
                Console
                {consoleLogs.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {consoleLogs.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="network">
                Network
                {networkRequests.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {networkRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {renderConnectionStatus()}

              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={isRecording ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : ""}
                        onClick={toggleRecording}
                      >
                        {isRecording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isRecording ? "Stop Recording" : "Start Recording"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {isRecording && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 animate-pulse"
                  >
                    Recording
                  </Badge>
                )}

                {(recordedLogs.length > 0 || recordedRequests.length > 0) && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="ml-1" onClick={saveRecording}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save Recording</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>

          <TabsContent value="preview" className="flex-1 mt-0">
            <div className="border rounded-md overflow-hidden bg-white h-full">
              <div className="bg-gray-100 border-b px-4 py-2 flex justify-between items-center">
                <span className="text-sm font-medium">{url}</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Refresh</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open in new tab</span>
                  </Button>
                </div>
              </div>
              <div className="p-4 h-[calc(100%-40px)] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Preview for {projectDetails.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {projectDetails.framework} project running on {url}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="console" className="flex-1 mt-0 border rounded-md overflow-hidden">
            <div className="bg-gray-100 border-b px-4 py-2 flex justify-between items-center">
              <div className="flex gap-2">
                <div className="relative">
                  <Button variant="outline" size="sm" className="gap-1" onClick={toggleConsoleFilter}>
                    <Filter className="h-3.5 w-3.5" />
                    {consoleFilter !== "all" && <span className="text-xs capitalize">{consoleFilter}</span>}
                    {consoleFilter === "all" && <span className="text-xs">All</span>}
                  </Button>
                  {isConsoleFilterOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-md z-10">
                      <div className="p-1">
                        <button
                          className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                          onClick={() => {
                            setConsoleFilter("all")
                            setIsConsoleFilterOpen(false)
                          }}
                        >
                          All
                        </button>
                        <button
                          className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                          onClick={() => {
                            setConsoleFilter("info")
                            setIsConsoleFilterOpen(false)
                          }}
                        >
                          Info
                        </button>
                        <button
                          className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                          onClick={() => {
                            setConsoleFilter("warn")
                            setIsConsoleFilterOpen(false)
                          }}
                        >
                          Warnings
                        </button>
                        <button
                          className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                          onClick={() => {
                            setConsoleFilter("error")
                            setIsConsoleFilterOpen(false)
                          }}
                        >
                          Errors
                        </button>
                        <button
                          className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                          onClick={() => {
                            setConsoleFilter("debug")
                            setIsConsoleFilterOpen(false)
                          }}
                        >
                          Debug
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Filter logs..."
                    className="pl-8 h-8 text-sm w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 mr-2">
                  <Switch id="auto-scroll" checked={autoScroll} onCheckedChange={setAutoScroll} size="sm" />
                  <Label htmlFor="auto-scroll" className="text-xs">
                    Auto-scroll
                  </Label>
                </div>
                <div className="flex items-center gap-2 mr-2">
                  <Switch id="group-logs" checked={groupSimilarLogs} onCheckedChange={setGroupSimilarLogs} size="sm" />
                  <Label htmlFor="group-logs" className="text-xs">
                    Group
                  </Label>
                </div>
                <Button variant="outline" size="sm" onClick={clearConsoleLogs}>
                  Clear
                </Button>
              </div>
            </div>
            <div
              ref={consoleContainerRef}
              className="bg-gray-900 text-gray-100 p-0 h-[calc(100%-40px)] overflow-auto font-mono text-sm"
            >
              {filteredLogs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">No console logs to display</div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="p-2 hover:bg-gray-800">
                      <div className="flex items-start">
                        <Badge className={`mr-2 ${getLogBadgeColor(log.level)}`}>
                          {log.level}
                          {log.repeated && log.repeated > 1 && <span className="ml-1 text-xs">({log.repeated})</span>}
                        </Badge>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-xs">{log.source}</span>
                            {showTimestamps && (
                              <span className="text-gray-400 text-xs">{log.timestamp.toLocaleTimeString()}</span>
                            )}
                          </div>
                          <div className="mt-1 whitespace-pre-wrap">{log.message}</div>
                          {log.stack && (
                            <div className="mt-1 text-red-400 text-xs whitespace-pre-wrap">{log.stack}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="network" className="flex-1 mt-0 border rounded-md overflow-hidden">
            <div className="bg-gray-100 border-b px-4 py-2 flex justify-between items-center">
              <div className="flex gap-2">
                <div className="relative">
                  <Button variant="outline" size="sm" className="gap-1" onClick={toggleNetworkFilter}>
                    <Filter className="h-3.5 w-3.5" />
                    {networkFilter !== "all" && (
                      <span className="text-xs capitalize">
                        {networkFilter === "clientError"
                          ? "Client Errors"
                          : networkFilter === "serverError"
                            ? "Server Errors"
                            : networkFilter.charAt(0).toUpperCase() + networkFilter.slice(1)}
                      </span>
                    )}
                    {networkFilter === "all" && <span className="text-xs">All</span>}
                  </Button>
                  {isNetworkFilterOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-md z-10">
                      <div className="p-1">
                        <button
                          className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                          onClick={() => {
                            setNetworkFilter("all")
                            setIsNetworkFilterOpen(false)
                          }}
                        >
                          All
                        </button>
                        <button
                          className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                          onClick={() => {
                            setNetworkFilter("success")
                            setIsNetworkFilterOpen(false)
                          }}
                        >
                          Success (2xx)
                        </button>
                        <button
                          className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                          onClick={() => {
                            setNetworkFilter("redirect")
                            setIsNetworkFilterOpen(false)
                          }}
                        >
                          Redirects (3xx)
                        </button>
                        <button
                          className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                          onClick={() => {
                            setNetworkFilter("clientError")
                            setIsNetworkFilterOpen(false)
                          }}
                        >
                          Client Errors (4xx)
                        </button>
                        <button
                          className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                          onClick={() => {
                            setNetworkFilter("serverError")
                            setIsNetworkFilterOpen(false)
                          }}
                        >
                          Server Errors (5xx)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Filter requests..."
                    className="pl-8 h-8 text-sm w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 mr-2">
                  <Switch id="auto-scroll-network" checked={autoScroll} onCheckedChange={setAutoScroll} size="sm" />
                  <Label htmlFor="auto-scroll-network" className="text-xs">
                    Auto-scroll
                  </Label>
                </div>
                <Button variant="outline" size="sm" onClick={clearNetworkRequests}>
                  Clear
                </Button>
                <Button variant="outline" size="sm" onClick={exportNetworkHAR}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  HAR
                </Button>
              </div>
            </div>
            <div ref={networkContainerRef} className="bg-white h-[calc(100%-40px)] overflow-auto text-sm">
              {filteredRequests.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No network requests to display
                </div>
              ) : (
                <div>
                  <div className="sticky top-0 bg-gray-100 text-xs font-medium text-gray-500 grid grid-cols-12 gap-2 px-4 py-2">
                    <div className="col-span-5">URL</div>
                    <div className="col-span-1">Method</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Type</div>
                    <div className="col-span-2">Size</div>
                    <div className="col-span-2">Time</div>
                  </div>
                  <div className="divide-y">
                    {filteredRequests.map((request) => (
                      <details key={request.id} className="group">
                        <summary
                          className={`cursor-pointer hover:bg-gray-50 grid grid-cols-12 gap-2 px-4 py-2 items-center ${request.time > slowRequestThreshold ? "bg-yellow-50" : ""}`}
                        >
                          <div className="col-span-5 truncate text-blue-600">{request.url}</div>
                          <div className="col-span-1 font-medium">{request.method}</div>
                          <div className="col-span-1">
                            <Badge className={getStatusBadgeColor(request.status)}>{request.status}</Badge>
                          </div>
                          <div className="col-span-1 text-gray-500">{request.type}</div>
                          <div className="col-span-2 text-gray-500">
                            {request.size < 1024 ? `${request.size} B` : `${(request.size / 1024).toFixed(1)} KB`}
                            {request.size / 1024 > largeResponseThreshold && (
                              <span className="ml-1 text-yellow-500">⚠️</span>
                            )}
                          </div>
                          <div className="col-span-2 text-gray-500">
                            <span className={request.time > slowRequestThreshold ? "text-yellow-600 font-medium" : ""}>
                              {request.time < 1000 ? `${request.time} ms` : `${(request.time / 1000).toFixed(1)} s`}
                            </span>
                          </div>
                        </summary>
                        <div className="px-4 py-3 bg-gray-50 border-t">
                          <Tabs defaultValue="headers" className="w-full">
                            <TabsList className="mb-2">
                              <TabsTrigger value="headers">Headers</TabsTrigger>
                              <TabsTrigger value="request">Request</TabsTrigger>
                              <TabsTrigger value="response">Response</TabsTrigger>
                              <TabsTrigger value="timing">Timing</TabsTrigger>
                            </TabsList>
                            <TabsContent value="headers">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">General</h4>
                                  <div className="bg-white p-3 rounded border text-sm font-mono">
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="text-gray-500">Request URL:</div>
                                      <div className="col-span-2">{request.url}</div>
                                      <div className="text-gray-500">Request Method:</div>
                                      <div className="col-span-2">{request.method}</div>
                                      <div className="text-gray-500">Status Code:</div>
                                      <div className="col-span-2">
                                        {request.status} {request.statusText}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Request Headers</h4>
                                  <div className="bg-white p-3 rounded border text-sm font-mono">
                                    <div className="grid grid-cols-3 gap-2">
                                      {Object.entries(request.request.headers).map(([key, value]) => (
                                        <React.Fragment key={key}>
                                          <div className="text-gray-500">{key}:</div>
                                          <div className="col-span-2">{value}</div>
                                        </React.Fragment>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Response Headers</h4>
                                  <div className="bg-white p-3 rounded border text-sm font-mono">
                                    <div className="grid grid-cols-3 gap-2">
                                      {Object.entries(request.response.headers).map(([key, value]) => (
                                        <React.Fragment key={key}>
                                          <div className="text-gray-500">{key}:</div>
                                          <div className="col-span-2">{value}</div>
                                        </React.Fragment>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="request">
                              {request.request.body ? (
                                <div className="bg-white p-3 rounded border text-sm font-mono whitespace-pre-wrap">
                                  {request.request.body}
                                </div>
                              ) : (
                                <div className="text-gray-500 italic">No request body</div>
                              )}
                            </TabsContent>
                            <TabsContent value="response">
                              {request.response.body ? (
                                <div className="bg-white p-3 rounded border text-sm font-mono whitespace-pre-wrap">
                                  {request.response.body}
                                </div>
                              ) : (
                                <div className="text-gray-500 italic">No response body</div>
                              )}
                            </TabsContent>
                            <TabsContent value="timing">
                              {request.timing ? (
                                <div className="space-y-4">
                                  <div className="bg-white p-3 rounded border">
                                    <div className="mb-2">
                                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>0ms</span>
                                        <span>{request.time}ms</span>
                                      </div>
                                      <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full flex">
                                          <div
                                            className="bg-purple-200"
                                            style={{ width: `${(request.timing.dns / request.time) * 100}%` }}
                                            title={`DNS: ${request.timing.dns}ms`}
                                          ></div>
                                          <div
                                            className="bg-blue-200"
                                            style={{ width: `${(request.timing.connect / request.time) * 100}%` }}
                                            title={`Connect: ${request.timing.connect}ms`}
                                          ></div>
                                          <div
                                            className="bg-green-200"
                                            style={{ width: `${(request.timing.ssl / request.time) * 100}%` }}
                                            title={`SSL: ${request.timing.ssl}ms`}
                                          ></div>
                                          <div
                                            className="bg-yellow-200"
                                            style={{ width: `${(request.timing.send / request.time) * 100}%` }}
                                            title={`Send: ${request.timing.send}ms`}
                                          ></div>
                                          <div
                                            className="bg-orange-200"
                                            style={{ width: `${(request.timing.wait / request.time) * 100}%` }}
                                            title={`Wait: ${request.timing.wait}ms`}
                                          ></div>
                                          <div
                                            className="bg-red-200"
                                            style={{ width: `${(request.timing.receive / request.time) * 100}%` }}
                                            title={`Receive: ${request.timing.receive}ms`}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                      <div className="flex items-center">
                                        <div className="w-3 h-3 bg-purple-200 mr-2 rounded"></div>
                                        <span className="text-gray-700">DNS Lookup:</span>
                                        <span className="ml-auto font-mono">{request.timing.dns}ms</span>
                                      </div>
                                      <div className="flex items-center">
                                        <div className="w-3 h-3 bg-blue-200 mr-2 rounded"></div>
                                        <span className="text-gray-700">Initial Connection:</span>
                                        <span className="ml-auto font-mono">{request.timing.connect}ms</span>
                                      </div>
                                      <div className="flex items-center">
                                        <div className="w-3 h-3 bg-green-200 mr-2 rounded"></div>
                                        <span className="text-gray-700">SSL Handshake:</span>
                                        <span className="ml-auto font-mono">{request.timing.ssl}ms</span>
                                      </div>
                                      <div className="flex items-center">
                                        <div className="w-3 h-3 bg-yellow-200 mr-2 rounded"></div>
                                        <span className="text-gray-700">Request Sent:</span>
                                        <span className="ml-auto font-mono">{request.timing.send}ms</span>
                                      </div>
                                      <div className="flex items-center">
                                        <div className="w-3 h-3 bg-orange-200 mr-2 rounded"></div>
                                        <span className="text-gray-700">Waiting (TTFB):</span>
                                        <span className="ml-auto font-mono">{request.timing.wait}ms</span>
                                      </div>
                                      <div className="flex items-center">
                                        <div className="w-3 h-3 bg-red-200 mr-2 rounded"></div>
                                        <span className="text-gray-700">Content Download:</span>
                                        <span className="ml-auto font-mono">{request.timing.receive}ms</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-500 italic">No timing information available</div>
                              )}
                            </TabsContent>
                          </Tabs>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="flex-1 mt-0 border rounded-md overflow-hidden">
            <div className="bg-gray-100 border-b px-4 py-2 flex justify-between items-center">
              <div className="flex gap-2">
                <Select
                  value={refreshInterval.toString()}
                  onValueChange={(value) => setRefreshInterval(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Refresh interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">Refresh: 1 second</SelectItem>
                    <SelectItem value="2000">Refresh: 2 seconds</SelectItem>
                    <SelectItem value="5000">Refresh: 5 seconds</SelectItem>
                    <SelectItem value="10000">Refresh: 10 seconds</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-refresh"
                    checked={isAutomaticRefresh}
                    onCheckedChange={setIsAutomaticRefresh}
                    size="sm"
                  />
                  <Label htmlFor="auto-refresh" className="text-xs">
                    Auto-refresh
                  </Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => generateMockData(false)}>
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="bg-white h-[calc(100%-40px)] overflow-auto">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">CPU Usage</p>
                          <h4 className="text-2xl font-bold">
                            {resourceUsage.length > 0 ? resourceUsage[resourceUsage.length - 1].cpu.toFixed(1) : 0}%
                          </h4>
                        </div>
                        <Cpu className="h-5 w-5 text-blue-500" />
                      </div>
                      <Progress
                        value={resourceUsage.length > 0 ? resourceUsage[resourceUsage.length - 1].cpu : 0}
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">Memory</p>
                          <h4 className="text-2xl font-bold">
                            {resourceUsage.length > 0 ? resourceUsage[resourceUsage.length - 1].memory.toFixed(1) : 0}{" "}
                            MB
                          </h4>
                        </div>
                        <HardDrive className="h-5 w-5 text-green-500" />
                      </div>
                      <Progress
                        value={
                          resourceUsage.length > 0 ? (resourceUsage[resourceUsage.length - 1].memory / 500) * 100 : 0
                        }
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">JS Heap</p>
                          <h4 className="text-2xl font-bold">
                            {resourceUsage.length > 0
                              ? resourceUsage[resourceUsage.length - 1].jsHeapSize.toFixed(1)
                              : 0}{" "}
                            MB
                          </h4>
                        </div>
                        <Database className="h-5 w-5 text-purple-500" />
                      </div>
                      <Progress
                        value={
                          resourceUsage.length > 0
                            ? (resourceUsage[resourceUsage.length - 1].jsHeapSize / 300) * 100
                            : 0
                        }
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">DOM Nodes</p>
                          <h4 className="text-2xl font-bold">
                            {resourceUsage.length > 0 ? resourceUsage[resourceUsage.length - 1].domNodes : 0}
                          </h4>
                        </div>
                        <Layers className="h-5 w-5 text-orange-500" />
                      </div>
                      <Progress
                        value={
                          resourceUsage.length > 0 ? (resourceUsage[resourceUsage.length - 1].domNodes / 2000) * 100 : 0
                        }
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">CPU Usage Over Time</CardTitle>
                      <CardDescription>Percentage of CPU utilization</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-end">
                        {resourceUsage.map((usage, index) => (
                          <div
                            key={index}
                            className="flex-1 flex flex-col justify-end items-center h-full"
                            style={{ minWidth: `${100 / Math.min(resourceUsage.length, 30)}%` }}
                          >
                            <div
                              className="w-full bg-blue-500 mx-px rounded-t"
                              style={{ height: `${usage.cpu}%` }}
                              title={`CPU: ${usage.cpu.toFixed(1)}%`}
                            ></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>-{resourceUsage.length}s</span>
                        <span>Now</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Memory Usage Over Time</CardTitle>
                      <CardDescription>Memory consumption in MB</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-end">
                        {resourceUsage.map((usage, index) => (
                          <div
                            key={index}
                            className="flex-1 flex flex-col justify-end items-center h-full"
                            style={{ minWidth: `${100 / Math.min(resourceUsage.length, 30)}%` }}
                          >
                            <div
                              className="w-full bg-green-500 mx-px rounded-t"
                              style={{ height: `${(usage.memory / 500) * 100}%` }}
                              title={`Memory: ${usage.memory.toFixed(1)} MB`}
                            ></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>-{resourceUsage.length}s</span>
                        <span>Now</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Network Activity</CardTitle>
                      <CardDescription>Data transfer in KB/s</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-end">
                        {resourceUsage.map((usage, index) => (
                          <div
                            key={index}
                            className="flex-1 flex flex-col justify-end items-center h-full"
                            style={{ minWidth: `${100 / Math.min(resourceUsage.length, 30)}%` }}
                          >
                            <div className="w-full flex flex-col">
                              <div
                                className="w-full bg-red-400 mx-px"
                                style={{
                                  height: `${(usage.networkOut / 100) * 100}%`,
                                  maxHeight: "50%",
                                }}
                                title={`Upload: ${usage.networkOut.toFixed(1)} KB/s`}
                              ></div>
                              <div
                                className="w-full bg-green-400 mx-px"
                                style={{
                                  height: `${(usage.networkIn / 100) * 100}%`,
                                  maxHeight: "50%",
                                }}
                                title={`Download: ${usage.networkIn.toFixed(1)} KB/s`}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-400 mr-1"></div>
                          <span>Download</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-400 mr-1"></div>
                          <span>Upload</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                      <CardDescription>Key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-[200px] overflow-auto">
                        {performanceMetrics
                          .slice(-10)
                          .reverse()
                          .map((metric) => (
                            <div key={metric.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                              <div>
                                <p className="text-sm font-medium">{metric.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(metric.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  metric.category === "rendering"
                                    ? "default"
                                    : metric.category === "network"
                                      ? "secondary"
                                      : metric.category === "cpu"
                                        ? "destructive"
                                        : "outline"
                                }
                              >
                                {metric.value.toFixed(2)} {metric.unit}
                              </Badge>
                            </div>
                          ))}

                        {performanceMetrics.length === 0 && (
                          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                            No performance metrics available
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex-1 border rounded-md flex items-center justify-center">
          <div className="text-center p-6">
            <p className="font-medium mb-2">Connect to your local development server</p>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the URL of your running {projectDetails.framework} application and click Connect
            </p>
            <Button onClick={handleConnect} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                "Connect to Server"
              )}
            </Button>
          </div>
        </div>
      )}

      {showPerformancePanel && renderPerformancePanel()}

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!showPerformancePanel && isConnected && (
            <Button variant="outline" size="sm" onClick={() => setShowPerformancePanel(true)} className="gap-1">
              <BarChart2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Show Performance Panel</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isConnected && (
            <>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Connected for:{" "}
                  {Math.floor((Date.now() - (resourceUsage[0]?.timestamp.getTime() || Date.now())) / 1000)}s
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="h-3.5 w-3.5" />
                <span>Logs: {consoleLogs.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5" />
                <span>Requests: {networkRequests.length}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
