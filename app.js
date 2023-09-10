const express = require('express');
const axios = require('axios');
const app = express();


const fetchNumbersFromURL = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 500 });
    if (response.status === 200 && response.data && Array.isArray(response.data.numbers)) {
      return response.data.numbers;
    }
    throw new Error('Invalid response from URL');
  } catch (error) {
    console.error(`Error fetching data from ${url}: ${error.message}`);
    return []; 
  }
};

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid or missing URL parameter' });
  }

  try {
    const allNumbers = [];
    const promises = urls.map((url) => fetchNumbersFromURL(url));


    const results = await Promise.all(promises);

  
    results.forEach((numbers) => {
      allNumbers.push(...numbers);
    });


    const mergedNumbers = Array.from(new Set(allNumbers)).sort((a, b) => a - b);

    return res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error(`Error processing URLs: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 8008;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
