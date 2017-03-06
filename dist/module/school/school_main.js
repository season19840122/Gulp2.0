var optionObj = function(){
	var this_ = this;
	this.options = {
		hostUrl : "",
		hostImg:"",
		ajaxTimeout:3000
	}
	
	//通用ajax封装
	this.ajax_ = function(obj) {
		$.ajax({
			type: obj.type || 'POST',
			url: obj.url,
			dataType: obj.dataType || 'json',
			timeout: this_.options.ajaxTimeout,
			success: obj.success,
			error: obj.error || function() {//如果不传递error，调用公用异常提示
				this_.showMsg(obj.name+"调用异常");
			}
		});
	}
	
	//公用弹出框
	this.showMsg = function(msg) {
		$('.alert_box .choose').hide();
		$('.alert_box .msg').hide();
		if(msg) {
			$('.alert_box .msg').html(msg).show();
		} else {
			$('.alert_box .choose').show();
		}
		$('.alert_box').show();
	}
	
	//公用弹出框
	this.hideMsg = function() {
		$('.alert_box').hide();
	}
	
	this.do_challengeValidate = function(callBack) {
		//校检火马登录
		var user = ClientAPI.getLoginXingYun();
		if(!user.hasOwnProperty("userId") || user.userId == 0) {
			//调起登陆窗
			ClientAPI.startLogin('VC_LOGIN');
			return;
		}
		callBack();
		return;
	}
	
	//初始化方法
	this.init = function(options_) {
		this.options = $.extend({}, this.options, options_);
	}
}

//init
var initObj = new optionObj();
initObj.init({
	hostUrl : "http://192.168.104.5/",
	ajaxTimeout:3000,
	hostImg:"../../"
})

var actionFun = new ACTIONFUN(initObj);
//设置绑定事件
actionFun.eventElement();
//查询开始时间
actionFun.do_getTimes();
//查询学霸学渣
actionFun.do_getSchoolGuess();
initObj.do_challengeValidate(function() {
	//查询完成作业奖励
	actionFun.do_getSchoolDay();
	//查询周考小测试
	actionFun.do_getSchoolWeek();
})

//返回方法
function goBack() {
	
}

