"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsersTable = void 0;
const configDB_1 = __importDefault(require("../configDB"));
const createUsersTable = async () => {
    const db = await (0, configDB_1.default)();
    await db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        favorite_sport TEXT NOT NULL
      )`);
    db.close();
};
exports.createUsersTable = createUsersTable;
