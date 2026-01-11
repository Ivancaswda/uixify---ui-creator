import axios from "axios"

const instance = axios.create()

instance.interceptors.request.use((config) => {
    const key = localStorage.getItem("GEMINI_API_KEY")
    if (key) {
        config.headers["x-gemini-key"] = key
    }
    return config
})

export default instance