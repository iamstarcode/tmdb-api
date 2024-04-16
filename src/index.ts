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
  //console.log(req.query.query, 'xsxsx'); //////////
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

    console.log(apiUrl.toString(), 'dcdcdc,,,');
    const response = await fetch(apiUrl.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`, // Replace with your access token
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from TMDB API');
    }

    const data = await response.json();

    const fiteredData = data.results.map((item: any) => {
      return {
        id: item.id,
        type: item.media_type,
        title: !item.title ? item.name : item.title,
        release_date: item.release_date,
      };
    });

    console.log(data);
    res.json({ data: fiteredData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`SerSver is running on port ${port}`);
});
