
let page = 3;
let pages = 1;
let limit = 3;
let comment = [];

//页面加载后渲染文章评论
$.ajax({

    type: 'get',
    url: '/api/comment',
    data: {
        contentId: $('#contentId').val()
    },
    success: function (result) {

        comment = result.content.comment.reverse()

        renderComment();

    }

})

// 提交评论更新
$('#messageBtn').on('click',function(){

    $.ajax({

        type: 'post',
        url: '/api/comment/post',
        data: {

            contentId: $('#contentId').val(),
            content: $('#messageContent').val()

        },
        success: function (result) {

            alert(result.messages);
            $('#messageContent').val('');

            comment = result.content.comment.reverse()

            renderComment();

        }

    })

});

$('.pager').delegate('a', 'click', function() {
    if ($(this).parent().hasClass('previous')) {
        page--;
    } else {
        page++;
    }
    renderComment();
});

//时间戳转换
function renderComment() {

    pages = Math.max(Math.ceil(comment.length / limit), 1);
    var start = Math.max(0, (page-1) * limit);
    var end = Math.min(start + limit, comment.length);

    var $lis = $('.pager li');
    $lis.eq(1).html( page + ' / ' +  pages);

    if (page <= 1) {
        page = 1;
        $lis.eq(0).html('<span>没有上一页了</span>');
    } else {
        $lis.eq(0).html('<a href="javascript:;">上一页</a>');
    }
    if (page >= pages) {
        page = pages;
        $lis.eq(2).html('<span>没有下一页了</span>');
    } else {
        $lis.eq(2).html('<a href="javascript:;">下一页</a>');
    }

    if (comment.length === 0) {
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
    } else {
        var html = '';
        for(let i=start; i<end; i++) {

            html += '<div class="messageBox">\n' +
                '    <p class="name clear">' +
                '<span class="fl">' + comment[i].username + '</span>' +
                '<span class="fr">' + getMyDate(comment[i].commentTime) + '</span>' +
                '</p>' +
                '<p>' + comment[i].content + '</p>\n' +
                '    </div>';

        }

        $('.messageList').html(html);
    }

};

//补零
function getMyDate(str){

    let oDate = new Date(str);
    let oYear = oDate.getFullYear();
    let oMonth = oDate.getMonth()+1;
    let oDay = oDate.getDate();
    let oHour = oDate.getHours();
    let oMin = oDate.getMinutes();
    let oSen = oDate.getSeconds();
    let oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);

    return oTime;

};

function getzf(num){

    if(parseInt(num) < 10){
        num = '0'+num;
    }

    return num;

}

