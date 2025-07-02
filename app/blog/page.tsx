"use client"

import { PageTransition, FadeIn } from "@/components/ui/animated"
import { CustomButton } from "@/components/custom-button"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Sample blog data
const blogPosts = [
  {
    id: 1,
    slug: "guide-to-turkish-student-visa",
    title: "Complete Guide to Turkish Student Visa Application Process",
    excerpt:
      "Everything international students need to know about applying for a student visa in Turkey, including required documents and application timeline.",
    category: "Visa Information",
    author: "Mehmet Yilmaz",
    date: "May 10, 2023",
    readTime: "8 min read",
    image: "/placeholder.svg?key=lzn55",
    featured: true,
  },
  {
    id: 2,
    slug: "top-engineering-programs-turkey",
    title: "Top 10 Engineering Programs in Turkish Universities",
    excerpt:
      "Discover the best engineering programs offered by Turkish universities, their strengths, and career opportunities for graduates.",
    category: "Academic Programs",
    author: "Ayşe Kaya",
    date: "April 22, 2023",
    readTime: "10 min read",
    image: "/placeholder.svg?key=v1x62",
    featured: true,
  },
  {
    id: 3,
    slug: "cost-of-living-for-students",
    title: "Cost of Living for International Students in Major Turkish Cities",
    excerpt:
      "A comprehensive breakdown of monthly expenses including accommodation, food, transportation, and entertainment in Istanbul, Ankara, and Izmir.",
    category: "Student Life",
    author: "John Smith",
    date: "March 15, 2023",
    readTime: "7 min read",
    image: "/placeholder.svg?key=tde74",
    featured: false,
  },
  {
    id: 4,
    slug: "scholarship-opportunities-2023",
    title: "Scholarship Opportunities for International Students in 2023",
    excerpt:
      "Explore various scholarship programs available for international students in Turkey, including government scholarships and university-specific grants.",
    category: "Scholarships",
    author: "Fatima Hassan",
    date: "February 28, 2023",
    readTime: "9 min read",
    image: "/placeholder.svg?key=ml1k9",
    featured: false,
  },
  {
    id: 5,
    slug: "learning-turkish-language-tips",
    title: "Essential Tips for Learning the Turkish Language",
    excerpt:
      "Practical advice and resources for international students looking to learn Turkish, from beginner to advanced levels.",
    category: "Language",
    author: "Carlos Rodriguez",
    date: "February 10, 2023",
    readTime: "6 min read",
    image: "/placeholder.svg?key=6tf0y",
    featured: false,
  },
  {
    id: 6,
    slug: "student-accommodation-options",
    title: "Student Accommodation Options in Turkey",
    excerpt:
      "Compare different housing options for international students, from university dormitories to private apartments and shared housing.",
    category: "Student Life",
    author: "Emma Wilson",
    date: "January 25, 2023",
    readTime: "8 min read",
    image: "/placeholder.svg?height=600&width=800&query=student dormitory in turkey",
    featured: false,
  },
  {
    id: 7,
    slug: "turkish-culture-for-international-students",
    title: "Understanding Turkish Culture: A Guide for International Students",
    excerpt:
      "Learn about Turkish customs, traditions, etiquette, and cultural norms to help you integrate better as an international student.",
    category: "Culture",
    author: "Priya Sharma",
    date: "January 12, 2023",
    readTime: "11 min read",
    image: "/placeholder.svg?height=600&width=800&query=turkish cultural festival",
    featured: false,
  },
  {
    id: 8,
    slug: "internship-opportunities-turkey",
    title: "Finding Internship Opportunities as an International Student in Turkey",
    excerpt:
      "Tips and resources for securing internships in Turkey, including company listings, application processes, and work permit information.",
    category: "Career",
    author: "Ahmed Hassan",
    date: "December 5, 2022",
    readTime: "7 min read",
    image: "/placeholder.svg?height=600&width=800&query=business internship office",
    featured: false,
  },
]

// Categories for filtering
const categories = [
  "All",
  "Visa Information",
  "Academic Programs",
  "Student Life",
  "Scholarships",
  "Language",
  "Culture",
  "Career",
]

export default function BlogPage() {
  // Check if this page is also including a Header component
  // If it is, we need to remove it since we already have one in the layout
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Filter posts based on search term and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Separate featured posts
  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-university-gradient text-white py-12 md:py-20">
            <div className="container px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Agenta Blog</h1>
                <p className="text-lg opacity-90 mb-8">
                  Insights, guides, and resources for international students considering Turkey for their education
                </p>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-white/70" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-6 bg-white/10 text-white placeholder:text-white/70 border-white/20 focus:border-white focus:bg-white/20"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && !searchTerm && selectedCategory === "All" && (
            <section className="py-12 bg-muted">
              <div className="container px-4 md:px-6">
                <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredPosts.map((post) => (
                    <FadeIn key={post.id} direction="up">
                      <Link href={`/blog/${post.slug}`} className="group block">
                        <div className="bg-card rounded-lg overflow-hidden shadow-sm border h-full transition-all duration-200 group-hover:shadow-md">
                          <div className="relative h-60">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="bg-primary text-white text-xs font-medium px-2.5 py-1 rounded">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <User className="h-4 w-4 mr-1" />
                              <span className="mr-4">{post.author}</span>
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="mr-4">{post.date}</span>
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Blog Posts */}
          <section className="py-12">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar with Categories */}
                <div className="md:w-1/4">
                  <div className="bg-card rounded-lg border p-6 sticky top-20">
                    <h3 className="text-lg font-medium mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                            selectedCategory === category ? "bg-primary text-white" : "hover:bg-muted"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Blog Posts Grid */}
                <div className="md:w-3/4">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">
                      {selectedCategory === "All" ? "All Articles" : selectedCategory}
                    </h2>
                    <p className="text-muted-foreground">
                      {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
                    </p>
                  </div>

                  {filteredPosts.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPosts.map((post, index) => (
                        <FadeIn key={post.id} direction="up" delay={index * 0.1}>
                          <Link href={`/blog/${post.slug}`} className="group block h-full">
                            <div className="bg-card rounded-lg overflow-hidden shadow-sm border h-full transition-all duration-200 group-hover:shadow-md">
                              <div className="relative h-48">
                                <Image
                                  src={post.image || "/placeholder.svg"}
                                  alt={post.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3">
                                  <span className="bg-primary/90 text-white text-xs font-medium px-2 py-0.5 rounded">
                                    {post.category}
                                  </span>
                                </div>
                              </div>
                              <div className="p-5">
                                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{post.date}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{post.readTime}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </FadeIn>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-muted rounded-lg">
                      <div className="mb-4 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No articles found</h3>
                      <p className="text-muted-foreground mb-6">Try adjusting your search or category selection</p>
                      <CustomButton
                        onClick={() => {
                          setSearchTerm("")
                          setSelectedCategory("All")
                        }}
                      >
                        Reset Filters
                      </CustomButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="py-12 bg-cta-gradient text-white">
            <div className="container px-4 md:px-6">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                <p className="mb-6">
                  Subscribe to our newsletter for the latest articles, guides, and resources about studying in Turkey.
                </p>
                <form className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-white/10 text-white placeholder:text-white/70 border-white/20 focus:border-white"
                  />
                  <CustomButton variant="accent" type="submit">
                    Subscribe
                  </CustomButton>
                </form>
              </div>
            </div>
          </section>
        </main>
        <ScrollToTop />
      </div>
    </PageTransition>
  )
}
