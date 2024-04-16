// src/index.ts
import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 8000;
const apiUrl = new URL('https://api.themoviedb.org/3/search/multi');

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/search', async (req: Request, res: Response) => {
  try {
    apiUrl.searchParams.append('query', req.query.query as string);
    apiUrl.searchParams.append(
      'include_adult',
      req.query.include_adult ? 'true' : 'false'
    );
    apiUrl.searchParams.append(
      'language',
      (req.query.language as string) || 'en-US'
    );
    apiUrl.searchParams.append('page', (req.query.page as string) || '1');

    const response = await fetch(apiUrl.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_READ_KEY}`, // Replace with your access token
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from TMDB API');
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`SerSver is running on port ${port}`);
});
