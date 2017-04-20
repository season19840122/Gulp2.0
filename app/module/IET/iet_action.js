var ACTIONFUN = function(initObj) {
	var this_ = this,
		FAILMSG = "调用失败",
		FLAGDM = true,
		timeBackInte = null,
		CODE_NO_TEAM = 10002,
		MSG_ONE = "请先创建或加入一支<span>艾欧尼亚</span>的战队！",
		MSG_MORE = "王者荣耀报名QQ群：<span>532314185</span>",
		SUCCESS_JOIN = "请加入IET赛事QQ群：<span>232965550</span>（<a>点此加群</a>）<br>了解参赛时间及赛事安排！";

	var actionObj = {
		check: {
			name: "报名校验",
			url: function() {
				return initObj.options.hostUrl + "applayCombatMatchTeam/iet/check?"
				+"gameAccount="+ClientAPI.getSubAccount(GameID.LOL)
				+"&loginServerId="+initObj.getLolServerId()
				+"&userId="+initObj.do_getUserId()
			}
		},
		apply: {
			name: "报名",
			url: function() {
				return initObj.options.hostUrl + "applayCombatMatchTeam/iet/apply?"
				+"gameAccount="+ClientAPI.getSubAccount(GameID.LOL)
				+"&loginServerId="+initObj.getLolServerId()
				+"&userId="+initObj.do_getUserId()
			}
		}
	}

	this.eventElement = function() {
		$(function() {
			//弹窗关闭
			$('.alert_box i,.alert_box .alert_content .confirm').on('click', function() {
				initObj.closeAlert();
			})
			
			//战队报名
			$('#join,.title_right').on('click',function() {
				$('.box').animate({scrollTop:500},300);
			})
			
			//赛事介绍
			$('.title_top h1').on('click',function() {
				$('.box').animate({scrollTop:1250},300);
			})
			
			//选拔赛
			$('#online').on('click',function() {
				$('.box').animate({scrollTop:1860},300);
			})

			//管理站队
			$('.bottom h2').on('click', function() {
				managerTeam();
			});
			
			//查看战绩
			$('.bottom h3').on('click', function() {
				checkGrade();
			});
			
			//战队报名
			$('.alert_box .iNow').on('click', function() {
				initObj.closeAlert();
				do_apply();
			});
			
			//创建战队
			$('.alert_content .create').on('click', function() {
				initObj.closeAlert();
				createTeam();
			});
			
			//加群
			$('.alert_content p').on('click','a',function() {
				window.open(initObj.options.qqLocation);
				initObj.closeAlert();
			});
			
			//更多游戏
			$('.float_right h3').on('click',function() {
				initObj.showMsg(MSG_MORE);
			});
			
			//返回首页
			$('.icon-home').on('click',function() {
				goBack();
			});
		})
	}


	var ShowCountDown = function(date, divname) {
		var now = new Date();
		var endDate = new Date(date);
		var leftTime = endDate.getTime() - now.getTime();
		var leftsecond = parseInt(leftTime / 1000);
		var day1 = Math.floor(leftsecond / (60 * 60 * 24));
		var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
		hour = hour < 10 ? "0" + hour : hour;
		var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
		minute = minute < 10 ? "0" + minute : minute;
		var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
		second = second < 10 ? "0" + second : second;
		var cc = $(divname);
		cc.html("距离报名截止："+day1+"天"+hour + "小时" + minute + "分" + second+"秒");
		//倒计时结束后处理业务
		if(endDate <= now) {
			clearInterval(timeBackInte);
			cc.html("报名已结束");
		}
	}

	var countBack = function(date, targetName) {
		timeBackInte = setInterval(function() {
			ShowCountDown(date, targetName);
		}, initObj.options.interval);
	}

	this.initFun = function() {
		checkLogin();
	}
	
	//初始化li
	this.initLi = function() {
		var liNum = $('#team_game li').length;
		$('#team_game li').width(parseInt(1017/liNum)+"px");
	}

	//检查报名状态
	function checkLogin() {
		$('.back_time p').html("报名已结束");
		$('.bottom h1').attr('class',"").addClass('join_close');
		return;
		if(initObj.options.hasApply == "true") {
			$('.back_time p').html("报名已结束");
			$('.bottom h1').attr('class',"").addClass('join_off');
		} else {
			var nowTime = initObj.options.nowTime;
			var joinStartTime = new Date(initObj.options.joinStartTime).getTime();
			var joinEndTime = new Date(initObj.options.joinEndTime).getTime();
			if(nowTime <= joinEndTime) {
				countBack(initObj.options.joinEndTime,$('.back_time p'));
				$('.bottom h1').attr('class',"").addClass('join_on');
				//报名按钮
				$('.bottom h1').on('click', function() {
					initObj.do_checkLogin(function() {
						//判断是否登录游戏
						if(initObj.getLolServerId() == 0) {
							initObj.showMsg("请先登录游戏");
						} else {
							do_check();
						}
					})
				});
			} else {
				$('.back_time p').html("报名已结束");
				$('.bottom h1').attr('class',"").addClass('join_close');
			}
		}
	}
		
	//校验报名
	var do_check = function() {
		initObj.ajax_({
			name: actionObj.check.name,
			url: actionObj.check.url(),
			success: function(obj) {
				if(obj.success && obj.code == 0) {
					initObj.showRule();
				} else if(obj.code == CODE_NO_TEAM) {//弹出创建战队
					initObj.showMsg(MSG_ONE,true);
				} else {
					initObj.showMsg(obj.message);
				}
			}
		});
	}
	
	//战队报名
	var do_apply = function() {
		initObj.ajax_({
			name: actionObj.apply.name,
			url: actionObj.apply.url(),
			success: function(obj) {
				if(obj.success && obj.code == 0) {
					initObj.showMsg(SUCCESS_JOIN);
					$('.bottom h1').attr('class',"").addClass('join_off');
					$('.bottom h1').off('click');
				} else {
					initObj.showMsg(obj.message);
				}
			}
		});
	}
}