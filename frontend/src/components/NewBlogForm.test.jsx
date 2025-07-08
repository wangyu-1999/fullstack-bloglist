import { render, screen } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'
import { userEvent } from '@testing-library/user-event'

describe('<NewBlogForm />', () => {
  let createBlog
  let userEventSetup
  let container
  let newBlogForm
  beforeEach(() => {
    createBlog = vi.fn()
    userEventSetup = userEvent.setup()
    container = render(<NewBlogForm createBlog={createBlog} />).container
    newBlogForm = container.querySelector('[data-testid="new-blog-form"]')
  })

  test("check props after input", async () => {
    const titleInput = newBlogForm.querySelector('input[id="title"]')
    const authorInput = newBlogForm.querySelector('input[id="author"]')
    const urlInput = newBlogForm.querySelector('input[id="url"]')
    await userEventSetup.type(titleInput, 'Test Blog')
    await userEventSetup.type(authorInput, 'Test Author')
    await userEventSetup.type(urlInput, 'https://test.com')
    const createButton = newBlogForm.querySelector('button[type="submit"]')
    await userEventSetup.click(createButton)
    expect(createBlog.mock.calls[0][0].title).toBe('Test Blog')
    expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
    expect(createBlog.mock.calls[0][0].url).toBe('https://test.com')
  })
})