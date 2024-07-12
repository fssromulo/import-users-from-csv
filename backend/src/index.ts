import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import { createUsersTable } from '../database/migrations/create-users-table';
import { insertUser, searchUser } from './controllers/UserController';

const upload = multer({ dest: 'uploads/' });

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.text());

// Create user table in sqlite database
createUsersTable();

app.get('/api/users', async (req, res) => {
  const term = req?.query?.q ?? '';
  const data = await searchUser(term.toString() ?? '');

  if (!data) {
    return res.status(500).json({ message: 'Internal server error' });
  }

  if (data.length <= 0) {
    return res.status(500).json({ message: 'No data found' });
  }

  return res.status(200).json({ data });
});

app.post('/api/files', upload.single('file'), async (req, res) => {
  return await insertUser(req, res);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
