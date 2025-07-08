
import { useState, forwardRef, useImperativeHandle } from 'react'

const Notification = forwardRef((_props, ref) => {

  const [timeoutId, setTimeoutId] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const clearMessage = () => {
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  useImperativeHandle(ref, () => ({
    updateMessage(successMessage, errorMessage=null) {
      if (successMessage === null && errorMessage === null) {
        return
      } else {
        if (errorMessage) {
          if (timeoutId) {
            clearTimeout(timeoutId)
          }
          setErrorMessage(errorMessage)
          const newTimeoutId = setTimeout(() => {
            clearMessage()
          }, 5000)
          setTimeoutId(newTimeoutId)
        } else {
          if (timeoutId) {
            clearTimeout(timeoutId)
          }
          setSuccessMessage(successMessage)
          const newTimeoutId = setTimeout(() => {
            clearMessage()
            setTimeoutId(null)
          }, 5000)
          setTimeoutId(newTimeoutId)
        }
      }
    }
  }))


  if (errorMessage === null && successMessage === null) {
    return null
  }

  return <div style={{
    color: errorMessage ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }}>{errorMessage || successMessage}</div>
})

Notification.displayName = 'Notification'

export default Notification