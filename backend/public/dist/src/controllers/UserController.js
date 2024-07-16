"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUser = exports.insertUser = void 0;
const csv_parse_1 = require("csv-parse");
const fs_1 = __importDefault(require("fs"));
const db_1 = __importDefault(require("../repository/db"));
const insertUser = async (req, res) => {
    const db = await (0, db_1.default)();
    const uploadedFile = req.file;
    const filePath = `uploads/${uploadedFile.filename}`;
    try {
        const results = [];
        if (uploadedFile.mimetype !== 'text/csv') {
            // Delete uploaded file after processing
            fs_1.default.unlinkSync(filePath);
            return res.status(400).json({ message: 'You must send "text/csv" file' });
        }
        const fileReadPromise = new Promise((resolve) => {
            fs_1.default.createReadStream(uploadedFile.path)
                .pipe((0, csv_parse_1.parse)({
                delimiter: ',',
                skipEmptyLines: true,
                trim: true,
                fromLine: 2, // Ignore header lines
            }))
                .on('data', (data) => {
                results.push(data);
            })
                .on('end', () => resolve(results));
        });
        const userDataList = await fileReadPromise;
        const createUser = (param) => {
            return new Promise(async (resolve) => {
                const insertStmt = await db.insertData('INSERT INTO users (name, city, country, favorite_sport) VALUES (?,?,?,?)', [param[0], param[1], param[2], param[3]]);
                resolve(insertStmt.lastID);
            });
        };
        const createUserPromise = [];
        for (const user of userDataList) {
            createUserPromise.push(createUser(user));
        }
        // Execute insert simultaneously to performance enhancement
        Promise.all(createUserPromise).then((values) => {
            console.log('Inserted users...', values);
        });
        return res.status(200).json('The file was uploaded successfully');
    }
    catch (err) {
        console.error('An error occurred while uploading the file', err);
    }
    finally {
        // Close database connection after processing
        db.closeConnection();
        // Delete uploaded file after processing
        fs_1.default.unlinkSync(filePath);
    }
};
exports.insertUser = insertUser;
const searchUser = async (term) => {
    const db = await (0, db_1.default)();
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
    }
    catch (err) {
        console.error(err);
        return null;
    }
    finally {
        // Close database connection after processing
        db.closeConnection();
    }
};
exports.searchUser = searchUser;
