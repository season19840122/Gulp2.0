var ACTIONFUN = function(initObj) {
	var this_ = this;
	var urlList = {
		url_getUserInfo : function() {
			return initObj.options.hostUrl + "challenge/getChallengePlayerInfo?challengeMatchId=" + initObj.options.challengeMatchId +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL);
		},
		url_getChallengeLevelInfo : function() {
			return initObj.options.hostUrl + "challenge/getChallengeLevelInfo?challengeMatchId=" + initObj.options.challengeMatchId +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL);
		},
		url_listChallengeRecords : function(pageNo, pageSize) {
			return initObj.options.hostUrl + "challenge/listChallengeRecords?pageNo=" + pageNo +
				"&pageSize=" + pageSize +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL);
		},
		url_listChallengeRoomPlayers : function(pageNo, pageSize, challengeRoomId) {
			return initObj.options.hostUrl + "challenge/listChallengeRoomPlayers?pageNo=" + pageNo +
				"&pageSize=" + pageSize +
				"&challengeRoomId=" + challengeRoomId +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL);
		},
		url_challenge : function(challengeLevelId) {
			return initObj.options.hostUrl + "challengeApply/challenge?barId=" + initObj.options.barId +
				"&challengeLevelId=" + challengeLevelId +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL);
		},
		url_enterRoom : function(challengeLevelId,orderId) {
			return initObj.options.hostUrl + "challengeApply/enterRoom?challengeLevelId=" + challengeLevelId +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL)+
				"&barId=" + initObj.options.barId+
				"&orderId=" + (orderId || "");
		},
		url_payFinished : function(orderId) {
			return initObj.options.hostUrl + "recharge/payFinished?orderId=" + orderId;
		},
		url_queryChallengeMatchState : function() {
			return initObj.options.hostUrl + "challenge/queryChallengeMatchState?challengeMatchId=" + initObj.options.challengeMatchId;
		},
		url_getAllChallengeMatchInfo : function() {
			return initObj.options.hostUrl + "challenge/getAllChallengeMatchInfo";
		},
		//重新跳转对应的挑战赛
		url_index : function(challengeMatchId) {
			return initObj.options.hostUrl + "challenge/index?challengeMatchId=" + challengeMatchId;
		},
		//获取挑战赛次数
		url_getChallengeLimitInfo : function() {
			return initObj.options.hostUrl + "challenge/getChallengeLimitInfo?challengeMatchId=" + initObj.options.challengeMatchId+
			"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL);
		}
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
		cc.html(hour + ":" + minute + ":" + second);
		//倒计时结束后处理业务
		if(endDate <= now) {
			var hostUrl = location.href;
			if(hostUrl.indexOf('needShowRecord') != -1) {
				hostUrl = hostUrl.replace('needShowRecord','a');
			} else if(hostUrl.indexOf('needShowRules') != -1) {
				hostUrl = hostUrl.replace('needShowRules','b');
			}
			if(hostUrl.indexOf('#') != -1) hostUrl = hostUrl.replace("#","");
			location.href = hostUrl;
			return;
		}
	}

	var countBack = function(date, targetName) {
		initObj.options.timeBackInte = setInterval(function() {
			ShowCountDown(date, targetName);
		}, initObj.options.interval);
	}

	//设置图片 init
	this.setTitle = function() {
		if(initObj.options.matchType == 1) {
			$('.challenge_title').attr('src', initObj.options.hostImg+'images/ten_title.png');
			$('.detail_box').css('background', 'url('+initObj.options.hostImg+'images/challenge_bg_new.jpg) 120px 0px no-repeat');
		} else if(initObj.options.matchType == 2) {
			$('.challenge_title').attr('src', initObj.options.hostImg+'images/hunderd_title.png');
			$('.detail_box').css('background', 'url('+initObj.options.hostImg+'images/challenge_bg_new2.jpg) 120px 0px no-repeat');
		}
		$('.challenge_lol').removeClass('hide');
		$('.challenge_title').removeClass('hide');
		$('.title_stone').removeClass('hide');
		$('.menu-wrap li').removeClass("active");
		$('.menu-wrap .li_' + initObj.options.matchType).addClass("active");
	}

	//设置挑战纪录
	this.showChallengeRulesList = function() {
		if(initObj.options.needShowRecord == 1) {
			$('.remind_num, .remind_ball1').click();
		} else if(initObj.options.needShowRules == 1) {
			$('.remind_ball2').click();
		}
	}

	//关闭二维码框处理事件
	this.closeQrcode = function(result) {
			var $dom = $('#alert_all');
			var $domTab = $('#alert_all #tab3');
			clearInterval(initObj.options.payObj.timeQuery);
			clearTimeout(initObj.options.payObj.timeBack);
			initObj.options.payObj.timeNum = 300;
			$dom.find('.tab_content').hide();
			$dom.find('.loading').hide();
			$dom.find('#tab3').show();
			if(result) {
				//支付成功,提示用户后进入房间
				//支付成功，不能切换顺豆购买
				$dom.find('.loading').show();
				isClickTab = false;
				$domTab.find('.remind').removeClass('deep_red').addClass('linght_blue').html('二维码支付成功');
				$domTab.find('.try').hide();
				$domTab.find('p').show();
				this_.do_enterRoom({
					challengeLevelId:initObj.options.payObj.challengeLevelId,
					orderId:initObj.options.payObj.orderId
				});
			} else {
				$domTab.find('.remind').removeClass('linght_blue').addClass('deep_red').html('二维码支付失败');
				$domTab.find('.try').show();
				$domTab.find('p').hide();
				$dom.find('.loading').hide();
			}
			
		}

	var alertMsg = function(msg) {
		$('#alert_msg .alert_title_h1').html(msg);
		$('#alert_msg').modal();
	}

	var errorMsg = function(msg) {
			$('#alert_msg .alert_title_h1').html(msg);
			$('#alert_msg').modal();
		}
	var isClickTab = true;
	//总弹出框关闭事件
	$('#alert_all').on('hidden.bs.modal', function() {
		$(this).find('.tab_title div[data_tab="tab1"]').show();
		$(this).find('.tab_title div[data_tab="tab2"]').show();
		isClickTab = true;
	});
	//切换弹出框tab
	$('#alert_all .tab_title div').on('click',function() {
		if(!isClickTab) return;
		var tabId = $(this).attr('data_tab');
		$(this).siblings('div').removeClass('active');
		$(this).addClass('active');
		$('#alert_all .tab_box .tab_content').hide();
		$('#'+tabId).show();
	})
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
			$dom.find('.qrcode_status span').html(qrcodeObj.money);
			$dom.find('.alert_img_qrcode').empty().qrcode({width: 120,height: 120,text: qrcodeObj.qrcodeUrl,render:"canvas",correctLevel:1});
			initObj.options.payObj.orderId = qrcodeObj.orderId;
			qrcodeTimeBack();
			//轮训查询支付状态
			initObj.options.payObj.timeQuery = setInterval(function() {
				this_.do_payFinished();
			}, 7000);
		}
		
		function initShun() {
			$dom.find('#noShun').hide();
			$dom.find('.tab_shunpay #tab_challenge_num').hide();
			$dom.find('.tab_shunpay #tab_challenge_num span').html(shunObj.useTimes+"/"+shunObj.totalTimes);
			if(shunObj.swbean <= 0) {
				$dom.find('.tab_shunpay .btn_enter').addClass('disable').html("顺豆余额不足");
				$dom.find('#noShun').show();
			} else if(shunObj.useTimes >= shunObj.totalTimes && shunObj.totalTimes > 0) {
				$dom.find('.tab_shunpay .btn_enter').addClass('disable').html("您的挑战次数已用完");
				$dom.find('.tab_shunpay #tab_challenge_num').show();
			} else {
				if(shunObj.totalTimes <= 0) $dom.find('.tab_shunpay #tab_challenge_num span').html("不限")
				$dom.find('.tab_shunpay .btn_enter').removeClass('disable').html("扣除"+shunObj.swbean+"顺豆，立刻报名");
				//绑定顺豆支付确定事件
				$dom.find('.btn_enter').one('click', function() {
					this_.do_enterRoom({
						challengeLevelId:initObj.options.payObj.challengeLevelId,
						orderId:"",
						isShowShunResult:true
					});
				})
				$dom.find('.tab_shunpay #tab_challenge_num').show();
			}
			if(!shunObj.isVip && shunObj.useTimes >= shunObj.totalTimes && shunObj.totalTimes>0) {
				$dom.find('#vip_box').show();
			} else {
				$dom.find('#vip_box').hide();
			}
		}
	}
	
		//扫码倒计时
	var qrcodeTimeBack = function() {
		initObj.options.payObj.timeNum--;
		initObj.options.payObj.timeBack = setTimeout(function() {
			if(initObj.options.payObj.timeNum <= 0) {
				this_.closeQrcode(false);
				return;
			}
			qrcodeTimeBack();
		}, 1000);
	}

	//挑战纪录
	this.getChallengeList = function() {
		$('#tab_challenge').bootstrapTable('destroy');
		$('#tab_challenge').bootstrapTable({
			method: 'post',
			striped: true, //是否显示行间隔色
			height: 400,
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true, //是否显示分页（*）
			paginationLoop: false,
			showPageDetail: false,
			paginationHAlign: 'center',
			sortable: false, //是否启用排序
			sortOrder: "asc", //排序方式
			pageNo: 1, //初始化加载第一页，默认第一页
			pageSize: 10, //每页的记录行数（*）
			url: initObj.options.hostUrl + "challenge/listChallengeRecords?playerAccount=" + ClientAPI.getSubAccount(GameID.LOL), //这个接口需要处理bootstrap table传递的固定参数
			queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
			queryParams: queryParamsChallenge, //前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参数
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			minimumCountColumns: 1, //最少允许的列数
			clickToSelect: true, //是否启用点击选中行
			searchOnEnterKey: true,
			columns: [{
				field: 'Number',
				title: '序列',
				align: 'center',
				width: '10%',
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field: 'challengeDateTime',
				title: '时间',
				align: 'center',
				width: '20%',
				formatter: function(value, row, index) {
					return "<span style='color:#6291ad'>" + value + "</span>";
				}
			}, {
				field: 'challengeType',
				title: '类型',
				align: 'center',
				width: '15%',
				formatter: function(value, row, index) {
					return "<span style='color:#6291ad'>" + value + "</span>";
				}
			}, {
				field: 'serverName',
				title: '角色名/所在服务器',
				align: 'center',
				width: '20%',
				formatter: function(value, row, index) {
					return "<span style='color:#6291ad'>" + value + "</span>";
				}
			}, {

				field: 'score',
				title: '我的评分',
				align: 'center',
				width: '10%'
			}, {
				field: 'rank',
				title: '我的成绩',
				align: 'center',
				width: '15%',
				formatter: function(value, row, index) {
					if(value.indexOf("成功") != -1) {
						return "<span style='color:#ee9f03'>" + value + "</span>";
					} else {
						return value;
					}

				}
			}, {
				field: 'finished',
				title: '详情',
				align: 'center',
				width: '10%',
				formatter: function(value, row, index) {
					if(value) {
						return "<div onclick='checkRoom(" + JSON.stringify(row) + ")' style='cursor:pointer; color:#00aeff'>查看</div>";
					} else {
						return "<div style='cursor:pointer; color:#3a515c'>查看</div>";
					}

				}
			}]
		});

		function queryParamsChallenge(params) {
			return {
				pageSize: params.pageSize,
				pageNo: params.pageNo
			};
		}
	}

	//传递房间号调用房间列表
	this.checkRoom = function(row) {
		if(row) this_.initRoomTab(row.challengeRoomId, row.challengeType);
	}

	//查看详情
	this.initRoomTab = function(challengeRoomId, challengeType) {
		$('#tab_rooms').bootstrapTable('destroy');
		$('#tab_rooms').bootstrapTable({
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
			url: initObj.options.hostUrl + "challenge/listChallengeRoomPlayers?challengeRoomId=" + challengeRoomId + "&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL), //这个接口需要处理bootstrap table传递的固定参数
			queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
			queryParams: queryParamsRoom, //前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参数
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			minimumCountColumns: 1, //最少允许的列数
			clickToSelect: true, //是否启用点击选中行
			searchOnEnterKey: true,
			columns: [{
				field: 'rank',
				title: '排名',
				align: 'center',
				width: "10%",
				formatter: function(value, row, index) {
					if(value) {
						return "<span style='color:#9c9e9f'>" + value + "</span>";
					} else {
						return "-";
					}
				}
			}, {
				field: 'playerName',
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
				title: '所在区服',
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
				field: 'challengeState',
				title: '挑战状态',
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
				field: 'challengeFinishDateTime',
				title: '完成挑战时间',
				align: 'center',
				width: "25%",
				formatter: function(value, row, index) {
					if(value) {
						return value;
					} else {
						return "-"
					}
				}
			}, {
				field: 'score',
				title: '评分',
				align: 'center',
				width: "10%",
				formatter: function(value, row, index) {
					if(value) {
						return "<div style='color:#b55e0b'>" + (value.indexOf("超时") == -1 ? value : 0) + "</div>";
					} else {
						return "-";
					}
				}
			}],
			rowStyle: function rowStyle(row, index) {
				if(row.self) {
					return {
						css: {
							"background": '#0f2a30',
							'color': '#9c9e9f'
						}
					}
				} else {
					return {}
				}
			}
		});

		function queryParamsRoom(params) {
			return {
				pageSize: params.pageSize,
				pageNo: params.pageNo
			};
		}
//		$('#alert_ten .alert_title_h4').html("场次id:" + challengeRoomId);
		$('#alert_ten .alert_title_h1').html(challengeType);
		$('#alert_ten').modal();
	}

	//获取用户信息
	this.getUserInfo = function() {
		//判断是否登录。如果未登录则不查询
		if(!ClientAPI.getSubAccount(GameID.LOL)) return;
		$.ajax({
			type: 'POST',
			url: urlList.url_getUserInfo(),
			dataType: 'json',
			timeout: initObj.options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'],
						playName = data['playName'],
						serverName = data['serverName'],
						battleScore = data['battleScore'];
					$('#playName').html(playName + "(" + serverName + ")");
					$('#battleScore').html(battleScore);
					$('.status_box').show();
				}
			},
			error: function() {
				errorMsg("获取用户信息调用异常");
			}
		});
	}
	
	//获取挑战赛次数
	this.do_getChallengeLimitInfo = function() {
		$.ajax({
			type: 'POST',
			url: urlList.url_getChallengeLimitInfo(),
			dataType: 'json',
			timeout: initObj.options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'];
					initObj.options.levelLimitInfoObj = data;
					levelLimitDom(data);
				} else {
					alertMsg(obj['message'] || "获取挑战次数出错啦~");
				}
			},
			error: function() {
				errorMsg("获取挑战次数调用异常");
			}
		});
	}
	
	function levelLimitDom(data) {
			var right_pos_init=185;
			var limitStr  = new Array();
			var levelLimitInfoList = data.levelLimitInfoList;
			limitStr.push("今日现金报名返顺豆次数已用（"+data.returnTimes+"/"+data.returnTotalTimes+"）");
			for(var i = 0;i<levelLimitInfoList.length; i++) {
				var moneyStr = "",shunStr = "";
				if(levelLimitInfoList[i].moneyTotalTimes != null) {
					moneyStr = levelLimitInfoList[i].moneyTotalTimes==0?"不限":levelLimitInfoList[i].useMoneyTimes+"/"+levelLimitInfoList[i].moneyTotalTimes;
				}
				if(levelLimitInfoList[i].swbeanTotalTimes != null) {
					shunStr = levelLimitInfoList[i].swbeanTotalTimes==0?"不限":levelLimitInfoList[i].useSwBeanTimes+"/"+levelLimitInfoList[i].swbeanTotalTimes;
				}
				
				var tipStr = function (name) {
					if(moneyStr && shunStr) {
						return "今日顺豆报名"+name+"场已用次数（"+shunStr+"）<br>今日现金报名"+name+"场已用次数（"+moneyStr+"）";
					} else if(moneyStr) {
						return "今日现金报名"+name+"场已用次数（"+moneyStr+"）";
					} else if(shunStr) {
						return "今日顺豆报名"+name+"场已用次数（"+shunStr+"）";
					}
				}
				if(levelLimitInfoList[i].levelType == "普通场") {
					limitStr.push(tipStr("普通"));
				} else if(levelLimitInfoList[i].levelType == "贵宾场") {
					limitStr.push(tipStr("贵宾"));
				} else if(levelLimitInfoList[i].levelType == "土豪场") {
					limitStr.push(tipStr("土豪"));
				}
			}
			var posOption = function(pos,index) {
				$('.challenge_num').find('.tip_box span').css('right',pos);
				$('.challenge_num').find('.tip_box div').html(limitStr[index]);
				$('.challenge_num').find('.tip_box').show();
			}
			$('.challenge_num li').each(function(index) {
				var pos = (right_pos_init-index*30)+"px";
				$(this).hover(function() {
					posOption(pos,index)
				}, function() {
					$('.challenge_num').find('.tip_box').hide();
				})
			})
		}

	//开始挑战
	this.do_challenge = function(challengeLevelId) {
		$.ajax({
			type: 'POST',
			url: urlList.url_challenge(challengeLevelId),
			dataType: 'json',
			timeout: initObj.options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					initObj.options.payObj.challengeLevelId = challengeLevelId;
					alertAll(data);
				} else {
					alertMsg(obj['message'] || "开始挑战出错啦~");
				}
			},
			error: function() {
				errorMsg("开始挑战调用异常");
			}
		});
	}

	//进入房间开始游戏，不展示提示框后台进入
	this.do_enterRoom = function(obj) {
		var challengeLevelId =  obj.challengeLevelId,
			orderId =  obj.orderId,
			isShowShunResult =  obj.isShowShunResult;
		$.ajax({
			type: 'POST',
			url: urlList.url_enterRoom(challengeLevelId, orderId),
			dataType: 'json',
			timeout: initObj.options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'],
					retSwbean = data.retSwbean;
					if(retSwbean && retSwbean>0) {
						$('#alert_all #tab3 p span').html(retSwbean).show();
					} else {
						$('#alert_all #tab3 p').hide();
					}
					//刷新挑战列表
					this_.do_etChallengeLevelInfo();
					//进入游戏
					if(isShowShunResult) $('#alert_all .btn_enter').html('顺豆支付成功');
					startGame();
				} else {
					$('#alert_all').modal('hide');
					alertMsg(obj['message'] || "进入房间出错啦~");
				}
			},
			error: function() {
				$('#alert_all').modal('hide');
				errorMsg("进入房间调用异常");
			}
		});
	}

	//查询支付状态
	this.do_payFinished = function() {
		$.ajax({
			type: 'POST',
			url: urlList.url_payFinished(initObj.options.payObj.orderId),
			dataType: 'json',
			timeout: initObj.options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					//支付成功隐藏二维码页面，进入房间
					this_.closeQrcode(true);
				}
			},
			error: function() {
				errorMsg("查询支付调用异常");
			}
		});
	}

	//查询挑战赛状态接口
	this.do_queryChallengeMatchState = function() {
		$.ajax({
			type: 'POST',
			url: urlList.url_queryChallengeMatchState(),
			dataType: 'json',
			timeout: initObj.options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					initObj.options.challengeStatus.isLogin = data.isLogin;
					initObj.options.challengeStatus.matchType = data.matchType;
					initObj.options.challengeStatus.allowTeam = data.allowTeam;
					initObj.options.challengeStatus.limitMinute = data.limitMinute;
					initObj.options.challengeStatus.levelLimitMin = data.levelLimitMin;
					initObj.options.challengeStatus.levelLimitMax = data.levelLimitMax;
					initObj.options.challengeStatus.rankRemark = data.rankRemark;
				}
			},
			error: function() {
				errorMsg("查询挑战赛状态调用异常");
			}
		});
	}

	//获取所有挑战赛信息，用于切换
	this.do_getAllChallengeMatchInfo = function() {
		$.ajax({
			type: 'POST',
			url: urlList.url_getAllChallengeMatchInfo(),
			dataType: 'json',
			timeout: initObj.options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					if(data[0].challengeMatchId != initObj.options.challengeMatchId) {
						location.href = urlList.url_index(data[0].challengeMatchId);
					} else {
						location.href = urlList.url_index(data[1].challengeMatchId);
					}
				}
			},
			error: function() {
				errorMsg("获取所有挑战赛调用异常");
			}
		});
	}

	//获取挑战场次列表
	this.do_etChallengeLevelInfo = function() {
		$.ajax({
			type: 'POST',
			url: urlList.url_getChallengeLevelInfo(),
			dataType: 'json',
			timeout: initObj.options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					for(var i = 0; i < data.length; i++) {
						var awardSwBean = data[i].awardSwBean,
							levelName = data[i].levelName,
							challengeLevelId = data[i].challengeLevelId,
							countdown = data[i].countdown,
							levelType = data[i].levelType,
							applySwBean = data[i].applySwBean,
							gameType = data[i].gameType,
							applyWay = data[i].applyWay,
							applyMoney = data[i].applyMoney,
							//0：可挑战; 1：挑战倒计时; 2：不可挑战；3:暂未开放；4：明日再战
							state = data[i].state;
						$('#content_' + levelType + ' .content_name').html("<h2>"+levelName+"</h2><h3>"+gameType+"</h3>");
						var joinStr = "SwBean"==applyWay?"报名费：<span>"+applySwBean+"</span>顺豆":"报名费：<span>"+applyMoney+"</span>元";
						$('#content_' + levelType + ' .challenge_remind .normal_remind').html(joinStr);
						analysisChallenge(challengeLevelId);
					}

					function analysisChallenge(challengeLevelId) {
						//奖励顺豆dom
						var dom_shun = $('#content_' + levelType + ' .normal_modal');
						//奖励顺豆数目dom
						var dom_num_shun = $('#content_' + levelType + ' .num_normal .f30');
						//倒计时dom
						var dom_count_back = $('#content_' + levelType + ' .num_count');
						//操作按钮dom
						var dom_button = $('#content_' + levelType + ' a');
						//显示倒计时提示文字dom
						var dom_normal_remind = $('#content_' + levelType + ' .challenge_remind .normal_remind');
						//显示报名顺豆提示文字dom
						var dom_count_remind = $('#content_' + levelType + ' .challenge_remind .count_remind');
						//取消绑定hover事件
						dom_button.off('mouseenter').off('mouseleave').off('click');
						if(state == 1) { //挑战倒计时
							var countTime = new Date().getTime() + countdown * 1000;
							dom_count_back.show();
							//处理倒计时
							countBack(countTime, '#content_' + levelType + ' .num_count');
							dom_shun.hide();

							dom_button.removeClass().addClass('state_0').show();
							dom_normal_remind.hide();
							dom_count_remind.show();

							//绑定开始游戏
							$('#content_' + levelType + ' a').on('click', function() {
								startGame();
							})
						} else if(state == 0) { //可挑战
							dom_num_shun.html(awardSwBean);
							dom_shun.show();
							dom_count_back.hide();

							//设置按钮
							dom_button.removeClass().addClass('state_1').show();
							dom_normal_remind.show();
							dom_count_remind.hide();
							//绑定可挑战点击
							dom_button.on('click', function(e) {
								e.preventDefault();
								this_.do_challengeValidate(false, initObj.options.challengeMatchId, initObj.options.challengeStatus.levelLimitMin,initObj.options.challengeStatus.levelLimitMax, initObj.options.challengeStatus.rankRemark, function() {
									this_.do_challenge(challengeLevelId);
								});
							})
						} else if(state == 2 || state == 3 || state == 4) { //不可挑战
							dom_num_shun.html(awardSwBean);
							dom_shun.show();
							dom_count_back.hide();
							//设置按钮
							dom_button.removeClass().addClass('state_' + state).show();
							dom_normal_remind.show();
							dom_count_remind.hide();
						}
					}

				} else {
					alertMsg(obj['message'] || "场次列表出错啦~");
				}
			},
			error: function() {
				errorMsg("场次列表调用异常");
			}
		});
	}

	//测试调用
	var ClientAPI = {
		getSubAccount:function(str) {
			return 1111111;
		},
		getLoginXingYun:function(str) {
			return true;
		}
	},
	GameID = {
		LOL : 1	
	}
		
	/**
	 * 挑战校检
	 * @param validateLoginOnly boolean类型,true只校检登陆；false校检等级限制，段位限制等
	 * @param challengeMatchId
	 * @param levelLimitMin
	 * @param rankRemark
	 * @param callback 回调逻辑
	 */
	this.do_challengeValidate = function(validateLoginOnly, challengeMatchId, levelLimitMin, levelLimitMax ,rankRemark, callBack) {
		var gameId = GameID.LOL;
		//校检火马登录
		var user = ClientAPI.getLoginXingYun();
		if(!user.hasOwnProperty("userId") || user.userId == 0) {
			//调起登陆窗
			ClientAPI.startLogin('VC_LOGIN');
			return;
		}
		//只校检登陆
		if(validateLoginOnly) {
			callBack();
			return;
		}
		//校检游戏登录
		var loginGame = ClientAPI.getLoginGame(gameId);
		if(!loginGame) {
			$("#alert_msg2 .alert_title_h1").html("<p>请先登录<span class='blue'>" + GameName.get(gameId) + "</span>，才能报名参加比赛哦</p>");
			$("#alert_msg2").modal();
			$("#alert_msg2 .user_agreement").hide();
			$("#alert_msg2 .btn_sure").off("click").on("click", function() {
				$("#alert_msg2").modal("hide");
				//调起游戏登陆
				ClientAPI.switchStartInfo(gameId, true);
			});
			return;
		}

		//校检等级
		if(loginGame.level < levelLimitMin) {
			alertMsg("召唤师等级<span class='blue'>未满"+levelLimitMin+"级</span>，不能参与挑战哦~");
			return;
		}
		//校检等级
		if(loginGame.level > levelLimitMax) {
			alertMsg("召唤师等级<span class='blue'>超过"+levelLimitMax+"级</span>，不能参与挑战哦~");
			return;
		}

		//校检挑战赛状态和用户绑定关系
		var postData = {};
		postData.challengeMatchId = challengeMatchId;
		postData.gameId = gameId;
		postData.account = loginGame.account;
		var resultData = Action.getData(urlList.url_checkChallengeMatchUserState(gameId), postData);
		if(!resultData) {
			errorMsg("服务器异常，请稍后再试！");
			return;
		}

		if(!resultData['success'] && resultData['code']) {
			if(resultData['code'] == 1004) {
				var otherUser = resultData['data'];
				var head = staticPath + "upload/userhead/middle/" + ((otherUser.headImgUrl) ? otherUser.headImgUrl : "1") + ".png";
				$("#quick-switch .f14").html(GameName.get(loginGame.gameId) + '账号<span class="blue">' + loginGame.account + '</span>已绑定过火马账号，您可以：');
				$("#quick-switch .head_pic").attr("src", head);
				$("#quick-switch .changegame").show();
				$("#quick-switch").modal();
				$("#quick-switch .otherUser").off("click").on("click", function() {
					//调起客户端快速登录窗
					User.loginOtherUser(otherUser.userIdHex, function(retData) {
						if(retData.success) {
							$("#quick-switch").modal("hide");
						} else {
							errorMsg(retData.message);
						}
					});
				});
			} else {
				errorMsg(resultData.message);
			}
			return;
		}
		callBack();
		return;
	}
}