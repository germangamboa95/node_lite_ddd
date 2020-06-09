import 'reflect-metadata';
import { createConnection, getConnectionOptions, getRepository } from 'typeorm';

import { User } from '../Users/models/User';
import { Note } from '../Notes/models/Note';
import { AssignUserNote } from './AssignNoteToUser';
import { id } from 'date-fns/locale';

describe('Assign Note To User Test Suite', () => {
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

  it('it can assigned an orphaned note to a user', async () => {
    const note = new Note();

    note.title = 'I am a lonely note';
    note.body = 'Note with a hot body';

    await getRepository(Note).save(note);

    const noteAssigneer = new AssignUserNote(user, getRepository(User));

    await noteAssigneer.execute(note, true);

    const freshUser = await getRepository(User).findOne({
      where: {
        id: user.id,
      },
      relations: ['notes'],
    });

    expect(freshUser.notes).not.toBe(null);
    expect(freshUser.notes).toHaveLength(1);
  });
});
