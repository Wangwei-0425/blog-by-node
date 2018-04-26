let express = require('express');
let router = express.Router();

let Category = require('../module/Category');
let Content = require('../module/Content');

let data;

router.use( (req,res,next) => {

    data = {
        userInfo: req.userInfo,
        categories: []
    };

    Category.find().then( result => {

        data.categories = result;
        next();

    } );

} )

router.get('/',(req,res,next) => {

    data.page = Number(req.query.page || 1);
    data.limit = 7;
    data.pages = 0;
    data.category = req.query.category || '';

    let where = {};

    if(data.category) {

        where.category = data.category;

    }
    Content.where(where).count().then(count => {

        data.count = count;
        data.pages = Math.ceil(data.count / data.limit) || 1;
        data.page = Math.max(data.page,1);
        data.page = Math.min(data.pages,data.page);

        let skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
            time: -1
        });

    }).then( (contents) => {

        data.contents = contents;

        res.render('main/index',data);

    } )

});

router.get('/view',(req,res,next) => {

    let contentId = req.query.contentId;

    Content.findOne({
        _id: contentId
    }).then( result => {

        result.views++;
        result.save();
        data.content = result;

        res.render('main/view',data)

    } )

})

module.exports = router