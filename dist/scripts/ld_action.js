var ACTIONFUN = function(initObj) {
	var this_ = this;
	var FAILMSG = "调用失败";
	var titleAgain = "";
	var now_period = "";
	var now_applyCnt = "";
	var now_gameId = "";
	var now_account = "";
	var now_gameList = [];
	var timeAllNum = 0;
	var timeScrollNum = 0;
	
	var gameList = function(gameId) {
		if(gameId == 17049) {//meng3
			return "<div><img src='"+initObj.options.hostImg+"images/m3_logo.png''/>梦三国2</div>";
		} else if(gameId == 13216) {//lol
			return "<div><img src='"+initObj.options.hostImg+"images/lol_logo.png'/>英雄联盟</div>";
		}
	}
	
	var actionObj = {
		//获取时间段列表
		listMelee : {
			name:"获取时间段列表",
			url: function() {
				return initObj.options.hostUrl+"melee/listMeleePeriods";
			}
		},
		getMelee : {
			name:"获取时间段详情",
			url: function(period) {
				return initObj.options.hostUrl+"melee/getMeleePeriodInfo?meleePeriod="+period;
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
				"&gameId="+now_gameId+
				"&meleePeriod="+now_period+
				"&playerAccount="+now_account+
				"&applyCnt="+now_applyCnt;
			}
		},
		pay : {
			name:"支付",
			url: function(orderId) {
				return initObj.options.hostUrl+"meleeApply/pay?barId="+initObj.options.barId+
				"&gameId="+now_gameId+
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
			//timetitle
			$('.nav ul').on('click','li',function() {
				$(this).siblings('li').removeClass('active');
				$(this).addClass('active');
				now_period = $(this).attr('data-period');
				//防抖动
				clearTimeout(titleAgain);
				titleAgain = setTimeout(function() {
					this_.do_getMelee(now_period);
				},200)
			})

			//刷新
			$('.opt_refresh').on('click', function(e) {
				var hostUrl = location.href;
				if(hostUrl.indexOf('showApply') != -1) {
					hostUrl = hostUrl.replace('showApply','a');
				}
				if(hostUrl.indexOf('showEndList') != -1) {
					hostUrl = hostUrl.replace('showEndList','a');
				}
				location.replace(hostUrl);
			})
			
			//奖励份数点击展示列表
			$('.btn_box span').on('click',function() {
				this_.do_listRecords();
				$('#alert_records').modal();
			})
			
			//返回
			$('.back').on('click',function() {
				goBack();
			})
			
			//绑定报名
			$('.btn_box .btn_join').on('click','div',function() {
				initObj.do_challengeValidate(now_gameList,function() {
					$('#alert_join').modal();
				})
			})
			
			//点击去支付
			$('#alert_join').on('click','.btn_sure', function() {
				now_gameId = $('#alert_join input[name=gameId]').val();
				now_account = $('#alert_join input[name=subAccount]').val();
				do_getPayWay();
				$('#alert_join').modal('hide');
			});
			
			var isClickTab = true;
			//二维码支付关闭后停止查询
			$('#alert_all').on('hidden.bs.modal', function() {
				closeQrcode(false);
				$(this).find('.tab_title div[data_tab="tab1"]').show();
				$(this).find('.tab_title div[data_tab="tab2"]').show();
				isClickTab = true;
			});
			
			//提示框关闭
			$('#alert_box').on('hidden.bs.modal', function() {
				if($('#alert_box .success_box').css('display') == 'block') {
					var hostUrl = location.href;
					if(hostUrl.indexOf('showApply') != -1) {
						hostUrl = hostUrl.replace('showApply','a');
					}
					if(hostUrl.indexOf('showEndList') != -1) {
						hostUrl = hostUrl.replace('showEndList','a');
					}
					location.replace(hostUrl);
				}
			});
			
			//二维码失败后点击再试一次
			$('#alert_all #tab3 .try').on('click', function(data) {
				$('#alert_all').modal('hide');
			});
			
			//采用防抖动关闭二维码状态：如果切换到顺豆十秒钟后不切换二维码则关闭二维码倒计时，否则不关闭
			var isCloseQrcodeBack = null;
			//切换弹出框tab
			$('#alert_all .tab_title div').on('click',function() {
				if(!isClickTab) return;
				var tabId = $(this).attr('data_tab');
				
				//如果切换顺豆，关闭二维码倒计时
				if(tabId == "tab2") {
					clearTimeout(isCloseQrcodeBack);
					isCloseQrcodeBack = setTimeout(function() {
						clearTimeout(initObj.options.payObj.timeBack);
						clearInterval(initObj.options.payObj.timeQuery);
						initObj.options.payObj.timeBack = "";
						initObj.options.payObj.timeNum = 300;
					},10000)
				}
				
				//如果切换到顺豆支付超过10秒关闭二维码倒计时，切换回来后再次开启
				if(!initObj.options.payObj.timeBack) {
					initObj.options.payObj.timeNum = 300;
					qrcodeTimeBack();
					//重新开始查询支付状态
					initObj.options.payObj.timeQuery = setInterval(function() {
						do_payFinished();
					}, 3000);
				}
				
				$(this).siblings('div').removeClass('active');
				$(this).addClass('active');
				$('#alert_all .tab_box .tab_content').hide();
				$('#'+tabId).show();
			})
			
			//如果下拉框开启点击旁白关闭
			$('#alert_join').on('click',function(e) {
				if($('input').hasClass('open') && e.target.localName != 'input') {
					$('.drop-select ul').hide();
				}
			})
			
			//列表左滚动
			$('.nav').on('click','.left',function() {
				if(timeScrollNum > 0) {
					timeScrollNum--;
					$('.menu-wrap ul').animate({'left':-100*timeScrollNum+'px'},200)
				}
			})
			//列表右滚动
			$('.nav').on('click','.right',function() {
				if(timeScrollNum < (timeAllNum-9)) {
					timeScrollNum++;
					$('.menu-wrap ul').animate({'left':-100*timeScrollNum+'px'},200);
				}
			})
		})
	}
	
	
	//获取时间段列表
	this.do_listMelee = function() {
		initObj.ajax_({
			name:actionObj.listMelee.name,
			url: actionObj.listMelee.url(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					$('.content_box').show();
					$('.close_remind').hide();
					var data = obj['data'];
					timeAllNum = data.length;
					var nowScrollNum = 0;
					var timeTitle = data.map(function(v,index) {
						var className = "";
						var contentStr = v.period;
						if(v.activated=="true" || v.activated == true) {
							nowScrollNum = index+1;
							now_period = v.period;
							if(v.onMelee) {
								contentStr = v.period+"<p>当前时段</p>";
								className = "active on";
							}
							if(!v.onMelee) className = "active";
						}
						return "<li class='"+className+"' data-period='"+v.period+"'>"+contentStr+"</li>";
					})
					var ulWidth = (data.length*100+2)+"px";
					$('.nav ul').css('width',ulWidth).html(timeTitle.join(""));
					if(nowScrollNum > 9) {
						timeScrollNum = nowScrollNum-9;
						$('.menu-wrap ul').animate({'left':-100*(nowScrollNum-9)+'px'},200);
					}
					if(timeAllNum>9) $('.nav .left,.nav .right').show();
					//调用时间段详情
					this_.do_getMelee(now_period);
				} else if(!obj['success']) {
					$('.content_box').hide();
					$('.close_remind').show();
					$('.close_remind h1').html(obj['message']);
				}
			}
		});
	}
	
	var setInfo = function(obj) {
		$('.content_box .title h1').html(obj.ruleTitle);
		$('.content_box .title h2').html(obj.ruleSubTitle+"的玩家平分奖池");
		$('.content_box .prize_box span').html(obj.rewardPool);
		$('.content_box .btn_box span').html(obj.achieveCnt);
		$('.content_box .btn_box>h2').html("奖池顺豆累积来自于本时段所有报名玩家，<span>同时段内可多次报名参加</span>，"+obj.applyEndTime+"结束报名，"+obj.calculateTime+"结算");
		$('#alert_rules .modal-body p').eq(0).html("1、本时段乱斗规则为：<span>"+obj.ruleSubTitle+"</span>，"+obj.ruleDetail);
		
		now_gameList = obj.supportGames;
		
		var returnGameList = new Array();
		for(var i = 0;i<obj.supportGames.length;i++) {
			if(i == obj.supportGames.length-1) {
				returnGameList.push(GameName.get(obj.supportGames[i]));
			} else {
				returnGameList.push(GameName.get(obj.supportGames[i])+"、");
			}
		}
		//allowTeamState;//组队状态（0:不允许组队；1：允许组队；2：必须组队)
		var teamStr = ["不允许组队","允许组队","必须组队"];
		var rule3 = "3、玩家需在"+obj.calculateTime+"之前完成"+returnGameList.join("")+"的游戏，"+obj.gameTypeRemark+"，"+teamStr[obj.allowTeamState]+"</span>";
		
		$('#alert_rules .modal-body p').eq(2).html(rule3);
		
		var gameStr = new Array("<span>支持游戏：</span>");
		for(var i = 0;i<obj.supportGames.length;i++) {
			gameStr.push(gameList(obj.supportGames[i]));
		}
		$('.bottom_box').html(gameStr.join(""));
		
		var state = obj.state;//时间段0, "未开始"；1, "进行中";2, "已结束";3, "禁止报名";
		var hasUserApply = obj.hasUserApply;//用户是否报名
		var hasUserGameFinished = obj.hasUserGameFinished;//用户是否完成游戏
		var hasUserCalculated = obj.hasUserCalculated;//游戏是否结算
		var hasUserAchieved = obj.hasUserAchieved;//是否达成目标
		
		
		var $closeBtn = $('.btn_box .btn_close');
		var $joinBtn = $('.btn_box .btn_join');
		var $btnClose_h1 = $('.btn_box .btn_close h1');
		var $btnClose_h2 = $('.btn_box .btn_close h2');
		var $btnJoin_h1 = $('.btn_box .btn_join h1');
		var $btnJoin_h2 = $('.btn_box .btn_join h2');
		$btnClose_h1.css('margin-top','63px')
		$closeBtn.hide();$joinBtn.hide();$btnClose_h1.html("");$btnClose_h2.html("");$btnJoin_h1.html("");$btnJoin_h2.html("");
		$closeBtn.removeClass('end normal');
		
		//是否开启达成列表框
		if(initObj.options.showEndList == 1) {
			this_.do_listRecords();
			$('#alert_records').modal();
		}
		
		//status1 时段未开始(提示开始时间)
		if(state == 0) {
			$closeBtn.addClass('normal').show();
			$btnClose_h1.css('margin-top','70px').html(obj.applyBeginTime+"开始报名");
			return;
		}
		
		//status2 时段进行中/已报名/游戏未完成（提示已报名）
		if(state == 1 && hasUserApply && !hasUserGameFinished) {
			$closeBtn.addClass('normal').show();
			$btnClose_h1.css('margin-top','70px').html("已报名");
			return;
		}
		
		//status3 时段进行中/已报名/游戏已完成||时段进行中/未报名 （提示立即报名）
		if((state == 1 && hasUserApply && hasUserGameFinished) || (state == 1 && !hasUserApply)) {
			$joinBtn.addClass('normal').show();
			$btnJoin_h1.html("立即报名");
			if(obj.applySwBean == 0) {
				$btnJoin_h1.css('margin-top','19px');
				$btnJoin_h2.html("");
			} else {
				$btnJoin_h1.css('margin-top','11px');
				$btnJoin_h2.html("（"+obj.applySwBean+"顺豆）");
			}
			
			//设置账号
			var gameInfo = ClientAPI.getLoginGameList();
			if(gameInfo) {
				var gameArr = gameInfo.map(function(v,index) {
					var strInfo = GameName.get(v.gameId)+"-"+v.playerName+"-"+v.serverName;
					var liStr = "<li data-id='"+v.gameId+"' data-ac='"+v.subAccount+"'>"+strInfo+"</li>";
					if(index == 0) {
						$('#alert_join input[name=gameInfo]').val(strInfo);
						$('#alert_join input[name=gameId]').val(v.gameId);
						$('#alert_join input[name=subAccount]').val(v.subAccount);
					}
					return liStr;
				})
				if(gameInfo.length > 3) $('#alert_join input[name=gameInfo]').siblings('ul').addClass('isScroll');
				$('#alert_join input[name=gameInfo]').siblings('ul').html(gameArr.join(""));
			}
			
			//设置份数
			obj.limitGroups.map(function(v,index) {
				$('.limitEachCnt li').eq(index).html(v);
			})
			//拖动份数
			$('#limitInput').slider({
				tooltip:'hide',
				min:1,
				max:obj.limitEachCnt,
				value:1,
				formatter: function(value) {
					$(".limitEachCnt .fix").removeClass('active');
					$(".limitEachCnt .auto").addClass('active');
					$('.limitEachCnt li').eq(3).html(value);
					if(obj.applySwBean == 0) {
						$('#alert_join .all').html("￥"+initObj.accMul(obj.applyMoney,value));
					} else {
						$('#alert_join .all').html(obj.applySwBean*value+"顺豆/￥"+initObj.accMul(obj.applyMoney,value));
					}
					now_applyCnt = value;
					return 'width:' +value;
				}
			});
			
			if(obj.applySwBean == 0) {
				$('#alert_join #joinNum span').html("￥"+obj.applyMoney);
				$('#alert_join .all').html("￥"+obj.applyMoney);
				$('#alert_join input[name=applySwBean]').val(0);
			} else {
				$('#alert_join #joinNum span').html(obj.applySwBean+"顺豆/￥"+obj.applyMoney);
				$('#alert_join .all').html(obj.applySwBean+"顺豆/￥"+obj.applyMoney);
				$('#alert_join input[name=applySwBean]').val(obj.applySwBean);
			}
			
			$('#alert_join input[name=applyMoney]').val(obj.applyMoney);
			
			//设置参数：份数,id,youxizhanghao
			now_gameId = $('#alert_join input[name=gameId]').val();
			now_account = $('#alert_join input[name=subAccount]').val();
			
			
			//点击份数
			$(".limitEachCnt .fix").off('click');
			$(".limitEachCnt .fix").each(function(index) {
				$(this).click(function() {
					now_applyCnt = $(this).html();
					$(".limitEachCnt li").removeClass('active');
					$(this).addClass('active');
					if(obj.applySwBean == 0) {
						$('#alert_join .all').html("￥"+initObj.accMul(obj.applyMoney,now_applyCnt));
					} else {
						$('#alert_join .all').html(obj.applySwBean*now_applyCnt+"顺豆/￥"+initObj.accMul(obj.applyMoney,now_applyCnt));
					}
				})
			});
			
			//拖动点击
			$(".limitEachCnt .auto").off('click');
			$(".limitEachCnt .auto").on('click',function() {
				$(".limitEachCnt .fix").removeClass('active');
				$(".limitEachCnt .auto").addClass('active');
				var autoValue = $('.limitEachCnt li').eq(3).html();
				if(obj.applySwBean == 0) {
					$('#alert_join .all').html("￥"+initObj.accMul(obj.applyMoney,autoValue));
				} else {
					$('#alert_join .all').html(obj.applySwBean*autoValue+"顺豆/￥"+initObj.accMul(obj.applyMoney,autoValue));
				}
				now_applyCnt = autoValue;
			})
			
			//下拉框点击
			$(".drop-select input").off('click');
			$(".drop-select input").click(function(e) {
				var ul = $(this).siblings("ul");
				if(ul.css("display") == "none") {
					ul.slideDown("fast");
					$(this).addClass("open");
				} else {
					ul.slideUp("fast");
					$(this).removeClass("open");
				}
			});
			
			//游戏下拉框内容点击
			$("#gameInfo li").off('click');
			$("#gameInfo li").click(function(e) {
				var txt = $(this).html();
				var gameId = $(this).attr('data-id');
				var subAccount = $(this).attr('data-ac');
				$('#alert_join input[name=gameId]').val(gameId);
				$('#alert_join input[name=subAccount]').val(subAccount);
				$(this).parents(".drop-select ul").siblings("input").val(txt).removeClass("open");
				$(".drop-select ul").hide();
			});
			
			//是否开启报名框
			if(initObj.options.showApply == 1) {
				initObj.do_challengeValidate(now_gameList,function() {
					$('#alert_join').modal();
				})
			}
			return;
		}
		
		//status4 时段已结束/已结算/达成目标 （提示以达成目标和获得的奖励）
		if(state == 2 && hasUserCalculated && hasUserAchieved) {
			$closeBtn.addClass('normal').show();
			$btnClose_h1.html("成功达成目标");
			$btnClose_h2.html("获得"+obj.achieveSwBean+"顺豆");
			return;
		}
		
		//status4 时段已结束/已结算/未达成目标 （提示已结束）
		if(state == 2 && hasUserCalculated && !hasUserAchieved) {
			$closeBtn.addClass('end').show();
			$btnClose_h1.css('margin-top','70px').html("已结束");
			return;
		}
		
		//status5 时段已结束/未结算 （提示报名结束，附加结算时间）
		if(state == 2 && !hasUserCalculated) {
			$closeBtn.addClass('normal').show();
			$btnClose_h1.html("报名结束");
			$btnClose_h2.html("结算时间："+obj.calculateTime);
			return;
		}
		
		//status6 时段禁止报名 （提示禁止报名）
		if(state == 3) {
			$closeBtn.addClass('end').show();
			$btnClose_h1.css('margin-top','70px').html("禁止报名");
			return;
		}
	}
	
	//获取时间段详情
	this.do_getMelee = function(period) {
		initObj.ajax_({
			name:actionObj.getMelee.name,
			url: actionObj.getMelee.url(period),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					$('.content_box').show();
					$('.close_remind').hide();
					var data = obj['data'];
					setInfo(data);
				} else if(!obj['success']) {
					$('.content_box').hide();
					$('.close_remind').show();
					$('.close_remind span').html(obj['message']);
				}
			}
		});
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
		closeQrcode(true);
		initObj.ajax_({
			name:actionObj.pay.name,
			url: actionObj.pay.url(orderId),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'];
					initObj.alertMsg("支付成功",data);
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
				closeQrcode(false);
				return;
			}
			qrcodeTimeBack();
		}, 1000);
	}
	
	//关闭二维码框处理事件
	var closeQrcode = function(result) {
		var $dom = $('#alert_all');
		var $domTab = $('#alert_all #tab3');
		clearInterval(initObj.options.payObj.timeQuery);
		clearTimeout(initObj.options.payObj.timeBack);
		initObj.options.payObj.timeNum = 300;
		$dom.find('.tab_content').hide();
		$domTab.show();
		if(result) {
			$dom.modal('hide');
		} else {
			$domTab.find('.remind').removeClass('linght_blue').addClass('deep_red').html('二维码支付失败');
			$domTab.find('.try').show();
		}
		
	}
	
	var alertAll = function(objArr) {
		var $dom = $('#alert_all');
		$dom.find('.tab_content').hide();
		$dom.find('.tab_title div').removeClass('active');
		$dom.find('.tab_title div[data_tab="tab1"]').addClass('active');
		var qrcodeObj = objArr.length<2?(objArr[0].applyWay == "Qrcode"?objArr[0]:{}):(objArr[0].applyWay == "Qrcode"?objArr[0]:objArr[1]),
			shunObj = objArr.length<2?(objArr[0].applyWay == "SwBean"?objArr[0]:{}):(objArr[0].applyWay == "SwBean"?objArr[0]:objArr[1]);
		$dom.modal();
		if(objArr.length < 2) {
			if(objArr[0].applyWay == "Qrcode") {
				$dom.find('.tab_title div[data_tab="tab1"]').addClass('active');
				$dom.find('.tab_title div[data_tab="tab2"]').hide();
				$dom.find('#tab1').show();
				initQrcode();
			} else {
				$dom.find('.tab_title div[data_tab="tab2"]').addClass('active');
				$dom.find('.tab_title div[data_tab="tab1"]').hide();
				$dom.find('#tab2').show();
				initShun();
			}
		} else {
			//显示二维码支付
			$dom.find('#tab1').show();
			initQrcode();
			initShun();
		}
		
		function initQrcode() {
			$dom.find('.qrcode_status span').html(qrcodeObj.money+"元");
			$dom.find('.alert_img_qrcode').empty().qrcode({width: 120,height: 120,text: qrcodeObj.qrcodeUrl,render:"canvas",correctLevel:1});
			initObj.options.payObj.orderId = qrcodeObj.orderId;
			qrcodeTimeBack();
			//轮训查询支付状态
			initObj.options.payObj.timeQuery = setInterval(function() {
				do_payFinished();
			}, 3000);
		}
		
		function initShun() {
			$dom.find('#noShun').hide();
			if(shunObj.swbean <= 0) {
				$dom.find('.tab_shunpay .btn_enter').addClass('disable').html("顺豆余额不足");
				$dom.find('#noShun').show();
			} else if(shunObj.useTimes >= shunObj.totalTimes && shunObj.totalTimes > 0) {
				$dom.find('.tab_shunpay .btn_enter').addClass('disable').html("您的挑战次数已用完");
			} else {
				$dom.find('.tab_shunpay .btn_enter').removeClass('disable').html("扣除"+shunObj.swbean+"顺豆，立刻报名");
				//绑定顺豆支付确定事件
				$dom.find('.btn_enter').one('click', function() {
					do_pay("");
				})
			}
		}
	}
	
	//查看达成奖励名单
	this.do_listRecords = function() {
		$('#alert_records #tab_rooms').bootstrapTable('destroy');
		$('#alert_records #tab_rooms').bootstrapTable({
			url: actionObj.listRecords.url(),
			method: 'post',
			striped: true, //是否显示行间隔色
			height: 500,
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true, //是否显示分页（*）
			paginationLoop: false,
			showPageDetail: false,
			paginationHAlign: 'center',
			sortable: false, //是否启用排序
			sortOrder: "asc", //排序方式
			pageNo: 1, //初始化加载第一页，默认第一页
			pageSize: 10, //每页的记录行数（*）
			queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
			queryParams: queryParamsRoom, //前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参数
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			minimumCountColumns: 1, //最少允许的列数
			clickToSelect: true, //是否启用点击选中行
			searchOnEnterKey: true,
			columns: [{
				field: 'Number',
				title: '序号',
				align: 'center',
				width: '10%',
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field: 'roleName',
				title: '角色名',
				align: 'center',
				width: "20%",
				formatter: function(value, row, index) {
					if(value) {
						return "<span style='color:#9c9e9f'>" + value + "</span>";
					} else {
						return "-";
					}
				}
			}, {
				field: 'serverName',
				title: '服务器',
				align: 'center',
				width: "20%",
				formatter: function(value, row, index) {
					if(value) {
						return value;
					} else {
						return "-"
					}
				}
			}, {
				field: 'achieveDateTime',
				title: '达成时间',
				align: 'center',
				width: "20%",
				formatter: function(value, row, index) {
					if(value) {
						return value;
					} else {
						return "-"
					}
				}
			}, {
				field: 'rewardCnt',
				title: '奖励份数',
				align: 'center',
				width: "15%",
				formatter: function(value, row, index) {
					if(value) {
						return value;
					} else {
						return "-"
					}
				}
			}, {
				field: 'rewardSwbean',
				title: '奖励顺豆',
				align: 'center',
				width: "15%",
				formatter: function(value, row, index) {
					if(value && value != 0) {
						return value;
					} else {
						return "";
					}
				}
			}],
			onLoadSuccess:function(data) {
				$('#alert_records .alert_title_h3').html("合计人数 "+(data.applyUniqueCnt||0));
				$('#alert_records .alert_title_h4').html("合计份数 "+(data.totalRewardCnt||0));
			}
		});

		function queryParamsRoom(params) {
			return {
				meleePeriod:now_period,
				pageSize: params.pageSize,
				pageNo: params.pageNo
			};
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
				{gameId: 13216, account:"699403830",subAccount:"4865_23232312",serverId:"2561", serverName:"诺克萨斯", playerName:"你妹啊", headId:"15", level:"30",rank:""}
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