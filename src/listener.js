const fs = require("fs");

class Listener {
  constructor(notesService, mailSender) {
    this._notesService = notesService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { userId, targetEmail } = JSON.parse(message.content.toString());

      const notes = await this._notesService.getNotes(userId);
      await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(notes)
      );
      fs.appendFileSync(
        __dirname + "/../src/logs/info.log",
        `${new Date().toLocaleString()} [Listener] Success sending email to ${targetEmail} about notes ${notes}\n`,
      );
    } catch (error) {
      fs.appendFileSync(
        __dirname + "/../src/logs/error.log",
        `${new Date().toLocaleString()} [Listener] Error ${error}\n`,
      );
    }
  }
}

module.exports = Listener;
