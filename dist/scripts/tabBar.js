$(function() {
	$('.left_main_menu ul li').on('click', function(data) {
		$(this).siblings('li').removeClass('active');
		$(this).addClass('active');
		var hrefStr = $(this).attr('data-href');
		if(hrefStr) {
			location.href = hrefStr;
		} else {
			//执行其他js操作
		}
	});
})
