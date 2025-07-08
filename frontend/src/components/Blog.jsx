import { useState } from 'react'

const Blog = ({ blog, clickLike, deleteBlog, user }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div style={blogStyle} className={"blog"} data-testid="blog">
      {blog.title} {blog.author} <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
      {showDetails &&
      <div>
        <div>{blog.url}</div>
        <div data-testid="blog-likes">{blog.likes} <button onClick={clickLike}>like</button></div>
        <div>{blog.user.name}</div>
      </div>}
      {showDetails && user.name === blog.user.name && <button onClick={deleteBlog}>delete</button>}
    </div>
  )
}

export default Blog