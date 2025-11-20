"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`)
    }
  }

  const suggestions = ["payments api", "authentication", "react", "database"]

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search questions by keyword, tag, or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-11"
            autoComplete="off"
          />
        </div>
        <Button type="submit" size="lg" className="gap-2">
          Search
        </Button>
      </div>

      {!query && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={(e) => {
                e.preventDefault()
                setQuery(suggestion)
                router.push(`/?search=${encodeURIComponent(suggestion)}`)
              }}
              className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded hover:bg-muted/80 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
