var dialog = {

	browserType: function(){
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串

		isOpera = userAgent.indexOf("Opera") > -1, //判断是否Opera浏览器
		isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera, //判断是否IE浏览器
		isFF = userAgent.indexOf("Firefox") > -1, //判断是否Firefox浏览器
		isChrome = userAgent.indexOf("Chrome") > -1, //判断是否Chrome浏览器
		isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") < 0; //判断是否Safari浏览器

		if(isIE){
			var IE5 = IE55 = IE6 = IE7 = IE8 = false;
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
			reIE.test(userAgent);
			var fIEVersion = parseFloat(RegExp["$1"]);

			IE55 = fIEVersion == 5.5, IE6 = fIEVersion == 6.0, IE7 = fIEVersion == 7.0, IE8 = fIEVersion == 8.0, IE9 = fIEVersion == 9.0, IE10 = fIEVersion == 10.0;

			if(IE55){
				return "IE55";
			}else if(IE6){
				return "IE6";
			}else if(IE7){
				return "IE7";
			}else if(IE8){
				return "IE8";
			}else if(IE9){
				return "IE9";
			}else if(IE10){
				return "IE10";
			}
		}else if(isOpera){
			return "Opera";
		}else if(isFF){
			return "FF";
		}else if(isChrome){
			return "Chrome";
		}else if(isSafari){
			return "Safari";
		}
	},

	masklayer: function (opt){
		/*-- 默认配置 --*/
		var defaults = {
			$obj : null,
			title : '',
			content : '请确认填写的报名信息无误<br />（如出错则需要玩家自己承担跨服费用）',
			ctype : 'common',
			width : 300,
			height : 200,
			mask : true,
			maskLayerID : 'maskLayer',
			maskLayerZIndex : 99998,
			color: '#000',
			drag : true,
			pos : 'center',
			fix : true,
			url : ''
		};

		var isIe6 = dialog.browserType() === "IE6"? true :false;
		/*合并选项*/
		var config = $.extend(defaults, opt);

		/*弹出*/
		function popout(){
			maskLayer();
			position(); //调整位置
			//content();//填充内容
			config.$obj.show();
			closed(); //绑定关闭
		};
		popout();

		/*调整位置*/
		function position(){
			if(isIe6) {
				var fix = 'absolute',
			 		left = ($(window).scrollLeft() + $(window).width()/2 - (config.width/2))+'px',
			 		top = ($(window).scrollTop() + $(window).height()/2 - (config.height/2))+'px',
			 		zindex = config.maskLayerZIndex + 1;
			}else{
				var fix = config.fix ? 'fixed' : 'absolute',
					left = ($(window).width()/2 - (config.width/2))+'px',
					top = ($(window).height()/2 - (config.height/2))+'px',
					zindex = config.maskLayerZIndex + 1;
			}
			if(config.pos == 'center'){/*居中*/
				config.$obj.css({'position':fix,'top':top,'left':left,'width':config.width,'height':config.height,'zIndex':zindex});
			}else if(config.pos == 'rightdown'){/*右下*/
				config.$obj.css({'position':fix,'right':0,'bottom':0,'width':config.width,'height':config.height,'zIndex':zindex});
			}else{/*默认居中*/
				var left = ($(window).scrollLeft() + $(window).width()/2 - (config.width/2))+'px';
				var top = ($(window).scrollTop() + $(window).height()/2 - (config.height/2))+'px';
				config.$obj.css({'position':fix,'top':top,'left':left,'width':config.width,'height':config.height,'zIndex':zindex});
			}
		};

		/*填充内容*/
		function content(){
			if(config.content !== "请确认填写的报名信息无误<br />（如出错则需要玩家自己承担跨服费用）"){
				config.$obj.find("p").html(config.content).css("paddingTop",50);
			}else{
				config.$obj.find("p").html(config.content);
			}
		}

		/*遮罩层*/
		function maskLayer(){
			var tmpMask = "";
			tmpMask = '<div id="'+ config.maskLayerID +'" style="position:absolute;width:0;height:0;"></div>';
			$("body").append(tmpMask);
			$('#'+config.maskLayerID).css({
				'width':'100%',
				'height':$(document).height()+'px',
				'top':'0px',
				'left':'0px',
				'z-index':config.maskLayerZIndex,
				'background-color':config.color,
				'filter':'alpha(opacity=50)',
				'opacity':'0.5'
			});
		};

		/*关闭*/
		function closed(){
			config.$obj.find(".dialog-close, .btn-yes, .btn-no").on('click',function(e){
				e.preventDefault();
				$('#'+config.maskLayerID).hide().remove();
				config.$obj.hide();
				//config.$obj.find("p").html(config.content).removeAttr("style");
			});
		}

		/*拖拽*/
		if(config.$obj.is(":visible")){
			if(dialog.browserType() === "IE6"){
				$('body').scroll(function(){
					position();
				})
			}

			// $('body').resize(function(){
			// 	position();
			// })
		}
		/*结束*/
	}

};
