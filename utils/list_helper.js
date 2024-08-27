const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }
  const sorted = blogs.toSorted((a, b) => b.likes - a.likes)
  // console.log('sorted', sorted)
  const { title, author, likes } = sorted[0]
  return { title, author, likes }
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }
  const authorBlogs = _.countBy(blogs, 'author')
  // console.log('authorBlogs', authorBlogs)
  const topAuthor = _.maxBy(_.keys(authorBlogs), author => authorBlogs[author])
  return {
    author: topAuthor,
    blogs: authorBlogs[topAuthor],
  }
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }
  const authorLikes = _(blogs)
    .groupBy('author')
    .mapValues(authorBlogs => _.sumBy(authorBlogs, 'likes'))
    .value()
  // console.log('authorLikes', authorLikes)
  const topAuthor = _.maxBy(_.keys(authorLikes), author => authorLikes[author])
  return {
    author: topAuthor,
    likes: authorLikes[topAuthor],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}