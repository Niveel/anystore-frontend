import clientApi from './client2'

const endpoint = '/category-list'

const getCategories = () => clientApi.get(endpoint)

export default {getCategories}