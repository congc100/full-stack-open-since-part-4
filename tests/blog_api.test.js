const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const postBlog = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
}

const postBlogMissingLikes = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
}

const postBlogMissingTitle = {
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
}

const postBlogMissingUrl = {
  title: 'React patterns',
  author: 'Michael Chan',
  likes: 7,
}

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const blog of initialBlogs) {
    await new Blog(blog).save()
  }
})

describe.only('test GET request to the /api/blogs', () => {
  test.only('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test.only('there are six blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test.only('the first blog\'s title is React patterns', async () => {
    const response = await api.get('/api/blogs')
    const firstTitle = response.body[0].title
    assert(firstTitle.includes('React patterns'))
  })
})

describe.only('ensure unique identifier is named id', () => {
  test.only('each has an property named id', async () => {
    const response = await api.get('/api/blogs')
    for (const blog of response.body) {
      assert(typeof blog.id === 'string')
    }
  })
})

describe.only('verify POST request to the /api/blogs', () => {
  test.only('total number increased by one', async () => {
    await api
      .post('/api/blogs')
      .send(postBlog)
      .expect(201)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
  })

  test.only('the content is correct', async () => {
    await api
      .post('/api/blogs')
      .send(postBlog)
      .expect(201)
    const response = await api.get('/api/blogs')
    const blog = response.body.pop()
    assert(blog.title.includes('React patterns'))
  })
})

describe.only('ensure default missing likes is 0', () => {
  test.only('the number is correct', async () => {
    await api
      .post('/api/blogs')
      .send(postBlogMissingLikes)
      .expect(201)
    const response = await api.get('/api/blogs')
    const blog = response.body.pop()
    assert.strictEqual(blog.likes, 0)
  })

  test.only('blogs with likes not affected', async () => {
    await api
      .post('/api/blogs')
      .send(postBlog)
      .expect(201)
    const response = await api.get('/api/blogs')
    const blog = response.body.pop()
    assert.strictEqual(blog.likes, 7)
  })
})

describe.only('400 Bad Request if missing title or url', () => {
  test.only('if missing the title property', async () => {
    await api
      .post('/api/blogs')
      .send(postBlogMissingTitle)
      .expect(400)
  })

  test.only('if missing the url property', async () => {
    await api
      .post('/api/blogs')
      .send(postBlogMissingUrl)
      .expect(400)
  })
})

describe.only('test deleting a single blog post resource', () => {
  test.only('delete the first blog', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    await api
      .delete(`/api/blogs/${firstBlog.id}`)
      .expect(204)
  })
})

describe.only('test updating the information of an individual blog post', () => {
  test.only('update the likes of the first blog', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    const likes = firstBlog.likes
    const updated = await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send({ ...firstBlog, likes: likes + 10 })
    // console.log('updated', updated.body)
    assert.strictEqual(updated.body.likes, likes + 10)
  })
})

after(async () => {
  await mongoose.connection.close()
  console.log('connection closed')
})

// npm test -- --test-only tests/blog_api.test.js
