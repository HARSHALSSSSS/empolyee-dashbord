import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchEmployeeData = async () => {
  try {
    const response = await api.post('/gettabledata.php', {
      username: import.meta.env.VITE_API_USERNAME,
      password: import.meta.env.VITE_API_PASSWORD,
    })
    return response.data
  } catch (error) {
    console.error('Error fetching employee data:', error)
    throw error
  }
}

export const validateLogin = (username, password) => {
  const validUsername = import.meta.env.VITE_LOGIN_USERNAME
  const validPassword = import.meta.env.VITE_LOGIN_PASSWORD
  return username === validUsername && password === validPassword
}

export default api
