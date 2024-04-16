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
  console.log(req.query.query, process.env.TMDB_API_READ_ACCESS_TOKEN);
  try {
    // Construct the URL with query parameters
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

    // Make a GET request to the TMDB API using fetch and include authorization header
    const response = await fetch(apiUrl.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_READ_KEY}`, // Replace with your access token
      },
    });

    // Check if the response was successful
    if (!response.ok) {
      throw new Error('Failed to fetch data from TMDB API');
    }

    // Parse the response JSON
    const data = await response.json();

    // Return the response data from the TMDB API
    res.json(data);
  } catch (error) {
    console.log(error);
    // If there's an error, return an error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`SerSver is running on port ${port}`);
});
