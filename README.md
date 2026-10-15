# Student Registration Master Template

Includes HTML5/CSS3/JavaScript, AngularJS and React demo pages, Express server with in-memory CRUD, optional MongoDB/MySQL server examples, XML/DTD/XSLT examples, and manual test cases.

## Quick start
1. Install Node.js.
2. Extract this ZIP and open a terminal in this folder.
3. Run `npm install`
4. Run `npm start`
5. Open http://localhost:3000

Default mode uses in-memory storage; data resets when the server restarts.

## Optional MongoDB
Copy `.env.example` to `.env`, configure `MONGODB_URI`, ensure MongoDB is running, then run `npm run start:mongodb`.

## Optional MySQL
Run `sql/schema.sql` in MySQL, configure `.env`, then run `npm run start:mysql`.

The AngularJS and React demo pages load libraries from CDNs, so they need internet unless libraries are downloaded locally. The CDN React/Babel example is for learning/practical demonstration, not production.
