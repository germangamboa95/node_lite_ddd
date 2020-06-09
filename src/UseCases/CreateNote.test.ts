import 'reflect-metadata';
import { createConnection, getConnectionOptions, getRepository } from 'typeorm';
import { CreateNote } from './CreateNote';
import { User } from '../Users/models/User';
import { Note } from '../Notes/models/Note';

describe('Note Creation Test Suite', () => {
  let user: User;

  beforeAll(async () => {
    const opts = await getConnectionOptions('test');
    await createConnection({ ...opts, name: 'default' });
    user = new User();
    user.firstName = 'Ben';
    user.lastName = 'Dover';
    user.age = 25;
    await getRepository(User).save(user);
  });

  it('it can store a note happy path', async () => {
    const createNote = new CreateNote(user, getRepository(Note));

    const noteData = {
      title: 'This is a note',
      body: 'Note note note note',
    };

    let note = await createNote.execute(noteData);

    note = await getRepository(Note).findOne({
      where: { id: note.id },
      relations: ['user'],
    });

    expect(note).toMatchObject(noteData);
    expect(note.user).toMatchObject(user);
  });

  it('it can store a note with a different user', async () => {
    const randomUser = new User();
    randomUser.firstName = 'Some User';
    randomUser.lastName = 'User';
    randomUser.age = 99;

    await getRepository(User).save(randomUser);

    const createNote = new CreateNote(user, getRepository(Note));

    const noteData = {
      title: 'This is a note',
      body: 'Note note note note',
    };

    let note = await createNote.execute(noteData, randomUser);

    note = await getRepository(Note).findOne({
      where: { id: note.id },
      relations: ['user'],
    });

    expect(note).toMatchObject(noteData);
    expect(note.user).not.toMatchObject(user);
    expect(note.user).toMatchObject(randomUser);
  });
});
