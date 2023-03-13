import { Controller, Get, Param, Delete, Post, Body } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RabbitMQService } from 'src/rabbitmq/rabbit.service';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/user/user.model';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly rabbitService: RabbitMQService,
  ) {}

  @Post()
  async createUser(@Body() user: User) {
    const createdUser = await this.userService.createUser(user);
    // Send rabbit event
    await this.rabbitService.publishEvent(
      'user_created',
      `User ${createdUser.name} has been created`,
    );
    // Send email
    await this.emailService.sendEmail(
      createdUser.email,
      'Welcome!',
      'Welcome to our website!',
    );

    return createdUser;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get(':id/avatar')
  async getUserAvatar(@Param('id') id: string): Promise<string> {
    const base64EncodedImage = await this.userService.getAvatar(id);
    return base64EncodedImage;
  }

  @Delete(':id/avatar')
  async deleteUserAvatar(@Param('id') id: string): Promise<boolean> {
    return this.userService.deleteUserAvatar(id);
  }
}
