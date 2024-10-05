import clientApi from './client2'

const endpoint = '/general-search/?query=trending items today'

const getTrendingProducts = () => clientApi.get(endpoint)

export default {getTrendingProducts}