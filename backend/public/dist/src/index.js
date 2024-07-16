"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const create_users_table_1 = require("../database/migrations/create-users-table");
const UserController_1 = require("./controllers/UserController");
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.text());
// Create user table in sqlite database
(0, create_users_table_1.createUsersTable)();
app.get('/api/users', async (req, res) => {
    const term = req?.query?.q ?? '';
    const data = await (0, UserController_1.searchUser)(term.toString() ?? '');
    if (!data) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (data.length <= 0) {
        return res.status(500).json({ message: 'No data found' });
    }
    return res.status(200).json({ data });
});
app.post('/api/files', upload.single('file'), async (req, res) => {
    return await (0, UserController_1.insertUser)(req, res);
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
exports.default = app;
