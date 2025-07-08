import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = ({ setErrorMessage, setSuccessMessage, setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setSuccessMessage('logged in')
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage('wrong credentials')
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input type="text" value={username} onChange={({ target }) => { setUsername(target.value) }} data-testid="username" />
      </div>
      <div>
        password
        <input type="password" value={password} onChange={({ target }) => { setPassword(target.value) }} data-testid="password" />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm