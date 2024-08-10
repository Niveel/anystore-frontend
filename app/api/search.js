import client from './client2'

const search = (query) => client.get(`/search=${query}`)

export default {search}