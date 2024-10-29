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
      response.status(400).send({ error: 'missing title or url' })
      return
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

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const blog = { ...request.body }
    const config = { new: true, runValidators: true, context: 'query' }
    const updatedPerson = await Blog.findByIdAndUpdate(request.params.id, blog, config)
    response.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter