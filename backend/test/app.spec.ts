// app.test.ts

import request from 'supertest';
import app from '../src/index';
// import fs from 'fs';

// Mocking the file system module
// jest.mock('fs');
// jest.mock('sqlite3', () => ({
//   Database: jest.fn().mockReturnValue({
//     all: jest.fn(),
//     run: jest.fn(),
//     close: jest.fn(),
//   }),
// }));

describe('GET /api/users', () => {
  it('responds with json', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ data: expect.any(Array) });
  });
});

// describe('POST /api/files', () => {
//   it('adds data to CSV file', async () => {
//     const postData = {
//       name: 'Alice',
//       country: 'abc',
//       city: 'def',
//       favorite_sport: 'xxx',
//     };
//     const csvData = `${postData.name},${postData.country},${postData.city},${postData.favorite_sport},\n`;

//     // Mocking fs.appendFileSync to simulate writing to CSV file
//     (fs.appendFileSync as jest.Mock).mockImplementationOnce(
//       (filePath: string, data: string) => {
//         expect(filePath).toBe('data.csv');
//         expect(data).toBe(csvData);
//       },
//     );

//     const response = await request(app)
//       .post('/api/add-data')
//       .send(postData)
//       .set('Accept', 'application/json');

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({ message: 'Data added to CSV file' });
//   });
// });
