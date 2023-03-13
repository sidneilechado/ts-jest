import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import axios from 'axios';
import { DatabaseModule } from '../database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './user.model';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      ],
      providers: [UserService],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userModel = moduleRef.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockResponse = { data: { id: 1, name: 'John' } };
      jest.spyOn(axios, 'get').mockResolvedValueOnce(mockResponse);

      const user = await userService.getUserById('1');

      expect(user).toEqual(mockResponse.data);
    });

    it('should throw an error if request to API fails', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Error'));

      await expect(userService.getUserById('1')).rejects.toThrowError('Error');
    });
  });
});
