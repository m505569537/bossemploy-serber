//加密函数
const md5 = require('blueimp-md5')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/guigu',{ useNewUrlParser: true })

const conn = mongoose.connection

conn.on('connected',function () {
    console.log('数据库连接成功');
})

const userSchema = mongoose.Schema({
    //指定文档结构，约束
    username: {type:String, required: true},
    password: {type:String, required: true},
    type: {type:String, required:true},
    header: {type: String}
})

const UserModel = mongoose.model('user', userSchema)  //集合名为users

//通过Model或其实例对集合数据进行CRUD操作
function testSave() {
    //生成一条数据
    const userModel = new UserModel({username:'Xeee',password:md5('123'),type:'dashen'})

    //调用save（）保存
    userModel.save(function (error,user) {
        console.log('save()',error,user);
    })
}

// testSave()

//通过Model的find()/findOne()查询多个或一个
function testFind() {
    UserModel.find(function(error,users) {
        console.log(error,users);
    })
}

function findOne() {
    UserModel.findOne({_id: '5cbc13a63138461f08477264'}, function(error, user){
        console.log(error,user);
    })
}
/* 
testFind()
findOne() */

//通过Model的findByIdAndUpdate()更新某个数据
function testUpdate() {
    UserModel.findByIdAndUpdate({_id: '5cbc13a63138461f08477264'}, {username:'Liii'}, function(err,doc){
        console.log('findByIdAndUpdate()',err,doc);
    })
}

// testUpdate()
function testDelete() {
    UserModel.remove({_id: '5cbc13a63138461f08477264'},function(err,doc){
        console.log('remove()',err,doc);
    })
}

testDelete()
