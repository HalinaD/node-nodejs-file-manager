import readline from 'readline';
import { User } from './src/user/user.js';
import { setWorkingDirectory } from './src/working-directory/workingDirectory.js';
import { displayWelcomeMessage, displayGoodbyeMessage, processCommand} from './src/utils/utils.js';

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const args = process.argv.slice(2);
const usernameArgIndex = args.findIndex(arg => arg.startsWith('--username='));
const username = usernameArgIndex !== -1 ? args[usernameArgIndex].split('=')[1] : null;

if (!username) {
  console.error('Invalid input');
  process.exit(1);
}

const user = new User(username);

userInterface.on('close', async () => {
  await displayGoodbyeMessage(username);
  process.exit();
});

await setWorkingDirectory();
await displayWelcomeMessage(username);
startUserInteraction();

function startUserInteraction() {
  userInterface.question('', async (command) => {
    await processCommand(user, command);
    startUserInteraction();
  });
}