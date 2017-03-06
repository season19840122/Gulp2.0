var ACTIONFUN = function(initObj) {
	var this_ = this;
	var FAILMSG = "调用失败";
	var titleAgain = "";
	var now_period = "";
	var now_applyCnt = "";
	var now_gameId = "";
	var now_account = "";
	var timeAllNum = 0;
	var timeScrollNum = 0;
	
	var actionObj = {
		getLiveList : {
			name:"获取直播列表",
			url: function() {
				return initObj.options.hostUrl+"liveAggregation/listLiveRooms";
			}
		},
		getDyList : {
			name:"获取订阅列表",
			url: function(period) {
				return initObj.options.hostUrl+"liveAggregation/listUserSubscribe";
			}
		}
	}
	
	this.eventElement = function() {
		$(function(){
			//收起订阅
			$('.my_dy ').on('click','.dy_close',function() {
				$('.my_dy ').animate({'right':'-340px'},200);
				$('.content_bg ').fadeOut(200);
			})

			//展开订阅
			$('.dy').on('click',function() {
				initObj.do_challengeValidate(function() {
					$('.my_dy ').animate({'right':'0px'},200);
					$('.content_bg ').fadeIn(200);
					do_getDyList();
				})
			})
			
			//点击空白收起订阅
			$('.content_bg').on('click',function() {
				$('.my_dy ').animate({'right':'-340px'},200);
				$('.content_bg ').fadeOut(200);
			})
			
			//点击直播列表和订阅列表
			$('.content_box ul').on('click','li',function() {
				var liveAnchorId = $(this).attr('data-id');
				goRoom(liveAnchorId);
			})
			//点击直播列表和订阅列表
			$('.my_dy ul').on('click','li',function() {
				var liveAnchorId = $(this).attr('data-id');
				goRoom(liveAnchorId);
			})
		})
	}
	
	
	//获取直播列表
	this.do_getLiveList = function() {
		initObj.ajax_({
			name:actionObj.getLiveList.name,
			url: actionObj.getLiveList.url(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'];
					setList(data);
				} else if(!obj['success']) {
					
				}
			}
		});
	}
	
	var setList = function(data) {
		var liveList =  data.map(function(v) {
			return "<li data-id='"+v.liveAnchorId+"'>"+
					"<img class='bg' src='"+v.roomPicUrl+"'/>"+
					"<span>"+v.sourceTypeRemark+"</span>"+
					"<p>"+v.mainTitle+"</p>"+
					"<div>"+
						"<div class='left'>"+
							"<img src='"+v.headImgUrl+"' />"+
							"<span>"+v.nickName+"</span>"+
						"</div>"+
						"<div class='right'>"+v.hotValue+"</div>"+
					"</div>"+
				"</li>";
		})
		$('.content_box ul').html(liveList.join(""));
	}
	
	
	//获取时间段详情
	var do_getDyList = function() {
		initObj.ajax_({
			name:actionObj.getDyList.name,
			url: actionObj.getDyList.url(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					var data = obj['data'];
					setDyList(data);
				} else if(!obj['success']) {
				}
			}
		});
	}
	
	var setDyList = function(data) {
		var dyList =  data.map(function(v) {
			return "<li data-id='"+v.liveAnchorId+"'>"+
					"<img src='"+v.headImgUrl+"'/>"+
					"<div class='"+(v.isOnLive?'on_live':'no_live')+"'>"+(v.isOnLive?'正在直播':'未开播')+"</div>"+
					"<div class='live_info'>"+
						"<h1>"+v.mainTitle+"</h1>"+
						"<h2>主播："+v.nickName+"</h2>"+
						"<h3>观众："+v.hotValue+"</h3>"+
					"</div>"+
				"</li>";
		})
		$('.my_dy ul').html(dyList.join(""));	
	}
	
	var defaultImg = function(imgDom) {
		console.log(imgDom);
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