import type { Contact } from "~/types/contact"
import { orbitypeSql } from "./client"
import { hasSqlConfigured, isMockMode } from "./config"

export async function insertContact(
  contact: Omit<Contact, "id" | "created_at">,
): Promise<Contact | null> {
  if (!hasSqlConfigured() || isMockMode()) return null

  const rows = await orbitypeSql<Contact>(
    `INSERT INTO contacts (first_name, last_name, email, phone, topic, message)
     VALUES (:first_name, :last_name, :email, :phone, :topic, :message)
     RETURNING *`,
    {
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone ?? "",
      topic: contact.topic ?? "",
      message: contact.message,
    },
  )
  return rows[0] ?? null
}
