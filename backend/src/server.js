import app from './app.js'
import { env } from './config/env.js'
import { ensureDb } from './shared/db.js'

await ensureDb()

app.listen(env.port, () => {
  console.log(`SHOPNOVA API running at http://127.0.0.1:${env.port}`)
})
