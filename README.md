# API testing

As the information served by an API becomes critical and other software comes to rely on it, developers need confidence that the API works as expected (and doesn't for example fail to respond or respond with missing or incorrect data).

## 💡 OBJECTIVES FOR THE WORKSHOP

Here's a glimpse of what you'll be achieving by the end of this workshop:

- Object 1: How to programmatically send requests to different types of endpoints
- Object 2: How to assert that the response is correct and as expected
- Object 3: How to perform setup and teardown to ensure each test has a fresh context and can't affect another test's outcome.

## 🎟️ TICKETS

You're a software developer working at an e-commerce company and your manager wants you and your team to implement testing for the company's Users API before the next release.

Time to dive into action! 🏊‍♂️ Here's what you'll be working on:

### 🎫 Ticket 1 - Familiarity

You're going to be testing an existing API, so first task for you and your team is to get familiar with the codebase.

If there are certain parts of the code which you're unsure about, try copy-pasting the relevant code snippets into ChatGPT (or a similar tool) and give it an appropriate prompt (e.g. "Explain what this Express.js code is doing"). Typically, you want to be careful about where you expose/paste company code (as you may be leaking company property), but since this a low risk situation, it's alright. Tools like ChatGPT are usually pretty good at explaining code (especially if the prompt explicitly mentions the packages being used and those packages are part of its learning dataset).

Some questions that might help guide your exploration:

- What endpoints and types of requests does this API support?✅
- What's the main purpose of the `db/helpers.js` file?✅
- What's the main purpose of each file in the `users` folder?✅
- Where and how are the files in the `users` folder used within the overall API and Express app?
- What endpoints/operations does the API support?
- What's the purpose of the `vitest.config.js` file?

### 🎫 Ticket 2 - Setup

Familiarising yourself with an existing codebase is an important skill to practise as a developer. Your manager has now tasked you with the following:

- Install the project's existing dependencies (listed in the `package.json`)✅
  - Why: In this case, the application code uses third party packages, which are listed in the `package.json`. As part of running the tests, the application code will also run (since we'll be testing it) and the application code needs these dependencies to be installed first.
- Install Vitest and Supertest both as dev dependencies.✅
  - Why: Vitest and Supertest are third party packages that make it easier to write tests and test HTTP respectively. However, both are only needed during testing and don't need to be included in the final application. Hence, during installation, you can specify that they should be installed as development-only dependencies.✅
  - If you're stuck, try to search online for any "getting started" guidance or examples in their respective documentation on how to install them as dev dependencies.✅
- Set up a PostgreSQL database so that you've got a connection string to connect with. (For simplicity, you can choose to do this using ElephantSQL or similar providers.) Then create a `.env` file at the root of this repository and within it add a line: DATABASE_URL=REPLACE_ME_WITH_YOUR_CONNECTION_STRING✅

  - Why: The API tests you'll write will send real requests to the API. When the API receives those requests, the code within the request handler will try to speak to a database (since this API uses a database for persistence). Hence, you need a database for testing purposes.
  - One of the downsides to using an online database provider for a test database is that their service may break occasionally, which would cause these API tests to fail for the wrong reasons (since the API can't connect to the database during the tests). There are alternative approaches that wouldn't involve connecting to a database server across the internet. These approaches can be more reliable for testing, but would require more setup and tooling. So for now, we're keeping things simpler. (If your database does go down during your tests, create another one or use a different provider.)✅

### 🎫 Ticket 3 - Test skeleton

Your next task is to create a `users.test.js` file within the `users` folder. Then within the `users.test.js` file, write a bare bones test (the test name can be `"GET /api/health works"` and the test callback can be left empty). Whilst this isn't a useful test yet, it's enough to register the test. Then run Vitest to check it detects the test file and the test passes.✅

### 🎫 Ticket 4 - Make a request with Supertest

Whilst exploring the codebase earlier, you may have noticed a `GET /api/health` endpoint in the `app.js` file. Your next task is to learn how to use Supertest to send a GET request to this API endpoint within the test you started in the previous ticket. Your manager's tied up in a meeting for the next couple of hours, so looks like you and your team will have to figure things out on your own.✅

Below is an example you've found online at https://www.npmjs.com/package/supertest:

```js
const request = require("supertest");
const express = require("express");

const app = express();

app.get("/user", function (req, res) {
  res.status(200).json({ name: "john" });
});

describe("GET /users", function () {
  it("responds with json", async function () {
    const response = await request(app).get("/users").set("Accept", "application/json");
    expect(response.headers["Content-Type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.email).toEqual("foo@bar.com");
  });
});
```

You and your team prompt ChatGPT to explain the above snippet to you and learn the following:

- The first couple of lines (with `require`) are simply importing packages -- albeit using a different, older approach (CommonJS). You could rewrite these to use the newer `import` approach (ESM) instead, whilst still having the code do the same thing.
- The next few lines (where the `app` constant is declared and initialised) creates an Express app. The example creates a new Express app only for demonstration purposes and completeness. For your purposes, you don't want to create a brand new Express app in the test. You instead want to import the existing Express app (from `app.js`) that contains all of the API logic and use that instead! But besides that, the rest of the test can use `app` the same as if you'd created a brand new instance.
- The `describe` block is a way to organise and group related tests together, but isn't necessary to use Supertest or test the API. So you could just remove it. The `it` function is the `test` function (just with a different name) and registers a new test.
- The `await request(app).get("/users").set("Accept", "application/json")` can be broken down as follows:
  - `request` is a function provided by Supertest (that the example has chosen to name `request` but it doesn't have to be called that specifically) and here it takes in the Express app and uses it to create and start a server using the Express app. The server will be listening for the requests during the test and will eventually be shut down at the end of the test.
  - `get("/users")` effectively sends a GET request for the listening server on that path (notice that this is conceptually just like sending a GET request with `fetch`). If you wanted to send a different type of request (e.g. POST), you would change `get` for `post`.
  - `.set("Accept", "application/json")` sets a request header that asks for the response to be in JSON if possible. This isn't specifically something you need to do (as the API you're testing only responds with JSON anyway), so you can leave this bit out.
  - The result of `await`ing that expression is a response object (containing many values)
- The lines with `expect` perform assertions/checks (but you'll come back to this later, as this ticket only needs you to make the request for now).

Equipped with this knowledge, your team makes the following plan. You may still need to break it down more:

```js
// Goal: make a GET request with Supertest to the /api/health
//
// import the Express app from app.js (because it needs to be tested)
// import the function from Supertest (maybe call it `request` like the documentation did)
// within the existing test, follow the example from the documentation and:
//    call `request` and pass in the Express app as an argument
//    send a GET request to the /api/health endpoint
//    await the overall expression and assign it to a `response` constant
//    console.log `response.body` for now to at least see a result
```

Once you and your team are ready, write the test code based on the plan. Once you've written the test, run Vitest to run the test and check whether the test passes and you see a response body displayed in the terminal.

At this point you should have a single test (which isn't useful yet as no assertions have been added) and it should be passing.

### 🎫 Ticket 5 - Making assertions

Well done on making a request with Supertest, your manager is thrilled with the progress you're making! Tests typically are incomplete until assertions are added. Your next task is to add assertions to the existing test, so that you can check whether certain aspects of the API response are as expected. Before you make assertions in the test, it's useful to first think about what things does the test actually need to check.

It's useful to start with a few:

- Is the response body as expected?
  - Why: This is important because the response body typically contains the data/resource that was requested. Imagine if something sends a valid request to this API to get some crucial data, but the data in the response is missing or malformed (because nobody's checked if the endpoint actually responds with the correct data). It would break the caller's application and degrade the API quality/experience, which isn't what you want.
- Is the response status code as expected?
  - Why: This is important as the status code indicates to the client whether the request was successful or not and client code will often make decisions based on it.
- Is there an appropriate Content-Type response header present?
  - Why: This is important because the Content-Type header lets the client know what format the response body is. In this case, there should be a Content-Type header that lets the client know the response body is JSON. If this particular header was missing, the client wouldn't know how to interpret the body (is it HTML? is it JSON? is it an MP3 file?)

Your task is to add the following assertions to the test:

- Assert that the response body is an object with the structure below:
  - `{ success: true, payload: "API is running correctly" }`
  - Why: This is what the response body should always be for the `GET /api/health` endpoint
  - Vitest offers matchers that allow you check if an object has a particular structure. Have a look at the documentation and examples.
- Assert that the response status code is 200
  - Why: HTTP status code 200 indicates the request was successful and this is what the response status code should always be for the `GET /api/health` endpoint
- Assert that the Content-Type response header contains `application/json`.
  - Why: The `GET /api/health` endpoint should always respond with JSON and also let the client know that the response body contains JSON.

If you're stuck on how to make assertions, remember that `expect` is a function provided by Vitest that lets you create assertions. To see examples of how to use it, look at the documentation for `expect`.

Once you're done, re-run the test and check that it still passes. You can try checking if the test fails by temporarily breaking implementation for that endpoint in `app.js` (once you're done, change the implementation back so that the test passes).

### 🎫 Ticket 6 - GET /api/users

Well done! You've now tested the `GET /api/health` endpoint.

Your next task is to test the `GET /api/users` endpoint. This is a very important endpoint as it's the main way to get a list of users, so testing it is critical.

The ticket provides you with the following table, representing how this endpoint is meant to work.

| Endpoint             | GET /api/users                                                             |
| -------------------- | -------------------------------------------------------------------------- |
| Response body        | `{ success: true, payload: an array of { id: number, username: string } }` |
| Response status code | Should be 200                                                              |
| Response headers     | `Content-Type` should be `application/json`                                |

Unlike the previous test, this endpoint returns data from the database. Before performing any actions or assertions, it's normally a good idea to ensure the database is reset to an expected state with any tables and data required for the test (depending on the scenario you're testing). The `resetUsersTable` function in `db/helpers.js` already does this for you, so import and use it in the test. Take some time to get familiar with what it takes in, how it works, and what it gives back. You can find an example of it being used in `db/scripts/reset-table.js`. The `resetUsersTable` function allows you to control what data the `users` table contains for each test.

You and your team have started to break this information down into the following plan, but you may need to break it down further:

```js
// write a test skeleton with a descriptive test name ("GET /api/users" could be a starting point)
// run tests to make sure the skeleton passes on its own
// then within the test:
//    ARRANGE:
//      use the `resetUsersTable` function to reset the database table to a known state
//    ACT:
//      use Supertest to send a GET request to the `/api/users` endpoint
//      wait for the response
//    ASSERT:
//      assert that the response body is an object
//      assert that response body.success is true
//      assert that response body.payload is an array
//      loop over the payload array. for each user object in the payload array:
//          assert that user object.id is a number
//          assert that user object.username is a string
//      assert that the response status code is 200
//      assert that there's a Content-Type response header which contains `application/json`
//      any other assertions that you think would be useful
// run tests to ensure they passes
// temporarily break the implementation in `users/users.controller.js` to ensure test fails and then change back so that tests pass
```

You've heard from another team that Vitest provides multiple ways to assert that something's type is an array/number/string. Your manager suggests looking at the documentation and for up-to-date examples online.

### 🎫 Ticket 7 - GET /api/users?username=

Amazing, your next task is to test the `GET /api/users` endpoint again but this time with a `username` parameter. This is a very important endpoint as it's the main way to search case-insensitively for usernames matching some text, so testing it is critical.

This ticket contains the following table, representing how this endpoint is meant to work for the given path and query string.

| Endpoint             | GET /api/users?username=lauren                                         |
| -------------------- | ---------------------------------------------------------------------- |
| Response body        | `{ success: true, payload: [{ id: any number, username: "lauren" }] }` |
| Response status code | Should be 200                                                          |
| Response headers     | `Content-Type` should be `application/json`                            |

The reason `payload` is an array is that there may be zero or more users matching the `username` provided in the query string. In this case, the database contains the seed data (from when you ran the `db-reset` script earlier) and contains only one match for `lauren`.

The ticket mentions that Supertest's documentation shows a way to set query parameters in the request, although in this case you could just add the query string directly in the path if you prefer.

Like earlier, use the `resetUsersTable` function to reset the database as part of the "arrange" step.

You and your team should break down these requirements into a plan and then write a test based on the plan.

### 🎫 Ticket 8 - GET /api/users/:id

Great work! Your next task is to test the `GET /api/users/:id` endpoint. This is a very important endpoint as it's currently the main way to get a particular user by ID, so testing it is critical. The ticket provides you with the following table, representing how this endpoint is meant to work.

| Endpoint             | GET /api/users/1                                           |
| -------------------- | ---------------------------------------------------------- |
| Response body        | `{ success: true, payload: { id: 1, username: "James" } }` |
| Response status code | Should be 200                                              |
| Response headers     | `Content-Type` should be `application/json`                |

The reason `payload` is a single object (and not an array of objects) is that if the id provided in the request path is valid and exists, then it can only match one user at most (since ids are unique). In this case, the database contains the seed data (from when you ran the `db-reset` script earlier) and the user with an `id` of 1 should be James.

Like earlier, use the `resetUsersTable` function to reset the database as part of the "arrange" step.

You and your team should break down these requirements into a plan and then write a test using your plan.

### 🎫 Ticket 9 - POST /api/users

Your next task is to test the `POST /api/users/` endpoint. This is a very important endpoint as it's currently the only way to create a new user, so testing it is critical. The ticket provides you with the following table, representing how this endpoint is meant to work.

| Endpoint             | POST /api/users                                                     |
| -------------------- | ------------------------------------------------------------------- |
| Request body         | `{ "username": "Trinity" }`                                         |
| Request header       | `{ "Content-Type": "application/json" }`                            |
| Response body        | `{ success: true, payload: { id: a number, username: "Trinity" } }` |
| Response status code | Should be 201                                                       |
| Response headers     | `Content-Type` should be `application/json`                         |

Both the request body and request header are things you need to include in the request you make with Supertest, as the endpoint expects them. Look at the Supertest documentation and find examples on how to set request headers and a request body.

The 201 status code indicates that something was created successfully. The reason `payload` is a single object (and not an array of objects) is that this endpoint only creates a single user in the database and then returns the newly created user (including the `id` that the database generated).

The ticket also mentions in the test, once you've sent a POST request to this endpoint, you should get back a response that contains the id of the newly created user. So to check that the user has actually been saved in the database (and not just returned), you could follow up with a GET request to `/api/users/REPLACE_WITH_ID_OF_CREATED_USER` and assert that the API still returns the newly created user.

Like earlier, use the `resetUsersTable` function to reset the database as part of the "arrange" step.

You and your team should break down these requirements into a plan and then write a test using your plan.

### 🎫 Ticket 10 - DELETE /api/users/:id

Amazing, your next task is to test the `DELETE /api/users/` endpoint. This is a very important endpoint as it's currently the only way to delete an existing user, so testing it is critical. The ticket provides you with the following table, representing how this endpoint is meant to work.

| Endpoint             | DELETE /api/users/2                                       |
| -------------------- | --------------------------------------------------------- |
| Response body        | `{ success: true, payload: { id: 2, username: "Mary" } }` |
| Response status code | Should be 200                                             |
| Response headers     | `Content-Type` should be `application/json`               |

The reason that `payload` is a single object (and not an array of objects) is that this endpoint only deletes a single user from the database and then returns the now deleted user.

The ticket also mentions that, in the test, once you've sent a DELETE request to this endpoint, you can follow up with a request to `/api/users/2` and assert that the API responds with a 404 status code (404 indicates that the user wasn't found). This adds confidence that the user really has been deleted.

Like earlier, use the `resetUsersTable` function to reset the database as part of the "arrange" step.

You and your team should break down these requirements into a plan and then write a test using your plan.

### 🎫 Ticket 11 - GET /api/users/:id

Great work, the tests you've written are already helping build coverage. It's also useful to cover other scenarios (like failures or things going wrong) to ensure the API still responds as expected.

Your next task is to test the `GET /api/users/:id` endpoint again, but this time with an id that doesn't exist. This is useful to test before the API is released because the team wants to make sure the API doesn't break or crash when a non-existent ID is supplied and instead provides a helpful, correct response.

The ticket provides you with the following table, representing how this endpoint is meant to work.

| Endpoint             | GET /api/users/1000                                        |
| -------------------- | ---------------------------------------------------------- |
| Response body        | `{ success: false, reason: 'No user with id 1000 found' }` |
| Response status code | Should be 404                                              |
| Response headers     | `Content-Type` should be `application/json`                |

Like earlier, use the `resetUsersTable` function to reset the database as part of the "arrange" step.

You and your team should break down these requirements into a plan and then write a test using your plan.

### 🎫 Ticket 12 - DELETE /api/users/query

Your next task is to test the `DELETE /api/users/:id` endpoint again, but this time with an id that doesn't exist. This is useful to test before the API is released because the team wants to make sure the API doesn't break or crash when a non-existent ID is supplied and instead provides a helpful, correct response.

The ticket provides you with the following table, representing how this endpoint is meant to work.

| Endpoint             | DELETE /api/users/5555                                     |
| -------------------- | ---------------------------------------------------------- |
| Response body        | `{ success: false, reason: 'No user with id 5555 found' }` |
| Response status code | Should be 404                                              |
| Response headers     | `Content-Type` should be `application/json`                |

Like earlier, use the `resetUsersTable` function to reset the database as part of the "arrange" step.

You and your team should break down these requirements into a plan and then write a test using your plan.

### 🎫 Ticket 13 - 404 handler

Your next task is to write a test to ensure the API doesn't break or crash when a request is sent to a non-existent endpoint and instead provides a helpful, correct response.

The ticket provides you with the following table:

| Endpoint             | GET /non-existent-path                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Response body        | `{ success: false, reason: 'No resource found at /non-existent-path, please re-check the path and try again.' }` |
| Response status code | Should be 404                                                                                                    |
| Response headers     | `Content-Type` should be `application/json`                                                                      |

You and your team should break down these requirements into a plan and then write a test using your plan.

### 🎫 Ticket 14 - Teardown

Now that you and your team have covered the fundamentals of API testing, there are some improvements that might be possible. Look at the documentation for `afterAll` from Vitest ([details](https://vitest.dev/api/#afterall)). Then use the `dropUsersTable` function from `db/helpers.js` and the exported `pool` from `db/index.js` to close the connection to the database down after all of the tests have finished running.

- Why: Whilst not always necessary, it's a good idea to explicitly clean up anything that was set up for the tests. In this case, the connection to the database (which this API used) is only needed during the tests and closing it after the tests have run should allow for everything to exit cleanly and predictably.
- If you're stuck on how to use the `pool` to close the connection, have a look at which methods exist on the `pool` instance. Find the documentation for the NPM package that `pool` comes from and have a look at the methods it provides.

### 🎫 Ticket 15 - Better isolation

Right now, all the tests interact with the same database table. This shared state means the tests are not completely independent - one test can affect the data seen by another test.

This hasn't been an issue so far since the tests run one-by-one and reset the database before each test.

But in the future, as more tests are added, you may want to run tests faster by running them in parallel. With the shared database, running tests in parallel could lead to unpredictable failures based on timing and which test finishes first.

For example, if test A deletes a record, and then test B tries to read that same record before resetting the database, test B could fail not because of a code issue, but because of test A's actions.

To prevent these kind of intermittent failures, we likely need to isolate each test's database interactions. One way is to give each test suite its own separate database or schema.

This would require more setup/teardown code in each test to create/reset its own schema. But it would eliminate shared state and ensure tests can run independently without impacting each other.

This approach needs the database credentials to have permissions to programmatically create/manage schemas. But it could be a robust way to isolate tests as we scale up.

With this approach, a rough plan for a test could look something like:

```js
// ARRANGE:
//    🆕 Set up a new database with a new unique name
//    🆕 Run the `resetUsersTable` against the newly created database
//    🆕 Have the API use the newly created database
// ACT:
//    Send a request to whichever API endpoint you're testing
// ASSERT:
//    Assert that the response is as you expect (body, status code, headers, etc.)
// TEARDOWN:
//    🆕 Delete the database
```

For this ticket, you and your team have been tasked with researching how each test could be better isolated, so that in the future tests can be run in parallel reliably without interfering with one another.

If you need to make any changes to the existing codebase, you should make them on a separate git branch.
