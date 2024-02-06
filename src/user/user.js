import { displayWelcomeMessage, displayGoodbyeMessage, processCommand } from '../utils/utils.js';

export class User {
  constructor(username) {
    this.username = username;
  }

  async displayWelcomeMessage() {
    await displayWelcomeMessage(this.username);
  }

  async displayGoodbyeMessage() {
    await displayGoodbyeMessage(this.username);
  }

  async processCommand(command) {
    await processCommand(this, command);
  }
}
