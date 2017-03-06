var detailObj = function(){
	var this_ = this;
	this.options = {
		hostUrl : "",
		hostImg:"",
		barId : 1111,
		playerAccount : 254332471,
		challengeMatchId : 10,
		needShowRecord : "",
		needShowRules : "",
		matchType : "",
		limitApply:"",
		payObj : {
			timeNum : 300,//倒计时时间
			timeQuery:"",//轮训查询支付
			timeBack:"",//轮训倒计时
			orderId:"",//订单id
			challengeLevelId:""//场次id
		},
		challengeStatus:{
			isLogin : "",//用户是否已登录
			matchType : "",//挑战赛类型
			allowTeam : "",//是否允许组队
			limitMinute : "",//时间限制
			levelLimitMin : "",//等级限制（0：无限制；30:满30级）
			levelLimitMax : "",//等级限制（0：无限制；30:满30级）
			rankRemark : ""//段位限制
		},
		levelLimitInfoObj:{},
		haoTime :"",
		haoFlag : true,
		ajaxTimeout:3000,
		interval : 1000,
		timeBackInte:""
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
				this_.errorMsg(obj.name+"调用异常");
			}
		});
	}
	
	this.errorMsg = function(msg) {
		$('#alert_msg .alert_title_h1').html(msg);
		$('#alert_msg').modal();
	}
	
	//初始化方法
	this.init = function(options_) {
		this.options = $.extend({}, this.options, options_);
	}
}

//init
var initObj = new detailObj();
initObj.init({
	hostUrl : "https://client.huoma.cn/",
	barId : 1111,
	playerAccount : 254332471,
	challengeMatchId : $('#challengeMatchId').val() || 44,
	needShowRecord : $('#needShowRecord').val(),
	needShowRules : $('#needShowRules').val(),
	matchType : $('#matchType').val() || 1,
	ajaxTimeout:3000,
	hostImg:""
})

var actionFun = new ACTIONFUN(initObj);
var domFun = new DOMFUN(initObj,actionFun);
//初始化绑定
domFun.eventElement();
//设置图片
actionFun.setTitle();
//查询挑战赛状态，用于登录判断等
actionFun.do_queryChallengeMatchState();
//设置title
actionFun.do_getAllChallengeMatchInfo();
//展示纪录和规则
actionFun.showChallengeRulesList();
//获取用户信息
actionFun.getUserInfo();
//获取场次列表
actionFun.do_etChallengeLevelInfo();
//暴露页面元素绑定的方法
var checkRoom =  actionFun.checkRoom;
//绑定开始游戏方法
function startGame() {
	console.log("开始游戏");
}

//绑定进入vip方法
function goVip() {
	console.log("vip");
}
