import { RabbitMQService } from './rabbit.service';

describe('RabbitMQService', () => {
  let rabbitMQService: RabbitMQService;

  beforeEach(() => {
    rabbitMQService = new RabbitMQService();
  });

  describe('publishEvent', () => {
    it('should log the message and queue name', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const queue = 'test-queue';
      const message = 'test-message';
      await rabbitMQService.publishEvent(queue, message);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Sending message ${message} to queue ${queue}`,
      );
    });
  });
});
