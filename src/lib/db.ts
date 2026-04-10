import { Client, createClient } from '@libsql/client';

let db: Client | null = null;
let initialized = false;
let initializationPromise: Promise<void> | null = null;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url || url.trim().length === 0) {
    throw new Error('DATABASE_URL não está configurada');
  }
  return url;
}

function getDatabaseToken(): string {
  const token = process.env.DATABASE_TOKEN || process.env.DATABASE_AUTH_TOKEN;
  if (!token || token.trim().length === 0) {
    throw new Error('DATABASE_TOKEN não está configurada');
  }
  return token;
}

async function runMigrations(client: Client): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matricula TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS selections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER UNIQUE NOT NULL,
      main_area_id INTEGER NOT NULL,
      area_preference_order TEXT NOT NULL,
      articles_selected TEXT NOT NULL,
      custom_pdf_path TEXT,
      custom_pdf_name TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      username TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute('CREATE INDEX IF NOT EXISTS idx_members_matricula ON members(matricula)');
  await client.execute('CREATE INDEX IF NOT EXISTS idx_selections_member_id ON selections(member_id)');
  await client.execute('CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token)');

  // Backward-compatible migration for existing databases.
  const membersColumns = await client.execute('PRAGMA table_info(members)');
  const hasFullNameColumn = membersColumns.rows.some((column) => {
    const row = column as Record<string, unknown>;
    return row.name === 'full_name';
  });

  if (!hasFullNameColumn) {
    await client.execute("ALTER TABLE members ADD COLUMN full_name TEXT NOT NULL DEFAULT ''");
  }
}

export async function initializeDatabase(): Promise<Client> {
  if (db && initialized) {
    return db;
  }

  if (!db) {
    db = createClient({
      url: getDatabaseUrl(),
      authToken: getDatabaseToken(),
    });
  }

  if (!initialized) {
    if (!initializationPromise) {
      initializationPromise = runMigrations(db).then(() => {
        initialized = true;
      });
    }
    await initializationPromise;
  }

  return db;
}

export async function getDatabase(): Promise<Client> {
  return initializeDatabase();
}

export function closeDatabase(): void {
  db = null;
  initialized = false;
  initializationPromise = null;
}
