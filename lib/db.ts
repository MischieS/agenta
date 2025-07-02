import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Create a SQL query executor using the Neon serverless driver
export const sql = neon(process.env.DATABASE_URL!)

// Create a Drizzle ORM instance
export const db = drizzle(sql)

// Helper function to execute raw SQL queries
export async function executeQuery(
  strings: TemplateStringsArray | string, 
  ...values: any[]
) {
  try {
    // Handle both tagged template literals and regular string + params
    if (typeof strings === 'string') {
      // Called with a regular string and array of values
      // Use the sql.query method for string queries instead of the template tag function
      const result = await sql.query(strings, values[0] || []);
      return result;
    } else {
      // Called with a tagged template literal
      const result = await sql(strings, ...values);
      return result;
    }
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Helper function to format JSONB data for display
export function formatJsonbField(jsonb: any, language = "en") {
  if (!jsonb) return ""

  if (typeof jsonb === "string") {
    try {
      jsonb = JSON.parse(jsonb)
    } catch (e) {
      return jsonb
    }
  }

  if (jsonb[language]) {
    return jsonb[language]
  }

  return JSON.stringify(jsonb)
}
