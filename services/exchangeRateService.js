const axios = require('axios');

const getExchangeRate = async () => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/TRY'); 
    return response.data.rates;
  } catch (err) {
    throw err;
  }
};

module.exports = { getExchangeRate };
