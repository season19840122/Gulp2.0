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
	this.alertMsg = function(msg,data) {
		$('#alert_box .alert_title_h1').hide();
		$('#alert_box .success_box').hide();
		if(data) {
			$('#alert_box .success_box').show();
			$('#alert_box .success_box h3').html("本时段乱斗规则：<span>"+data.rule+"</span>。请在<span>"+data.calculateTime+"之前</span>完成一场"+data.gameTypeRemark+"模式的比赛！");
		} else {
			$('#alert_box .alert_title_h1').html(msg).show();
		}
		$('#alert_box').modal();
	}
	
	/**
	 * 挑战校检
	 * @param validateLoginOnly boolean类型,true只校检登陆；false校检等级限制，段位限制等
	 * @param meleeMatchTimesId
	 * @param levelLimitMin
	 * @param rankRemark
	 * @param callback 回调逻辑
	 */
	this.do_challengeValidate = function(gameIdList, callBack) {
		//校检火马登录
		var user = ClientAPI.getLoginXingYun();
		if(!user.hasOwnProperty("userId") || user.userId == 0) {
			//调起登陆窗
			ClientAPI.startLogin('VC_LOGIN');
			return;
		}
		//校检游戏登录
		if(gameIdList.length == 1){
			var loginGame = ClientAPI.getLoginGame(gameIdList[0]);
			if(!loginGame) {
				$("#alert_msg2 .alert_title_h1").html("<p>请先登录<span class='blue'>" + GameName.get(gameIdList[0]) + "</span>，才能报名参加比赛哦</p>");
				$("#alert_msg2").modal();
				$("#alert_msg2 .user_agreement").hide();
				$("#alert_msg2 .btn_sure").off("click").on("click", function() {
					$("#alert_msg2").modal("hide");
					//调起游戏登录
					ClientAPI.switchStartInfo(gameIdList[0], true);
				});
				return;
			}
		}else if(gameIdList.length > 1){
			if(!ClientAPI.getLoginGame(gameIdList[0]) && !ClientAPI.getLoginGame(gameIdList[1])){
				$("#alert_msg2 .alert_title_h1").html("<p>请先登录<span class='blue'>" + GameName.get(gameIdList[0])
					+ "或" + GameName.get(gameIdList[1]) + "</span>，才能报名参加比赛哦</p>");
				$("#alert_msg2").modal();
				$("#alert_msg2 .user_agreement").hide();
				$("#alert_msg2 .btn_sure").off("click").on("click", function() {
					$("#alert_msg2").modal("hide");
					//调起游戏登录
					ClientAPI.switchStartInfo(gameIdList[0], true);
				});
				return;
			}
		}else{
			//todo 暂未开放
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
	hostUrl : "https://client.huoma.cn/",
	ajaxTimeout:3000,
	hostImg:"../../",
	barId:11233,
	showApply:$('#showApply').val()
})

var actionFun = new ACTIONFUN(initObj);
//设置绑定事件
actionFun.eventElement();
//返回
function goBack() {
	
}
