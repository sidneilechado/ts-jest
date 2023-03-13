import { EmailService } from './email.service';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  describe('sendEmail', () => {
    it('should log the appropriate message to the console', async () => {
      const consoleSpy = jest.spyOn(console, 'log');

      const to = 'jane@example.com';
      const subject = 'Test email';
      const message = 'This is a test email';

      await emailService.sendEmail(to, subject, message);

      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Sending email to ${to} with subject ${subject}`,
      );
      expect(consoleSpy).toHaveBeenCalledWith(`Message body: ${message}`);

      consoleSpy.mockRestore();
    });
  });
});
