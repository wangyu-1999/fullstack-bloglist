const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { initialBlogs } = require('../utils/test_helper')

const blogs = initialBlogs

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes([blogs[0]])
        assert.strictEqual(result, blogs[0].likes)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 36)
    })
})

describe('favorite blog', () => {
    test('of empty list is null', () => {
        const result = listHelper.favoriteBlog([])
        assert.deepStrictEqual(result, null)
    })

    test('when list has only one blog, returns that', () => {
        const result = listHelper.favoriteBlog([blogs[0]])
        assert.deepStrictEqual(result, {
            title: blogs[0].title,
            author: blogs[0].author,
            likes: blogs[0].likes
        })
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, {
            title: blogs[2].title,
            author: blogs[2].author,
            likes: blogs[2].likes
        })
    })
})

describe('most blogs', () => {
    test('most blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, {
            author: 'Robert C. Martin',
            blogs: 3
        })
    })
})    

describe('most likes', () => {
    test('most likes', () => {
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })
})