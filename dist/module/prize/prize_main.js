var optionObj = function(){
	this.options = {
		hostUrl : "",
		hostImg:"",
		ajaxTimeout:1
	}
	//初始化方法
	this.init = function(options_) {
		this.options = $.extend({}, this.options, options_);
	}
}

//init
var initObj = new optionObj();
initObj.init({
	hostUrl : "http://10.149.4.19:8090",
	ajaxTimeout:3000,
	hostImg:"../../"
})

var actionFun = new ACTIONFUN(initObj);
//设置绑定事件
actionFun.eventElement();
//查询按钮状态
actionFun.go_btn();
//获取奖品列表
actionFun.do_awardProduct();
//获取我的奖品
actionFun.do_myAward();
//获取获奖记录
actionFun.do_awardLog();
//绑定进入vip方法
function goVip() {
	console.log("vip");
}

//返回
function goBack() {
	console.log("goBack");
}
