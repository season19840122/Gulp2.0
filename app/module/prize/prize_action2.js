var ACTIONFUN = function(initObj) {
	var this_ = this;
	var isGuid = true;
	var scrollTime = null,speed=50,isClickAgain = true;
	var awardObj = {};
	var closeFlag = false;//是否允许抽奖标识
	var joinAgain = true;//是否有机会
	var statusNum = 0;
	/**
	 * 10001;//抽奖按钮免费
	 * 10002;//抽奖按钮可以抽奖
	 * 10007;//未登录需要处理
	 */
	var btnStatus = 0;
	var urlList = {
		//奖品列表
		url_list :function() {
			return initObj.options.hostUrl+"/awardProduct/list";
		},
		//抽奖
		url_prizeDraw :function() {
			return initObj.options.hostUrl+"/awardProduct/prizeDraw";
		},
		//获取按钮状态
		url_btn :function() {
			return initObj.options.hostUrl+"/awardProduct/btn";
		},
		//点击兑换
		url_exchange :function(productId) {
			return initObj.options.hostUrl+"/awardProduct/exchange?productId="+productId;
		},
		//我的奖品
		url_myAward :function() {
			return initObj.options.hostUrl+"/AwardProductProgress/getMyAward.do";
		},
		//获奖记录
		url_awardLog :function() {
			return initObj.options.hostUrl+"/userAwardLog/getTopTwentyAwardLog.do";
		}
	}
	
	this.eventElement = function() {
		$(function(){
			//活动规则
			$('.rules_box img').on('click',function() {
				$('.rules_box').animate({'bottom':'-900px'},200);
			})
			$('.title_box .title_rules').on('click',function() {
				if(!isClickAgain) return;
				$('.rules_box').animate({'bottom':'0px'},200);
			})
			$('.alert_box .pic_close').on('click',function() {
				$('.alert_box').hide();
				//初始化抽奖按钮
				isChou(false);
				$('.bg').hide();
			})
			
			//规则说明
			$('.rule-wrap').hover(function(){
	          $(this).find('div').show();
	        }, function(){
	          $(this).find('div').hide();
	        })
			
			//点击兑换
			$('.award').on('click','.ul-award .tip',function() {
				if(btnStatus == 10007) {//去登陆
					ClientAPI.startLogin('VC_LOGIN');
					return;
				}
				var proId = $(this).attr('data-id');
				var pic = $(this).attr('data-pic');
				var proName = $(this).attr('data-name');
				this_.go_exchange(proId,pic,proName);
			})
			
			//返回
			$('.back').on('click',function() {
				goBack();
			})
		})
	}
	
	function guide() {
		$('.guide_box').show();
		var step = 1;
		$('.guide_box .guide3').on('click',function() {
			if(step == 1) {
				$('.guide_box .guide5').hide();
				$('.guide_box .guide4').show();
				step = 2;
			} else if(step == 2) {
				$('.guide_box .guide3').hide();
				$('.guide_box .guide1').show();
				$('.guide_box .guide4').hide();
				$('.guide_box .guide2').show();
			}
		});
		$('.guide_box .guide1').on('click',function() {
			$('.guide_box').hide();
		});
	}
			
	var alertMsg = function(obj) {
		$('.prize_msg,.remind_msg').hide();
		if(obj.type=="prize") {
			$('.prize_msg h1').html(obj.awardObj.msg);
			$('.prize_msg p').html(obj.awardObj.remind);
			$('.prize_msg').show();
			//刷新按钮状态
			this_.go_btn();
			//刷新获奖记录
			this_.do_awardLog();
		} else if(obj.type == "msg") {
			$('.remind_msg').html(obj.msg).show();
		}
		$('.alert_box').show();
	}	
	
	$.AJAX = function(obj) {
		$.ajax({
			type: obj.type || 'POST',
			url: obj.url,
			data:"activityId="+initObj.options.activityId,
			dataType: obj.dataType || 'json',
			timeout: initObj.options.ajaxTimeout,
			success: obj.success,
			error: obj.error || function() {
				alertMsg({type:'msg',msg:obj.name+"调用异常"});
			},
			complete :function(e) {
				console.log(e);
			}
		});
	}
	
	var showScroll = function() {
		$('.prize_box .bg').show();
		speed=50;
		$('.prize_box .prize_div').css('z-index','0');
		scrollImg(0);
	}
	
	var scrollImg = function(num) {
		if(num == 0) {
			$('#prize'+num).css('z-index','100');
		} else if(num >0 && num <8) {
			$('#prize'+(num-1)).css('z-index','0');
			$('#prize'+num).css('z-index','100');
		} else if(num == 8) {
			$('#prize'+(num-1)).css('z-index','0');
			num = 0;
			$('#prize'+num).css('z-index','100');
		}
		speed+=5;
		scrollTime = setTimeout(function() {
			if(speed == 180) speed = 300;
			//判断奖品是否抽中
			if(speed>=320) {
				var awardId_ = $('#prize'+num).find('input').val();
				
				
				if(awardId_ == awardObj.awardId) {
					clearTimeout(scrollTime);
					alertMsg({type:'prize',awardObj:awardObj});
					return;
				}
			}
			scrollImg(++num);
		},speed);
		
	}
	
	//获取奖品信息
	this.do_awardProduct = function() {
		$.AJAX({
			name:"获取奖品列表",
			url: urlList.url_list(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'];
					for(var i = 0;i<data.length;i++) {
						var prizeObj = new Array();
						var imgSrc = initObj.options.hostImg+'images/'+data[i].pic || initObj.options.hostImg+'images/prize_no1.png';
						prizeObj.push("<img src='"+imgSrc+"' >");
						prizeObj.push("<p>"+data[i].productName+"</p>");
						prizeObj.push("<input type=hidden value='"+data[i].awardProductId+"'>");
						$('#prize'+i).attr('title',data[i].productInfo).html(prizeObj.join(""));
						$('#prize'+i).find('p,img').show();
					}
					$('.prize_box .prize_div').tooltip();
				} else if(!obj['success']) {
					alertMsg({type:'msg',msg:obj['message'] || "奖品列表调用失败"});
				}
			}
		});
	}
	
	function isChou(flag) {
		if(closeFlag) return;
		//true标示点击开始抽奖
		if(flag) {
			isClickAgain = false;
			$('.prize_enter').removeClass('normal').addClass('enter');
			$('.prize_enter p,.prize_enter h3').hide();
			$('.prize_enter h2').show();
		} else {
			//false标示结束抽奖或者
			$('.prize_enter').removeClass('enter').addClass('normal');
			$('.prize_enter p,.prize_enter h3').show();
			$('.prize_enter h2').hide();
			isClickAgain = true;
		}
	}
	
	//抽奖
	this.do_prizeDraw = function() {
		isChou(true);
		$.AJAX({
			name:"抽奖",
			url: urlList.url_prizeDraw(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'],
						award = data.award,
						awardProductId = award.awardProductId,
						productName = award.productName,
						catalog = award.catalog,
						pic = award.pic;
						
					awardObj.awardId = awardProductId;
					awardObj.productName = productName;
					awardObj.pic = pic;
					
					var statusStr;
					if(statusNum > 1 ) {
						statusStr = "今天还有"+(statusNum-1)+"次机会";
					} else if(statusNum == 1) {
						statusStr = "今天机会已用完~"
					}
					$('.prize_enter h3').html(statusStr);
					if(catalog == 6) {//顺豆
						awardObj.msg = "恭喜您获得<span>"+productName+"</span>, "+statusStr;
						awardObj.remind = "";
					} else {
						awardObj.msg = "恭喜您获得<span>"+productName+"</span>, "+statusStr;
						awardObj.remind = "访问“我的-我的奖品”即可领取";
					}
					showScroll();
				} else {
					isChou(false);
					alertMsg({type:'msg',msg:obj['message'] || "抽奖调用失败"});
				}
			},
			error:function() {
				isChou(false);
				alertMsg({type:'msg',msg:"抽奖调用异常"});
			}
		});
	}
	
	
	//获取按钮状态
	this.go_btn = function() {
		$.AJAX({
			name:"获取状态",
			url: urlList.url_btn(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'],
						sate = data.sate,
						btnText = data.btnText;
					btnStatus = sate;
					setBtn(sate,btnText);
				} else if(!obj['success']) {
					alertMsg({type:'msg',msg:obj['message'] || "获取状态调用失败"});
				}
			}
		});
	}
	
	function setBtn(sate,btnText) {
		statusNum = btnText;
		if(sate == 10007) {//去登录
			$('.prize_enter').removeClass('enter').addClass('normal');
			$('.prize_enter p,.prize_enter h3').show();
			$('.prize_enter h3').html("请登录").show();
		} else if(sate == 10001) {//免费
			$('.prize_enter').removeClass('enter').addClass('normal');
			$('.prize_enter p,.prize_enter h3').show();
			$('.prize_enter h2').hide();
			$('.prize_enter h3').html("第一次免费哦");
		} else if(sate == 10002) {//可以抽
			$('.prize_enter').removeClass('enter').addClass('normal');
			$('.prize_enter p,.prize_enter h3').show();
			$('.prize_enter h2').hide();
			$('.prize_enter h3').html("今天还有"+btnText+"次机会");
		} else if(sate == 10003) {//没有抽奖机会
			$('.prize_enter').removeClass('enter').addClass('normal');
			$('.prize_enter p,.prize_enter h3').show();
			$('.prize_enter h2').hide();
			$('.prize_enter h3').html("今天机会已用完");
			joinAgain = false;
		} else if(sate == 20001) {
			closeFlag = true;
			$('.prize_enter').removeClass('normal').addClass('enter');
			$('.prize_enter p').eq(0).html("暂未");
			$('.prize_enter p').eq(1).html("开启");
			$('.prize_enter h3').hide();
			return;
		}
		
		//点击抽奖
		$('.prize_enter').off('click');
		$('.prize_enter').on('click',function() {
			if(closeFlag) return;
			if(!joinAgain) {
				alertMsg({type:'msg',msg:"今天机会已用完，明天再来吧~"});
				return;
			}
			
			if(btnStatus == 10007) {//去登陆
				ClientAPI.startLogin('VC_LOGIN');
				return;
			}
			
			if(!isClickAgain) return;
			//调用抽奖接口
			this_.do_prizeDraw();
		})
	}
	
	//获奖记录
	this.do_awardLog = function() {
		$.AJAX({
			name:"获奖记录",
			url: urlList.url_awardLog(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'];
						listArr = new Array();
					for(var i = 0;i<data.length;i++) {
						var userNickName = data[i].userNickName,
							productName = data[i].productName,
							state = data[i].state,
							addTime = data[i].addTime,
							userId = data[i].userId;
							listArr.push("<li><p><span class='b'>· </span>"+checkName(userNickName)+"抽到了 "+productName+"</p></li>");
					}
					$('.record .ul-record').html(listArr.join(""));
				} else if(!obj['success']) {
					alertMsg({type:'msg',msg:obj['message'] || "获奖记录调用失败"});
				}
			}
		});
	}
	
	function checkName(name) {
		var endName = name;
		name = String(name);
		var nameL = name.length;
		var replaceNum = 1/3;
		var middleNum = parseInt(nameL/2);//字符串中间位置
		var middleLong = nameL==4?2:Math.round(nameL*replaceNum);//字符串需要截取的字符数量
		var middleLongT = parseInt(middleLong/2);//字符串需要截取的字符数量
		var leftNum = nameL==3?1:(middleNum-middleLongT-(middleLong%2==0?0:1));
		var rightNum = nameL==3?2:(middleNum+middleLongT);
		var leftStr = name.substring(0,leftNum);
		var rightStr = name.substring(rightNum);
		var lll = rightNum - leftNum - 1;
		if(nameL >= 3) {
			var start = "*";
			for(var i=0;i<lll;i++) {
				start+="*";
			}
			endName = leftStr+start+rightStr;
		} else if(nameL == 2) {
			endName = name.substring(0,1)+"*";
		}
		return endName;
	}
		
	/**
	 * 校检登录
	 */
	this.do_challengeValidate = function() {
		var gameId = GameID.LOL;
		//校检火马登录
		var user = ClientAPI.getLoginXingYun();
		if(!user.hasOwnProperty("userId") || user.userId == 0) {
			//调起登陆窗
			ClientAPI.startLogin('VC_LOGIN');
			return;
		}
		return user.userId;
	}
	
}