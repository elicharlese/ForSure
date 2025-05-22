"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ExternalLink, Search, X, Filter, Download } from "lucide-react"
import type { ProjectDetails } from "./project-details-form"

// Types for console logs
type LogLevel = "info" | "warn" | "error" | "debug"

interface ConsoleLog {
  id: string
  timestamp: Date
  level: LogLevel
  message: string
  source: string
  stack?: string
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

  const handleConnect = () => {
    setIsLoading(true)
    // Simulate connection attempt
    setTimeout(() => {
      setIsLoading(false)
      setIsConnected(true)
      generateMockData()
    }, 1500)
  }

  const generateMockData = () => {
    // Generate mock console logs
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
      },
    ]

    setConsoleLogs(mockLogs)
    setNetworkRequests(mockRequests)

    // Simulate new logs and requests coming in
    const interval = setInterval(() => {
      const newLog: ConsoleLog = {
        id: `log${Date.now()}`,
        timestamp: new Date(),
        level: ["info", "warn", "error", "debug"][Math.floor(Math.random() * 4)] as LogLevel,
        message: `New log message at ${new Date().toLocaleTimeString()}`,
        source: "live-update.js:34",
      }

      const methods: RequestMethod[] = ["GET", "POST", "PUT", "DELETE"]
      const statuses = [200, 201, 204, 400, 401, 404, 500]

      const newRequest: NetworkRequest = {
        id: `req${Date.now()}`,
        url: `http://localhost:3000/api/endpoint${Math.floor(Math.random() * 10)}`,
        method: methods[Math.floor(Math.random() * methods.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        statusText: "Status Text",
        time: Math.floor(Math.random() * 500),
        size: Math.floor(Math.random() * 5000),
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
      }

      setConsoleLogs((prev) => [newLog, ...prev])
      setNetworkRequests((prev) => [newRequest, ...prev])
    }, 5000)

    return () => clearInterval(interval)
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

  if (!projectDetails) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No project available. Create a project to use the port viewer.
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter localhost URL (e.g., http://localhost:3000)"
          className="flex-grow"
        />
        <Button onClick={handleConnect} disabled={isLoading} className="gap-2">
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Connect"}
        </Button>
      </div>

      {isConnected ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3">
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
          </TabsList>

          <TabsContent value="preview" className="flex-1 mt-0">
            <div className="border rounded-md overflow-hidden bg-white h-full">
              <div className="bg-gray-100 border-b px-4 py-2 flex justify-between items-center">
                <span className="text-sm font-medium">{url}</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Open in new tab</span>
                </Button>
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
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    {consoleFilter !== "all" && <span className="text-xs capitalize">{consoleFilter}</span>}
                    {consoleFilter === "all" && <span className="text-xs">All</span>}
                  </Button>
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-md z-10 hidden group-hover:block">
                    <div className="p-1">
                      <button
                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setConsoleFilter("all")}
                      >
                        All
                      </button>
                      <button
                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setConsoleFilter("info")}
                      >
                        Info
                      </button>
                      <button
                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setConsoleFilter("warn")}
                      >
                        Warnings
                      </button>
                      <button
                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setConsoleFilter("error")}
                      >
                        Errors
                      </button>
                      <button
                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setConsoleFilter("debug")}
                      >
                        Debug
                      </button>
                    </div>
                  </div>
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
                <Button variant="outline" size="sm" onClick={clearConsoleLogs}>
                  Clear
                </Button>
              </div>
            </div>
            <div className="bg-gray-900 text-gray-100 p-0 h-[calc(100%-40px)] overflow-auto font-mono text-sm">
              {filteredLogs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">No console logs to display</div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="p-2 hover:bg-gray-800">
                      <div className="flex items-start">
                        <Badge className={`mr-2 ${getLogBadgeColor(log.level)}`}>{log.level}</Badge>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-xs">{log.source}</span>
                            <span className="text-gray-400 text-xs">{log.timestamp.toLocaleTimeString()}</span>
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
                  <Button variant="outline" size="sm" className="gap-1">
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
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-md z-10 hidden group-hover:block">
                    <div className="p-1">
                      <button
                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setNetworkFilter("all")}
                      >
                        All
                      </button>
                      <button
                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setNetworkFilter("success")}
                      >
                        Success (2xx)
                      </button>
                      <button
                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setNetworkFilter("redirect")}
                      >
                        Redirects (3xx)
                      </button>
                      <button
                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setNetworkFilter("clientError")}
                      >
                        Client Errors (4xx)
                      </button>
                      <button
                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setNetworkFilter("serverError")}
                      >
                        Server Errors (5xx)
                      </button>
                    </div>
                  </div>
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
                <Button variant="outline" size="sm" onClick={clearNetworkRequests}>
                  Clear
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3.5 w-3.5" />
                  <span className="sr-only">Download HAR</span>
                </Button>
              </div>
            </div>
            <div className="bg-white h-[calc(100%-40px)] overflow-auto text-sm">
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
                        <summary className="cursor-pointer hover:bg-gray-50 grid grid-cols-12 gap-2 px-4 py-2 items-center">
                          <div className="col-span-5 truncate text-blue-600">{request.url}</div>
                          <div className="col-span-1 font-medium">{request.method}</div>
                          <div className="col-span-1">
                            <Badge className={getStatusBadgeColor(request.status)}>{request.status}</Badge>
                          </div>
                          <div className="col-span-1 text-gray-500">{request.type}</div>
                          <div className="col-span-2 text-gray-500">
                            {request.size < 1024 ? `${request.size} B` : `${(request.size / 1024).toFixed(1)} KB`}
                          </div>
                          <div className="col-span-2 text-gray-500">
                            {request.time < 1000 ? `${request.time} ms` : `${(request.time / 1000).toFixed(1)} s`}
                          </div>
                        </summary>
                        <div className="px-4 py-3 bg-gray-50 border-t">
                          <Tabs defaultValue="headers" className="w-full">
                            <TabsList className="mb-2">
                              <TabsTrigger value="headers">Headers</TabsTrigger>
                              <TabsTrigger value="request">Request</TabsTrigger>
                              <TabsTrigger value="response">Response</TabsTrigger>
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
                          </Tabs>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
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
    </div>
  )
}
