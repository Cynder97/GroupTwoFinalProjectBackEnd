const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://sbessenbacher:TestingPass259@songdb.kysdpur.mongodb.net/SongDB?retryWrites=true&w=majority&appName=SongDB",{useNewURLParser: true})

module.exports = mongoose