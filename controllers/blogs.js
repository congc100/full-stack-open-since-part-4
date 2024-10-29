const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.post('/', async (request, response, next) => {
  try {
    // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const { title, url, likes } = request.body
    // missing the title or url properties
    if (!title || !url) {
      response.status(400).send({ error: 'missing title or url' })
      return
    }
    const user = await User.findById(decodedToken.id)
    console.log('user', user)
    const blog = !likes
      ? new Blog({ ...request.body, user: user._id, likes: 0 })
      : new Blog({ ...request.body, user: user._id })
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    // await Blog.findByIdAndDelete(request.params.id)
    // response.status(204).end()

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() !== decodedToken.id.toString()) {
      return response.status(403).json({ error: 'a blog can be deleted only by the user who added it' })
    }
    await blog.deleteOne()
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