var optionObj = function(){
	var this_ = this;
	this.options = {
		hostUrl : "",
		hostImg:"",
		ajaxTimeout:3000,
		timeNum:60,
		timeBack:null,
		timeQuery:null,
		APPKEY:""
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
		$('#alert_box .modal-body p').html(msg);
		$('#alert_box').modal();
	}
	
	Date.prototype.Format = function (fmt) { //author: meizz 
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	
	this.do_checkLogin = function(callBack) {
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
	
	this.do_getUserId = function() {
		//校检火马登录
		var user = ClientAPI.getLoginXingYun();
		if(!user.hasOwnProperty("userId") || user.userId == 0) {
			//调起登陆窗
			ClientAPI.startLogin('VC_LOGIN');
			return;
		} else {
			return user.userId;
		}
	}
	
	//初始化方法
	this.init = function(options_) {
		this.options = $.extend({}, this.options, options_);
	}
}

//init
var initObj = new optionObj();
initObj.init({
	hostUrl : "http://10.149.4.7/",
	ajaxTimeout:3000,
	hostImg:"../../",
	timeNum:60,
	APPKEY:"58c106ee8b6bc8963cff8e72"
})

var actionFun = new ACTIONFUN(initObj);
//设置绑定事件
actionFun.eventElement();
//初始化云吧弹幕
actionFun.yunbaInit();
//初始化方法
actionFun.init();
//返回方法
function goBack() {
	
}

