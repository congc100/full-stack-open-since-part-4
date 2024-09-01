const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const { title, url, likes } = request.body
    // missing the title or url properties
    if (!title || !url) {
      response.status(400).end()
    }
    const blog = !likes
      ? new Blog({ ...request.body, likes: 0 })
      : new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter