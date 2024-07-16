"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createConnection;
const configDB_1 = __importDefault(require("../../database/configDB"));
async function createConnection() {
    const db = await (0, configDB_1.default)();
    // Close the database connection
    async function closeConnection() {
        db.close();
    }
    async function getData(query, sqlFilter) {
        return await db.all(query, sqlFilter);
    }
    async function insertData(query, data) {
        return await db.run(query, data);
    }
    return {
        insertData,
        getData,
        closeConnection,
    };
}
