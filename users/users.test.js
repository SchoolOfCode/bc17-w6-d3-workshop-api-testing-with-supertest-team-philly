// Your next task is to create a users.test.js file within the users folder. Then within 
// the users.test.js file, write a bare bones test (the test name can be "GET /api/health works" 
//     and the test callback can be left empty). Whilst this 
// isn't a useful test yet, it's enough to register the test. Then run Vitest to check it detects the test file and the test passes.

import { test, expect} from "vitest";
import request from "supertest";

import app from "../app.js";


test("GET /api/health works", async () => {
// arrange
const response = await request(app).get('/api/health');


// assert
    expect(respose.body).toEqual({
        success: true,
        payload: "API is running correctly"
    });
    expect(response.status).toEqual(200);
});