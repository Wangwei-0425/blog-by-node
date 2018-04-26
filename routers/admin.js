let express = require('express');
let router = express.Router();

let Use = require('../module/User');
let Category = require('../module/Category');
let Content = require('../module/Content');

router.use( (req,res,next) => {

    if(!req.userInfo.isAdmin) {

        res.send('抱歉，你没有权限进行该操作，请联系管理员！！！');
        return;

    }
    next()

} )

router.get('/',(req,res,next) => {

    res.render('admin/index',{
        userInfo: req.userInfo
    });

});

/*
* 用户管理路由
* */

router.get('/users',(req,res,next) => {

    Use.count().then((count) => {

        let page = Number(req.query.page || 1);
        let limit = 15;
        let pages = Math.ceil(count / limit);

        page = Math.max(page,1);
        page = Math.min(pages,page);

        let skip = (page - 1) * limit;

        Use.find().limit(limit).skip(skip).then( (users) => {

            res.render('admin/users_index',{
                userInfo: req.userInfo,
                users: users,
                link: 'users',

                pages: pages,
                limit: limit,
                page: page,
                count: count
            });

        } );

    });

});

/*
* 分类管理路由
* */
router.get('/category',(req,res,next) => {

    Category.count().then((count) => {

        let page = Number(req.query.page || 1);
        let limit = 15;
        let pages = Math.ceil(count / limit) || 1;

        page = Math.max(page,1);
        page = Math.min(pages,page);

        let skip = (page - 1) * limit;

        Category.find().sort({_id: 1}).limit(limit).skip(skip).then( (Category) => {

            res.render('admin/category_index',{
                userInfo: req.userInfo,
                categories: Category,
                link: 'category',

                pages: pages,
                limit: limit,
                page: page,
                count: count
            });

        } );

    });

});

/*
* 分类添加路由
* */
router.get('/category/add',(req,res,next) => {

    res.render('admin/category_add',{
        userInfo: req.userInfo
    });

});

router.post('/category/add',(req,res,next) => {

    let categoryName = req.body.categoryName || '';
    let tipsInfo = {
        code: 0,
        messages: ''
    };

    if(categoryName.trim() === ''){

        tipsInfo.messages = '输入信息不能为空';

        res.render('admin/tipsPage',{

            userInfo: req.userInfo,
            tipsInfo: tipsInfo

        });

        return;

    };

    Category.findOne({
        categoryName: categoryName
    }).then( result => {

        if(result) {

            try {
                tipsInfo.messages = '添加分类已存在';

                res.render('admin/tipsPage',{

                    userInfo: req.userInfo,
                    tipsInfo: tipsInfo

                });

                return Promise.reject();

            }catch (e){}

        }else {

            return new Category({
                categoryName: categoryName
            }).save();

        }

    } ).then( result => {

        tipsInfo.code = 1;
        tipsInfo.messages = '保存成功！！！';
        tipsInfo.url = '/admin/category';

        res.render('admin/tipsPage',{

            userInfo: req.userInfo,
            tipsInfo: tipsInfo

        });

    } )

});

/*
* 分类操作-修改
* */
router.get('/category/edit',(req,res,next) => {

    let ID = req.query.id;

    Category.findOne({
        _id: ID
    }).then( result => {

        res.render('admin/category_edit',{

            userInfo: req.userInfo,
            categoryInfo: result

        });

    } )

});

router.post('/category/edit',(req,res,next) => {

    let ID = req.query.id || '';
    let edmitName = req.body.edmitName || '';

    let tipsInfo = {
        code: 0,
        messages: ''
    };

    if (edmitName.trim() === '') {

        tipsInfo.messages = '输入信息不能为空';
        res.render('admin/tipsPage',{

            userInfo: req.userInfo,
            tipsInfo: tipsInfo

        });

        return;

    }else{

        Category.findOne({
            _id: ID
        }).then( result => {

            if(edmitName === result.categoryName) {

                tipsInfo.code = 1;
                tipsInfo.messages = '保存成功';
                tipsInfo.url = '/admin/category';

                res.render('admin/tipsPage',{

                    userInfo: req.userInfo,
                    tipsInfo: tipsInfo

                });

                return Promise.reject();

            }else{

                return Category.findOne({
                    _id: {$ne: ID},
                    categoryName: edmitName
                });

            }

        } ).then( sameName => {

            if(sameName) {

                tipsInfo.messages = '有同名分类';
                res.render('admin/tipsPage',{

                    userInfo: req.userInfo,
                    tipsInfo: tipsInfo

                });

                return Promise.reject();

            }else{

                return Category.update({
                    _id: ID
                }, {
                    categoryName: edmitName
                });

            }

        } ).then( () => {

            tipsInfo.code = 1;
            tipsInfo.messages = '保存成功';
            tipsInfo.url = '/admin/category';

            res.render('admin/tipsPage',{

                userInfo: req.userInfo,
                tipsInfo: tipsInfo

            });

        } )

    }

})

/*
* 分类操作-删除
* */
router.get('/category/delete',(req,res,next) => {

    let ID = req.query.id || '';
    let tipsInfo = {
        code: 0,
        messages: '',
        url: ''
    };

    Category.remove({
        _id: ID
    }).then( result => {

        tipsInfo.code = 1;
        tipsInfo.messages = '删除成功';
        tipsInfo.url = '/admin/category';

        res.render('admin/tipsPage',{

            userInfo: req.userInfo,
            tipsInfo: tipsInfo

        });

    } )

});

/*
* 文章路由管理
* */
router.get('/content',(req,res,next) => {

    let page = Number(req.query.page || 1);
    let limit = 10;
    let pages = 0;

    Content.count().then((count) => {

        pages = Math.ceil(count / limit) || 1;
        page = Math.max(page,1);
        page = Math.min(pages,page);

        let skip = (page - 1) * limit;

        Content.find().limit(limit).skip(skip).populate(['category','user']).sort({
            time: -1
        }).then( (result) => {

            res.render('admin/content_index',{
                userInfo: req.userInfo,
                contents: result,
                link: 'content',

                pages: pages,
                limit: limit,
                page: page,
                count: count
            });

        } ).catch( result => {

            console.log(result)

        } );

    });

});

/*
* 文章添加
* */
router.get('/content/add',(req,res,next) => {

    Category.find().then( result => {

        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categories: result
        })

    } )

});

router.post('/content/add',(req,res,next) => {

    let tipsInfo = {
        code: 0,
        messages: '',
        url: ''
    };

    if( !req.body.title.trim() ) {

        tipsInfo.messages = '标题不能为空';
        res.render('admin/tipsPage',{
            userInfo: req.userInfo,
            tipsInfo: tipsInfo
        })

        return;

    };

    new Content({

        category: req.body.category,
        title: req.body.title,
        about: req.body.about,
        contents: req.body.contents,
        user: req.userInfo._id.toString(),
        time: Date.now()

    }).save().then( result => {

        tipsInfo.code = 1;
        tipsInfo.messages = '保存成功';
        tipsInfo.url = '/admin/content'
        res.render('admin/tipsPage',{
            userInfo: req.userInfo,
            tipsInfo: tipsInfo
        });

    } );

});

/*
* 文章操作-修改
* */
router.get('/content/edit',(req,res,next) => {

    let ID = req.query.id || '';
    let categories = [];

    Category.find().sort({_id: -1}).then( result => {

        categories = result;

        return Content.findOne({
            _id: ID
        }).populate(['category','user'])

    } ).then( result => {

        console.log(result)

        res.render('admin/content_edit',{

            userInfo: req.userInfo,
            contents: result,
            categories: categories

        })

    } )

});

router.post('/content/edit',(req,res,next) => {

    let ID = req.query.id;
    let Title = req.body.title || '';
    let tipsInfo = {
        code: 0,
        messages: '',
        url: ''
    };

    if(!Title) {

        tipsInfo.messages = '标题不能为空';
        res.render('admin/tipsPage',{

            userInfo: req.userInfo,
            tipsInfo: tipsInfo

        });

        return;

    };

    Content.update({
        _id: ID
    },{
        category: req.body.category,
        title: req.body.title,
        about: req.body.about,
        contents: req.body.contents
    }).then( result => {

        tipsInfo.code = 1;
        tipsInfo.messages = '修改成功';
        tipsInfo.url = '/admin/content'
        res.render('admin/tipsPage',{
            userInfo: req.userInfo,
            tipsInfo: tipsInfo
        });

    } )

});

/*
* 文章操作-删除
* */
router.get('/content/delete',(req,res,next) => {

    let ID = req.query.id;
    let tipsInfo = {
        code: 0,
        messages: '',
        url: ''
    };

    Content.remove({
        _id: ID
    }).then( result => {

        tipsInfo.code = 1;
        tipsInfo.messages = '删除成功';
        tipsInfo.url = '/admin/content'
        res.render('admin/tipsPage',{
            userInfo: req.userInfo,
            tipsInfo: tipsInfo
        })

    } )

})

module.exports = router;