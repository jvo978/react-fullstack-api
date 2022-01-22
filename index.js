const express = require('express'); // instance of the framework
const app = express(); // initialize our server, make api requests
const cors = require('cors');
require("dotenv").config();


app.use(express.json())
app.use(cors());

//models
const db = require('./models')

//Routers
const postRouter = require('./routes/Posts');
app.use('/posts', postRouter)
const commentsRouter = require('./routes/Comments');
app.use('/comments', commentsRouter)
const usersRouter = require('./routes/Users');
app.use('/auth', usersRouter)
const likesRouter = require('./routes/Likes');
app.use('/likes', likesRouter)

db.sequelize
    .sync()
    .then(() => {
        app.listen(process.env.PORT || 3001, () => {
        console.log('Server is running on port 3001.')
    })
})