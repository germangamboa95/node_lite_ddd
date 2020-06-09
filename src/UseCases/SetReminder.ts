import { Repository } from 'typeorm';
import { User } from '../Users/models/User';
import { Note } from '../Notes/models/Note';
import { Reminder } from '../Notes/models/Reminder';
import { addMinutes } from 'date-fns';

export class SetReminder {
  protected reminderRepo: Repository<Reminder>;

  public constructor(reminderRepo: Repository<Reminder>) {
    this.reminderRepo = reminderRepo;
  }

  protected calcTime(minutes: number): Date {
    return addMinutes(new Date(), minutes);
  }

  async execute(minutes: number, note: Note): Promise<Reminder> {
    const reminder = new Reminder();

    reminder.note = note;

    // eslint-disable-next-line @typescript-eslint/camelcase
    reminder.remind_at = this.calcTime(minutes);

    await this.reminderRepo.save(reminder);

    return reminder;
  }
}
