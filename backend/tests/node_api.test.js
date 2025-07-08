const { test, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const { initialBlogs, createBlog } = require("../utils/test_helper")
const Blog = require("../models/blog")
const User = require("../models/user")
beforeEach(async () => {
    await User.deleteMany({})
    const res = await api.post("/api/users").send({
        username: "root",
        name: "root",
        password: "root"
    })
    await Blog.deleteMany({})
    const blogObjects = initialBlogs.map(blog => new Blog({...blog,user: res.body.id}))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test("blogs are returned as json", async () => {
    await api.get("/api/blogs").expect(200).expect("Content-Type", /application\/json/)
})

test("the number of blogs is correct", async () => {
    const response = await api.get("/api/blogs")
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test("blog id is returned as id instead of _id", async () => {
    const response = await api.get("/api/blogs")
    response.body.forEach(blog => {
        assert(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
})

test("blog can be added correctly", async () => {
    const newBlog = {
        title: "Test Blog",
        author: "Test Author",
        url: "http://test.com",
        likes: 0,
    }
    await createBlog(api, newBlog)
    const response = await api.get("/api/blogs")
    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    const { title, author, url, likes } = response.body.find(blog => blog.title === "Test Blog")
    assert.strictEqual(title, newBlog.title)
    assert.strictEqual(author, newBlog.author)
    assert.strictEqual(url, newBlog.url)
    assert.strictEqual(likes, newBlog.likes)
})

test("missing likes property defaults to 0", async () => {
    const newBlog = {
        title: "Test Blog",
        author: "Test Author",
        url: "http://test.com"
    }
    await createBlog(api, newBlog)
    const response = await api.get("/api/blogs")
    assert.strictEqual(response.body.find(blog => blog.title === "Test Blog").likes, 0)
})

test("blog without title or url is not added", async () => {
    const newBlog = {
        author: "Test Author",
        likes: 0,
        url: "http://test.com"
    }
    const res = await createBlog(api, newBlog)
    assert.strictEqual(res.status, 400)
    const newBlog2 = {
        title: "Test Blog",
        author: "Test Author",
        likes: 0
    }
    const res2 = await createBlog(api, newBlog2)
    assert.strictEqual(res2.status, 400)
})

test("deleting a blog requires authorization", async () => {
    const newBlog = {
        title: "Test Blog 1",
        author: "Test Author 1",
        url: "http://test.com",
        likes: 0,
    }
    await api.post("/api/users").send({
        username: "test1",
        name: "test1",
        password: "test1"
    }).expect(201)
    const res1 = await api.post("/api/login").send({
        username: "test1",
        password: "test1"
    })
    await api.post("/api/users").send({
        username: "test2",
        name: "test2",
        password: "test2"
    }).expect(201)
    const res2 = await api.post("/api/login").send({
        username: "test2",
        password: "test2"
    })
    const token1 = res1.body.token
    const blog = await api.post("/api/blogs").set("Authorization", `Bearer ${token1}`).send(newBlog).expect(201)
    const token2 = res2.body.token
    await api.delete(`/api/blogs/${blog.body.id}`).set("Authorization", `Bearer ${token2}`).expect(401)
    await api.delete(`/api/blogs/${blog.body.id}`).set("Authorization", `Bearer ${token1}`).expect(204)
    const response = await api.get("/api/blogs")
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test("updating a blog", async () => {
    const blogsAtStart = await api.get("/api/blogs")
    const blogToUpdate = blogsAtStart.body[0]
    await api.put(`/api/blogs/${blogToUpdate.id}`).send({likes: 10}).expect(200)
    const blogsAtEnd = await api.get("/api/blogs")
    const updatedBlog = blogsAtEnd.body.find(blog => blog.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, 10)
    assert.strictEqual(updatedBlog.title, blogToUpdate.title)
    assert.strictEqual(updatedBlog.author, blogToUpdate.author)
    assert.strictEqual(updatedBlog.url, blogToUpdate.url)
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length)
})

after(async () => {
    await mongoose.connection.close()
})