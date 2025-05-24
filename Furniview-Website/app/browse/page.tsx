"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, CuboidIcon as Cube3d, Search, SlidersHorizontal, X } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedButton } from "@/components/animated-button"

// Sample furniture data
const furnitureItems = [
  {
    id: 1,
    name: "Modern Coffee Table",
    company: "Scandinavian Designs",
    category: "Tables",
    difficulty: "Easy",
    estimatedTime: "30 min",
    parts: 12,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    company: "WorkSpace Pro",
    category: "Chairs",
    difficulty: "Medium",
    estimatedTime: "45 min",
    parts: 18,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    name: "Bookshelf with Storage",
    company: "Urban Living",
    category: "Storage",
    difficulty: "Medium",
    estimatedTime: "60 min",
    parts: 24,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    name: "Platform Bed Frame",
    company: "Sleep Essentials",
    category: "Beds",
    difficulty: "Hard",
    estimatedTime: "90 min",
    parts: 32,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 5,
    name: "Dining Table Set",
    company: "Home Gatherings",
    category: "Tables",
    difficulty: "Medium",
    estimatedTime: "75 min",
    parts: 28,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 6,
    name: "TV Stand with Media Storage",
    company: "Entertainment Solutions",
    category: "Storage",
    difficulty: "Easy",
    estimatedTime: "40 min",
    parts: 16,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 7,
    name: "Adjustable Standing Desk",
    company: "WorkSpace Pro",
    category: "Desks",
    difficulty: "Hard",
    estimatedTime: "80 min",
    parts: 30,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 8,
    name: "Lounge Chair with Ottoman",
    company: "Comfort Living",
    category: "Chairs",
    difficulty: "Medium",
    estimatedTime: "50 min",
    parts: 20,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 9,
    name: "Modular Wardrobe System",
    company: "Storage Solutions",
    category: "Storage",
    difficulty: "Hard",
    estimatedTime: "120 min",
    parts: 45,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 10,
    name: "Nightstand with Drawer",
    company: "Bedroom Essentials",
    category: "Storage",
    difficulty: "Easy",
    estimatedTime: "25 min",
    parts: 10,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 11,
    name: "Kitchen Island Cart",
    company: "Culinary Spaces",
    category: "Kitchen",
    difficulty: "Medium",
    estimatedTime: "60 min",
    parts: 22,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 12,
    name: "Bunk Bed with Ladder",
    company: "Kids Furniture Co",
    category: "Beds",
    difficulty: "Hard",
    estimatedTime: "100 min",
    parts: 38,
    image: "/placeholder.svg?height=300&width=400",
  },
]

// Categories for filtering
const categories = ["All Categories", "Tables", "Chairs", "Storage", "Beds", "Desks", "Kitchen"]

// Difficulty levels for filtering
const difficultyLevels = ["Easy", "Medium", "Hard"]

// Companies for filtering
const companies = [
  "All Companies",
  "Scandinavian Designs",
  "WorkSpace Pro",
  "Urban Living",
  "Sleep Essentials",
  "Home Gatherings",
  "Entertainment Solutions",
  "Comfort Living",
  "Storage Solutions",
  "Bedroom Essentials",
  "Culinary Spaces",
  "Kids Furniture Co",
]

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedCompany, setSelectedCompany] = useState("All Companies")
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Filter furniture items based on search query and filters
  const filteredItems = furnitureItems.filter((item) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory

    // Company filter
    const matchesCompany = selectedCompany === "All Companies" || item.company === selectedCompany

    // Difficulty filter
    const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(item.difficulty)

    return matchesSearch && matchesCategory && matchesCompany && matchesDifficulty
  })

  // Toggle difficulty filter
  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty],
    )

    // Update active filters
    updateActiveFilters(difficulty, "difficulty")
  }

  // Update active filters
  const updateActiveFilters = (value: string, type: string) => {
    if (type === "difficulty") {
      if (selectedDifficulties.includes(value)) {
        setActiveFilters((prev) => prev.filter((filter) => filter !== value))
      } else {
        setActiveFilters((prev) => [...prev, value])
      }
    } else if (type === "category") {
      if (value === "All Categories") {
        setActiveFilters((prev) => prev.filter((filter) => !categories.includes(filter)))
      } else {
        setActiveFilters((prev) => {
          const withoutCategories = prev.filter((filter) => !categories.includes(filter))
          return [...withoutCategories, value]
        })
      }
    } else if (type === "company") {
      if (value === "All Companies") {
        setActiveFilters((prev) => prev.filter((filter) => !companies.includes(filter)))
      } else {
        setActiveFilters((prev) => {
          const withoutCompanies = prev.filter((filter) => !companies.includes(filter))
          return [...withoutCompanies, value]
        })
      }
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All Categories")
    setSelectedCompany("All Companies")
    setSelectedDifficulties([])
    setActiveFilters([])
  }

  // Remove a specific filter
  const removeFilter = (filter: string) => {
    if (difficultyLevels.includes(filter)) {
      setSelectedDifficulties((prev) => prev.filter((d) => d !== filter))
    } else if (categories.includes(filter)) {
      setSelectedCategory("All Categories")
    } else if (companies.includes(filter)) {
      setSelectedCompany("All Companies")
    }

    setActiveFilters((prev) => prev.filter((f) => f !== filter))
  }

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <section className="w-full py-12 md:py-24 px-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-medium tracking-tighter sm:text-4xl md:text-5xl">
                Browse Assembly Instructions
              </h1>
              <p className="max-w-[700px] text-foreground-muted md:text-xl">
                Find interactive 3D assembly instructions for your furniture
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="w-full py-6 px-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <Input
                placeholder="Search furniture..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-auto">
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value)
                  updateActiveFilters(value, "category")
                }}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Filter */}
            <div className="w-full md:w-auto">
              <Select
                value={selectedCompany}
                onValueChange={(value) => {
                  setSelectedCompany(value)
                  updateActiveFilters(value, "company")
                }}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* More Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <AnimatedButton variant="outline" className="w-full md:w-auto" animationType="scale">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  More Filters
                </AnimatedButton>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your search with additional filters</SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Difficulty Level</h3>
                    {difficultyLevels.map((difficulty) => (
                      <div key={difficulty} className="flex items-center space-x-2">
                        <Checkbox
                          id={`difficulty-${difficulty}`}
                          checked={selectedDifficulties.includes(difficulty)}
                          onCheckedChange={() => toggleDifficulty(difficulty)}
                        />
                        <Label htmlFor={`difficulty-${difficulty}`}>{difficulty}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <SheetTrigger asChild>
                    <Button>Apply Filters</Button>
                  </SheetTrigger>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-foreground-muted">Active filters:</span>
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1 animate-scale-in">
                  {filter}
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter(filter)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" className="text-xs h-7" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Furniture Grid */}
      <section className="w-full py-8 px-4">
        <div className="container px-4 md:px-6">
          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-foreground-muted">
              Showing {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground-muted hidden md:inline">Sort by:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="easiest">Easiest First</SelectItem>
                  <SelectItem value="hardest">Hardest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Furniture Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <ScrollReveal key={item.id} delay={Math.min(0.05 * (index % 8), 0.35)}>
                  <Link href={`/model/${item.id}`}>
                    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md hover-lift">
                      <div className="aspect-[4/3] relative bg-background-subtle">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={
                              item.difficulty === "Easy"
                                ? "outline"
                                : item.difficulty === "Medium"
                                  ? "secondary"
                                  : "default"
                            }
                            className={
                              item.difficulty === "Easy"
                                ? "bg-white/80 backdrop-blur-sm"
                                : item.difficulty === "Medium"
                                  ? "bg-secondary/80 backdrop-blur-sm"
                                  : "bg-primary/80 backdrop-blur-sm text-white"
                            }
                          >
                            {item.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-foreground-muted">{item.company}</p>
                            <div className="flex items-center text-xs text-foreground-muted">
                              <Cube3d className="h-3 w-3 mr-1" />
                              {item.parts} parts
                            </div>
                          </div>
                          <h3 className="font-medium line-clamp-1">{item.name}</h3>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="bg-background-subtle">
                              {item.category}
                            </Badge>
                            <p className="text-xs text-foreground-muted">Est. time: {item.estimatedTime}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background-subtle mb-4 animate-pulse-subtle">
                <Search className="h-6 w-6 text-foreground-muted" />
              </div>
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-foreground-muted max-w-md mx-auto">
                We couldn't find any furniture matching your search criteria. Try adjusting your filters or search term.
              </p>
              <AnimatedButton onClick={clearFilters} className="mt-4 hover-lift" animationType="scale">
                Clear All Filters
              </AnimatedButton>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <section className="w-full py-8 px-4">
          <div className="container px-4 md:px-6 flex justify-center">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" disabled>
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="icon">
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
