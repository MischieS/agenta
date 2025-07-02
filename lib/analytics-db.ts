import { neon, neonConfig } from "@neondatabase/serverless"

// Create a reusable SQL client
const dbUrl = process.env.DATABASE_URL

if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Configure neon
neonConfig.fetchConnectionCache = true

// Create the SQL client
const sql = neon(dbUrl)

// Helper function to execute analytics queries
export async function executeAnalyticsQuery(query: string, params: any[] = []) {
  try {
    // Use the sql.query method for parameterized queries
    const result = await sql.query(query, params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function to track an event
export async function trackEvent(
  eventName: string,
  entityType: string | null,
  entityId: string | null,
  userId: string | null,
  sessionId: string | null,
  eventData: any = {},
  url: string | null = null,
  ipAddress: string | null = null,
  userAgent: string | null = null,
) {
  try {
    const query = `
      SELECT analytics.track_event(
        $1, $2, $3::uuid, $4::uuid, $5::uuid, $6::jsonb, $7, $8, $9
      ) as event_id
    `

    const result = await sql.query(query, [
      eventName,
      entityType,
      entityId,
      userId,
      sessionId,
      JSON.stringify(eventData),
      ipAddress,
      userAgent,
      url,
    ])

    return result[0]?.event_id
  } catch (error) {
    console.error("Error tracking event:", error)
    // Don't throw the error to prevent breaking the application flow
    return null
  }
}

// Helper function to start a session
export async function startSession(
  userId: string | null,
  entryPage: string,
  referrer: string | null = null,
  utmSource: string | null = null,
  utmMedium: string | null = null,
  utmCampaign: string | null = null,
  ipAddress: string | null = null,
  userAgent: string | null = null,
) {
  try {
    const query = `
      SELECT analytics.start_session(
        $1::uuid, $2, $3, $4, $5, $6, NULL, NULL, $7, $8, 
        NULL, NULL, NULL, NULL, NULL, NULL
      ) as session_id
    `

    const result = await sql.query(query, [
      userId,
      entryPage,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      ipAddress,
      userAgent,
    ])

    return result[0]?.session_id
  } catch (error) {
    console.error("Error starting session:", error)
    return null
  }
}

// Helper function to track a page view
export async function trackPageView(
  userId: string | null,
  sessionId: string,
  url: string,
  pageTitle: string,
  referrer: string | null = null,
  userAgent: string | null = null,
  ipAddress: string | null = null,
) {
  try {
    const query = `
      SELECT analytics.track_page_view(
        $1::uuid, $2::uuid, $3, $4, $5, $6, $7
      ) as page_view_id
    `

    const result = await sql.query(query, [userId, sessionId, url, pageTitle, referrer, userAgent, ipAddress])

    return result[0]?.page_view_id
  } catch (error) {
    console.error("Error tracking page view:", error)
    return null
  }
}
