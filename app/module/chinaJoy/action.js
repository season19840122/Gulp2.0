define(['jquery','vue','commons','school'],function($,Vue,COMMONS,school) {
	//初始化配置
	COMMONS.init({
		hostImg:"../../",
		globalData:{
			"activityId":111,
			"userId":222,
		},
		baseUrl:{
			dev:"./testUrl/",
			pub:"http://10.149.4.13/"
		},
		useOn:"dev"
	})
	
	COMMONS.alertMsg = function(msg) {
		$('.alert_box').html(msg).show();
		setTimeout(function() {
			$('.alert_box').hide();
		},3000)
	}
	
	var urlObj = {
		list:{
			name:"奖品列表",
			url:{
				dev:"list.json",
				pub:"awardProduct/app/list"
			}
		},
		choujiang:{
			name:"抽奖",
			url:{
				dev:"chou.json",
				pub:"awardProduct/app/prizeDraw"
			}
		},
		btn:{
			name:"获取按钮状态",
			url:{
				dev:"btn.json",
				pub:"awardProduct/app/btn"
			}
		},
		duihuan:{
			name:"点击兑换",
			url:{
				dev:"duihuan.json",
				pub:"awardProduct/app/exchange"
			},
			data:function(productId) {
				return {"productId":productId};
			}
		},
		award:{
			name:"我的获奖记录",
			url:{
				dev:"award.json",
				pub:"AwardProductProgress/app/getMyAward.do"
			}
		},
		bobao:{
			name:"奖品播报",
			url:{
				dev:"bobao.json",
				pub:"awardProduct/app/broadcastLog"
			}
		}
	}
	var tem_status = {
		props: ['msg'],
		template: '<div id="msg_status"><h1>{{msg[0]}}</h1><h2>{{msg[1]}}</h2></div>',
	}
	var vue = new Vue({
		el:".box",
		data:{
			alert_c:"*只有队长才能报名",
			status_msg:[],
			status:"notice",//提示类型：success，fail，notice
			flag:{
				remind:false,
				remind_box:false,
				input_box:true,
				school_box:false,
				sheng_list:false,
				p:true,
				userInput:false,
			},
			phone_remind:"手机号码要求必须可用",
			school_remind:"请输入高校全称，需与学生证上保持一致",
			input:{
				phone:"",
				school:"",
				otherSchool:"",
			},
			shengNum:school.province[0][0],
			province:school.province,
			proSchool:school.proSchool,
			shengStr:school.province[0][1],
		},
		components: {
		    'tem_status': tem_status
	    },
	    computed: {
			statusClass: function () {
				var classObj = {
					success:"iconfont icon-duigou",
					fail:"iconfont icon-duigou fail",
					notice:"iconfont icon-zhuyi1"
				}
				return classObj[this.status];
			},
			c_status_msg: function () {
				var classObj = {
					success:["恭喜！","您提交的信息已通过审核"],
					fail:["您的参赛信息已提交","请耐心等待工作人员的审批"],
					notice:["很抱歉！","您提交的信息未通过审核"]
				}
				return classObj[this.status];
			},
			school_list:function() {
				console.log(this.shengNum);
				return this.proSchool[this.shengNum]
			}
		},
		mounted:function() {
//			this.initBtn();
//			this.bobao();
//			this.award();
//			this.list();
//			this.scrollPrize = new COMMONS.scrollObj(50,3,110,220,this.showMsg);
		},
		methods:{
			getSchool:function() {//展开学校选择
				this.flag.school_box = true;
			},
			getSheng:function() {//获取省份
				if(this.flag.sheng_list) {
					this.flag.sheng_list = false;
				} else {
					this.flag.sheng_list = true;
				}
			},
			hideSheng:function(e) {//点击旁边元素隐藏省份列表
				if(e.target.id != "shengName" && e.target.className.indexOf('icon-xia') == -1) this.flag.sheng_list = false;
			},
			getSchoolList:function(v) {//通过省份获取高校列表
				this.flag.sheng_list = false;
				this.shengNum = v[0];
				this.shengStr = v[1];
				if(this.shengNum == 99) {
					this.flag.userInput = true;
					this.flag.p = false;
					this.input.otherSchool = "";
				} else {
					this.flag.userInput = false;
					this.flag.p = true;
				}
			},
			closeSchool:function() {//关闭高校框
				if(this.shengNum == 99) {
					this.input.school = this.input.otherSchool;
				}
				this.flag.sheng_list = false;
				this.flag.school_box = false;
			},
			setSchool:function(v) {//选择设置高校
				this.flag.sheng_list = false;
				this.flag.school_box = false;
				this.input.school = v;
			},
//			initBtn:function() {
//				var this_ = this;
//				COMMONS.ajax({
//					name:urlObj.btn.name,
//					url: urlObj.btn.url,
//					success: function(obj) {
//						if(obj['success'] && obj['code'] == 0 && obj['data']) {
//							var data = obj['data'];
//							this_.btnTip = data.btnText;
//							this_.tem.btnStatus = data.sate;
//							this_.setBtn(data.sate);
//						} else if(!obj['success']) {
//							this_.showMsg('msg',urlObj.btn.name+"出错");
//						}
//					}
//				})
//			},
//			duihuan:function(el) {
//				var this_ = this;
//				var proId = $(el).attr('data-id');
//				COMMONS.ajax({
//					name:urlObj.duihuan.name,
//					url: urlObj.duihuan.url,
//					data:urlObj.duihuan.data(proId),
//					success: function(obj) {
//						if(obj['success'] && obj['code'] == 0 && obj['data']) {
//							var data = obj['data'],
//								proName = data.proName;
//								this_.showMsg('msg',"恭喜您获得<span>"+proName+"</span>访问“我-奖品”即可查询~");
//						} else if(!obj['success']) {
//							this_.showMsg('msg',urlObj.btn.name+"出错");
//						}
//					}
//				})
//			},
			alertBg:function(flag) {
				flag?this.flag.boxBg_flag = true:this.flag.boxBg_flag = false;
			},
			//弹框显示
			showMsg:function(type,message) {
				var this_ = this;
				if(type == 'msg') {
					this.flag.alertFlag = true;
					this.alert_msg = message;
					setTimeout(function() {
						this_.flag.alertFlag = false;
					},3000)
				} else if(type == 'ac') {
					this.flag.ac_flag = true;
					this.alertBg(true);
				} else if(type == 'award') {
					this.flag.award_flag = true;
					this.alertBg(true);
				} else if(type == 'free') {
					this.flag.free_flag = true;
					this.alertBg(true);
				} else if(type == 'prize') {
					this.flag.alertFlag = true;
					this.alert_msg = message;
					setTimeout(function() {
						this_.flag.alertFlag = false;
						//刷新按钮状态
						this_.initBtn();
						//刷新小红点
						this_.award();
						this_.isChou(false);
					},3000)
				}
			},
			closeAlert:function() {
				this.flag.ac_flag = false;
				this.flag.award_flag = false;
				this.flag.free_flag = false;
				this.alertBg(false);
			},
			setBtn:function(sate) {
				this.chouFlag = true;
				if(sate == 10007) {//去登录
					this.btnName = "请登录";
					this.className.prize_enter = "prize_enter";
					this.tipFlag = false;
				} else if(sate == 10001) {//免费
					this.btnName = "点击抽奖";
					this.className.prize_enter = "prize_enter";
					this.btnTip = "第一次免费哦";
					//显示引导
				} else if(sate == 10002) {//可以抽
					this.btnName = "点击抽奖";
					this.className.prize_enter = "prize_enter";
					this.btnTip = this.btnTip;
					this.tipFlag = true;
				} else if(sate == 10003) {//没有抽奖机会
					this.btnName = "点击抽奖";
					this.className.prize_enter = "prize_enter off";
					this.btnTip = "今天机会已用完";
					this.tem.joinAgain = false;
				}  else if(sate == 20001) {//暂未开启
					this.btnName = "暂未开启";
					this.chouFlag = false;
					this.className.prize_enter = "prize_enter off";
					this.tipFlag = false;
					return;
				}
			},
			isChou:function(flag) {
				if(this.tem.closeFlag) return;
				//true标示点击开始抽奖
				if(flag) {
					this.btnName = "抽奖中...";
					this.tem.isClickAgain = false;
					this.className.prize_enter = "prize_enter off";
				} else {
					//false标示结束抽奖或者
					if (this.tem.btnStatus != 10003) this.className.prize_enter = "prize_enter";
					$('.prize_box .bg').hide();
					//初始化抽奖高亮块
					$('.prize_box .prize_div').removeClass('on').css('z-index','0');
					this.tem.isClickAgain = true;
				}
			}
		}
	})
	
	
	Vue.directive('tap',{
    bind:function(el,binding){
        var startTx, startTy,endTx,endTy;
        el.addEventListener("touchstart",function(e){
            var touch=e.touches[0];
            startTx = touch.clientX;
            startTy = touch.clientY;
            el.addEventListener("touchend",function(e){
                    var touch = e.changedTouches[0];
                    endTx = touch.clientX;
                    endTy = touch.clientY;
                    if( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6){
                        var method = binding.value.method;
                        var params = binding.value.params;
                        method(params);
                    }
                },false);
        },false );
        
    }
})
})
