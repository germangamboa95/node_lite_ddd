import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';
import express, { Response, Request } from 'express';
import { CreateNote } from './UseCases/CreateNote';
import { getRepository } from 'typeorm';
import { Note, NoteInterface } from './Notes/models/Note';
import { User } from './Users/models/User';
import { SetReminder } from './UseCases/SetReminder';
import { Reminder } from './Notes/models/Reminder';
interface DumbOject {
  [key: string]: object | null | string | number;
}

const app = express();

app.use(express.json());

// Assume we have some auth middleware that pulls the
// User out of a token or something
const someAuthFunc = async (): Promise<User> => {
  return getRepository(User).findOne({
    firstName: 'German',
  });
};

// You don't have to forcefully run everything as a usecase
// Somethings are simple and don't require it.
app.get('/notes', async (req: Request, res: Response<Note[]>) => {
  res.json(await getRepository(Note).find());
});

app.get(
  '/notes/:id',
  async (req: Request<{ id: string }>, res: Response<Note>) => {
    const id = req.params.id;
    res.json(await getRepository(Note).findOne(id));
  },
);

app.post('/notes', async (req: Request, res: Response<Note>) => {
  const possibleNote: NoteInterface = req.body;
  const user = await someAuthFunc(); // Middleware is cool for this in this layer

  // Use an object factory to mitigate having to input all dependencies
  // like this
  const createNote = new CreateNote(user, getRepository(Note));

  const note = await createNote.execute(possibleNote);

  return res.json(note);
});

app.post(
  '/notes/:id/reminder/:time',
  async (req: Request<{ id: string; time: string }>, res: Response) => {
    try {
      const time = req.params.time;

      if (Number.isNaN(+time)) {
        throw new TypeError(`${time} is not a number`);
      }

      const note = await getRepository(Note).findOneOrFail(req.params.id);
      const setReminder = new SetReminder(getRepository(Reminder));

      const reminder = setReminder.execute(+time, note);

      res.json(reminder);
    } catch (error) {
      res.json(error);
    }
  },
);

async function main(): Promise<void> {
  const opts = await getConnectionOptions('default');
  console.log(opts);
  await createConnection(opts);
  app.listen(8888, () => {
    // eslint-disable-next-line no-console
    console.log('App is running!');
  });
}
main();
