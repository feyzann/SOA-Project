const { getProductByIdFromDb, getAllProductsFromDb,addProductToDb,deleteProductFromDb } = require('./productRepository');

const getProductById = (args, callback) => {
  console.log("getProductById request")
  const productId = args.id;
  getProductByIdFromDb(productId)
    .then(product => callback(null, { product }))
    .catch(err => callback(err));
};

const getAllProducts = (call, callback) => {
  console.log("getAllProducts request")
  getAllProductsFromDb()
    .then(products => callback(null, { products }))
    .catch(err => callback(err));
};

const addProduct = (args, callback) => {
  console.log("addProduct request");

  const { name, price, stock } = args;  // `args` burada doğru şekilde alınmalı
  const newProduct = { name, price, stock };

  addProductToDb(newProduct)
    .then(result => {
    
    })
    .catch(err => callback(err));
};

const deleteProduct = (args, callback) => {
  console.log("deleteProduct request");
  const productId = args.id;
  deleteProductFromDb(productId)
    .then(result => {

    })
    .catch(err => callback(err));
};

module.exports = { getProductById, getAllProducts,addProduct,deleteProduct };