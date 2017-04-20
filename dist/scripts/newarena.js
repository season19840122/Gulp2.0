;(function($){

	var optionObj = function(options_){
		var this_ = this;
		//公用配置参数
		this.options = {
			hostUrl: [],
			hostImg: "",
			ajaxTimeout: 3000
		}
		
		//通用 ajax 封装
		this.ajax_ = function(obj) {
			$.ajax({
				url: obj.url,
				// type: obj.type || 'POST',
				type: obj.type || 'GET',
				dataType: obj.dataType || 'json',
				data: obj.data || null,
				timeout: this_.options.ajaxTimeout,
				success: obj.success,
				error: function(xhr, errorType, error) {
					console.log('Ajax request error, errorType: ' + errorType +  ', error: ' + error);
					this_.showMsg(obj.name + "调用异常");
				}
			});
		}
		
		//公用弹出框
		this.showMsg = function(msg) {
			$('#alert_box .modal-body p').html(msg);
			$('#alert_box').modal();
		}
		
		// 登录判断
		this.do_checkLogin = function(callBack) {
			//校检火马登录
			var user = ClientAPI.getLoginXingYun();
			if(!user.hasOwnProperty("userId") || user.userId == 0) {
				//调起登陆窗
				ClientAPI.startLogin('VC_LOGIN');
				return;
			}
			callBack();
			return;
		}
		
		this.options = $.extend({}, this.options, options_);
	}

	var arenaObj = new optionObj({
		hostUrl: [
			"./mock/擂台赛/arenaMatchData.json",
			"./mock/擂台赛/teamEnroll.json",
			"./mock/擂台赛/toGuessArena.json",
			"./mock/擂台赛/support.json",
			"./mock/擂台赛/qrcodePayParam.json",
			"./mock/擂台赛/payFinished.json"
		],
		ajaxTimeout: 3000,
		hostImg: "./"
	});

	Vue.component('paginate', VuejsPaginate);

	var arenaVM = new Vue({
	  el: '#app',
	  data: {
	  	video: { 
	  		show: true 
	  	},
	  	nowData: {},
	  	monthData: [],
	  	allData: {
	  		matchRole:[]
	  	},
	  	swBean: {},
	  	qrcodePay: {},
	  	param: '',
	  	creatTeam: {
	  		show: true
	  	}
	  },
	  computed: {
	    // 仅读取，值只须为函数
	    getBtnClass: function () {
	    	if (this.nowData.couldGuess) {
	    		if (this.allData.isGuessed) {
			    	if (this.allData.guessedTeamId === this.nowData.teamId) {
			    		return ['already', '已支持', 'support', '支持该战队'];
			    	} else if(this.allData.guessedTeamId === this.nowData.attackTeamId){
			    		return ['support', '支持该战队', 'already', '已支持'];
			    	}
		    	} else {
		    		return ['support disable', '支持该战队', 'support disable', '支持该战队']
		    	}
	    	} else {
	    		return ['support disable', '支持该战队', 'support disable', '支持该战队']
	    	}

	    },
	    getRules: function(){
	    	return this.allData.matchRole.join('<br>');
	    }
	  },
	  mounted: function() {
    	this.getPageInit();
    },
    methods: {
	    getPageInit: function(){
	    	var vm = this;
	    	// 页面初始化
	    	arenaObj.ajax_({
	    		name: '页面初始化数据',
	    		url: arenaObj.options.hostUrl[0],
	    		success: function(data) {
	    			if (data.success) {
            	if (data.data.guess_live_switch === "1") {
            		// 由于函数的作用域，这里不能用 this
            		vm.video = {'show':false, 'url':data.data.live_video_url};
            	} else {
            		// vm.$set('nowData', data.data.arenaMatch);
            		vm.nowData = data.data.arenaMatch;
            		vm.nowData.count = vm.nowData.arenaCnt/(vm.nowData.arenaCnt + vm.nowData.attackCnt)*100;
            		var arr = [];
            		for (var i=0; i<data.data.monthMatchVideos.length; i+=3) {
            			arr.push(data.data.monthMatchVideos.slice(i, i+3));
            		}
            		vm.monthData = arr;
            		vm.allData = data.data;
            	}
            } else {
            	if (data.message) {
            		arenaObj.showMsg(data.message);
							} else {
								arenaObj.showMsg('数据调用异常！');
							}
						}
					}
				});
	    },
	    clickCallback: function(pageNum) {
	    	$('.guess-wrap>ul').eq(pageNum-1).show().siblings('ul').hide();
	      // console.log(pageNum)
	    },
	    openRule: function(){
	    	$("#rules_box").modal("show");
	    },
	    teamApply: function(){
	    	var vm = this;
	    	// 战队报名
	    	arenaObj.ajax_({
	    		name: '战队报名',
	    		url: arenaObj.options.hostUrl[1],
	    		success: function(data) {
	    			if (data.success) {
            	$("#team_five").modal("show");
            } else {
            	if (data.message) {
            		if (data.link) {
		    					vm.creatTeam = {'show':false, 'link':data.link};
		    				}
            		arenaObj.showMsg(data.message);
							} else {
								arenaObj.showMsg('数据调用异常！');
							}
						}
					}
				});
	    },
	    supportTeam: function(event){
	    	if ($(event.target).attr('class') === 'support') {
	    		$(event.target).addClass('flag');
	    		var vm = this;
	    		// 支持该战队
		    	arenaObj.ajax_({
		    		name: '支持该战队',
		    		url: arenaObj.options.hostUrl[2] + '?userId=' + $('.box').data('userid'),
		    		success: function(data) {
		    			if (data.success) {
		    				var param = '?userId=' + $('.box').data('userid') +
	    					'&teamId=' + $('.flag').data('teamid') +
	    					'&arenaMatchId=' + vm.nowData.arenaMatchId +
	    					'&barId=1' +
	    					'&payValue=' + $('#zan_box .on').data('bean');
	    					vm.param = param;
		    				vm.swBean = data.data;
	            	$("#zan_box").modal("show");
	            } else {
	            	if (data.message) {
	            		arenaObj.showMsg(data.message);
								} else {
									arenaObj.showMsg('数据调用异常！');
								}
							}
						}
					});
	    		
	    	}
	    },
	    swBeanSupport: function(event){
	    	var vm = this;
    		// 顺豆支持
	    	arenaObj.ajax_({
	    		name: '顺豆支持',
	    		url: arenaObj.options.hostUrl[3],
	    		success: function(data) {
	    			if (data.success) {
	    				arenaObj.ajax_({
				    		name: '顺豆支持',
				    		url: arenaObj.options.hostUrl[3] + vm.param,
				    		success: function(data) {
				    			if (data.success) {
				    				$("#zan_box").modal('hide');
				    				arenaObj.showMsg(data.message);
				    				window.setTimeout(function(){
				    					location.reload();
				    				}, 3000)
			            } else {
			            	if (data.message) {
			            		arenaObj.showMsg(data.message);
										} else {
											arenaObj.showMsg('数据调用异常！');
										}
									}
								}
							});
            } else {
            	if (data.message) {
            		arenaObj.showMsg(data.message);
							} else {
								arenaObj.showMsg('数据调用异常！');
							}
						}
					}
				});
	    },
	    qrcodeSupport: function(event){
	    	var vm = this;
    		// 扫码支持
	    	arenaObj.ajax_({
	    		name: '扫码支持',
	    		url: arenaObj.options.hostUrl[4] + vm.param,
	    		success: function(data) {
	    			if (data.success) {
	    				vm.qrcodePay = data.data;
	    				$('#pay_qrcode').find('.alert_img_qrcode').empty().qrcode({
	    					width: 120,
	    					height: 120,
	    					text: vm.qrcodePay.qrcodeUrl,
	    					render: "canvas",
	    					correctLevel: 1
	    				});
            	$("#pay_qrcode").modal("show");
            	vm.flag = window.setInterval(function() {
								vm.payFinished();
							}, 3000);
            } else {
            	if (data.message) {
            		arenaObj.showMsg(data.message);
							} else {
								arenaObj.showMsg('数据调用异常！');
							}
						}
					}
				});
	    },
	    payFinished: function(event){
	    	var vm = this;
	    	arenaObj.ajax_({
	    		name: '定时查询',
	    		url: arenaObj.options.hostUrl[5] + '?orderId=' + vm.qrcodePay.orderId,
	    		success: function(data) {
	    			if(data.success && data.code === 0) {
							clearInterval(vm.flag);
							$('#pay_qrcode').modal('hide');
							arenaObj.ajax_({
								name: '顺豆支持',
								url: arenaObj.options.hostUrl[3] + vm.param,
								success: function(obj) {
									if(data.success && data.code === 0) {
										$("#zan_box").modal('hide');
				    				arenaObj.showMsg('支付成功！');
				    				window.setTimeout(function(){
				    					location.reload();
				    				}, 3000)
									} else {
			            	if (data.message) {
			            		arenaObj.showMsg(data.message);
										} else {
											arenaObj.showMsg('数据调用异常！');
										}
									}
								}
							});
            }
          }
				});
	    }
	  }

	});

	$('body').on('click', '#zan_box li', function(event) {
		$(this).addClass('on').siblings().removeClass('on');
	});
	
})(jQuery);