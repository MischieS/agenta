"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type User = {
  id: string
  name: string | null
  email: string | null
  created_at: Date | null
  updated_at: Date | null
  deleted_at: Date | null
  raw_json: any
}

export async function getUsers(): Promise<User[]> {
  try {
    const users = await executeQuery(`
      SELECT id, name, email, created_at, updated_at, deleted_at, raw_json
      FROM neon_auth.users_sync
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `)

    return users as User[]
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return []
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const users = await executeQuery(
      `
      SELECT id, name, email, created_at, updated_at, deleted_at, raw_json
      FROM neon_auth.users_sync
      WHERE id = $1
    `,
      [id],
    )

    return users.length > 0 ? (users[0] as User) : null
  } catch (error) {
    console.error(`Failed to fetch user with ID ${id}:`, error)
    return null
  }
}

export async function createUser(userData: { name: string; email: string }) {
  try {
    const { name, email } = userData

    await executeQuery(
      `
      INSERT INTO neon_auth.users_sync (id, name, email, created_at, updated_at, raw_json)
      VALUES ($1, $2, $3, NOW(), NOW(), $4)
    `,
      [
        crypto.randomUUID(), // Generate a UUID for the ID
        name,
        email,
        JSON.stringify({ name, email }),
      ],
    )

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Failed to create user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUser(id: string, userData: { name?: string; email?: string }) {
  try {
    const { name, email } = userData

    // First get the current user data
    const currentUser = await getUserById(id)
    if (!currentUser) {
      return { success: false, error: "User not found" }
    }

    // Update the user
    await executeQuery(
      `
      UPDATE neon_auth.users_sync
      SET 
        name = $1,
        email = $2,
        updated_at = NOW(),
        raw_json = $3
      WHERE id = $4
    `,
      [
        name ?? currentUser.name,
        email ?? currentUser.email,
        JSON.stringify({
          ...currentUser.raw_json,
          name: name ?? currentUser.name,
          email: email ?? currentUser.email,
        }),
        id,
      ],
    )

    revalidatePath("/admin/users")
    revalidatePath(`/admin/users/${id}`)
    return { success: true }
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    // Soft delete by setting deleted_at
    await executeQuery(
      `
      UPDATE neon_auth.users_sync
      SET deleted_at = NOW()
      WHERE id = $1
    `,
      [id],
    )

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error)
    return { success: false, error: "Failed to delete user" }
  }
}
