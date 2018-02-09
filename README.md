# Expense Tracker
A MEAN stack single page application to manage your expenses and track your spendings by generating reports and analysing the spendings


### Summary
- A single-page application using Node.js, Express, AngularJS, and MongoDB
- RESTful API with JSON Web Token (JWT) based authentication and authorization
- This web application is built using Mongoose - MongoDB mapper for Node.js.
- Implements JSON API that serves the information about the user and his/her expenses

### Features

- Multiple user accounts must be supported.
- Two types of users: regular users and admins
- A regular user: Can log in and log out, Can generate reports of their spending over time (described in more detail in a later requirement), Can create, read, update, and delete (CRUD) expenses they own, and Can not CRUD expenses they do not own
- An admin: In addition to regular users, can read all the saved expenses, including those which they do not own, but can not create, update, or delete expenses they do not own
- The back-end provides an interface which is agnostic to any particular front-end client implementation
- The front-end is a single-page application which does not refresh the browser after initial load

### Tools, Technologies and Services used
- Node.js
- Express Framework
- MongoDB with Mongoose
- Angular 5 with TypeScript
- HTML5 / CSS3
- Bootstrap
- Google Material Design
- Git / github.com
- Python for random data generation
- Heroku
- Visual Studio Code

### Lessons learned
- RESTful API implementation
- Angular 5 client interaction with server
- How web frameworks assist in developing a manageable codebase
- How frameworks can decrease the time required developing an application and provide a number of utilities