var ACTIONFUN = function(initObj) {
	var this_ = this;
	var FAILMSG = "调用失败";
	var titleAgain = "";
	var now_period = "";
	var now_applyCnt = "";
	var now_account = "";
	var timeAllNum = 0;
	var timeScrollNum = 0;
	var isShunHover = true;
	
	var actionObj = {
		getMelee : {
			name:"获取时间段详情",
			url: function() {
				return initObj.options.hostUrl+"melee/getPanelMeleeInfo?gameId="+initObj.options.gameId;
			}
		},
		listRecords : {
			name:"获取达成奖励名单",
			url: function() {
				return initObj.options.hostUrl+"melee/listMeleeUserAchieveRecords";
			}
		},
		getPayWay : {
			name:"获取支付方式",
			url: function() {
				return initObj.options.hostUrl+"meleeApply/getPayWay?barId="+initObj.options.barId+
				"&gameId="+initObj.options.gameId+
				"&meleePeriod="+now_period+
				"&playerAccount="+now_account+
				"&applyCnt="+now_applyCnt;
			}
		},
		pay : {
			name:"支付",
			url: function(orderId) {
				return initObj.options.hostUrl+"meleeApply/pay?barId="+initObj.options.barId+
				"&gameId="+initObj.options.gameId+
				"&meleePeriod="+now_period+
				"&playerAccount="+now_account+
				"&applyCnt="+now_applyCnt+
				"&orderId="+orderId
			}
		},
		payStatus : {
			name:"支付查询",
			url: function(orderId) {
				return initObj.options.hostUrl+"recharge/payFinished?orderId="+orderId;
			}
		}
	}
	
	this.eventElement = function() {
		$(function(){
			//绑定二维码返回事件
			$('.ld .qrcode_box .back').on('click',function() {
				closeQrcode();
				//重新绑定支付
				$('.content_bottom .award_box li').off('click');
				$('.content_bottom .award_box li').one('click',function(){
					now_applyCnt = $(this).attr('data-value');
					do_getPayWay();
				})
			})
			
			//绑定关闭事件
			$('.ld > i').on('click',function() {
				ClientAPI.closeWebWnd();
			})
			
			//绑定刷新按钮
			$('#flush').on('click',function() {
				var hostUrl = location.href;
				if(hostUrl.indexOf('showApply') != -1) {
					hostUrl = hostUrl.replace('showApply','a');
				}
				location.replace(hostUrl);
			})
			
			//开启规则
			$('.ld .title h2').on('click','span',function() {
				$('.rules_box').show();
			})
			//关闭规则
			$('.rules_box i').on('click',function() {
				$('.rules_box').hide();
			})
			
			
			//跳转积分商城
			$('.status_box h3').on('click',function() {
				goVip();
			})
			
			//点击去查看
			$('.content_box .cnt .green').on('click',function() {
				goCnt();
			})
			
		})
	}
	
	//获取时间段详情
	this.do_getMelee = function() {
		initObj.ajax_({
			name:actionObj.getMelee.name,
			url: actionObj.getMelee.url(GameID.M3GUO),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					$('.ld .title,.ld .ld_content').show();
					var data = obj['data'];
					setInfo(data);
				} else if(!obj['success']) {
					ClientAPI.closeWebWnd();
				}
			}
		});
	}
	
	var setInfo = function(obj) {
		$('.title h1').html(obj.ruleTitle);
		$('.title h2').html("<span>规则</span> "+obj.ruleSubTitle+"的玩家平分奖池");
		$('.title h3 div').html("“"+obj.gameTypeRemark+"“");
		$('.content_box .cnt .calculateTime').html(obj.calculateTime+" 结算");
		$('.content_box .cnt .green').html(obj.achieveCnt);
		$('.content_box .content_top>span').html(obj.rewardPool);
		
		$('.rules_box p').eq(1).html("1、本时段乱斗规则为：<span>"+obj.ruleSubTitle+"</span>，"+obj.ruleDetail);
		var rule3 = "3、玩家需在"+obj.calculateTime+"之前完成"+GameName.get(GameID.M3GUO)+"的游戏，"+obj.gameTypeRemark+"，"+(obj.allowTeam?"允许组队；":"不允许组队；")+"</span>";
		$('.rules_box p').eq(3).html(rule3);
		
		var state = obj.state;//时间段0, "未开始"；1, "进行中";2, "已结束";3, "禁止报名";
		var hasUserApply = obj.hasUserApply;//用户是否报名
		var hasUserGameFinished = obj.hasUserGameFinished;//用户是否完成游戏
		var hasUserCalculated = obj.hasUserCalculated;//游戏是否结算
		var hasUserAchieved = obj.hasUserAchieved;//是否达成目标
		
		
		var $boxApply = $('.content_box .content_bottom');
		var $boxStatus = $('.content_box .status_box');
		var $award = $('.content_box .award_box');
		$boxApply.hide();$boxStatus.hide();
		//status1 时段未开始(提示开始时间)
		if(state == 0) {
		}
		
		//status2 时段进行中/已报名/游戏未完成（提示已报名）
		if(state == 1 && hasUserApply && !hasUserGameFinished) {
			$boxApply.show();
			$boxStatus.show();
			$award.hide();
			return;
		}
		
		//status3 时段进行中/已报名/游戏已完成||时段进行中/未报名 （提示立即报名）
		if((state == 1 && hasUserApply && hasUserGameFinished) || (state == 1 && !hasUserApply)) {
			$boxApply.show();
			
			var liArr = new Array();
			for(var i = 0;i<4;i++) {
				var liObj = {};
				if(i == 0) {
					liObj.bean = obj.applySwBean;
					liObj.money = obj.applyMoney;
					liObj.className = obj.limitEachCnt >= 1?'on':'off';
					liObj.tip = obj.limitEachCnt >= 1?'':'本期乱斗无效';
				} else if(i == 1) {
					liObj.bean = obj.applySwBean*5;
					liObj.money = obj.applyMoney*5;
					liObj.className = obj.limitEachCnt >= 5?'on':'off';
					liObj.tip = obj.limitEachCnt >= 5?'':'本期乱斗无效';
				} else if(i == 2) {
					liObj.bean = obj.applySwBean*10;
					liObj.money = obj.applyMoney*10;
					liObj.className = obj.limitEachCnt >= 10?'on':'off';
					liObj.tip = obj.limitEachCnt >= 10?'':'本期乱斗无效';
				} else if(i == 3) {
					liObj.bean = obj.applySwBean*20;
					liObj.money = obj.applyMoney*20;
					liObj.className = obj.limitEachCnt >= 20?'on':'off';
					liObj.tip = obj.limitEachCnt >= 20?'':'本期乱斗无效';
				}
				liArr.push(liObj);
			}
			if(obj.applySwBean == 0) {
				isShunHover = false;
				liArr.map(function(v,index) {
					$('.award_box li').eq(index).addClass(v.className).find('h3').html("￥"+v.money);
					$('.award_box li').eq(index).attr('title',v.tip);
				})
			} else {
				isShunHover = true;
				liArr.map(function(v,index) {
					$('.award_box li').eq(index).addClass(v.className).find('h2').html(v.bean);
					$('.award_box li').eq(index).attr('title',v.tip);
				})
			}
			
			now_period = obj.period;
			var accountList =  ClientAPI.getLoginGameList();
			
			accountList.map(function(v) {
				if(v.gameId == initObj.options.gameId) now_account = v.subAccount;
			})
			
			//点击报名
			$('.content_bottom .award_box li.on').one('click',function(){
				now_applyCnt = $(this).attr('data-value');
				do_getPayWay();
			})
			
			//顺豆支付绑定hover
			$('.content_bottom .award_box li.on').hover(function(){
				$(this).find('h1,h2,h3').hide();
				if(isShunHover) {
					$(this).find('h2').show();
				} else {
					$(this).find('h3').show();
				}
			},function(){
				$(this).find('h1,h2,h3').hide();
				$(this).find('h1').show();
			})
			return;
		}
		
		//status4 时段已结束/已结算/达成目标 （提示以达成目标和获得的奖励）
		if(state == 2 && hasUserCalculated && hasUserAchieved) {
		}
		
		//status4 时段已结束/已结算/未达成目标 （提示已结束）
		if(state == 2 && hasUserCalculated && !hasUserAchieved) {
		}
		
		//status5 时段已结束/未结算 （提示报名结束，附加结算时间）
		if(state == 2 && !hasUserCalculated) {
		}
		
		//status6 时段禁止报名 （提示禁止报名）
		if(state == 3) {
		}
	}
	
	//获取支付方式
	var do_getPayWay = function() {
		initObj.ajax_({
			name:actionObj.getPayWay.name,
			url: actionObj.getPayWay.url(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'];
					alertAll(data);
				} else if(!obj['success']) {
					initObj.alertMsg(obj['message']);
				}
			}
		});
	}
	
	//去支付
	var do_pay = function(orderId) {
		initObj.ajax_({
			name:actionObj.pay.name,
			url: actionObj.pay.url(orderId),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					closeQrcode();
					$('.award_box').hide();
					$('.status_box h1').show();
					$('.status_box h2').hide();
					$('.status_box').show();
				} else if(!obj['success']) {
					initObj.alertMsg(obj['message']);
				}
			}
		});
	}
	
	//查询支付
	var do_payFinished = function() {
		initObj.ajax_({
			name:actionObj.payStatus.name,
			url: actionObj.payStatus.url(initObj.options.payObj.orderId),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					do_pay(initObj.options.payObj.orderId);
				}
			}
		});
	}
	
	//扫码倒计时
	var qrcodeTimeBack = function() {
		initObj.options.payObj.timeNum--;
		initObj.options.payObj.timeBack = setTimeout(function() {
			if(initObj.options.payObj.timeNum <= 0) {
				closeQrcode();
				return;
			}
			qrcodeTimeBack();
		}, 1000);
	}
	
	//关闭二维码框处理事件
	var closeQrcode = function() {
		clearInterval(initObj.options.payObj.timeQuery);
		clearTimeout(initObj.options.payObj.timeBack);
		initObj.options.payObj.timeNum = 300;
		var $dom = $('.ld_content');
		$dom.find('.qrcode_box').hide();
		$dom.find('.content_box').show();
	}
	
	var alertAll = function(objArr) {
		var $dom = $('.ld_content');
		$dom.find('.qrcode_box').hide();
		$dom.find('.content_box').hide();
		var qrcodeObj = objArr.length<2?(objArr[0].applyWay == "Qrcode"?objArr[0]:{}):(objArr[0].applyWay == "Qrcode"?objArr[0]:objArr[1]),
			shunObj = objArr.length<2?(objArr[0].applyWay == "SwBean"?objArr[0]:{}):(objArr[0].applyWay == "SwBean"?objArr[0]:objArr[1]);
		if(objArr[0].applyWay == "SwBean" && objArr[0].swbean > 0) {//顺豆足够
			$dom.find('.content_box').show();
			do_pay("");
		} else {//展示二维码
			initQrcode();
		}
		
		function initQrcode() {
			$dom.find('.qrcode_box h1').html("本场报名费：￥"+qrcodeObj.money);
			$dom.find('.qrcode_box .alert_img_qrcode').empty().qrcode({width: 90,height: 90,text: qrcodeObj.qrcodeUrl,render:"canvas",correctLevel:1});
			initObj.options.payObj.orderId = qrcodeObj.orderId;
			$dom.find('.qrcode_box').show();
			qrcodeTimeBack();
			//轮训查询支付状态
			initObj.options.payObj.timeQuery = setInterval(function() {
				do_payFinished();
			}, 7000);
		}
	}
	
	
	//测试调用
	var ClientAPI = {
		getSubAccount:function(str) {
			return 1111111;
		},
		getLoginXingYun:function(str) {
			return true;
		},
		getLoginGameList: function() {
			return [
				{gameId: 13216, account:"28839943", subAccount:"2561_28839943", serverId:"2561", serverName:"黑色玫瑰", playerName:"只吃肉的和尚", headId:"15", level:"30",rank:""}, 
				{gameId: 17049, account:"699403830",subAccount:"4865_23232312",serverId:"2561", serverName:"诺克萨斯", playerName:"你妹啊", headId:"15", level:"30",rank:""}
			];
		}
	}
	var GameID = {
		//英雄联盟
		LOL : 13216,
		//梦三国
		M3GUO : 17049,
		//炉石传说
		HearthStone : 16302,
		//守望先锋
		Overwatch : 17673,
		//守望先锋免费试玩
		OverwatchTrial : 17674,
		//战舰世界
		WorldOfWarships : 17071,
		//坦克世界
		WorldOfTanks : 14437,
		//魔幻英雄
		Strife : 16482,
		//300英雄
		Hero300 : 17055
	}
	
	var GameName = {
		get : function(gameId){
			if(GameID.LOL == gameId){
				return "英雄联盟";
			}else if(GameID.M3GUO == gameId){
				return "梦三国2";
			}else if(GameID.WorldOfTanks == gameId){
				return "坦克世界";
			}else if(GameID.Overwatch == gameId){
				return "守望先锋";
			}else if(GameID.OverwatchTrial == gameId){
				return "守望先锋免费试玩";
			}else if(GameID.Strife == gameId){
				return "魔幻英雄";
			}else if(GameID.Hero300 == gameId){
				return "300英雄";
			}
			return "";
		}
	}
}