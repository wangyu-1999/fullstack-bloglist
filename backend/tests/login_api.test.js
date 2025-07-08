const mongoose = require("mongoose")
const {beforeEach, test, describe, after} = require("node:test")
const User = require("../models/user")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)

describe("login", () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const newUser = {
            username: "root",
            name: "root",
            password: "root"
        }
        await api.post("/api/users").send(newUser).expect(201)
    })

    test("login with correct credentials", async () => {
        const loginUser = {
            username: "root",
            password: "root"
        }
        await api.post("/api/login").send(loginUser).expect(200)
    })

    test("login with incorrect credentials", async () => {
        const loginUser = {
            username: "root",
            password: "root1"
        }
        await api.post("/api/login").send(loginUser).expect(401)
    })

    test("login with username that does not exist", async () => {
        const loginUser = {
            username: "root1",
            password: "root"
        }
        await api.post("/api/login").send(loginUser).expect(401)
    })
})

after(async () => {
    await mongoose.connection.close()
})