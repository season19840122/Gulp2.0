var optionObj = function(){
	var this_ = this;
	this.options = {
		hostUrl : "",
		hostImg:"",
		ajaxTimeout:3000,
		qqLocation : "",
		joinStartTime:"",
		joinEndTime:"",
		hasApply : "",
		nowTime:""
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
	this.showMsg = function(msg,createFlag) {
		$('.alert_box').fadeIn(0);
		$('.alert_box .alert_content').show();
		$('.alert_box .alert_rule').hide();
		$('.alert_box .alert_content p').html(msg);
		$('.alert_box .alert_content .confirm,.alert_box .alert_content .create').hide();
		if(createFlag) {
			$('.alert_box .alert_content .create').show();
		} else {
			$('.alert_box .alert_content .confirm').show();
		}
	}
	
	//规则
	this.showRule = function() {
		$('.alert_box').fadeIn(0);
		$('.alert_box .alert_content').hide();
		$('.alert_box .alert_rule').show();
	}
	
	//关闭弹窗
	this.closeAlert = function() {
		$('.alert_box').fadeOut(0);
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
	
	this.getLolServerId = function() {
		var gameList =  ClientAPI.getLoginGameList();
		if(!gameList) return 0;
		var serverId = 0;
		gameList.map(function(v) {
			if(v.gameId == GameID.LOL) serverId = v.serverId;
		})
		return serverId;
	}
	
	//初始化方法
	this.init = function(options_) {
		this.options = $.extend({}, this.options, options_);
	}
}

//init
var initObj = new optionObj();
initObj.init({
	hostUrl : "http://10.149.4.12/",
	ajaxTimeout:3000,
	hostImg:"../../",
	joinStartTime:"2017-04-11 00:00:00",
	joinEndTime:"2017-04-16 23:59:59",
	hasApply: $('#hasApply').val(),
	nowTime: $('#now').val(),
	qqLocation : "http://shang.qq.com/wpa/qunwpa?idkey=f31841d4c16918449293ecdc19f34a879df28621f0aa23cdbf69bacf0ac753ac"
})

var actionFun = new ACTIONFUN(initObj);
//设置绑定事件
actionFun.eventElement();
//初始化状态
actionFun.initFun();
//返回首页
function goBack() {
	console.log(5);
}
