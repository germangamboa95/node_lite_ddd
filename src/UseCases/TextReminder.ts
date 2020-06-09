import { Repository, LessThanOrEqual } from 'typeorm';
import { User } from '../Users/models/User';
import { Note } from '../Notes/models/Note';
import { Reminder, ReminderStatus } from '../Notes/models/Reminder';
import { addMinutes } from 'date-fns';
import { SMS } from '../Services/SMS';

export class TextReminder {
  protected reminderRepo: Repository<Reminder>;
  protected smsClient: SMS;
  public constructor(reminderRepo: Repository<Reminder>) {
    this.reminderRepo = reminderRepo;
    this.smsClient = new SMS();
  }

  protected calcTime(minutes: number): Date {
    return addMinutes(new Date(), minutes);
  }

  async execute(): Promise<void> {
    const currentTime = new Date();
    const reminders = await this.reminderRepo.find({
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        remind_at: LessThanOrEqual(currentTime),
        status: ReminderStatus.WAITNG,
      },
      relations: ['note'],
    });

    const attemptedReminders = reminders.map(async reminder => {
      const note = reminder.note;
      try {
        await this.smsClient.sendSMS(
          '4077449871',
          `${note.title} \n\n ${note.body}`,
        );
        reminder.status = ReminderStatus.SENT;
        return reminder;
      } catch (error) {
        reminder.status = ReminderStatus.FAILED;
        return reminder;
      }
    });

    this.reminderRepo.save(await Promise.all(attemptedReminders));
  }
}
