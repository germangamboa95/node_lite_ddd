import { getRepository, Repository } from 'typeorm';
import { User, UserInterface } from '../Users/models/User';
import { Note, NoteInterface } from '../Notes/models/Note';
import { AssignUserNote } from './AssignNoteToUser';

interface DumbOject {
  [key: string]: object | null | string | number;
}

export class CreateNote {
  protected user: User;
  protected noteRepo: Repository<Note>;
  protected assignUserNote: AssignUserNote;

  public constructor(user: User, noteRepo: Repository<Note>) {
    this.user = user;
    this.noteRepo = noteRepo;
    this.assignUserNote = new AssignUserNote(user, getRepository(User));
  }

  async execute(noteData: NoteInterface, userData?: User): Promise<Note> {
    let note = new Note();

    note.title = noteData.title || 'Missing Title';

    note.body = noteData.body || 'Missing Body';

    if (userData !== undefined) {
      this.assignUserNote.changeUser(userData);
    }

    note = await this.assignUserNote.execute(note);

    await this.noteRepo.save(note);

    return note;
  }
}
