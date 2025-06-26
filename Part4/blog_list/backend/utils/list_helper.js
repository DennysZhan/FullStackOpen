const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (!blogs) {
    return 0
  }
  
  // If it's a single blog object (not an array), return its likes
  else if (!Array.isArray(blogs)) {
    return blogs.likes || 0
  }
  else{
  // If it's an array, reduce as before
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
    }
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  else if (!Array.isArray(blogs)) {
    return blogs
  }
  else{
    return blogs.reduce((mostLiked, current) => {
        return current.likes > mostLiked.likes ? current : mostLiked
    })
  }

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
