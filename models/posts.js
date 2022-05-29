const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: [true, '使用者 ID 未填寫']
  },
  content: {
    type: String,
    required: [true, 'Content 未填寫']
  },
  type: {
    type: String,
    enum:['group','person'],
    required: [true, '貼文類型 type 未填寫']
  },
  image: {
    type: String,
    default:""
  },
  likes: {
    type:Number,
    default:0
  },
  comments: {
    type: Number,
    default:0
  },
  tags:[
    {
      type: String,
      required: [true, '貼文標籤 tags 未填寫']
    }
  ]
},
{ 
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;