import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [sortedBlogs, setSortedBlogs] = useState([])
  const [user, setUser] = useState(null)

  const newBlogRef = useRef()
  const notificationRef = useRef()

  const updateMessage = (successMessage, errorMessage) => {
    notificationRef.current.updateMessage(successMessage, errorMessage)
  }

  useEffect(() => {
    (async () => {
      if (user) {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      }
    })()
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    setSortedBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }, [blogs])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    updateMessage('logged out', null)
    setUser(null)
    blogService.setToken(null)
    setBlogs([])
  }

  const createBlog = async (blog) => {
    const newBlog = await blogService.create(blog)
    setBlogs(blogs.concat(newBlog))
    updateMessage('new blog created')
    newBlogRef.current.toggleVisibility()
  }

  const handleClickLike = (blog) => {
    return async () => {
      const updatedBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
      setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
      updateMessage(`${blog.title} liked`)
    }
  }

  const handleDeleteBlog = (blog) => {
    return async () => {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        await blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        updateMessage(`${blog.title} deleted`)
      }
    }
  }

  return (
    <div>
      {user ? <h2>blogs</h2> : <h2>log in to application</h2>}
      <Notification ref={notificationRef}/>
      {user ?
        <>
          <p>{user.name} logged in
            <button onClick={handleLogout}>log out</button>
          </p>
          <Togglable buttonLabel="new blog" ref={newBlogRef}>
            <NewBlogForm createBlog={createBlog} />
          </Togglable>
          {sortedBlogs.map(blog =>
            <Blog key={blog.id} blog={blog} clickLike={handleClickLike(blog)} deleteBlog={handleDeleteBlog(blog)} user={user} />
          )}
        </> :
        <>
          <LoginForm
            setErrorMessage={(errorMessage) => updateMessage(null, errorMessage)}
            setSuccessMessage={(successMessage) => updateMessage(successMessage, null)}
            setUser={setUser} />
        </>}
    </div>
  )
}

export default App