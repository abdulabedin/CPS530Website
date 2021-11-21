// const mongoose = require('mongoose')

// const JobsSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//         trim: true
//       },
//       body: {
//         type: String,
//         required: true,
//       },

//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
    
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       },
//     })


// module.exports = mongoose.model('Job', JobsSchema)






const mongoose = require('mongoose')

const JobsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
  },
 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Job', JobsSchema)