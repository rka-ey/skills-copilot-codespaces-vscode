// Create web server
// 1. Load all modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

// 2. Use modules
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 3. Set up server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// 4. Create routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/comments', (req, res) => {
  fs.readFile('./comments.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('An error occurred while reading the file.');
    } else {
      res.send(data);
    }
  });
});

app.post('/comments', (req, res) => {
  const newComment = req.body;
  fs.readFile('./comments.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('An error occurred while reading the file.');
    } else {
      const comments = JSON.parse(data);
      comments.push(newComment);
      fs.writeFile('./comments.json', JSON.stringify(comments, null, 2), (err) => {
        if (err) {
          res.status(500).send('An error occurred while writing the file.');
        } else {
          res.status(201).send('Comment added successfully');
        }
      });
    }
  });
});

// 5. Error handling
app.use((req, res) => {
  res.status(404).send('Resource not found');
});

// 6. Close server
process.on('SIGINT', () => {
  console.log('Server is stopped');
  process.exit();
});
// End of comments.js
