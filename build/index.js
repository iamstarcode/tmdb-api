var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/index.ts
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 8000;
const apiUrl = new URL('https://api.themoviedb.org/3/search/multi');
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.query.query, 'xsxsx'); //////////
    try {
        apiUrl.searchParams.append('query', req.query.query);
        apiUrl.searchParams.append('include_adult', req.query.include_adult ? 'true' : 'false');
        apiUrl.searchParams.append('language', req.query.language || 'en-US');
        apiUrl.searchParams.append('page', req.query.page || '1');
        console.log(apiUrl.toString(), 'dcdcdc,,,');
        const response = yield fetch(apiUrl.toString(), {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`, // Replace with your access token
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data from TMDB API');
        }
        const data = yield response.json();
        const fiteredData = data.results.map((item) => {
            return {
                id: item.id,
                type: item.media_type,
                title: !item.title ? item.name : item.title,
                release_date: item.release_date,
            };
        });
        console.log(data);
        res.json({ data: fiteredData });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.listen(port, () => {
    console.log(`SerSver is running on port ${port}`);
});
