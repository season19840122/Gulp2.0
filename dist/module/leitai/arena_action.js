var ACTIONFUN = function(initObj) {
	var this_ = this,
		FAILMSG = "调用失败",
		FLAGDM = true;
		TOPIC_BULLET = 'bullet',
		TOPIC_LIKE = 'like',
		TOPIC_STAT = 'stat',
		NOW_VIDEO_URL = '',
		NOW_TEAM_ID = "",//下注队伍id
		NOW_MATCH_ID = "",//擂台赛id
		NOW_BEAN_NUM = "",//当前选择顺豆
		NOW_ORDER_ID = "",//当前二维码订单id
		NOW_MONEY_NUM = "",//当前选择现金
		TEXTS = ['♪', '♩', '♭', '♬'],
		FILTERSTR = ["fuck", "tmd", "他妈的", "妈卖批", "傻逼", "操你妈", "麻痹", "你麻痹", "畜生", "婊子", "垃圾", "死全家", "骨灰"],
		OLD_VIDEO_DOM = function(content, videoUrl,className) {
			return "<li class=" + (className ? className : '') + ">" + content + "<input type='hidden' value='"+videoUrl+"'></li>";
		},
		ZAN_DOM = function(title, award,bean,money, className) {
			return "<li class=" + (className ? className : '') + "><h1>"+title+"</h1><h2>"+award+"</h2><input type='hidden' id='bean_' value='"+bean+"'><input id='money_' type='hidden' value='"+money+"'></li>";
		},
		HEIGHT_VIDEO_DOM = function(imgUrl, videoUrl,content) {
			return "<li><img src='" + imgUrl + "'/><p>" + content + "</p><input type='hidden' value='"+videoUrl+"'></li>";
		};

	var actionObj = {
		getArenaMatchData: {
			name: "擂台赛页面",
			url: function() {
				return initObj.options.hostUrl + "arenaMatch/arenaMatchData";
			}
		},
		getTeamEnroll: {
			name: "挑战赛报名",
			url: function() {
				return initObj.options.hostUrl + "arenaMatch/teamEnroll?userId="+initObj.do_getUserId();
			}
		},
		toGuessArena: {
			name: "竞猜用户明细",
			url: function(schoolDayId) {
				return initObj.options.hostUrl + "arenaMatchGuess/toGuessArena?userId="+initObj.do_getUserId();
			}
		},
		support: {
			name: "支付",
			url: function(payType) {
				return initObj.options.hostUrl + "arenaMatchGuess/support?teamId=" + NOW_TEAM_ID
				+"&arenaMatchId="+NOW_MATCH_ID
				+"&money="+NOW_MONEY_NUM
				+"&barId="+ClientAPI.getBarId()
				+"&payType="+payType
				+"&userId="+initObj.do_getUserId()
				+"&payValue="+NOW_BEAN_NUM;
			}
		},
		qrcodePayPara: {
			name: "获取支付二维码",
			url: function() {
				return initObj.options.hostUrl + "arenaMatchGuess/qrcodePayParam"
				+"?matchId="+NOW_MATCH_ID
				+"&money="+NOW_MONEY_NUM
				+"&userId="+initObj.do_getUserId()
				+"&barId="+ClientAPI.getBarId();
			}
		},
		payFinished: {
			name: "查询支付",
			url: function() {
				return initObj.options.hostUrl + "arenaMatchGuess/payFinished?orderId="+NOW_ORDER_ID;
			}
		}
	}

	this.eventElement = function() {
		$(function() {
			//操作弹幕
			$('.dm_switch').on('click', function() {
				if(FLAGDM) { //关闭弹幕
					$(this).find('span').eq(0).html('开');
					$(this).find('span').eq(1).html('启');
					$(this).siblings('div').hide();
					$('.right_box').removeClass('remove_dm').addClass('close_dm');
					FLAGDM = false;
				} else { //开启弹幕
					$(this).find('span').eq(0).html('关');
					$(this).find('span').eq(1).html('闭');
					$(this).siblings('div').show();
					$('.right_box').attr('class', 'right_box');
					FLAGDM = true;
				}
			})
			
			//战队报名
			$('#join').on('click',function() {
				initObj.do_checkLogin(function() {
					do_getTeamEnroll();
				})
			})

			//规则
			$('#rules').on('click', function() {
				$('#rules_box').modal();
			});

			//弹出赔率
			$('.team_box .normal_box .zan_hand').hover(function() {
				if(!$('.team_box').hasClass('zhu_off') && !$('.team_box').hasClass('ke_off') && !$('.team_box').hasClass('off')) {
					$(this).siblings('h1').show();
					$(this).addClass('big');
				}
			}, function() {
				$(this).siblings('h1').hide();
				$(this).removeClass('big');
			});

			//返回火马
			$('.go_back').on('click', function(e) {
				e.preventDefault();
				goBack();
			});

			//押注点击
			$('#zan_box ul').on('click', 'li', function() {
				$(this).siblings('li').removeClass('on');
				$(this).addClass('on');
				NOW_BEAN_NUM = $(this).find('#bean_').val();
				NOW_MONEY_NUM = $(this).find('#money_').val();
			})
			
			//返回播放
			$('.right_box .play_box').on('click', function() {
				$('.right_box').attr('class','right_box');
				$('.dm_box iframe').attr('src',NOW_VIDEO_URL);
			})
			
			//点击往期视频
			$('.bottom ul').on('click','li',function() {
				var videoUrl = $(this).find('input').val();
				$('.dm_box iframe').attr('src',videoUrl);
				$(this).siblings('li').removeClass('on');
				$(this).addClass('on');
				//如果竞猜结束不显示正在直播窗口按钮
				if($('.right_box .middle').css('display') == 'none') return;
				$('.right_box').attr('class','right_box').addClass('ready_play');
				$('.dm_switch').find('span').eq(0).html('关');
				$('.dm_switch').find('span').eq(1).html('闭');
				$('.dm_switch').siblings('div').show();
				FLAGDM = true;
			})
			
			//点击精彩集锦
			$('.rec_video ul').on('click','li',function() {
				var videoUrl = $(this).find('input').val();
				$('.dm_box iframe').attr('src',videoUrl);
				//如果竞猜结束不显示正在直播窗口按钮
				if($('.right_box .middle').css('display') == 'none') return;
				$('.right_box').attr('class','right_box').addClass('ready_play');
				$('.dm_switch').find('span').eq(0).html('关');
				$('.dm_switch').find('span').eq(1).html('闭');
				$('.dm_switch').siblings('div').show();
				FLAGDM = true;
			})
			
			//绑定点击支付顺豆
			$('#zan_box .modal-footer div').eq(0).on('click',function() {
				do_support(1);
			})
			//绑定点击支付扫码
			$('#zan_box .modal-footer div').eq(1).on('click',function() {
				do_qrcodePayPara();
			})
			
			//关闭支付框
			$('#pay_qrcode').on('hidden.bs.modal', function() {
				closeQrcode();
			});
		})
	}

	//发送弹幕初始化方法
	this.yunbaInit = function() {
		window.yunba = new Yunba({
			server: 'sock.yunba.io',
			port: 3000,
			appkey: initObj.options.APPKEY
		});

		yunba.init(function(success) {
			if(success) {
				connect_by_customid();
			} else {
//				initObj.showMsg('弹幕服务器初始化失败');
			}
		});

		function connect_by_customid() {
			// 连接云巴服务器
			var cid = Math.random().toString().substr(2);
			yunba.connect_by_customid(cid,function(success, msg, sessionid) {
				if(success) {
					// 订阅弹幕 TOPIC
					yunba.subscribe({
							'topic': TOPIC_BULLET
						},
						function(success, msg) {
							if(success) {
								$('.send_btn').off('click');
								$('.send_btn').on('click', function() {
									var bullet = $('#dm_str').val();
									$('#dm_str').val("");
									sendMsg(filter(bullet));
								})

								$('#dm_str').keydown(function(event) {
									//回车执行查询
									if(event.keyCode == 13) {
										$('.send_btn').click();
									}
								});
							} else {
								initObj.showMsg('订阅弹幕失败：' + msg);
							}
						});

					// 设置收到信息回调函数
					yunba.set_message_cb(yunba_msg_cb);
				} else {
					initObj.showMsg('弹幕服务器连接失败');
				}
			});
		}

		function yunba_msg_cb(data) {
			if(data.topic === TOPIC_BULLET) {
				// 弹幕
				scrollDm(data.msg);
			}
		}

		function sendMsg(msg) {
			yunba.publish({
					topic: TOPIC_BULLET,
					msg: msg
				},
				function(success, msg) {
					if(success) {} else {
						initObj.showMsg('弹幕服务器发送失败：' + msg);
					}
				}
			);
		}

		var pmh = 100;
		var pmw = 840;

		function colorRandom() {
			var Rand = Math.random();
			var num = Math.round(Rand * 9); //四舍五入
			var colorArr = ["#00f6ff", "#eaff00", "#1eff00", "#f247ec", "#f24747", "#ffffff", "#ff006c", "#76b5d5", "#6bffef", "#ff3600"];
			return colorArr[num];
		}
		//控制弹幕发送
		function scrollDm(str) {
			var dd = document.createElement('div');
			var ds = document.getElementsByClassName('dm_content')[0];
			dd.setAttribute('class', 'ss');
			dd.innerHTML = str;
			ds.appendChild(dd);
			$(dd).css('color', colorRandom);
			dd.style.fontSize = Math.floor(Math.random() * 7 + 14) + 'px';
			dd.style.left = Math.floor(Math.random() * 10 + 900) + 'px';
			dd.style.top = Math.floor(Math.random() * pmh + 15) + 'px';
			var l = pmw - dd.offsetWidth;
			var tim = null;
			tim = setInterval(function() {
				l--;
				if(l <= (0 - dd.offsetWidth)) {
					clearInterval(tim);
					ds.removeChild(dd);
				}
				dd.style.left = l + 'px';
			}, 13);
		}

		//敏感字过滤
		function filter(str) {
			for(var i = 0; i < FILTERSTR.length; i++) {
				var r = new RegExp(FILTERSTR[i], "ig");
				str = str.replace(r, "*");
			}
			return str;
		}
	}

	//定义按钮事件状态机
	var btnStatus = function(dom, callBack, par) {
		var this_ = this;

		//绑定事件
		this.init = function() {
			dom.on('click', function() {
				this_.transition();
			});
		}

		//状态转换
		this.transition = function() {
			callBack(par, dom);
		}
	}

	//方法初始化
	this.init = function() {
		do_getArenaMatchData();
	}

	//战队报名
	var do_getTeamEnroll = function() {
		initObj.ajax_({
			name: actionObj.getTeamEnroll.name,
			url: actionObj.getTeamEnroll.url(),
			success: function(obj) {
				if(obj.success && obj.code == 0) {
					$('#team_five').modal();
				} else {
					initObj.showMsg(obj.message);
				}
			}
		});
	}

	//获取擂台赛
	var do_getArenaMatchData = function(flag) {
		initObj.ajax_({
			name: actionObj.getArenaMatchData.name,
			url: actionObj.getArenaMatchData.url(),
			success: function(obj) {
				if(obj.success && obj.code == 0) {
					setInfo(obj.data,flag);
				} else {
					initObj.showMsg(actionObj.getArenaMatchData.name + FAILMSG);
				}
			}
		});
	}

	//设置首页信息
	var setInfo = function(data,falg) {
		//设置往期视频
		var oldArr = data.oldArenaMatchs.map(function(v, index) {
			var className = (index == 0 ? 'on' : null);
			return OLD_VIDEO_DOM(new Date(v.onlineTime).Format("yyyy.MM.dd") + v.catalog + "-" + v.title, v.videoUrl, className);
		})
		$('.right_box .bottom ul').html(oldArr.join(""));

		//设置精彩集锦
		var heightArr = data.highlightVideos.map(function(v, index) {
			return HEIGHT_VIDEO_DOM(v.imgUrl, v.videoUrl,v.title);
		})
		$('.rec_video ul').html(heightArr.join(""));

		//设置规则
		var rulesArr = data.matchRole.map(function(v) {
			return "<p>"+v+"</p>";
		})
		$('#rules_box .modal-body div').html(rulesArr.join(""));

		//设置直播地址
		NOW_VIDEO_URL = data.live_video_url;
		if(!falg) $('.dm_box iframe').attr('src',data.live_video_url);
		//设置竞猜金额面板信息
		var zanObj = [
			{title:'小小鼓励',bean:data.guess_swbean,money:data.guess_money,award:(data.allow_money==1?data.guess_swbean+'顺豆/￥'+data.guess_money:data.guess_swbean+'顺豆')},
			{title:'大力支持',bean:data.guess_swbean*5,money:data.guess_money*5,award:(data.allow_money==1?data.guess_swbean*5+'顺豆/￥'+data.guess_money*5:data.guess_swbean*5+'顺豆')},
			{title:'全力以赴',bean:data.guess_swbean*10,money:data.guess_money*10,award:(data.allow_money==1?data.guess_swbean*10+'顺豆/￥'+data.guess_money*10:data.guess_swbean*10+'顺豆')},
			{title:'必胜',bean:data.guess_swbean*20,money:data.guess_money*20,award:(data.allow_money==1?data.guess_swbean*20+'顺豆/￥'+data.guess_money*20:data.guess_swbean*20+'顺豆')}
		];
		NOW_MONEY_NUM = data.guess_money;
		NOW_BEAN_NUM = data.guess_swbean;
		data.allow_money==1?$('#zan_box .modal-footer div').eq(1).show():$('#zan_box .modal-footer div').eq(1).hide();
		var zanArr = zanObj.map(function(v,index) {
			var className = (index == 0?'on':'');
			return ZAN_DOM(v.title,v.award,v.bean,v.money,className);
		})
		$('#zan_box ul').html(zanArr.join(""));

		//设置攻擂手雷信息
		var arenaObj = data.arenaMatch;
		NOW_MATCH_ID = arenaObj.arenaMatchId;
		$('.team_box .zhu img').attr('src',data.arenaTeamLogo);
		$('.team_box .ke img').attr('src',data.attackTeamLogo);
		$('.team_box #zhu_name').html(arenaObj.teamName);
		$('.team_box .zhu .zan_num').html(arenaObj.arenaCnt);
		$('.team_box #ke_name').html(arenaObj.attackTeamName);
		$('.team_box .ke .zan_num').html(arenaObj.attackCnt);
		//计算赔率 赔率＝总顺豆奖池/本方竞猜份数/单份竞猜顺豆
		var zhuPl = (arenaObj.swBeanPool/arenaObj.arenaTimesCnt/data.guess_swbean).toFixed(2);
		$('.team_box .zhu h1').html("赔率 1:"+zhuPl);
		var kePl = (arenaObj.swBeanPool/arenaObj.attackTimesCnt/data.guess_swbean).toFixed(2);
		$('.team_box .ke h1').html("赔率 1:"+kePl);
		settleTime = new Date(arenaObj.settleTime).getTime();//结算时间
		guessBeginTime = new Date(arenaObj.guessBeginTime).getTime();//竞猜开始时间
		guessEndTime = new Date(arenaObj.guessEndTime).getTime();//竞猜结束时间
		playTime = new Date(arenaObj.playTime).getTime();//直播播放时间
		systemTime = new Date(data.systemTime).getTime();//当前系统时间
		base_award = parseFloat(data.base_award);
		combo_award = parseFloat(data.combo_award);
		var shouCash = base_award+combo_award*arenaObj.continueDayCnt;//守擂奖金
		var gongCash = base_award;//攻擂奖金
		//设置右边擂台信息
		$('.right_box .top').css('background','url('+data.profile_img_url+')');
		$('#left_zu').html(arenaObj.teamName);
		$('#right_zu').html(arenaObj.attackTeamName);
		$('#s_win').html("守擂获胜￥"+shouCash);
		$('#g_win').html("攻擂获胜￥"+gongCash);
		
		//设置右边模块直播详情
		if(systemTime < playTime) {//显示预告
			$('.middle .title>span').html("节目预告");
			$('.middle .title #name').html(arenaObj.title);
		} else if(systemTime >= playTime && systemTime < settleTime) {//显示直播队伍
			$('.middle .title>span').html("正在直播");
			$('.middle .title #name').html(arenaObj.title);
		}
		
		
		$('.team_box').attr('class','team_box');
		$('.right_box').attr('class','right_box');
		$('.dm_switch').show();
		//status 1 当前用户有竞猜
		if(data.isGuessed) {
			$('.team_box').addClass('normal');
			console.log("1 当前用户有竞猜");
			if(data.GuessedTeamId == arenaObj.arenaMatchId) {//支持过守擂
				$('.team_box').addClass('zhu_off');
			} else if(data.GuessedTeamId == arenaObj.attackTeamId) {//支持过攻擂
				$('.team_box').addClass('ke_off');
			}
			return;
		}
		
		//status 2 竞猜开始 (从本期竞猜开始时间－本期结算时间之间显示竞猜)
		if(data.guess_switch == 1 && systemTime >= guessBeginTime && systemTime < settleTime) {
			$('.team_box').addClass('normal');
			console.log("2 可以竞猜");
			//点赞
			$('.zhu .zan_hand').off('click');
			$('.zhu .zan_hand').click(function() {
				initObj.do_checkLogin(function() {
					NOW_TEAM_ID = arenaObj.arenaMatchId;
					do_toGuessArena();
				})
			});
			$('.ke .zan_hand').off('click');
			$('.ke .zan_hand').click(function() {
				initObj.do_checkLogin(function() {
					NOW_TEAM_ID = arenaObj.attackTeamId;
					do_toGuessArena();
				})
			});
			return;
		}
		
		//status 3 不显示竞猜按钮和赔率(从本期竞猜结束时间－本期结算时间之前)
		if(data.guess_switch != 1 || systemTime >= guessEndTime && systemTime < settleTime) {
			$('.team_box').addClass('normal');
			console.log("3 不可竞猜");
			$('.team_box').addClass('off');
			return;
		}
		
		//status 4 显示竞猜结果(从本期结算时间－下期竞猜开始时间)  isWin = 1(g攻擂赢) 0 (攻擂输)
		if(systemTime >= settleTime) {
			console.log("4 显示竞猜结果");
			$('.team_box').addClass('win');
			$('.right_box').addClass('remove_dm');
			$('.dm_switch').hide();
			
			if(arenaObj.isWin == 1) {//攻擂赢
				$('.team_box .win_pic').attr('src',data.attackTeamLogo);
				$('.win_box').removeClass('zhu_win').addClass('ke_win');
				$('.win_box h1').html(arenaObj.attackTeamName);
				$('.win_box h2').html(arenaObj.attackTeamName);
				$('.win_box h2').html("恭喜"+arenaObj.attackTeamName+"获胜，获得"+gongCash+"元奖金！");
			} else if(arenaObj.isWin == 0) {//守擂赢
				$('.team_box .win_pic').attr('src',data.arenaTeamLogo);
				$('.win_box').removeClass('ke_win').addClass('zhu_win');
				$('.win_box h1').html(arenaObj.teamName);
				$('.win_box h2').html("恭喜"+arenaObj.teamName+"获胜，获得"+shouCash+"元奖金！");
			}
			return;
		}
		
	}
	

	//竞猜用户明细
	var do_toGuessArena = function() {
		initObj.ajax_({
			name: actionObj.toGuessArena.name,
			url: actionObj.toGuessArena.url(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					$('#zan_box p').html("顺豆余额："+obj.data.swBeanCnt);
					$('#zan_box').modal();
				} else if(!obj['success']) {
					initObj.showMsg(actionObj.toGuessArena.name + FAILMSG);
				}
			}
		});
	}

	//去支付
	var do_support = function(payType) {
		initObj.ajax_({
			name: actionObj.support.name,
			url: actionObj.support.url(payType),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					do_getArenaMatchData(true);
					initObj.showMsg("支付成功");
				} else if(!obj['success']) {
					initObj.showMsg(actionObj.support.name + FAILMSG);
				}
			}
		});
	}

	//获取二维码信息
	var do_qrcodePayPara = function() {
		initObj.ajax_({
			name: actionObj.qrcodePayPara.name,
			url: actionObj.qrcodePayPara.url(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					initQrcode(obj.data);
				} else if(!obj['success']) {
					initObj.showMsg(actionObj.qrcodePayPara.name + FAILMSG);
				}
			}
		});
	}
	
	//扫码倒计时
	var qrcodeTimeBack = function() {
		initObj.options.timeNum--;
		initObj.options.timeBack = setTimeout(function() {
			if(initObj.options.timeNum <= 0) {
				closeQrcode();
				return;
			}
			qrcodeTimeBack();
		}, 1000);
	}
	
	//关闭二维码框处理事件
	var closeQrcode = function() {
		clearInterval(initObj.options.timeQuery);
		clearTimeout(initObj.options.timeBack);
		initObj.options.timeNum = 300;
		$('#pay_qrcode').modal('hide');
	}
	
	function initQrcode(data) {
		$('#pay_qrcode').find('h1').html("支付现金："+data.money+"元");
		$('#pay_qrcode').find('.alert_img_qrcode').empty().qrcode({width: 120,height: 120,text: data.qrcodeUrl,render:"canvas",correctLevel:1});
		NOW_ORDER_ID = data.orderId;
		$('#pay_qrcode').modal();
		qrcodeTimeBack();
		//轮训查询支付状态
		initObj.options.timeQuery = setInterval(function() {
			do_payFinished();
		}, 3000);
	}

	var do_payFinished = function() {
		initObj.ajax_({
			name: actionObj.payFinished.name,
			url: actionObj.payFinished.url(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					closeQrcode();
					do_support(0);
				}
			}
		});
	}
}