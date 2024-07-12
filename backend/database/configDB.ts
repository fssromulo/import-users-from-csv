import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function openDb() {
  return await open<sqlite3.Database, sqlite3.Statement>({
    filename: './database/index.db',
    driver: sqlite3.Database,
  });
}
