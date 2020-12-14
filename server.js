const express = require('express');

const mongoose = require('mongoose');
const routes = require('./routes/index');
require('dotenv').config();
const path = require('path')
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 8000;



app.use(express.json())
app.use(routes)
app.use(cookieParser())

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
let gfs;
connection.once('open', () => {
    console.log('mongoDB connected')
    gfs = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: 'uploads',
    });

})

const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                };
                resolve(fileInfo);
            });
        });
    },
});

const upload = multer({
    storage,
});

app.listen(port, () => {
    console.log('server is running on port', port);
})
app.post('/bill/', upload.single('file'), (req, res) => {
    res.status(201).send(req.file);
})

app.get('/bill/:filename', (req, res) => {
    // console.log('id', req.params.id)
    gfs
        .find({
            filename: req.params.filename,
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: 'no files exist',
                });
            }
            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        });


});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}