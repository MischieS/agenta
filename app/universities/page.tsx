"use client"

import { useState, useMemo, useCallback } from "react"
import { PageTransition } from "@/components/ui/animated"
import { UniversityCard } from "@/components/university-card"
import { UniversitySearch } from "@/components/university-search"
import { Button } from "@/components/ui/button"
import { CustomButton } from "@/components/custom-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Filter, MapPin, GraduationCap, BookOpen, X } from "lucide-react"
import { ScrollToTop } from "@/components/scroll-to-top"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

// Updated university data (only private universities in Istanbul)
const universities = [
  {
    id: 1,
    name: "İstinye Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=istinye",
    programs: 85,
    faculties: 10,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 15,
    fields: ["Medicine", "Engineering", "Business", "Health Sciences", "Social Sciences"],
  },
  {
    id: 2,
    name: "İstanbul Atlas Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=atlas",
    programs: 60,
    faculties: 8,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 22,
    fields: ["Medicine", "Dentistry", "Engineering", "Social Sciences", "Health Sciences"],
  },
  {
    id: 3,
    name: "İstanbul Medipol Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=medipol",
    programs: 95,
    faculties: 12,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 8,
    fields: ["Medicine", "Dentistry", "Pharmacy", "Health Sciences", "Engineering"],
  },
  {
    id: 4,
    name: "İstanbul Yeni Yüzyıl Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=yeniyuzyil",
    programs: 55,
    faculties: 7,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 25,
    fields: ["Medicine", "Dentistry", "Pharmacy", "Law", "Communication"],
  },
  {
    id: 5,
    name: "Nişantaşı Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=nisantasi",
    programs: 70,
    faculties: 9,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 20,
    fields: ["Business", "Engineering", "Architecture", "Arts", "Health Sciences"],
  },
  {
    id: 6,
    name: "İstanbul Arel Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=arel",
    programs: 65,
    faculties: 8,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 24,
    fields: ["Engineering", "Business", "Communication", "Arts", "Health Sciences"],
  },
  {
    id: 7,
    name: "Biruni Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=biruni",
    programs: 75,
    faculties: 9,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 18,
    fields: ["Medicine", "Dentistry", "Pharmacy", "Health Sciences", "Education"],
  },
  {
    id: 8,
    name: "Fenerbahçe Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=fenerbahce",
    programs: 50,
    faculties: 6,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 26,
    fields: ["Business", "Engineering", "Communication", "Sports Sciences", "Health Sciences"],
  },
  {
    id: 9,
    name: "İstanbul Kent Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=kent",
    programs: 55,
    faculties: 7,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 27,
    fields: ["Medicine", "Dentistry", "Law", "Engineering", "Health Sciences"],
  },
  {
    id: 10,
    name: "Bezmialem Vakıf Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=bezmialem",
    programs: 60,
    faculties: 8,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 14,
    fields: ["Medicine", "Dentistry", "Pharmacy", "Health Sciences", "Nursing"],
  },
  {
    id: 11,
    name: "Acıbadem Mehmet Ali Aydınlar Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=acibadem",
    programs: 65,
    faculties: 8,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 13,
    fields: ["Medicine", "Dentistry", "Pharmacy", "Health Sciences", "Engineering"],
  },
  {
    id: 12,
    name: "Altınbaş Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=altinbas",
    programs: 70,
    faculties: 9,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 19,
    fields: ["Medicine", "Dentistry", "Pharmacy", "Law", "Engineering"],
  },
  {
    id: 13,
    name: "Kadir Has Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=kadirhas",
    programs: 75,
    faculties: 9,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 10,
    fields: ["Engineering", "Communication", "Law", "Business", "Arts"],
  },
  {
    id: 14,
    name: "Haliç Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=halic",
    programs: 60,
    faculties: 8,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 23,
    fields: ["Medicine", "Dentistry", "Engineering", "Arts", "Health Sciences"],
  },
  {
    id: 15,
    name: "İstanbul Kültür Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=kultur",
    programs: 80,
    faculties: 10,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 12,
    fields: ["Engineering", "Architecture", "Law", "Arts", "Business"],
  },
  {
    id: 16,
    name: "İstanbul Gelişim Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=gelisim",
    programs: 85,
    faculties: 10,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 17,
    fields: ["Engineering", "Health Sciences", "Business", "Social Sciences", "Sports Sciences"],
  },
  {
    id: 17,
    name: "İstanbul Okan Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=okan",
    programs: 90,
    faculties: 11,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 11,
    fields: ["Medicine", "Dentistry", "Engineering", "Business", "Law"],
  },
  {
    id: 18,
    name: "Bahçeşehir Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=bahcesehir",
    programs: 95,
    faculties: 12,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 5,
    fields: ["Medicine", "Engineering", "Law", "Communication", "Architecture"],
  },
  {
    id: 19,
    name: "Yeditepe Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=yeditepe",
    programs: 100,
    faculties: 13,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 4,
    fields: ["Medicine", "Dentistry", "Pharmacy", "Law", "Engineering"],
  },
  {
    id: 20,
    name: "Beykent Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=beykent",
    programs: 85,
    faculties: 10,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 16,
    fields: ["Medicine", "Dentistry", "Engineering", "Architecture", "Communication"],
  },
  {
    id: 21,
    name: "İstanbul Bilgi Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=bilgi",
    programs: 90,
    faculties: 11,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 6,
    fields: ["Law", "Business", "Communication", "Engineering", "Architecture"],
  },
  {
    id: 22,
    name: "İstanbul Aydın Üniversitesi",
    location: "Istanbul",
    image: "/placeholder.svg?key=aydin",
    programs: 95,
    faculties: 12,
    languages: ["English", "Turkish"],
    type: "Private",
    ranking: 9,
    fields: ["Medicine", "Dentistry", "Engineering", "Communication", "Law"],
  },
]

// Available locations for filter
const locations = [...new Set(universities.map((uni) => uni.location))]

// Available languages for filter
const allLanguages = universities.flatMap((uni) => uni.languages)
const languages = [...new Set(allLanguages)]

// Available fields of study for filter
const allFields = universities.flatMap((uni) => uni.fields)
const uniqueFields = [...new Set(allFields)].sort()

export default function UniversitiesPage() {
  // Basic state
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("ranking")
  const [isLoading, setIsLoading] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Filter state
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedFields, setSelectedFields] = useState<string[]>([])

  // Toggle field selection
  const toggleField = useCallback((field: string) => {
    setSelectedFields((prev) => {
      if (prev.includes(field)) {
        return prev.filter((f) => f !== field)
      } else {
        return [...prev, field]
      }
    })
  }, [])

  // Remove a single field
  const removeField = useCallback((field: string) => {
    setSelectedFields((prev) => prev.filter((f) => f !== field))
  }, [])

  // Reset filters function
  const resetFilters = useCallback(() => {
    setSearchTerm("")
    setSelectedLocation("")
    setSelectedType("")
    setSelectedLanguage("")
    setSelectedFields([])
    setSortBy("ranking")
  }, [])

  // Filter universities with memoization
  const filteredUniversities = useMemo(() => {
    let results = [...universities]

    // Text search filter
    if (searchTerm) {
      results = results.filter(
        (uni) =>
          uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          uni.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Location filter
    if (selectedLocation && selectedLocation !== "all") {
      results = results.filter((uni) => uni.location === selectedLocation)
    }

    // Type filter
    if (selectedType && selectedType !== "all") {
      results = results.filter((uni) => uni.type === selectedType)
    }

    // Language filter
    if (selectedLanguage && selectedLanguage !== "all") {
      results = results.filter((uni) => uni.languages.includes(selectedLanguage))
    }

    // Fields filter
    if (selectedFields.length > 0) {
      results = results.filter((uni) => selectedFields.some((field) => uni.fields.includes(field)))
    }

    // Sort universities
    if (sortBy === "ranking") {
      results.sort((a, b) => a.ranking - b.ranking)
    } else if (sortBy === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name))
    }

    return results
  }, [searchTerm, selectedLocation, selectedType, selectedLanguage, selectedFields, sortBy])

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-university-gradient text-white py-12">
            <div className="container px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  Find Your Perfect University in Turkey
                </h1>
                <p className="text-lg opacity-90 mb-8">
                  Browse through our comprehensive list of top Turkish universities and find the one that matches your
                  academic goals.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto">
                  <UniversitySearch
                    variant="dark"
                    className="w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Filter and Results Section */}
          <section className="py-12 bg-background">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden flex justify-between items-center mb-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ranking">Ranking</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filters Sidebar */}
                <div className={`lg:w-1/4 ${showMobileFilters ? "block" : "hidden"} lg:block`}>
                  <div className="bg-card rounded-lg border p-6 sticky top-20">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Filters</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Reset
                      </Button>
                    </div>

                    {/* Scrollable filters container */}
                    <div className="max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar pr-2">
                      <Accordion type="multiple" defaultValue={["location", "type", "language", "fields"]}>
                        {/* Location Filter */}
                        <AccordionItem value="location">
                          <AccordionTrigger className="text-base font-medium">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Location
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {locations.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </AccordionContent>
                        </AccordionItem>

                        {/* University Type Filter */}
                        <AccordionItem value="type">
                          <AccordionTrigger className="text-base font-medium">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              University Type
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <Select value={selectedType} onValueChange={setSelectedType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Private">Private</SelectItem>
                              </SelectContent>
                            </Select>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Language Filter */}
                        <AccordionItem value="language">
                          <AccordionTrigger className="text-base font-medium">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Language
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Languages</SelectItem>
                                {languages.map((language) => (
                                  <SelectItem key={language} value={language}>
                                    {language}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Fields of Study Filter */}
                        <AccordionItem value="fields">
                          <AccordionTrigger className="text-base font-medium">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Fields of Study
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                              {uniqueFields.map((field) => (
                                <div key={field} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`field-${field}`}
                                    checked={selectedFields.includes(field)}
                                    onCheckedChange={() => toggleField(field)}
                                  />
                                  <Label htmlFor={`field-${field}`} className="text-sm cursor-pointer">
                                    {field}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            {selectedFields.length > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-muted-foreground"
                                  onClick={() => setSelectedFields([])}
                                >
                                  Clear selected fields
                                </Button>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    {/* Mobile Apply Filters Button */}
                    <div className="mt-6 lg:hidden">
                      <Button className="w-full" onClick={() => setShowMobileFilters(false)}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className={`${showMobileFilters ? "hidden" : "block"} lg:block lg:w-3/4`}>
                  {/* Desktop Sort Controls */}
                  <div className="hidden lg:flex justify-between items-center mb-6">
                    <div className="text-muted-foreground">
                      Showing <span className="font-medium text-foreground">{filteredUniversities.length}</span>{" "}
                      universities
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Sort by:</span>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ranking">Ranking</SelectItem>
                          <SelectItem value="name">Name (A-Z)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(selectedLocation || selectedType || selectedLanguage || selectedFields.length > 0) && (
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">Active filters:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedLocation && selectedLocation !== "all" && (
                          <div className="bg-muted text-sm px-2 py-1 rounded-md flex items-center">
                            <span className="mr-1">Location: {selectedLocation}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1 text-muted-foreground"
                              onClick={() => setSelectedLocation("")}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {selectedType && selectedType !== "all" && (
                          <div className="bg-muted text-sm px-2 py-1 rounded-md flex items-center">
                            <span className="mr-1">Type: {selectedType}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1 text-muted-foreground"
                              onClick={() => setSelectedType("")}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {selectedLanguage && selectedLanguage !== "all" && (
                          <div className="bg-muted text-sm px-2 py-1 rounded-md flex items-center">
                            <span className="mr-1">Language: {selectedLanguage}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1 text-muted-foreground"
                              onClick={() => setSelectedLanguage("")}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Fields of Study Badges */}
                      {selectedFields.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm text-muted-foreground mb-1">Fields of Study:</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedFields.map((field) => (
                              <Badge key={field} variant="secondary" className="pl-2 pr-1 py-1">
                                <span>{field}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0 ml-1"
                                  onClick={() => removeField(field)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                            {selectedFields.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground h-6"
                                onClick={() => setSelectedFields([])}
                              >
                                Clear all
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Results Grid */}
                  {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : filteredUniversities.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                      {filteredUniversities.map((university, index) => (
                        <UniversityCard
                          key={university.id}
                          id={university.id}
                          name={university.name}
                          location={university.location}
                          image={university.image}
                          programs={university.programs}
                          faculties={university.faculties}
                          type={university.type}
                          ranking={university.ranking}
                          languages={university.languages}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-muted rounded-lg">
                      <div className="mb-4 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No universities found</h3>
                      <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
                      <CustomButton onClick={resetFilters}>Reset Filters</CustomButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <ScrollToTop />
    </PageTransition>
  )
}
