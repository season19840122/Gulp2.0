var optionObj = function(){
	var this_ = this;
	this.options = {
		hostUrl : "",
		hostImg:"",
		ajaxTimeout:3000,
		barId:"",
		payObj : {
			timeNum : 300,//倒计时时间
			timeQuery:"",//轮训查询支付
			timeBack:"",//轮训倒计时
			orderId:""//订单id
		}
	}
	
	this.url_checkChallengeMatchUserState = function(gameId) {
		return ;
	}
	
	//js小数相乘
	this.accMul = function(arg1,arg2) {
		var m=0,s1=arg1.toString(),s2=arg2.toString();
		try{m+=s1.split(".")[1].length}catch(e){}
		try{m+=s2.split(".")[1].length}catch(e){}
		return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
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
				this_.alertMsg(obj.name+"调用异常");
			}
		});
	}
	
	//公用弹出框
	this.alertMsg = function(msg) {
		$('.award_box').hide();
		$('.status_box h1').hide();
		$('.status_box h2').html(msg).show();
		$('.status_box').show();
	}
	
	//初始化方法
	this.init = function(options_) {
		this.options = $.extend({}, this.options, options_);
	}
}

//init
var initObj = new optionObj();
initObj.init({
	hostUrl : "https://client.huoma.cn/",
	ajaxTimeout:3000,
	hostImg:"../../",
	barId:11233
})

var actionFun = new ACTIONFUN(initObj);
//设置绑定事件
actionFun.eventElement();
//获取时间段列表
actionFun.do_getMelee();
//积分商城
function goVip() {
	
}
//查看达成分数
function goCnt() {
	
}
