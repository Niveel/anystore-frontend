import clientApi from './client2'

const endPoint = '/general-search/?query'

const searchProducts = (query) => clientApi.get(`${endPoint}=${query}`)

export default {searchProducts}