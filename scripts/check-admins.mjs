import postgres from "postgres"

const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false })

const rows = await sql.unsafe(`
  SELECT id, email, display_name, role, active, password_hash,
         created_at, updated_at
  FROM admin_users
  ORDER BY id
`)

if (rows.length === 0) {
  console.log("TABLE EMPTY")
} else {
  for (const r of rows) {
    console.log(`id:       ${r.id}`)
    console.log(`email:    ${r.email}`)
    console.log(`name:     ${r.display_name || "(empty)"}`)
    console.log(`role:     ${r.role}`)
    console.log(`active:   ${r.active}`)
    console.log(`pw_hash:  ${r.password_hash ? r.password_hash.substring(0, 16) + "..." : "(null)"}`)
    console.log(`created:  ${r.created_at}`)
    console.log(`updated:  ${r.updated_at}`)
    console.log("---")
  }
}

await sql.end()
