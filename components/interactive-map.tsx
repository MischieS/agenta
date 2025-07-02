"use client"

import { useEffect, useRef, useState } from "react"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"

// Define types for points of interest
interface PointOfInterest {
  id: string
  name: string
  category: "restaurant" | "cafe" | "library" | "accommodation" | "shopping" | "transportation" | "entertainment"
  latitude: number
  longitude: number
  description?: string
}

interface InteractiveMapProps {
  latitude: number
  longitude: number
  universityName: string
  zoom?: number
  height?: string
  nearbyAttractions?: PointOfInterest[]
}

// Category configuration with colors and icons
const categoryConfig = {
  restaurant: { color: "#e74c3c", icon: "🍽️", label: "Restaurants" },
  cafe: { color: "#9b59b6", icon: "☕", label: "Cafes" },
  library: { color: "#3498db", icon: "📚", label: "Libraries" },
  accommodation: { color: "#2ecc71", icon: "🏠", label: "Accommodation" },
  shopping: { color: "#f39c12", icon: "🛍️", label: "Shopping" },
  transportation: { color: "#7f8c8d", icon: "🚌", label: "Transportation" },
  entertainment: { color: "#1abc9c", icon: "🎭", label: "Entertainment" },
}

export function InteractiveMap({
  latitude,
  longitude,
  universityName,
  zoom = 15,
  height = "400px",
  nearbyAttractions = [],
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.IMap | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(Object.keys(categoryConfig)))

  // Toggle category visibility
  const toggleCategory = (category: string) => {
    setActiveCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    // Initialize map if it doesn't exist
    if (mapRef.current && !mapInstanceRef.current) {
      const map = new L.Map(mapRef.current).setView([latitude, longitude], zoom)

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attributionControl: false
      } as L.TileLayerOptions).addTo(map)

      // Create custom university marker icon
      const universityIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-graduation-cap"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
               </div>`,
        className: 'university-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      } as L.DivIconOptions)

      // Add marker for university location
      L.marker([latitude, longitude], { icon: universityIcon })
        .addTo(map)
        .bindPopup(`<b>${universityName}</b>`)
        .openPopup()

      mapInstanceRef.current = map

      // Ensure map is properly sized
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, universityName, zoom])

  // Effect to handle markers for nearby attractions
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      marker.remove()
    })
    markersRef.current = {}

    // Add markers for nearby attractions
    nearbyAttractions.forEach((poi) => {
      if (!activeCategories.has(poi.category)) return

      const { color, icon } = categoryConfig[poi.category as keyof typeof categoryConfig]

      const poiIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-6 h-6 text-white rounded-full shadow-md" style="background-color: ${color}">
                ${icon}
               </div>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      })

      const marker = L.marker([poi.latitude, poi.longitude], { icon: poiIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`<b>${poi.name}</b>${poi.description ? `<br>${poi.description}` : ""}`)

      markersRef.current[poi.id] = marker
    })
  }, [nearbyAttractions, activeCategories])

  return (
    <div className="space-y-3">
      <div className="rounded-lg overflow-hidden border">
        <div ref={mapRef} style={{ height }} className="z-0" />
      </div>

      {nearbyAttractions.length > 0 && (
        <div className="bg-card rounded-lg border p-3">
          <p className="text-sm font-medium mb-2">Nearby Points of Interest</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryConfig).map(([category, config]) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  activeCategories.has(category) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                <span className="mr-1">{config.icon}</span>
                {config.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
