const mongoose = require("mongoose")
const {beforeEach, test, describe, after} = require("node:test")
const assert = require("node:assert")
const User = require("../models/user")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

describe("when there is initially one user in db", () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })

    test("create a new user", async () => {
        const newUser = {
            username: "root",
            name: "root",
            password: "root"
        }
        await api.post("/api/users").send(newUser).expect(201).expect("Content-Type", /application\/json/)
        const usersAtEnd = await api.get("/api/users")
        assert.strictEqual(usersAtEnd.body.length, 1)
    })

    test("creation fails with short username or password", async () => {
        const newUser = {
            username: "ro",
            name: "root",
            password: "root"
        }
        await api.post("/api/users").send(newUser).expect(400)
        const newUser2 = {
            username: "root",
            name: "root",
            password: "ro"
        }
        await api.post("/api/users").send(newUser2).expect(400)
        const usersAtEnd = await api.get("/api/users")
        assert.strictEqual(usersAtEnd.body.length, 0)
    })

    test("creation fails with duplicate username", async () => {
        const newUser = {
            username: "root",
            name: "root",
            password: "root"
        }
        await api.post("/api/users").send(newUser).expect(201)
        await api.post("/api/users").send(newUser).expect(400)
        const usersAtEnd = await api.get("/api/users")
        assert.strictEqual(usersAtEnd.body.length, 1)
    })
})

after(async () => {
    await mongoose.connection.close()
})