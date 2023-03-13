import { Module } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017')],
  providers: [
    {
      provide: 'MONGO_CLIENT',
      useFactory: async () => {
        const uri = 'mongodb://localhost:27017';
        const client = new MongoClient(uri);
        await client.connect();

        return client;
      },
    },
  ],
  exports: ['MONGO_CLIENT'],
})
export class DatabaseModule {}
