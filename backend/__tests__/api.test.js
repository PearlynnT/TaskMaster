const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server.js');

require('dotenv').config();

const api = request(app);
//let token = null;

// Connecting to the database before each test.
// beforeEach(async () => {
//     await mongoose.connect(process.env.DATABASE_URI);
//     // token = await request(app).post("/login").send({
//     //     user: "Eric",
//     //     pwd: "Testing123!"
//     // });
// });
  
// Closing database connection after each test.
// afterEach(async () => {
//     await mongoose.connection.close();
// });

beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URI);
}, 100000)
  
afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
})

describe("GET /users/", () => {
    it("should return all users", async () => {
        const token = await api.post("/login").send({
            user: "Eric",
            pwd: "Testing123!"
        });
        const res = await api
            .get("/users/")
            .set({
                Authorization: "Bearer " + token._body.accessToken,
                "Content-Type": "application/json"
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    }, 200000);
});

describe("GET /users/ no authentication", () => {
    it("should return unauthorised response", async () => {
        const res = await api.get("/users");
        expect(res.statusCode).toBe(401);
    });
});

describe("GET /users/:id", () => {
    it("should return a user", async () => {
        const token = await api.post("/login").send({
            user: "Eric",
            pwd: "Testing123!"
        });
        const res = await api
            .get("/users/6493e6e8f861f3986f5df50f")
            .set({
                Authorization: "Bearer " + token._body.accessToken,
                "Content-Type": "application/json"
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.username).toBe("Bryan");
    }, 200000);
});

describe("GET /projects/", () => {
    it("should return all projects", async () => {
        const token = await api.post("/login").send({
            user: "Eric",
            pwd: "Testing123!"
        });
        const res = await api
            .get("/projects/")
            .set({
                Authorization: "Bearer " + token._body.accessToken,
                "Content-Type": "application/json"
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0); // may be changed
    }, 200000);
});

describe("POST /projects/", () => {
    it("should create a project", async () => {
        const token = await api.post("/login").send({
            user: "Eric",
            pwd: "Testing123!"
        });
        const res = await api
            .post("/projects/")
            .send({
                own: "6493e6e1f861f3986f5df50c",
                name: "Test Project",
                description: "This is a test.",
                memb: ["6493e6e8f861f3986f5df50f"],
                completed: false
            })
            .set({
                Authorization: "Bearer " + token._body.accessToken,
                "Content-Type": "application/json"
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe("Test Project");
    }, 200000);
});

describe("GET /tasks/", () => {
    it("should return all tasks", async () => {
        const token = await api.post("/login").send({
            user: "Eric",
            pwd: "Testing123!"
        });
        const res = await api
            .get("/tasks/")
            .set({
                Authorization: "Bearer " + token._body.accessToken,
                "Content-Type": "application/json"
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0); // may be changed
    }, 200000);
});

describe("POST /tasks/", () => {
    it("should create a task", async () => {
        const token = await api.post("/login").send({
            user: "Eric",
            pwd: "Testing123!"
        });
        const res = await api
            .post("/tasks/")
            .send({
                proj: "64989566792b2bb8de2335d4",
                name: "Task 1",
                description: "This is the first task.",
                priority: "high",
                assigned: "6493e6e1f861f3986f5df50c",
                date: new Date(),
                completed: false
            })
            .set({
                Authorization: "Bearer " + token._body.accessToken,
                "Content-Type": "application/json"
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe("Task 1");
    });
});