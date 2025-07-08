const _ = require('lodash')
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    let favorite = blogs[0]
    blogs.forEach(blog => {
        if (blog.likes > favorite.likes) {
            favorite = blog
        }
    })
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    const authorCounts = _.countBy(blogs, 'author')
    const maxAuthor = _.maxBy(Object.keys(authorCounts), author => authorCounts[author])
    return {
        author: maxAuthor,
        blogs: authorCounts[maxAuthor]
    }
}

const mostLikes = (blogs) => {
    const authorLikes = blogs.reduce((authorLikes, blog) => {
        authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
        return authorLikes
    }, {})
    const maxAuthor = _.maxBy(Object.keys(authorLikes), author => authorLikes[author])
    return {
        author: maxAuthor,
        likes: authorLikes[maxAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}