# fiberfinds_webapp
Fiber Finds is a web platform for people to browse and share various fiber art patterns and tutorials. I designed this web application using Node.js, MongoDB, and React for my Project 4 assignment in CIS 435 (Web Technology) at the University of Michigan-Dearborn.

## Run Instructions
### Step 1: Set up environment variables
Open the project in an IDE like VS Code where you can easily create and edit files. Within the backend folder of the project, create a file called .env to store the back-end environment variables.
- Store your MongoDB Atlas cluster connection string in a variable called MONGO_URI. You can find this string by going to your cluster in MongoDB Atlas and clicking Connect. Select "Drivers", turn off "SRV Connection String", and copy the connection string to paste in the MONGO_URI environment variable.
- Create an environment variable called MONGO_DB and assign "fiber_finds_app" to it. While doing this, make sure you create a database called "fiber_finds_app" in your cluster which will store the app's data.
- Create an environment variable called NODE_ENV and assign "development" to it.
- Create an environment variable called PORT and assign 3000 to it (or whatever port number you want the back-end server to run on).
- Create an environment variable called JWT_SECRET. Go to https://jwtsecrets.com/ to generate a random 256-bit security string and assign the string to the environment variable.
- Create an environment variable called CSRF_SECRET. Go to https://jwtsecrets.com/ to generate another random 256-bit security string and assign the string to the environment variable.
Within the frontend folder of the project, create a file called .env to store the front-end environment variables.
- Create an environment variable called VITE_API_URL and assign http://localhost:3000 to it (if you used a different number for PORT in backend's .env file, replace 3000 with that number instead).

### Optional step: Restore database with backup data
This step is only for my project submission (the database backup is not available on the GitHub). Make sure you have MongoDB Database Tools installed and set on your machine's PATH environment variable (follow the steps at this website for help: https://www.mongodb.com/docs/database-tools/installation/?operating-system=windows&package-type=msi&msockid=0dc208bc99586b0f07451b3798cb6acd).
- Open a terminal on your machine.
- Run the following command, replacing "your-mongodb-atlas-cluster-uri" with the connection string you gathered in Step 1 and "/path/to" with the path to the directory where you extracted the submission folder.
After completing this step, your finder_fiber_app database should be populated with the data that my finder_fiber_app database contained as of the backup date.

### Step 2: Open two terminals
The back-end and the front-end run on two different ports, so you need to start them separately.
- In one terminal, open the fiberfinds_webapp directory and then enter the backend folder.
  ```bash
  cd backend
  ```
- In the other terminal, open the fiberfinds_webapp directory again and then enter the frontend folder.
  ```bash
  cd frontend
  ```

### Step 3: Install dependencies
Within both terminals (one inside the backend folder, the other inside the frontend folder), run the following command to dowlnoad all of the Node dependencies for the project:
```bash
npm install
```

### Step 4: Run project
Within both terminals (one inside the backend folder, the other inside the frontend folder), run the following command to start the project:
```bash
npm run dev
```
After running the commands, follow the link provided in the frontend terminal (http://localhost:5173/) to view and use the web application.

## Sources
### Code Help
- Project setup: https://dev.to/ekwoster/building-a-full-stack-web-app-with-nodejs-and-react-a-step-by-step-guide-2me5
- Gitignore file for Node: https://github.com/github/gitignore/blob/main/Node.gitignore
- Different favicon sizes: https://favicon.io/tutorials/favicon-sizes/
- User registration: https://dev.to/buildwithgagan/build-a-login-and-registration-system-using-nodejs-a-step-by-step-guide-1d0p
- Explanation of bcrypt: https://auth0.com/blog/hashing-in-action-understanding-bcrypt/
- JWT secret key generator: https://jwtsecrets.com/#generator
- Authentication middleware: https://www.freecodecamp.org/news/how-to-build-a-secure-authentication-system-with-jwt-and-refresh-tokens/
- Storing JWT token in cookie: https://www.c-sharpcorner.com/article/how-to-store-jwt-token-securely-in-localstorage-vs-cookies/
- String inperpolation: https://stackoverflow.com/questions/35835362/what-does-dollar-sign-and-curly-braces-mean-in-a-string-in-javascript
- Signed Double-Submit Cookie pattern for CSRF token: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#signed-double-submit-cookie-recommended
- Get value from cookie in front-end JavaScript: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
- Intercept requests with axios: https://axios-http.com/docs/interceptors
- MongoDB data types: https://www.mongodb.com/docs/mongodb-shell/reference/data-types/?msockid=0dc208bc99586b0f07451b3798cb6acd
- Default values for data fields: https://www.slingacademy.com/article/mongodb-set-default-value-for-a-field-with-examples/
- Define set list of valid values for field using enum: https://www.geeksforgeeks.org/mongodb/how-to-create-and-use-enum-in-mongoose/
- Foreign key reference: https://stackoverflow.com/questions/26008555/creating-a-foreign-key-relationship-in-mongoose
- Extracting form data from request body: https://www.xjavascript.com/blog/how-to-get-data-passed-from-a-form-in-express-node-js/
- Search for phrase in string value of field: https://thecodebuzz.com/mongodb-get-record-document-that-contain-a-string-matching/
- MongoDB or operator (for find function): https://www.mongodb.com/docs/manual/reference/operator/query/or/?msockid=0dc208bc99586b0f07451b3798cb6acd
- HTTP status code meanings: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
- Adding key-value pair to array: https://www.geeksforgeeks.org/javascript/how-to-add-key-value-pair-to-a-javascript-object/
- Deleting a file: https://www.geeksforgeeks.org/node-js/node-js-fs-unlink-method/
- Restricting file types: https://www.xjavascript.com/blog/multer-file-type-typescript/
- Pagnation (to reduce redering costs): https://www.slingacademy.com/article/implement-pagination-express-js/
- Using express-validator: https://betterstack.com/community/guides/scaling-nodejs/express-validator-nodejs/
- XSS sanitizer library: https://www.npmjs.com/package/express-xss-sanitizer
- Sanitizer for URL: https://github.com/validatorjs/validator.js#sanitizers
- Implementing authentication context for React: https://ktree.com/blog/managing-authentication-state-with-react-context-provider.html
- React icons: https://react-icons.github.io/react-icons/
- Optional chaining operator (?.): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
- Disabled button styling: https://www.tutorialpedia.org/blog/csstricks-button-disabled/
### Images
- Favicon generator: https://favicon.io/favicon-converter/
