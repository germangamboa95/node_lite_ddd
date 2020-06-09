import express from 'express';

const app = express();

app.use(express.json());

// You don't have to forcefully run everything as a usecase
// Somethings are simple and don't require it.
app.get('/notes');
app.get('/notes/:id');

app.post('/notes');
app.put('/notes/id');

app.post('/notes/:id/reminder');

app.listen(8888, () => {
  console.log('App is running!');
});
