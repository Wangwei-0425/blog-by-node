$(function () {

    //获取注册id/登陆id
    let $loginBox = $('#loginBox');
    let $registerBox = $('#registerBox');
    let $userInfo = $('#userInfo');
    let $logout = $('#logout');

    //点击登陆下的a标签=>注册框显示
    $loginBox.find('a.colMint').on('click',function () {

        $loginBox.hide();
        $registerBox.show();

    });

    //点击注册下的a标签=>登陆框显示
    $registerBox.find('a.colMint').on('click',function () {

        $loginBox.show();
        $registerBox.hide();

    });

    //提交注册的Ajax请求
    $registerBox.find('button').on('click',function () {

        $.ajax({

            type: 'post',
            url: '/api/use/register',
            data: {

                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val(),
                repassword: $registerBox.find('[name="repassword"]').val()

            },
            dataType: 'json',
            success: function (result) {

                $registerBox.find('.colWarning').html(result.messages);

                if(!result.code) {

                    setTimeout(function() {

                        $registerBox.hide();
                        $loginBox.show();

                    },1000);

                }

            }

        });

    });

    //提交登陆的Ajax请求
    $loginBox.find('button').on('click',function () {

        $.ajax({

            type:'post',
            url: '/api/use/login',
            data: {

                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()

            },
            dataType: 'json',
            success: function(result) {

                if(!result.code) {

                    window.location.reload();

                };

                $loginBox.find('.colWarning').html(result.messages);

            }

        })

    })

    //提交退出Ajax请求
    $logout.on('click',() => {

        $.ajax({

            url: '/api/use/logout',
            success: (result) => {

                if(!result.code) {

                    window.location.reload();

                }

            }

        })

    })


});


















