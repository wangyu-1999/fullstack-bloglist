import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { userEvent } from '@testing-library/user-event'

describe('<Blog />', () => {
  let blog
  let container
  let blogElement
  let clickLike
  let deleteBlog
  let user
  let userEventSetup
  beforeEach(() => {
    blog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://test.com',
      likes: 0,
      user: {
        username: 'testuser',
        name: 'Test User'
      }
    }
    clickLike = vi.fn()
    deleteBlog = vi.fn()
    user = {
      username: 'testuser',
      name: 'Test User'
    }
    container = render(<Blog blog={blog} clickLike={clickLike} deleteBlog={deleteBlog} user={user} />).container
    blogElement = container.querySelector('.blog')
    userEventSetup = userEvent.setup()
  })

  test('renders content', () => {
    expect(blogElement).toHaveTextContent('Test Blog')
    expect(blogElement).toHaveTextContent('Test Author')
    expect(blogElement).not.toHaveTextContent('https://test.com')
    expect(blogElement).not.toHaveTextContent('0')
  })

  test("click the button to view details", async () => {
    const button = screen.getByText('view')
    await userEventSetup.click(button)
    expect(blogElement).toHaveTextContent('https://test.com')
    expect(blogElement).toHaveTextContent('0')
  })

  test("click the like button twice", async () => {
    const viewButton = screen.getByText('view')
    await userEventSetup.click(viewButton)
    const likeButton = screen.getByText('like')
    await userEventSetup.click(likeButton)
    await userEventSetup.click(likeButton)
    expect(clickLike.mock.calls).toHaveLength(2)
  })
})
