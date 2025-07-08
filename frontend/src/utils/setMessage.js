const setMessageTimeout = (setMessage, message, timeout=5000) => {
  setMessage(message)
  setTimeout(() => {
    setMessage(null)
  }, timeout)
}

export default setMessageTimeout