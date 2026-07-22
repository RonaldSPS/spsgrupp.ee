import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import * as schema from "./schema"

let _client: postgres.Sql | null = null
let _db: PostgresJsDatabase<typeof schema> | null = null

export function getDb(): PostgresJsDatabase<typeof schema> {
  if (!_db) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error("DATABASE_URL is not set")

    try {
      _client = postgres(url, {
        max: 1,
        prepare: false,
        connect_timeout: 10,
        idle_timeout: 30,
      })
      _db = drizzle(_client, { schema })
    } catch (error) {
      console.error("Database connection failed:", error)
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  return _db
}

export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
