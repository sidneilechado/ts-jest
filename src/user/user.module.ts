import { Module } from '@nestjs/common';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { RabbitMQService } from 'src/rabbitmq/rabbit.service';
import { EmailService } from 'src/email/email.service';
import { DatabaseModule } from '../database/database.module';
import { UserSchema } from 'src/user/user.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, RabbitMQService, EmailService],
})
export class UserModule {}
