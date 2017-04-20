var ACTIONFUN = function(initObj) {
	var this_ = this;
	var FAILMSG = "调用失败";
	var initStr1 = "查看作业进度";
	var initStr2 = "查一查我的战绩";
	var initStr3 = "查看我的排名";
	var prizeStr2 = "奖励领取成功，在我的-我的奖品页面查看";
	var prizeStr = "开学季活动·宝箱领取成功，在我的-我的包裹页面查看宝箱";
	var now_schoolWeekId = 0;
	var now_schoolWeekDom = 0;
	var now_prizeType = 0;
	var now_rank = 0;

	var actionObj = {
		getTimes: {
			name: "获取开始时间",
			url: function() {
				return initObj.options.hostUrl + "school/getSchoolTime";
			}
		},
		getSchoolDay: {
			name: "完成作业奖励",
			url: function() {
				return initObj.options.hostUrl + "school/getSchoolDay";
			}
		},
		getSchoolDayPrize: {
			name: "领取作业奖励",
			url: function(schoolDayId) {
				return initObj.options.hostUrl + "school/acceptSchoolDayPrize?schoolDayId="+schoolDayId;
			}
		},
		getSchoolGuessPrize: {
			name: "领取周考奖励",
			url: function(schoolGuessId) {
				return initObj.options.hostUrl + "school/acceptSchoolGuessPrize?schoolGuessId="+schoolGuessId;
			}
		},
		getSchoolWeekPrize: {
			name: "领取学霸奖励",
			url: function(schoolWeekId,prizeType) {
				return initObj.options.hostUrl + "school/acceptSchoolWeekPrize?schoolWeekId="+schoolWeekId+"&prizeType="+prizeType;
			}
		},
		getSchoolWeek: {
			name: "周考小测试",
			url: function() {
				return initObj.options.hostUrl + "school/getSchoolGuess";
			}
		},
		getSchoolGuess: {
			name: "学霸学渣",
			url: function() {
				return initObj.options.hostUrl + "school/getSchoolWeek";
			}
		}
	}

	this.eventElement = function() {
		$(function() {
			//弹出框
			$('.alert_content h1').on('click', function() {
				initObj.hideMsg();
			});

			//返回火马
			$('.go_back').on('click', function() {
				goBack();
			});

			//选择奖励类型
			$('.alert_content .choose span').on('click', function() {
				$(this).siblings('span').removeClass('on');
				$(this).addClass('on');
				now_prizeType = $(this).attr('data-type');
			});

			//确定领取
			$('.alert_content .choose a').on('click', function() {
				do_weekPrize();
			});

			//刷新按钮1
			(function flush1() {
				$('.middle .icon_flush').on('click', function() {
					var thisDom = $(this);
					initObj.do_challengeValidate(function() {
						thisDom.off('click');
						new flushDom(thisDom, flush1).backTime();
						this_.do_getSchoolDay();
					})
				}).html(initStr1);
			})();

			//刷新按钮2
			(function flush2() {
				$('.middle2 .icon_flush').on('click', function() {
					var thisDom = $(this);
					initObj.do_challengeValidate(function() {
						thisDom.off('click');
						new flushDom(thisDom, flush2).backTime();
						this_.do_getSchoolWeek();
					})
				}).html(initStr2);
			})();
			
			//刷新按钮3
			(function flush3() {
				$('.bottom_box .icon_flush').on('click', function() {
					$(this).off('click');
					new flushDom($(this), flush3).backTime();
					this_.do_getSchoolGuess();
				}).html(initStr3);
			})();
		})
	}
	
	//定义宝箱浮窗
	var floatBao = function(boxName) {
		boxName.find('.bao').on('mouseenter',function() {
			$(this).find('.tip').show();
		});
		boxName.find('.tip').on('mouseout',function() {
			$(this).hide();
		});
	}

	var flushDom = function(dom, callBack) {
		this.num = 10;
		var this_ = this;
		this.backTime = function() {
			dom.html((this_.num < 10 ? "0" + this_.num : this_.num) + "秒后可操作");
			this_.num--;
			setTimeout(function() {
				if(this_.num <= 0) {
					this_.num = 10;
					callBack();
					return;
				}
				this_.backTime(dom, callBack);
			}, 1000)
		}
	}
	
	//定义按钮事件状态机
	var btnStatus = function(dom, callBack,par) {
		var this_ = this;

		//绑定事件
		this.init = function() {
			dom.on('click', function() {
				this_.transition();
			});
		}

		//状态转换
		this.transition = function() {
			callBack(par,dom);
		}
	}

	//获取开始时间
	this.do_getTimes = function() {
		initObj.ajax_({
			name: actionObj.getTimes.name,
			url: actionObj.getTimes.url(),
			success: function(obj) {
				if(obj) {
					$('.top_bg p').html("活动时间："+obj.beginTime+"至"+obj.endTime);
				}
			}
		});
	}

	//领取作业奖励
	this.do_getSchoolDayPrize = function(obj,dom) {
		initObj.ajax_({
			name: actionObj.getSchoolDayPrize.name,
			url: actionObj.getSchoolDayPrize.url(obj.schoolDayId),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					initObj.showMsg(prizeStr);
					dom.off('click');
					this_.do_getSchoolDay();
				} else if(!obj['success']) {
					initObj.showMsg(obj['message']);
					dom.removeClass('off').addClass('on');
				}
			}
		});
	}

	//领取周考奖励
	this.do_getSchoolGuessPrize = function(obj,dom) {
		initObj.ajax_({
			name: actionObj.getSchoolGuessPrize.name,
			url: actionObj.getSchoolGuessPrize.url(obj.schoolGuessId),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					initObj.showMsg(prizeStr);
					dom.off('click');
					this_.do_getSchoolWeek();
				} else if(!obj['success']) {
					initObj.showMsg(obj['message']);
					dom.removeClass('off').addClass('on');
				}
			}
		});
	}
	
	var do_weekPrize = function() {
		initObj.ajax_({
			name: actionObj.getSchoolWeekPrize.name,
			url: actionObj.getSchoolWeekPrize.url(now_schoolWeekId,now_rank>8?3:now_prizeType),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					initObj.showMsg(now_rank>8?prizeStr:prizeStr2);
					now_schoolWeekDom.off('click');
					this_.do_getSchoolGuess();
				} else if(!obj['success']) {
					initObj.showMsg(obj['message']);
					now_schoolWeekDom.removeClass('off').addClass('on');
				}
			}
		});
	}

	//领取学霸奖励
	this.do_getSchoolWeekPrize = function(obj,dom) {
		now_schoolWeekId = obj.schoolWeekId;
		now_schoolWeekDom = dom;
		now_rank = obj.rankNo;
		if(now_rank < 9) {
			initObj.showMsg();
		} else {
			do_weekPrize();
		}
	}

	//完成作业奖励
	this.do_getSchoolDay = function() {
		initObj.ajax_({
			name: actionObj.getSchoolDay.name,
			url: actionObj.getSchoolDay.url(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					setSchoolDay(data);
				} else if(!obj['success']) {
					initObj.showMsg(obj['message']);
				}
			}
		});
	}

	var setSchoolDay = function(data) {
		var workLi = [
			{type:"挑战",boxDom:$('#work0'),chestPrice:"",schoolDayId:"0",state:"未达成"},
			{type:"乱斗",boxDom:$('#work1'),chestPrice:"",schoolDayId:"0",state:"未达成"},
			{type:"竞猜",boxDom:$('#work2'),chestPrice:"",schoolDayId:"0",state:"未达成"}
		];
		workLi.map(function(v,index) {
			data.map(function(v2,index2) {
				if(v2.type.indexOf(v.type) != -1) {
					workLi[index].chestPrice = v2.chestPrice;
					workLi[index].schoolDayId = v2.schoolDayId;
					workLi[index].state = (v2.state.indexOf("未领取") != -1?"立即领取":v2.state);
					return;
				}
			})
		})
		workLi.map(function(v) {
			if(v.chestPrice) {
				v.boxDom.find('.tip').html(v.chestPrice);
				floatBao(v.boxDom);
			}
			
			v.boxDom.find('.btn').html(v.state).removeClass('off').removeClass('on');
			if(v.state.indexOf('立即领取') != -1) {
				v.boxDom.find('.btn').addClass('on');
				new btnStatus(v.boxDom.find('.btn'), this_.do_getSchoolDayPrize,{schoolDayId:v.schoolDayId}).init();
			} else {
				v.boxDom.find('.btn').addClass('off');
			}
		})
	}
	
	//周考小测试
	this.do_getSchoolWeek = function() {
		initObj.ajax_({
			name: actionObj.getSchoolWeek.name,
			url: actionObj.getSchoolWeek.url(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					setSchoolWeek(data);
				} else if(!obj['success']) {
					initObj.showMsg(obj['message']);
				}
			}
		});
	}
	
	var setSchoolWeek = function(data) {
		var testLi = [
			{type:"60",boxDom:$('.score60'),chestPrice:"",schoolGuessId:"0",chestName:"",state:"未达成",sumGuessBeans:"0"},
			{type:"80",boxDom:$('.score80'),chestPrice:"",schoolGuessId:"0",chestName:"",state:"未达成",sumGuessBeans:"0"},
			{type:"100",boxDom:$('.score100'),chestPrice:"",schoolGuessId:"0",chestName:"",state:"未达成",sumGuessBeans:"0"}
		];
		testLi.map(function(v,index) {
			data.map(function(v2,index2) {
				$('.middle2 .tip span').eq(0).html("当前赢取的顺豆数："+v2.sumGuessBeans);
				if(v2.type.indexOf(v.type) != -1) {
					testLi[index].chestPrice = v2.chestPrice;
					testLi[index].schoolGuessId = v2.schoolGuessId;
					testLi[index].chestName = v2.chestName;
					testLi[index].sumGuessBeans = v2.sumGuessBeans;
					testLi[index].state = (v2.state.indexOf("未领取") != -1?"立即领取":v2.state);
					return;
				}
			})
		})
		testLi.map(function(v) {
			if(v.chestPrice) {
				v.boxDom.find('.tip').html(v.chestPrice);
				floatBao(v.boxDom);
			}
			v.boxDom.find('.btn').html(v.state).removeClass('off').removeClass('on');
			if(v.state.indexOf('未达成') == -1) v.boxDom.addClass('on');
			if(v.state.indexOf('立即领取') != -1) {
				v.boxDom.find('.btn').addClass('on');
				new btnStatus(v.boxDom.find('.btn'), this_.do_getSchoolGuessPrize,{schoolGuessId:v.schoolGuessId}).init();
			} else {
				v.boxDom.find('.btn').addClass('off');
			}
		})
	}
	

	//学霸学渣
	this.do_getSchoolGuess = function() {
		initObj.ajax_({
			name: actionObj.getSchoolGuess.name,
			url: actionObj.getSchoolGuess.url(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					setSchoolGuess(data);
				} else if(!obj['success']) {
					initObj.showMsg(obj['message']);
				}
			}
		});
	}
	
	var setSchoolGuess = function(data) {
		var rankLi = {
			schoolWeekChallengeList:{dom:$('.rank1'),list:[],state:"",schoolWeekId:0,rankNo:1},
			schoolWeekGuessList:{dom:$('.rank3'),list:[],state:"",schoolWeekId:0,rankNo:1},
			schoolWeekMeleeList:{dom:$('.rank2'),list:[],state:"",schoolWeekId:0,rankNo:1}
		}
		for(var k in rankLi) {
			if(data[k] && data[k].length != 0) rankLi[k].list = data[k];
		}
		console.log(rankLi);
		for(var k in rankLi) {
			rankLi[k].dom.find('.list').html(
				(rankLi[k].list.map(function(v,index) {
					var className = (v.flag=='myself'?'active':'');
					if(v.flag == 'prize') {
						rankLi[k].state = (v.flag=='prize'?v.state:'');
						rankLi[k].schoolWeekId = v.schoolWeekId;
						rankLi[k].rankNo = v.rankNo;
					} else {
						return "<li class='"+className+"'><span>"+(v.rankNo?v.rankNo:"未上榜")+"</span><span>"+v.nickName+"</span><span>"+v.sumBeans+"</span></li>";
					}
				})).join("")
			)
			
			rankLi[k].dom.find('.btn').html("").removeClass('on');
			if(rankLi[k].state.indexOf("未领取") != -1) {
				rankLi[k].dom.find('.btn').html("领取上周奖励").addClass('on');
				new btnStatus(rankLi[k].dom.find('.btn'), this_.do_getSchoolWeekPrize,{schoolWeekId:rankLi[k].schoolWeekId,rankNo:rankLi[k].rankNo}).init();
			}
		}
	}

}

