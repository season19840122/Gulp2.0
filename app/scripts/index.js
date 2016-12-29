;
(function($) {

	var initDomFun = function() {
		//计算下方轮播指标的li宽度
		var arousel = {
			setLiAuto: function(ulWidth, liNum, liName) {
				var liWidth = (ulWidth - (liNum - 1)) / liNum;
				$(liName).css('width', liWidth + "px");
			}
		}
		arousel.setLiAuto(778, 5, '.carousel-indicators li');
		$('#indexArousel').carousel('cycle');

		// 自定义下拉框
		$(document).on('click', function(e) {
			var target = e.target;
			if(target.localName != 'input') $(".drop-select input").siblings("ul").hide();
		});

		$(".drop-select input").click(function(e) {
			var ul = $(this).siblings("ul");
			if(ul.css("display") == "none") {
				ul.slideDown("fast");
				$(this).addClass("open")
			} else {
				ul.slideUp("fast");
				$(this).removeClass("open")
			}
		});

		$(".drop-select ul li a").click(function() {
			var txt = $(this).text();
			$(this).parents(".drop-select ul").siblings("input").val(txt).removeClass("open");
			$(".drop-select ul").hide();
		});

		//tips
		$('.state_lBlue, .state_lBlue span').hover(function() {
			$(this).find('span').show();
		}, function() {
			$(this).find('span').hide();
		})
		
		
		//首页app下载绑定
		$('.download_pic').on('click',function() {
			
		})
	  }

	initDomFun();
})(jQuery);