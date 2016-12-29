var ACTIONFUN1  = function(optionObj) {
	var this_ = this;
	//dom事件
	this.dom = function() {
		$(function () {
			$('#dg-container').gallery();
		})
	}
	
	//显示抽奖动画
	this.showChesure = function(flag,arr) {
		arr = [
			{pic:"images/download_pic.png",name:"手办1"},
			{pic:"images/download_pic.png",name:"手办2"},
			{pic:"images/download_pic.png",name:"手办3"}
		];
		
		if(flag) {
			$('.animate_box').show();
			$('.flash_pic').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function() {
				$('.rotate_pic').show();
				$('.line_left').show();
				$('.line_right').show();
				$('.tresure_word').show();
				$('.tresure_content').show();
				$('.confirm').show();
				
				var liArr = new Array();
				for(var i = 0;i<arr.length;i++) {
					var pic = arr[i].pic;
					var name = arr[i].name;
					liArr.push("<li><div><img src='"+pic+"'><p>"+name+"</p></div></li>")
				}
				$('.animate_box ul').html(liArr.join(""));
				
				$('.animate_box ul li').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function() {
					$('.animate_box ul li div').addClass('liFlash');
				})
				
				function showLi(num) {
					$('.animate_box ul li').eq(num).addClass('visible rotateAndTranIn');
					setTimeout(function() {
						if(num == arr.length) return;
						num++;
						showLi(num);
					},500)
				}
				setTimeout(function() {showLi(0);},500)
			})
		} else {
			$('.animate_box').hide();
			$('.rotate_pic').hide();
			$('.line_left').hide();
			$('.line_right').hide();
			$('.tresure_word').hide();
			$('.tresure_content').hide();
			$('.confirm').hide();
			$('.animate_box ul').empty();
		}
		$('.confirm').one('click',function() {
			this_.showChesure(false);
		});		
	}
	
	var urlList = {
		//图片轮播url
		url_list :function() {
			return initObj.options.hostUrl+"/awardProduct/list";
		}
	}
	
	//获取轮播图片
	this.do_rec = function() {
		optionObj.ajax_({
			name:"轮播图片",
			url: urlList.url_list(),
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0 && obj['data']) {
					
				} else if(!obj['success']) {
					optionObj.alertMsg({type:'msg',msg:obj['message'] || "轮播图片调用失败"});
				}
			}
		});
	}
	

}