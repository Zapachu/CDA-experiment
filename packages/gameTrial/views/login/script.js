function LoginInit (_csrf, __rootname, lanCtrlObj, cb) {  //登录组件引用了模态框组件Modal   cb为登录成功后的回调函数
    // if (!_csrf || !lanCtrlObj) {
    //     throw new Error('invalid parameter')
    // }
    // TODO
    var modalOptions = {
        maskCloseable: true,
        onClose: function () {
            loginType = ''
        }
    }
    var loginModal = Modal('.loginBox', modalOptions)
    var loginType = ''
    var mobileLoginStep = 1
    var postAreaCode = 86

    var contentBoxEle = $('.loginBox .content')
    var mobileBoxEle = $('.loginByMobile .item:nth-child(1)')
    var validateCodeBoxEle = $('.loginByMobile .item:nth-child(2)')
    var resendBtnEle = $('.loginByMobile .resendBtn')
    var submitBtnEle = $('.loginByMobile .submitBtn')
    var nextBtnEle = $('.loginByMobile .nextBtn')
    var mobileInputEle = $(".loginByMobile .mobileValue")
    var codeInputEle = $(".loginByMobile .codeValue")
    var acceptTerms = $('.loginByMobile .acceptTerms')

    // var langEnums = lanCtrlObj.langEnums // TODO
    var loginRequest = function () {
        var startTime, stopTime, wechatScanSigninPending;
        startTime = (new Date()).getTime() / 1000;
        stopTime = startTime + 100;
        wechatScanSigninPending = function () {
            return $.post('/wxopen/logincheck', {_csrf: _csrf}).done(function (result) {
                if (loginType !== 'wx')
                    return;
                var now = (new Date()).getTime() / 1000;
                if (result.code === 0) {
                    if (cb) {
                        return cb()
                    }
                    var redirectUrl = result.redirect || __rootname+'/org/home'; //TODO hardcode
                    window.location.href = redirectUrl
                    return;
                }
                if (now < stopTime) {
                    return setTimeout(wechatScanSigninPending, 100);
                }
            }).fail(function () {
                if (loginType !== 'wx')
                    return;
                var now = (new Date()).getTime() / 1000;
                stopTime = stopTime - 10;
                if (now < stopTime) {
                    return setTimeout(wechatScanSigninPending, 100);
                }
            });
        };
        wechatScanSigninPending();
    };

    function showWxLogin() {
        hideMobileLogin()
        var loadingEle = $('.loginByWx .loading')
        var qrcodeEle = $('.loginByWx img')
        $('.loginByWx').show()
        loadingEle.show()
        qrcodeEle.hide()
        $('.loginBox .tab .active').removeClass('active')
        $('.loginBox .tab .wx').addClass('active')
        loginType = 'wx'
        $.ajax({
            type: 'GET',
            url: '/wxopen/loginqrcode',
            success: function (data) {
                if (loginType !== 'wx') {
                    return
                }
                if (data.code === 0) {
                    loadingEle.hide();
                    qrcodeEle.attr('src', data.url).show();
                    setTimeout(loginRequest, 100);
                }
            }
        });
    }
    function showMobileLogin() {
        hideWxLogin()
        $('.loginByMobile').show()
        $('.loginBox .tab .active').removeClass('active')
        $('.loginBox .tab .mobile').addClass('active')
        loginType = 'mobile'
        postAreaCode = 86
        renderStep1()
    }
    function hideWxLogin() {
        loginType = ''
        $('.loginByWx').hide()
    }
    function hideMobileLogin() {
        loginType = ''
        $('.loginByMobile').hide()
    }
    function setSelectedAreaCode (code) {
        postAreaCode = code
        $('.loginByMobile .areaCode .value').text('+' + code)
    }

    function updateResendTime (time) {
        if (time < 0 ) {
            resendBtnEle.removeClass('disabledBtn')
            resendBtnEle.children('.timeValue').hide()
            resendBtnEle.children('.second').hide()
            return
        }
        $('.loginByMobile .resendBtn .timeValue').text('(' + time + ')')
        setTimeout(updateResendTime.bind(null, time - 1), 1000)
    }

    function startCountDown() {
        resendBtnEle.children('.timeValue').show()
        resendBtnEle.children('.second').show()
        updateResendTime(300)
    }
    function renderStep1 () {
        mobileLoginStep = 1
        $('.loginBox .loginByMobile .selector').hide()
        setSelectedAreaCode(postAreaCode)
        validateCodeBoxEle.hide()
        submitBtnEle.hide()
        nextBtnEle.show()
        acceptTerms.show()
        mobileBoxEle.children('.errMsg').remove()
        mobileInputEle.val('')
    }
    function renderStep2 () {
        mobileLoginStep = 2
        startCountDown()
        validateCodeBoxEle.fadeIn(400)
        resendBtnEle.addClass('disabledBtn')
        nextBtnEle.hide()
        submitBtnEle.show()
        acceptTerms.hide()
        codeInputEle.val('')
    }

    function renderErrorMsg (sibling, msg) {
        var find = $(sibling).siblings('.errMsg')
        if (find.length) {
            find.text(msg)
            return
        }
        $(sibling).after(
            '<div class="errMsg">' +
            msg +
            '</div>'
        )
    }
    function submitFunc () {
        var code = codeInputEle.val(),
            mobile = mobileInputEle.val(),
            areaCode = postAreaCode,
            submitData = {_csrf: _csrf, code: code, mobile: mobile, areaCode: areaCode}
        $.ajax({
            type: 'POST',
            url: __rootname+'/account/login',
            data: submitData,
            success: function (data) {
                if (loginType !== 'mobile')
                    return;
                if (data.code === 0) {
                    if (cb) {
                        return cb()
                    }
                    window.location.href = data.returnTo || '/';
                }
                if (data.code !== 0) {
                    renderErrorMsg('.loginByMobile .item .code', data.msg || '未知错误')
                }
            }
        });
    }

    function getCode () {
        var areaCode = postAreaCode,
            mobile = mobileInputEle.val(),
            queryStr = '?mobile=' + mobile + '&areaCode=' + areaCode
        $.ajax({
            type: 'GET',
            url: '/account/login/code' + queryStr,
            success: function (data) {
                if (loginType !== 'mobile')
                    return;
                if (data.code !== 0) {
                    var errMsgSibling = mobileLoginStep === 1 ? '.loginByMobile .item .mobile' : '.loginByMobile .item .code'
                    renderErrorMsg(errMsgSibling, data.msg || '未知错误')
                    return;
                }
                renderStep2()
            }
        });
    }

    $('.loginBox .close').click(loginModal.close)
    $('.loginBox .tab > .tabPane').click(function () {
        var tabType = $(this).attr('data-type')
        if (tabType === loginType) {
            return
        }
        loginType = tabType
        loginType === 'wx' ? showWxLogin() : showMobileLogin()
    })

    $('.loginByMobile .areaCode').click(function (e) {
        $('.loginBox .loginByMobile .selector').show()
        e.stopPropagation()
    })
    contentBoxEle.click(function () {
        $('.loginBox .loginByMobile .selector').hide()
    })
    $(window).click(function () {
        $('.loginBox .loginByMobile .selector').hide()

    })
    $('.loginByMobile .selectItem').click(function (e) {
        var areaCode = $(this).attr('data-code')
        setSelectedAreaCode(areaCode)
        $('.loginBox .loginByMobile .selector').hide()
        if (mobileLoginStep === 2) {
            renderStep1()
        }
        e.stopPropagation()
    })


    $('.loginByMobile .mobile .mobileValue').keyup(function () {
        $('.loginByMobile .mobile').siblings('.errMsg').remove()
    })
    $('.loginByMobile .code .codeValue').keyup(function () {
        $('.loginByMobile .code').siblings('.errMsg').remove()
    })
    mobileInputEle.keyup(function () {
        if (mobileLoginStep === 2) {
            renderStep1()
        }
    })


    nextBtnEle.click(function () {
        getCode()
    })

    submitBtnEle.click(function () {
        submitFunc()
    })
    resendBtnEle.click(function () {
        if ($(this).hasClass('disabledBtn')) {
            return
        }
        getCode()
    })
    $('.loginByMobile .termsLink').click(function () {
        window.open('/terms')
    })
    return {
        show: function (e) {
            loginModal.open(e)
            $('.loginBox .tab > *').show()
            $('.loginBox .tab > .tabPane.login').hide()
            showWxLogin()
            return
            // TODO
            var nowLangType = lanCtrlObj.getNowLangType()
            loginModal.open(e)
            if (nowLangType === langEnums.english) {
                $('.loginBox .tab > *').hide()
                $('.loginBox .tab > .tabPane.login').show()
                showMobileLogin()
            } else {
                $('.loginBox .tab > *').show()
                $('.loginBox .tab > .tabPane.login').hide()
                showWxLogin()
            }
        },
        hidden: function (e) {
            loginType = ''
            loginModal.close(e)
        }
    }
}

