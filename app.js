const express = require('express');
const soap = require('soap');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { getProductById, getAllProducts,addProduct,deleteProduct } = require('./services/productService');
const { getExchangeRate } = require('./services/exchangeRateService');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json()); 
// Portlar
const REST_AND_SOAP_PORT = 8000;
const GRPC_PORT = 50051;

// gRPC Server Setup
const packageDefinition = protoLoader.loadSync('./protos/product.proto');
const newsProto  = grpc.loadPackageDefinition(packageDefinition).product;

const grpcServer = new grpc.Server();
grpcServer.addService(newsProto.ProductService.service, {
  getAllProducts,  // Burada servis fonksiyonları bağlanır
});
grpcServer.bindAsync(`127.0.0.1:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`gRPC Server listening on port ${GRPC_PORT}`);
});

// SOAP Endpoint Setup
const service = {
  ProductService: {
    ProductServicePort: {
      getProductById: getProductById
      }
    }
};

const wsdl = path.resolve(__dirname, 'wsdl', 'product.wsdl');
const xml = fs.readFileSync(wsdl, 'utf8');

soap.listen(app, '/product', service, xml, function() {
  console.log('SOAP server running at http://localhost:8000/product');
});

// REST API Endpoint Setup
app.get('/exchange-rate', async (req, res) => {
  try {
    const rate = await getExchangeRate();
    res.json({ rate });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
});

// Ürün ekleme işlemi (HTTP POST)
app.post('/add-product', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    if (!name || !price || !stock) {
      return res.status(400).json({ error: 'Missing product fields' });
    }
    const newProduct = { name, price, stock };
    const result = await addProduct(newProduct);
    console.log("result",result)
    
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Ürün silme işlemi (HTTP DELETE)
app.delete('/delete-product/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const result = await deleteProduct({ id: productId });

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Tek bir listen çağrısı
app.listen(REST_AND_SOAP_PORT, () => {
  console.log(`REST and SOAP server listening on port ${REST_AND_SOAP_PORT}`);
});
