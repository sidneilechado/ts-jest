export class EmailService {
  async sendEmail(to, subject, message) {
    console.log(`Sending email to ${to} with subject ${subject}`);
    console.log(`Message body: ${message}`);
    // Implementation for sending email
  }
}
