import openDb from '../configDB';

export const createUsersTable = async () => {
  const db = await openDb();
  await db.exec(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        favorite_sport TEXT NOT NULL
      )`,
  );
  db.close();
};
