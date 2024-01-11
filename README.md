# [Todo List website](https://52.207.238.161:3000/)

----

This is my first real website. this site is a todo list app 
it uses some of the most popular frameworks such as express, mongoose, passport,ejs and more    

----
#### diagram of the main components 
![architecture diagram](/readme_resources/architecture%20diagram.png)

----

#### frameworks and middleware

* ejs
* Express.js
* mongoose
* passport
* express-session
* morgan
* bcryptjs
* helmet

----

#### what and How I used.

###### Express:
solid understanding of express router, middleware and M.V.C

###### Ejs:
used to create the pages and render item's conditionally

###### Mongoose:
used to create/validate schema's and connect to the database

###### Bcrypts:
used to hash and salt users passwords

###### Helmet:
used to secure the server

###### Morgan;
used to log all servers request and responses

###### Passportjs:
used to handel authentication and Google/GitHub login oauth flow

###### express-session:
used to manage secure and store session data allong with connect-mongo

-----

## .env
* DB_URL
* DB_URL_O
* SESSION_SECRET
* GITHUB_CLIENT_ID
* GITHUB_CLIENT_SECRET
* SALT_ROUNDS
* PORT