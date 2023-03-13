# REST API README
This is a REST API that provides CRUD operations for users, as well as the ability to retrieve user data from an external API, and store and retrieve user avatars in a file system.

# How to run
## API
To run the API, clone the repository, install dependencies, and start the server:

```bash
Copy code
git clone https://github.com/sidneilechado/ts-jest.git
cd ts-jest
npm install
npm run start
This will start the server on http://localhost:3000 or your configure PORT.
```

*Side note* this project has a dependency on mongodb, so you will need to have a installation on your local machine, you can use docker to have that with the following line:
`docker run --name mongodb -d -p 27017:27017 mongo:latest`
## Tests
To run the tests, you will need to have the the steps on item above (at least the npm install part) and then you can run `npm run test` on the CLI.
# Endpoints
## POST /api/users
Creates a new user and sends an email and a RabbitMQ event. The request should have the following payload:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "job": "Developer"
}
```

The API will return a JSON object representing the created user.

## GET /api/user/{userId}

Retrieves user data from an external API and returns it in JSON representation. The API should be called with a valid userId parameter, e.g. /api/user/1.

## GET /api/user/{userId}/avatar

Retrieves the user's avatar image by its URL. If the image has not been saved before, it will be downloaded and stored in the file system. If it has already been saved, it will be retrieved from the file system. The API should be called with a valid userId parameter, e.g. /api/user/1/avatar.

## DELETE /api/user/{userId}/avatar

Removes the user's avatar file from the file system and the MongoDB database. The API should be called with a valid userId parameter, e.g. /api/user/1/avatar.

## Technologies Used

This API was built using:

Node.js
NestJS
MongoDB
Mongoose

## License
This API is licensed under the MIT License.
