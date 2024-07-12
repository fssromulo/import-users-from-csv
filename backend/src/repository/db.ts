import openDb from '../../database/configDB';

export default async function createConnection() {
  const db = await openDb();

  // Close the database connection
  async function closeConnection() {
    db.close();
  }

  async function getData(query: string, sqlFilter: string[]) {
    return await db.all(query, sqlFilter);
  }

  async function insertData(query: string, data: string[]) {
   return await db.run(query, data);
  }

  return {
    insertData,
    getData,
    closeConnection,
  };
}
