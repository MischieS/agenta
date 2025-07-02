'use client'

import { useEffect, useState } from 'react'

export default function LayoutInit() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Initialize database on app start (client-side)
    async function initDb() {
      try {
        const response = await fetch('/api/init-db')
        const result = await response.json()
        
        if (result.success) {
          console.log('Database initialized successfully')
        } else {
          console.error('Database initialization failed:', result.error)
        }
        
        setInitialized(true)
      } catch (error) {
        console.error('Error during database initialization:', error)
        setInitialized(true)
      }
    }

    initDb()
  }, [])

  // This component doesn't render anything visible
  return null
}
