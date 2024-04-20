// src/index.ts
import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/search', async (req: Request, res: Response) => {
  try {
    const apiUrl = new URL('https://api.themoviedb.org/3/search/multi');
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
    apiUrl.searchParams.append('api_key', process.env.TMDB_API_KEY!);

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error('Failed to fetch data from TMDB API');
    }

    const data = await response.json();

    const fiteredData = data.results.map((item: any) => {
      return {
        id: item.id,
        type: item.media_type !== 'tv' ? 'movie' : 'tv',
        title: !item.title ? item.name : item.title,
        release_date: !item.release_date
          ? item.first_air_date
          : item.release_date,
      };
    });

    res.json({ data: fiteredData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/tv/:id', async (req, res) => {
  const { id } = req.params;
  const apiUrl = new URL(`https://api.themoviedb.org/3/tv/${id}`);
  apiUrl.searchParams.append('api_key', process.env.TMDB_API_KEY!);
  apiUrl.searchParams.append('append_to_response', 'external_ids');

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/tv/:tvId/season/:seasonNumber', async (req, res) => {
  try {
    const { tvId, seasonNumber } = req.params;
    const apiUrl = new URL(
      `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}`
    );
    apiUrl.searchParams.append('api_key', process.env.TMDB_API_KEY!);
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`SerSver is running on port ${port}`);
});
