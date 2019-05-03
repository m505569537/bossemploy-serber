const { ChatModel } = require('../db/models')
module.exports = function (server) {
    const io = require('socket.io')(server)

    //监听客户端和服务器的连接
    io.on('connection' ,function (socket) {
        // console.log('有一个客户端连接上了服务器');
        socket.on('sendMsg', function (data) {
            // console.log('客户端发送来的消息', data);
            //准备chatMsg对象的相关数据
            const { from, to, msg } = data
            //无论发送方和接收方是否颠倒，通过排序得到的结果都是一样的
            const chat_id  = [from, to].sort().join('_')
            const create_time = Date.now()
            //将聊天消息存储到数据库中，
            new ChatModel({ from, to, msg, chat_id,create_time }).save(function (err, chatMsg) {
                //给所有连接到的client发消息
                //虽然想只给目标对象发消息，但是对不起，我做不到。呜呜呜
                //如果目标在线，则可以直接读取到新发送的消息，否则则需要从数据库中读取
                io.emit('receiveMsg',chatMsg)
            })
        })
    })
}