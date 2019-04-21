var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const UserModel = require('../db/models').UserModel

const filter = {password:0, __v:0}  //设置过滤，使回调返回的数据不包含过滤器中的属性

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 注册一个路由：用户注册
/* 
1. path为 /register
2. 请求方式为 POST
3. 接收 username和password
4. admin是已注册用户
5. 注册成功返回 {code:0, data: {_id:'abc',username:'xxx',password:'123}}
6. 注册失败返回 {code:1, msg:'此用户已存在'}
*/

/* router.post('/register', function (req, res, next) {
  //1. 获取请求数据
  // post请求数据放在body中，路径参数 (:id)和查询字符串放在param和query中
  const { username, password } = req.body
  //2. 处理
  if(username==='admin'){
    res.send({code:1, msg:'此用户已存在'})
  }else{
    res.send({code:0, data: {_id:'abc',username,password}})
  }
}) */

/* 卧槽！！！！！劳资终于知道怎么和后台进行数据交互了 */
/* 注册路由，操作数据库，返回数据，其实也不是很难 */
router.post('/register', function(req,res){
  //获取请求数据
  const { username, password, type } = req.body;
  //处理
  //查询是否user已存在
  UserModel.findOne({ username }, function (err, user) {
    if(user){
      //如果user已经存在，返回错误
      res.send({ code:1, msg: '此用户已存在' })
    } else {
      //user不存在，保存到数据库中
      new UserModel({ username, type, password:md5(password) }).save(function (err, user){
        //使用cookie保证持久化登录   maxAge单位是毫秒
        res.cookie('userid', user._id, { maxAge: 1000*60*60*24 })
        //返回数据不要保护密码
        const data = { username, type, _id: user._id }
        res.send({ code:0, data })
      })
    }
  })
})

router.post('/login', function(req,res){
  const { username, password } = req.body

  UserModel.findOne({ username, password: md5(password) }, filter ,function (err, user){
    if(user){
      //如果user存在，则登录成功
      res.cookie('userid',user._id, {maxAge: 1000*60*60*24})
      res.send({ code:0, data: user })
    } else {
      //登录失败
      res.send({ code:1, msg: '用户名或密码错误' })
    }
  })
})

module.exports = router;
