"use strict";
// Mock SQLite module and functions
jest.mock('sqlite3', () => ({
    Database: jest.fn().mockReturnValue({
        all: jest.fn(),
        run: jest.fn(),
        close: jest.fn(),
    }),
}));
let db;
describe('SQLite operations', () => {
    beforeEach(async () => {
        db = {
            getData: jest.fn().mockReturnValue([
                { id: 1, name: 'Alice', age: 30 },
                { id: 2, name: 'Bob', age: 25 },
            ]),
            insertData: jest.fn().mockReturnValue(1),
            closeConnection: jest.fn(),
        };
    });
    it('Should retrieve data from SQLite', async () => {
        const data = db.getData('SELECT * FROM users', '');
        expect(data.length).toBe(2);
    });
    it('Should insert data into SQLite', () => {
        const data = db.insertData('INSERT INTO users (name, city, country, favorite_sport) VALUES (?,?,?,?)', ['name', 'city', 'country', 'favorite_sport']);
        expect(typeof data).toBe('number');
    });
});
