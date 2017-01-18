var DOMFUN = function(initObj,actions) {
	//dom绑定方法
	this.eventElement = function() {
		var alertFlag1 = false,alertFlag2 = false;
		//点击挑战纪录
		$('.remind_ball1').on('click', function() {
			if(!alertFlag1) {
				if(alertFlag2) initRemind(false);
				actions.do_challengeValidate(true, initObj.options.challengeMatchId, initObj.options.challengeStatus.levelLimitMin,initObj.options.challengeStatus.levelLimitMax, initObj.options.challengeStatus.rankRemark, function() {
					actions.getChallengeList();
					alertFlag1 = true;
					$('.alert_box').animate({
						'bottom': '0px'
					}, 150);
					$('.rule_content').hide();
					$('.box_challenge').show();
					$('.remind_ball1 img').show();
					$('.remind_ball1 p').hide();
				});
			} else {
				initRemind(true);
			}

		})

		$('.remind_ball2').on('click', function() {
			if(!alertFlag2) {
				if(alertFlag1) initRemind(false);
				$('.alert_box').animate({
					'bottom': '0px'
				}, 150);
				alertFlag2 = true;
				$('.rule_content').show();
				$('.box_challenge').hide();
				$(this).find('img').show();
				$(this).find('p').hide();
			} else {
				initRemind(true);
			}
		})
		
		function initRemind(flag) {
			if(flag) $('.alert_box').animate({'bottom': '-413px'}, 150);
			$('.remind_ball2,.remind_ball1').find('img').hide();
			$('.remind_ball2,.remind_ball1').find('p').show();
			alertFlag2 = false;
			alertFlag1 = false;
		}

		$('.remind').hover(function() {
			$(this).find('.tip_box').show();
		}, function() {
			$(this).find('.tip_box').hide();
		})

		//二维码支付关闭后停止查询
		$('#alert_all').on('hidden.bs.modal', function() {
			actions.closeQrcode(false);
		});

		//绑定进入房间确认按钮事件
		$('#alert_enter .btn_sure').on('click', function() {
			$('#alert_enter').modal('hide');
			//进入游戏
			startGame();
		})

		//绑定刷新按钮
		$('.opt_refresh').on('click', function(e) {
			var hostUrl = location.href;
			if(hostUrl.indexOf('needShowRecord') != -1) {
				hostUrl = hostUrl.replace('needShowRecord','a');
			} else if(hostUrl.indexOf('needShowRules') != -1) {
				hostUrl = hostUrl.replace('needShowRules','b');
			}
			if(hostUrl.indexOf('#') != -1) hostUrl = hostUrl.replace("#","");
			location.replace(hostUrl);
		})

		//左边导航点击切换
		$('.menu-wrap ul li').on('click', function(data) {
			if(!$(this).hasClass('active')) actions.do_getAllChallengeMatchInfo();
		});
		
		//二维码失败后点击再试一次
		$('#alert_all #tab3 .try').on('click', function(data) {
			$('#alert_all').modal('hide');
		});
		
		//二维码失败后点击再试一次
		$('#goVip').on('click', function(data) {
			goVip();
		});
		
		$('.challenge_num ul').one('mouseenter',function() {
			actions.do_getChallengeLimitInfo();
		})
	}
}
