import clientApi from "./client2";

const endpoint = "/barcode-search/";

const searchBarcode = (barcode) => clientApi.get(`${endpoint}?query=${barcode}`);

export default {searchBarcode} 