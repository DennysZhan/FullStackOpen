const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

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

test('creating a blog post', async () => {
  const newBlog = {
    title: "Title",
    author: "Author",
    url: "https://hi.com",
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const updatedList = await api.get('/api/blogs')
  assert.strictEqual(updatedList.body.length, initialBlogs.length + 1)
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
    .send(newBlog)
    .expect(400)
})

test('deleting a blog post', async () => {
  const response = await api.get('/api/blogs')
  const blogToDelete = response.body[0].id

  await api
    .delete(`/api/blogs/${blogToDelete}`)
    .expect(204)
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

after(async () => {
  await mongoose.connection.close()
})