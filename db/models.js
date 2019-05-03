/* 
    包含N个操作数据库集合数据的Model模块
*/
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/guigu',{ useNewUrlParser: true })

const conn = mongoose.connection

conn.on('connected',function(){
    console.log('数据库连接成功');
})
const userSchema = mongoose.Schema({
    username: { type:String, required: true },
    password: { type:String, required: true },
    type: { type:String, required: true },
    header: { type:String },
    post: { type:String },
    info: { type:String },
    company: { type:String },
    salary: { type:String }
})

const UserModel = mongoose.model('user', userSchema);

exports.UserModel = UserModel

const chatSchema = mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    chat_id: { type: String, required: true },
    msg: { type: String, required: true },
    read: { type: Boolean, default: false },
    create_time: { type: Number },
})

const ChatModel = mongoose.model('chat', chatSchema)

exports.ChatModel = ChatModel