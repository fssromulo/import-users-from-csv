import { parse } from 'csv-parse';
import { Request, Response } from 'express';
import fs from 'fs';
import createConnection from '../repository/db';

interface UserData {
  name: string;
  city: string;
  country: string;
  sport: string;
}

export const insertUser = async (req: Request, res: Response) => {
  const db = await createConnection();

  const uploadedFile = req.file as any;
  const filePath = `uploads/${uploadedFile.filename}`;

  try {
    const results = [] as UserData[];
    if (uploadedFile.mimetype !== 'text/csv') {
      // Delete uploaded file after processing
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'You must send "text/csv" file' });
    }

    const fileReadPromise = new Promise<UserData[]>((resolve) => {
      fs.createReadStream(uploadedFile.path)
        .pipe(
          parse({
            delimiter: ',',
            skipEmptyLines: true,
            trim: true,
            fromLine: 2, // Ignore header lines
          }),
        )
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => resolve(results));
    });

    const userDataList = await fileReadPromise;

    const createUser = (param: string[]): Promise<number> => {
      return new Promise(async (resolve) => {
        const insertStmt = await db.insertData(
          'INSERT INTO users (name, city, country, favorite_sport) VALUES (?,?,?,?)',
          [param[0], param[1], param[2], param[3]],
        );
        resolve(insertStmt.lastID as number);
      });
    };

    const createUserPromise = [] as Promise<number>[];
    for (const user of userDataList) {
      createUserPromise.push(createUser(user as unknown as string[]));
    }

    // Execute insert simultaneously to performance enhancement
    Promise.all(createUserPromise).then((values) => {
      console.log('Inserted users...', values);
    });

    return res.status(200).json('The file was uploaded successfully');
  } catch (err) {
    console.error('An error occurred while uploading the file', err);
  } finally {
    // Close database connection after processing
    db.closeConnection();
    // Delete uploaded file after processing
    fs.unlinkSync(filePath);
  }
};

export const searchUser = async (term: string) => {
  const db = await createConnection();
  try {
    let sqlFilter = [];

    let sqlQuery = `SELECT
          u.id,
          u.name,
          u.city,
          u.country,
          u.favorite_sport
        FROM
          users u`;

    if (term.toString().length > 0) {
      sqlQuery += ` WHERE (
          LOWER(u.name) LIKE?
          OR LOWER(u.city) LIKE?
          OR LOWER(u.country) LIKE?
          OR LOWER(u.favorite_sport) LIKE?
        )`;

      sqlFilter = Array(4).fill(`%${term.toString().toLowerCase()}%`);
    }

    return await db.getData(sqlQuery.trim(), sqlFilter);
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    // Close database connection after processing
    db.closeConnection();
  }
};
