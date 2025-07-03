const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  // 1. Create user
  const newUser = {
    username: 'root',
    name: 'root',
    password: 'password',
  }
  const savedUser = await api.post('/api/users').send(newUser)

  // 2. Log in to get token
  const result = await api.post('/api/login').send(newUser)
  token = result.body.token

  // 3. Associate initial blogs with the created user
  const blogsWithUser = helper.initialBlogs.map(blog => ({
    ...blog,
    user: savedUser.body.id, // Use the ID of the created user
  }))

  // 4. Insert the associated blogs
  await Blog.insertMany(blogsWithUser)
})

describe('When there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blog ids are called id', async () => {
    const response = await api.get('/api/blogs')
    
    response.body.forEach(blog => {
      assert(blog.id !== undefined)
      assert(blog._id === undefined)
    })
  })

})

describe('Creating a new blog post', () => {
  test('creating a blog post with valid data', async () => {
    const newBlog = {
      title: "Title",
      author: "Author",
      url: "https://hi.com",
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedList = await api.get('/api/blogs')
    assert.strictEqual(updatedList.body.length, helper.initialBlogs.length + 1)
  })

  // 4.11: Test that likes defaults to 0 when missing
  test('creating a blog post without likes defaults to 0', async () => {
    const newBlog = {
      title: "Blog without likes",
      author: "Author",
      url: "https://example.com"
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  // 4.12: Test that missing title returns 400
  test('creating a blog post without title and url returns 400', async () => {
    const newBlog = {
      author: "Author",
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('Deleting a blog post', () => {
  test('deleting a blog post', async () => {
    const currentBlogsInDb = await helper.blogsInDb()
    const blogToDelete = currentBlogsInDb[0].id

    await api
      .delete(`/api/blogs/${blogToDelete}`)
      .expect(204)
      .set('Authorization', `bearer ${token}`)

  })
})

test('updating a blog post', async () => {
  const response = await api.get('/api/blogs')
  const blogToUpdate = response.body[0].id


  const updatedBlog = {
    title: "Updated Title",
    author: "Updated Author",
    url: "https://updated.com",
    likes: 10
  }

  const putResponse = await api
    .put(`/api/blogs/${blogToUpdate}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(putResponse.body.title, updatedBlog.title)
  assert.strictEqual(putResponse.body.author, updatedBlog.author)
  assert.strictEqual(putResponse.body.url, updatedBlog.url)
  assert.strictEqual(putResponse.body.likes, updatedBlog.likes)
})

describe('When there is initially some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'rooster', name: 'rooster', passwordHash })

    await user.save()

  })
  test('create a new user', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
          username: "newuser",
          name: "New User",
          password: "newpassword"
      }

      await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(usersAtEnd.length === usersAtStart.length + 1 )
      assert(usersAtEnd.map(u => u.username).includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'rooster',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})