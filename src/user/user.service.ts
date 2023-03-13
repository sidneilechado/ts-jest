import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import { createReadStream, createWriteStream, unlink } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { createHash } from 'crypto';
import { GridFSBucket } from 'mongodb';
import axios from 'axios';
import { pipeline as Pipeline } from 'stream';
import { MongoClient } from 'mongodb';

const pipeline = promisify(Pipeline);

@Injectable()
export class UserService {
  private gridFSBucket: GridFSBucket;
  private readonly baseUrl = 'https://reqres.in/api/users';

  constructor(
    @Inject('MONGO_CLIENT') private readonly client: MongoClient,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.gridFSBucket = new GridFSBucket(this.client.db(), {
      bucketName: 'userAvatars',
    });
  }

  async createUser(user: User): Promise<any> {
    try {
      const { data } = await axios.post(this.baseUrl, { user });
      const responseUser = data.user;
      console.log(Object.assign(data, { email: user.email }));
      return this.userModel.create(
        Object.assign(responseUser, { email: user.email }),
      );
    } catch (err) {
      return err;
    }
  }

  async getUserById(id: string) {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getUserAvatarById(id: string) {
    const {
      data: {
        data: { avatar },
      },
    } = await axios.get(`${this.baseUrl}/${id}`);
    return avatar;
  }

  async getAvatar(id: string): Promise<string> {
    const hash = createHash('md5').update(id).digest('hex');
    const existingFile = await this.gridFSBucket
      .find({ filename: hash })
      .toArray();

    if (existingFile.length) {
      // If the file already exists, retrieve it from MongoDB and return its base64-encoded representation
      const stream = this.gridFSBucket.openDownloadStreamByName(hash);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      return buffer.toString('base64');
    } else {
      // If the file doesn't exist, download it from the reqres.in API using axios and save it to MongoDB as a plain file
      const url = `https://reqres.in/img/faces/${id}-image.jpg`;
      const response = await axios.get(url, { responseType: 'stream' });
      const hashStream = createWriteStream(
        join(__dirname, `../../public/${hash}`),
      );
      await pipeline(response.data, hashStream);

      // Save the file to MongoDB and return its base64-encoded representation
      const fileStream = createReadStream(
        join(__dirname, `../../public/${hash}`),
      );
      const uploadStream = this.gridFSBucket.openUploadStream(hash);
      await pipeline(fileStream, uploadStream);
      const stream = this.gridFSBucket.openDownloadStreamByName(hash);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      return buffer.toString('base64');
    }
  }

  async deleteUserAvatar(id: string): Promise<boolean> {
    const hash = createHash('md5').update(id).digest('hex');
    const existingFile = await this.gridFSBucket
      .find({ filename: hash })
      .toArray();

    if (existingFile.length) {
      await this.gridFSBucket.delete(existingFile[0]._id);
      const pathToFile = join(__dirname, `../../public/${hash}`);
      unlink(pathToFile, (err) => {
        if (err) {
          console.error(err);
        }
      });
      return true;
    } else {
      return false;
    }
  }
}
