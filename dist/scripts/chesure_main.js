var optionObj = function(options_){
	var this_ = this;
	//公用配置参数
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
				this_.alertMsg({type:'msg',msg:obj.name+"调用异常"});
			}
		});
	}
	
	//公用弹出框
	this.alertMsg = function(obj) {
//		$('.prize_msg,.remind_msg').hide();
		//测试先用alert
		if(obj.type=="prize") {
//			$('.prize_msg img').attr('src',obj.awardObj.pic);
//			$('.prize_msg p').html(obj.awardObj.msg);
//			$('.prize_msg').show();
			alert(obj.msg);
		} else if(obj.type == "msg") {
//			$('.remind_msg').html(obj.msg).show();
			alert(obj.msg);
		}
		$('.alert_box').show();
	}	
	
	$.extend({}, this.options, options_);
}

//init
var initObj = new optionObj({
	hostUrl : "http://10.149.4.19:8090",
	ajaxTimeout:3000,
	hostImg:"../../"
});

//右边推荐与抽奖动画action
var actionFun1 = new ACTIONFUN1(initObj);

//测试显示动画
actionFun1.showChesure(true);
//测试设置轮播
actionFun1.do_rec();
//绑定进入vip方法
function goVip() {
	console.log("vip");
}

//返回
function goBack() {
	console.log("goBack");
}
