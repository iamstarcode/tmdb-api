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
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.query.query, 'xsxsx'); //////////
    try {
        const apiUrl = new URL('https://api.themoviedb.org/3/search/multi');
        apiUrl.searchParams.append('query', req.query.query);
        apiUrl.searchParams.append('include_adult', req.query.include_adult ? 'true' : 'false');
        apiUrl.searchParams.append('language', req.query.language || 'en-US');
        apiUrl.searchParams.append('page', req.query.page || '1');
        apiUrl.searchParams.append('api_key', process.env.TMDB_API_KEY);
        console.log(apiUrl.toString(), 'dcdcdc,,,');
        const response = yield fetch(apiUrl.toString());
        if (!response.ok) {
            throw new Error('Failed to fetch data from TMDB API');
        }
        const data = yield response.json();
        const fiteredData = data.results.map((item) => {
            return {
                id: item.id,
                type: item.media_type,
                title: !item.title ? item.name : item.title,
                release_date: !item.release_date
                    ? item.first_air_date
                    : item.release_date,
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
app.get('/tv/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const apiUrl = new URL(`https://api.themoviedb.org/3/tv/${id}`);
    apiUrl.searchParams.append('api_key', process.env.TMDB_API_KEY);
    apiUrl.searchParams.append('append_to_response', 'external_ids');
    try {
        const response = yield fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = yield response.json();
        console.log(data);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.get('/tv/:tvId/season/:seasonNumber', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tvId, seasonNumber } = req.params;
        const apiUrl = new URL(`https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}`);
        apiUrl.searchParams.append('api_key', process.env.TMDB_API_KEY);
        const response = yield fetch(apiUrl.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = yield response.json();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.listen(port, () => {
    console.log(`SerSver is running on port ${port}`);
});
