import { useState } from 'react'
const NewBlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div data-testid="new-blog-form">
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title: <input id="title" value={title} onChange={({ target }) => setTitle(target.value)} data-testid="new-blog-title" />
        </div>
        <div>
          author: <input id="author" value={author} onChange={({ target }) => setAuthor(target.value)} data-testid="new-blog-author" />
        </div>
        <div>
          url: <input id="url" value={url} onChange={({ target }) => setUrl(target.value)} data-testid="new-blog-url" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default NewBlogForm