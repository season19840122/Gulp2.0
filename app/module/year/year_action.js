var ACTIONFUN = function(initObj) {
	var this_ = this;
	var FAILMSG = "调用失败";
	var now_sw = "";
	var now_combatMatchBattleId = "";
	var homeTeamId = "";
	var awayTeamId = "";
	var now_time = "";
	var now_state = "";
	
	var actionObj = {
		getLiveList : {
			name:"获取场次列表",
			url: function() {
				return initObj.options.hostUrl+"userSwScore/getCombatMatchTime";
			}
		},
		teamDetail : {
			name:"获取直播列表详情",
			url: function(combatMatchBattleId) {
				return initObj.options.hostUrl+"userSwScore/getAnnualGuessDetail?combatMatchBattleId="+combatMatchBattleId;
			}
		},
		supportTeam : {
			name:"点击支持",
			url: function(teamId) {
				return initObj.options.hostUrl+"userSwScore/supportTeam?teamId="+teamId+"&combatMatchBattleId="+now_combatMatchBattleId;
			}
		}
	}
	
	this.eventElement = function() {
		$(function(){
			//开启规则
			$('.rules_pointer').on('click',function() {
				$('.rules_box').show();
				$('.live_box').hide();
			})
			
			//关闭规则
			$('.rules_box i,.alert_box i').on('click',function() {
				$('.rules_box').hide();
				$('.alert_box').hide();
				$('.live_box').show();
			})
			
			//返回
			$('.go_back').on('click',function() {
				goBack();
			})
			
			//点击左边menu
			$('.left_menu li').each(function(index) {
				$(this).on('click',function() {
					$(this).siblings('li').removeClass('on');
					$(this).addClass('on');
					this_.getList(index);
				})
			})
		})
	}
	
	
	//获取直播列表
	this.getList = function(leftNum) {
		initObj.ajax_({
			name:actionObj.getLiveList.name,
			url: actionObj.getLiveList.url(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'];
					setLeft(data,leftNum);
				} else if(!obj['success']) {
					initObj.alertMsg(obj['message']);
				}
			}
		});
	}
	
	var setLeft = function(obj,leftNum) {
		$('.title_box h1').html(obj.combatMatchName);
		var initNum = 0;
		var swArr = obj.combatMatchScheduleVOList.map(function(v,index) {
			//1未开始，2进行中 ，3已结束
			if(leftNum == index) {
				now_sw = v.swBean;
				now_state = v.state;
				now_time = new Date(v.beginTime).Format("hh:mm")+"-"+new Date(v.endTime).Format("hh:mm");
				now_combatMatchBattleId = v.combatMatchBattleId;
				$('.title_box h3').html("（本场猜中奖励："+now_sw+"顺豆）");
			} else if(v.state == 2) {
				initNum = index;
			}
			var stateName = [{className:"noStart"},{className:"ing"},{className:"over"}];
			$('.left_menu li').eq(index).find('h1').html(new Date(v.beginTime).Format("hh:mm")+"-"+new Date(v.endTime).Format("hh:mm"));
			$('.left_menu li').eq(index).addClass(stateName[v.state-1].className);
			return v.swBean;
		})
		$('.rules_box .content p').eq(5).html("2、4进2赛程，猜中获胜队伍奖励"+swArr.min()+"顺豆；");
		$('.rules_box .content p').eq(6).html("3、决赛赛程，猜中获胜队伍奖励"+swArr.max()+"顺豆；");
		if(leftNum!=undefined) {
			do_teamInfo(now_combatMatchBattleId);
		} else {
			//默认选中
			$('.left_menu li').removeClass('on');
			$('.left_menu li').eq(initNum).addClass('on');
			$('.title_box h3').html("（本场猜中奖励："+obj.combatMatchScheduleVOList[initNum].swBean+"顺豆）");
			now_time = new Date(obj.combatMatchScheduleVOList[initNum].beginTime).Format("hh:mm")+"-"+new Date(obj.combatMatchScheduleVOList[initNum].endTime).Format("hh:mm");
			now_sw = obj.combatMatchScheduleVOList[initNum].swBean;
			now_state = obj.combatMatchScheduleVOList[initNum].state;
			now_combatMatchBattleId = obj.combatMatchScheduleVOList[initNum].combatMatchBattleId;
			do_teamInfo(now_combatMatchBattleId);
		}
	}
	
	//获取队伍详情
	var do_teamInfo = function(combatMatchBattleId) {
		if(!combatMatchBattleId) {
			teamStatus(null);
			return;
		}
		initObj.ajax_({
			name:actionObj.teamDetail.name,
			url: actionObj.teamDetail.url(combatMatchBattleId),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'];
					teamStatus(data);
				} else if(!obj['success']) {
					initObj.alertMsg(obj['message']);
				}
			}
		});
	}
	
	//队伍状态
	var teamStatus = function(obj) {
		//1未开始，2进行中 ，3已结束
		$('.team_box1 h1,.team_box2 h1').off('click');
		$('.team_box1 h1').html("").attr('class', '');
		$('.team_box2 h1').html("").attr('class', '');
		$('.team_box1 h3').attr('class', '');
		$('.team_box2 h3').attr('class', '');
		$('.team_box1 h2').html(0);
		$('.team_box2 h2').html(0);
		$('.team_box1 h4').hide();
		$('.team_box2 h4').hide();
		$('.live_box').removeClass('noLive');
		$('.live_box .game_status').hide();
		$('#live_if').attr('src','');
		if(!obj || now_state == 1) {//id为空或state是未开始,中间直播显示状态
			$('.live_box iframe').hide();
			$('.live_box').addClass('noLive');
			$('.live_box .game_status').show();
			$('.live_box .game_status h1').html("来早了哦~");
			$('.live_box .game_status h2').html("比赛时间："+now_time);
		}
		if(!obj) {
			$('.team_box1 h1').html("未开始").addClass('normal');
			$('.team_box1 h3').html("待揭晓").addClass('noTeam');
			$('.team_box2 h1').html("未开始").addClass('normal');
			$('.team_box2 h3').html("待揭晓").addClass('noTeam');
		} else {
			$('.team_box1 h3').html(obj.homeTeamName);
			$('.team_box2 h3').html(obj.awayTeamName);
			$('.team_box1 h2').html(obj.supportHomeTeamCnt);
			$('.team_box2 h2').html(obj.supportAwayTeamCnt);
			homeTeamId = obj.homeTeamId;
			awayTeamId = obj.awayTeamId;
			//state2 不可支持，未出结果
			if(!obj.isCanSupport && !obj.userSwScore && (obj.state != 1 && obj.state != 2)) {
				if(now_state != 1) $('#live_if').attr('src',obj.combatLiveUrl).show();
				$('.team_box1 h1').html("来晚了哦~").addClass('normal');
				$('.team_box2 h1').html("来晚了哦~").addClass('normal');
				return;
			}
			
			//state3 可以支持
			if(obj.isCanSupport && (obj.state != 1 && obj.state != 2) && !obj.userSwScore) {
				if(now_state != 1) $('#live_if').attr('src',obj.combatLiveUrl).show();
				$('.team_box1 h1').html("支持他").addClass('zan');
				$('.team_box1').attr("data-teamId",obj.homeTeamId);
				
				$('.team_box2 h1').html("支持他").addClass('zan');
				$('.team_box2').attr("data-teamId",obj.awayTeamId);
				
				//赞
				$('.team_box1 h1.zan,.team_box2 h1.zan').on('click',function() {
					var teamId = $(this).parent().attr('data-teamId');
					initObj.do_challengeValidate(function() {
						do_support(teamId);
					})
				})
				
				return;
			}
			
			//state4 已支持过，不可再次支持，未出结果
			if(obj.userSwScore && (obj.state != 1 && obj.state != 2)) {
				if(now_state != 1) $('#live_if').attr('src',obj.combatLiveUrl).show();
				if(obj.userSwScore.teamId == obj.homeTeamId) {//支持的主队
					$('.team_box1 h1').addClass('zanEd');
					$('.team_box2 h1').html("支持他").addClass('normal');
				} else {//支持的客队
					$('.team_box2 h1').addClass('zanEd');
					$('.team_box1 h1').html("支持他").addClass('normal');
				}
				return;
			}
			//state5 已出结果，不可支持
			if(!obj.isCanSupport && (obj.state == 1 || obj.state == 2)) {
				$('.live_box iframe').hide();
				$('.live_box').addClass('noLive');
				$('.live_box .game_status').show();
				$('.live_box .game_status h1').html("比赛已结束");
				$('.live_box .game_status h2').html("");
				
				if(obj.state == 1) {//主队赢
					$('.team_box1 h3').addClass('win');
				} else if(obj.state == 2) {//客队赢
					$('.team_box2 h3').addClass('win');
				}
				
				if(obj.userSwScore) {//比赛结束有竞猜结果
					var isWinClass = obj.userSwScore.isWin==0?"wrong":"right";
					var isWinStr = obj.userSwScore.isWin==0?"可惜，猜错了":"获得"+now_sw+"顺豆";
					
					var nowTeamDom = obj.homeTeamId == obj.userSwScore.teamId?$('.team_box1 h4'):$('.team_box2 h4');
					nowTeamDom.html(isWinStr).attr('class','').addClass(isWinClass).show();
				} else {//比赛结束没有竞猜
					$('.team_box1 h1').html("已结束").addClass('normal');
					$('.team_box2 h1').html("已结束").addClass('normal');
				}
				
				return;
			}
		}
	}
	
	//点击支持
	var do_support = function(teamId) {
		initObj.ajax_({
			name:actionObj.supportTeam.name,
			url: actionObj.supportTeam.url(teamId),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					$('.team_box1 h1').html("").attr('class', '');
					$('.team_box2 h1').html("").attr('class', '');
					if(teamId == homeTeamId) {//支持的主队
						$('.team_box1 h1').addClass('zanEd');
						$('.team_box1 h2').html(parseInt($('.team_box1 h2').html())+1);
						$('.team_box2 h1').html("支持他").addClass('normal');
					} else {//支持的客队
						$('.team_box2 h1').addClass('zanEd');
						$('.team_box2 h2').html(parseInt($('.team_box2 h2').html())+1);
						$('.team_box1 h1').html("支持他").addClass('normal');
					}
					$('.team_box1 h1,.team_box2 h1').off('click');
				} else if(!obj['success']) {
					initObj.alertMsg(obj['message']);
				}
			}
		});
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
	
	Array.prototype.max = function(){  return Math.max.apply({},this)  }
	Array.prototype.min = function(){  return Math.min.apply({},this)  }
}