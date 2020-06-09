import { Repository } from 'typeorm';
import { User, UserInterface } from '../Users/models/User';
import { Note } from '../Notes/models/Note';
import { fi } from 'date-fns/locale';

export class AssignUserNote {
  protected user: User;
  protected userRepo: Repository<User>;

  public constructor(user: User, userRepo: Repository<User>) {
    this.user = user;

    this.userRepo = userRepo;
  }

  async changeUser(user: User): Promise<void> {
    this.user = user;
  }

  async execute(note: Note, save = false): Promise<Note> {
    note.user = this.user;

    if (save) {
      this.user.notes = [note];
      await this.userRepo.save(this.user);
      return note;
    }

    return note;
  }
}
