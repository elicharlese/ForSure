'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useRouter } from 'next/navigation'

type SearchResult = {
  title: string
  description: string
  url: string
  category: string
}

// Mock search results - in a real app, this would come from an API or search index
const mockSearchResults: SearchResult[] = [
  {
    title: 'Basic Syntax',
    description: 'Learn the fundamental syntax of ForSure',
    url: '/docs/syntax',
    category: 'Syntax',
  },
  {
    title: 'CLI Commands',
    description: 'Reference for all ForSure CLI commands',
    url: '/docs/cli',
    category: 'CLI',
  },
  {
    title: 'Installation Guide',
    description: 'How to install ForSure on your system',
    url: '/docs/installation',
    category: 'Getting Started',
  },
  {
    title: 'File Structure',
    description: 'How to define file structures in ForSure',
    url: '/docs/syntax/file-structure',
    category: 'Syntax',
  },
  {
    title: 'Import Directives',
    description: 'How to use @import directives in ForSure',
    url: '/docs/syntax/import-directives',
    category: 'Syntax',
  },
  {
    title: 'API Reference',
    description: 'Programmatic API for ForSure',
    url: '/docs/api',
    category: 'API',
  },
  {
    title: 'Examples',
    description: 'See ForSure in action with practical examples',
    url: '/docs/examples',
    category: 'Examples',
  },
  {
    title: 'Attributes',
    description: 'How to use attributes in ForSure',
    url: '/docs/syntax/attributes',
    category: 'Syntax',
  },
]

export default function DocsSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter results based on query
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const filtered = mockSearchResults.filter(
      result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
    )
    setResults(filtered)
  }, [query])

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full md:w-64 justify-between text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center">
          <Search className="mr-2 h-4 w-4" />
          <span>Search documentation...</span>
        </div>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search documentation..."
          value={query}
          onValueChange={setQuery}
          ref={inputRef}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((result, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleSelect(result.url)}
                  className="flex flex-col items-start"
                >
                  <div className="flex items-center w-full">
                    <span className="font-medium">{result.title}</span>
                    <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded">
                      {result.category}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {result.description}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
