let express = require('express');
let router = express.Router();
let User = require('../module/User');
let Content = require('../module/Content');

let responseData;

router.use( function(req,res,next) {

    responseData = {

        code: 0,
        messages: ''

    };

    next()

});

router.post('/use/register',(req,res,next) => {

    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;

    if(username === ''){

        responseData.code = 1;
        responseData.messages = '用户名不能为空';
        res.json(responseData);
        return;

    };

    if(password === ''){

        responseData.code = 2;
        responseData.messages = '密码不能为空';
        res.json(responseData);
        return;

    };

    if(password !== repassword){

        responseData.code = 3;
        responseData.messages = '密码前后不一致';
        res.json(responseData);
        return;

    };

    User.findOne({

        username: username

    }).then(function (userInfo) {

        try{

            if(userInfo) {

                responseData.code = 4;
                responseData.messages = '该用户已经存在';
                res.json(responseData);

                return;

            };

            return new User({
                username: username,
                password: password
            }).save();

        }catch(userInfo) {

            console.log('err');

        }

    }).then(function(newUserInfo){

        try {

            responseData.code = 0;
            responseData.messages = '注册成功';
            res.json(responseData);

        }catch(newUserInfo) {

            console.log('err');

        };

    });

});

router.post('/use/login',function (req,res,next) {

    let username = req.body.username;
    let password = req.body.password;

    if(username === '' || password === '') {

        responseData.code = 1;
        responseData.messages = '输入框不能为空';
        res.json(responseData);

    };

    User.findOne({

        username: username,
        password: password

    }).then(function(userInfo) {

        try {

            if(!userInfo){

                responseData.code = 2;
                responseData.messages = '该用户名不存在或密码错误';
                res.json(responseData);
                return;

            };

            responseData.messages = '登陆成功';
            responseData.info = {
                _id: userInfo._id,
                username: userInfo.username
            };
            req.cookies.set( 'userInfo',JSON.stringify({
                _id: userInfo._id,
                username: userInfo.username
            }) );
            res.json(responseData);
            return

        }catch(userInfo) {

            console.log('err');

        }

    })

})

router.get('/use/logout',(req,res,next) => {

    req.cookies.set( 'userInfo',null );
    res.json(responseData);

});

/*
* 评论获取路由设置
* */
router.get('/comment',(req,res,next) => {

    Content.findOne({
        _id: req.query.contentId
    }).then( result => {

        responseData.content = result;
        res.json(responseData);

    } )

})

/*
* 评论更新路由设置
* */
router.post('/comment/post',(req,res,next) => {

    let commentData = {

        username: req.userInfo.username,
        commentTime: Date.now(),
        content: req.body.content

    };

    Content.findOne({
        _id: req.body.contentId
    }).then( result => {

        result.comment.push(commentData);
        return result.save();

    } ).then( newContent => {

        responseData.messages = '评论成功';
        responseData.content = newContent;
        res.json(responseData);

    } )

})

module.exports = router;