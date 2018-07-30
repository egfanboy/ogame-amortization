const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const csvData = require('csvdata');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const removeFile = promisify(fs.unlink);

const app = express();
app.use(cors());
app.use(bodyParser.json());
const buildPath = path.join(__dirname, '..', '/build');
app.use(express.static(buildPath));

app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));

app.post('/download', async (req, res) => {
    const tempFilePath = path.join(__dirname, '..', `temp-${Date.now()}.csv`);

    await csvData.write(tempFilePath, req.body, {
        header: 'planet,building,level',
    });

    res.sendFile(tempFilePath, () => removeFile(tempFilePath));
});

app.listen(process.env.PORT || '3001');
