const sql = require('mssql');

const config = {
  user: 'product',
  password: 'product',
  server: 'localhost',
  database: 'ProductSoap',
  options: {
    encrypt: true,  // Veritabanı şifreli bağlantı kullanıyor mu?
    trustServerCertificate: true,  // Self-signed sertifikayı kabul et
  },
};

const getProductByIdFromDb = async (id) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Products WHERE id = @id');
    return result.recordset[0]; // Ürün verisini döndür
  } catch (err) {
    console.log("getProductByIdFromDb error:",err);
  }
};

const getAllProductsFromDb = async () => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Products');
    return result.recordset; // Ürünlerin tamamını döndür
  } catch (err) {
    console.log("getAllProductsFromDb error:",err);
  }
};

const addProductToDb = async (newProduct) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('name', sql.NVarChar, newProduct.name)
      .input('price', sql.Decimal, newProduct.price)
      .input('stock', sql.Int, newProduct.stock)
      .query('INSERT INTO Products (name, price, stock) VALUES (@name, @price, @stock)');

    return result.rowsAffected; // Bu, eklenen satır sayısını döndürür
  } catch (err) {
    console.error("Error adding product to DB:", err);
    throw err;
  }
};

const deleteProductFromDb = async (id) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Products WHERE id = @id');
    return result.rowsAffected; 
  } catch (err) {
    console.log("deleteProductFromDb error:", err);
  }
};

module.exports = { getProductByIdFromDb, getAllProductsFromDb, addProductToDb, deleteProductFromDb };
