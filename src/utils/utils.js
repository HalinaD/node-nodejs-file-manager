import { getCurrentWorkingDirectory, changeWorkingDirectory } from '../working-directory/workingDirectory.js';

export async function displayWelcomeMessage(username) {
  const currentWorkingDirectory = await getCurrentWorkingDirectory();
  console.log(`Welcome to the File Manager, ${username}!`);
  console.log(`You are currently in ${currentWorkingDirectory}`);
}

export async function displayGoodbyeMessage(username) {
  const currentWorkingDirectory = await getCurrentWorkingDirectory();
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  console.log(`You are currently in ${currentWorkingDirectory}`);
}

export async function processCommand(user, command) {
  const [operation, targetPath] = command.split(' ');

  switch (operation) {
    case 'cd':
      try {
        const newWorkingDirectory = await changeWorkingDirectory(targetPath);
        console.log(`You are currently in ${newWorkingDirectory}`);
      } catch (error) {
        console.error(error.message);
      }
      break;
    case '.exit':
      await displayGoodbyeMessage(user.username);
      process.exit();
      break;
    default:
      console.error('Operation failed');
      break;
  }
}
