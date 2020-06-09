import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './Users/models/User';
import { Note } from './Notes/models/Note';
import { Reminder, ReminderStatus } from './Notes/models/Reminder';

createConnection()
  .then(async connection => {
    const userRepo = connection.getRepository(User);
    const noteRepo = connection.getRepository(Note);
    const reminderRepo = connection.getRepository(Reminder);

    const reminder = new Reminder();

    reminder.status = 'not valid';
    reminder.status = ReminderStatus.WAITNG;

    // let sampleNote = new Note();
    // sampleNote.title = 'This is the title to the sample note';
    // sampleNote.body = 'This is a sample note!';

    // await noteRepo.save(sampleNote);

    // const user = new User();

    // user.firstName = 'German';
    // user.lastName = 'Gamboa';
    // user.age = 25;
    // user.notes = [sampleNote];

    // await userRepo.save(user);

    const user = await userRepo.findOne({
      where: {
        firstName: 'German',
      },
      relations: ['notes'],
    });
  })
  .catch(error => console.log(error));
