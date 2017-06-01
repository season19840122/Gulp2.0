
/*
var dcVM = new Vue({
	el: '#app',
	data: {
		common: {
			fourHead: [
	  		{ text: '时间', width: '25%' },
	  		{ text: '房间名称', width: '30%' },
	  		{ text: '奖金', width: '12%' },
	  		{ text: '规则', width: '12%' },
	  		{ text: '' }
	  	],
	  	fourBody: [
	  		[
	  			{ text: '2017.01 02 16:00:00', width: '25%' },
	  			{ text: 'RNG丶MLXG VS WE丶Deft', width: '30%' },
	  			{ text: '¥10', className:'yellow', width: '12%' },
	  			{ text: 'KDA', width: '12%' },
	  			{ text: '等待对手', className:'green' }
	  		],
	  		[
	  			{ text: '2017.01 02 16:00:00' },
	  			{ text: 'RNG丶MLXG VS ？？？' },
	  			{ text: '¥10', className:'yellow' },
	  			{ text: 'KDA' },
	  			{ text: '等待对手', className:'green' }
	  		],
	  		[
	  			{ text: '2017.01 02 16:00:00' },
	  			{ text: 'RNG丶MLXG VS ？？？' },
	  			{ text: '¥10', className:'yellow' },
	  			{ text: 'KDA' },
	  			{ text: '等待对手', className:'red' }
	  		],
	  		[
	  			{ text: '2017.01 02 16:00:00' },
	  			{ text: 'RNG丶MLXG VS ？？？' },
	  			{ text: '¥10', className:'yellow' },
	  			{ text: 'KDA' },
	  			{ text: '进行中', className:'red' }
	  		],
	  		[
	  			{ text: '2017.01 02 16:00:00' },
	  			{ text: 'RNG丶MLXG VS ？？？' },
	  			{ text: '¥10', className:'yellow' },
	  			{ text: 'KDA' },
	  			{ text: '进行中', className:'red' }
	  		],
	  		[
	  			{ text: '2017.01 02 16:00:00' },
	  			{ text: 'RNG丶MLXG VS ？？？' },
	  			{ text: '¥10', className:'yellow' },
	  			{ text: 'KDA' },
	  			{ text: '进行中', className:'red' }
	  		]
	  	]
		},
		myGame: {
			fourHead: [
	  		{ text: '时间', width: '20%' },
	  		{ text: '房间名称', width: '30%' },
	  		{ text: '战绩', class:'yellow' ,width: '15%' },
	  		{ text: '规则', width: '12%' },
	  		{ text: '结果'}
	  	],
	  	fourBody: [
	  		[
	  			{ text: '2017.01 02 16:00:00', width: '20%' },
	  			{ text: 'RNG丶MLXG VS WE丶Deft', width: '30%' },
	  			{ text: '12/13', className:'ochre', width: '15%' },
	  			{ text: 'KDA', width: '12%' },
	  			{ text: '胜利', className:'green', class:'check' }
	  		],
	  		[
	  			{ text: '2017.01 02 16:00:00' },
	  			{ text: 'RNG丶MLXG VS ？？？' },
	  			{ text: '12/13', className:'ochre' },
	  			{ text: 'KDA' },
	  			{ text: '胜利', className:'green', class:'check' }
	  		],
	  		[
	  			{ text: '2017.01 02 16:00:00' },
	  			{ text: 'RNG丶MLXG VS ？？？' },
	  			{ text: '12/13', className:'ochre' },
	  			{ text: 'KDA' },
	  			{ text: '胜利', className:'green', class:'check' }
	  		],
	  		[
	  			{ text: '2017.01 02 16:00:00' },
	  			{ text: 'RNG丶MLXG VS ？？？' },
	  			{ text: '12/13', className:'ochre' },
	  			{ text: 'KDA' },
	  			{ text: '失败', class:'check' }
	  		],
	  		[
	  			{ text: '2017.01 02 16:00:00' },
	  			{ text: 'RNG丶MLXG VS ？？？' },
	  			{ text: '12/13', className:'ochre' },
	  			{ text: 'KDA' },
	  			{ text: '失败', class:'check' }
	  		],
	  		[
	  			{ text: '2017.01 02 16:00:00' },
	  			{ text: 'RNG丶MLXG VS ？？？' },
	  			{ text: '12/13', className:'ochre' },
	  			{ text: 'KDA' },
	  			{ text: '失败', class:'check' }
	  		]
	  	]
		},
		detail: {
			fourHead: [
	  		{ text: '排名', width: '15%' },
	  		{ text: '角色名', width: '20%' },
	  		{ text: '所在区服', width: '15%' },
	  		{ text: '完成时间', width: '30%' },
	  		{ text: '评分' }
	  	],
	  	fourBody: [
	  		[
	  			{ text: '1', width: '15%' },
	  			{ text: '是jfk价格哈撒你', width: '20%' },
	  			{ text: '皮尔沃特夫', width: '15%' },
	  			{ text: '2017.08.09 16:00:00', width: '30%' },
	  			{ text: '2654.25', className:'orange' }
	  		],
	  		[
	  			{ text: '2' },
	  			{ text: '慢慢就结婚' },
	  			{ text: '皮城警备', },
	  			{ text: '2017.08.09 16:00:00' },
	  			{ text: '1352.68', className:'orange' }
	  		]
	  	]
		}
	}
});
*/

;(function($){
	$('body').on('click', '.rules, .check', function(event) {
		event.preventDefault();
		$('.modals').each(function(){
			$('.up').addClass('down');
		})
		if ($(this).hasClass('rules')) {
			$('.dialog-rules').addClass('up').removeClass('down');
		} else {
			$('.dialog-table').addClass('up').removeClass('down');
		}
	});

	$('body').on('click', '.btn-down', function(event) {
		event.preventDefault();
		$('.modals').addClass('down').removeClass('up');
	});

	//! 调用扫码弹层
	var obj = {
    qrcodeSupport: function(event){
      $('#pay_qrcode').find('.alert_img_qrcode').empty().qrcode({
        width: 120,
        height: 120,
        text: "http://www.baidu.com",
        render: "canvas",
        correctLevel: 1
      });
      $("#pay_qrcode").modal("show");

      /*var param += '&teamId=' + $('.flag').data('teamid') + '&payValue=' + $('#zan_box .on').data('money');
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
            $("#zan_box").modal('hide');
            if (data.message) {
              arenaObj.showMsg(data.message);
            } else {
              arenaObj.showMsg('数据调用异常！');
            }
          }
        }
      });*/
    },
    payFinished: function(){
      /*arenaObj.ajax_({
        name: '定时查询',
        url: arenaObj.options.hostUrl[5] + '?orderId=' + vm.qrcodePay.orderId,
        success: function(data) {
          if(data.success && data.code === 0) {
            clearInterval(vm.flag);
            $('#pay_qrcode').modal('hide');
            $("#zan_box").modal('hide');
            arenaObj.showMsg('支付成功！');
            // window.setTimeout(function(){
            //  location.reload();
            // }, 3000)
            $('[name="flag"]').attr('class', 'already').html('已支持');
            vm.nowData.arenaCnt++;
            vm.nowData.count = vm.nowData.arenaCnt/(vm.nowData.arenaCnt + vm.nowData.attackCnt)*100;
          } else {
            if (data.message) {
              $("#zan_box").modal('hide');
              arenaObj.showMsg(data.message);
            } else {
              arenaObj.showMsg('数据调用异常！');
            }
          }
            // arenaObj.ajax_({
            //  name: '顺豆支持',
            //  url: arenaObj.options.hostUrl[5] + vm.param,
            //  success: function(obj) {
                
            //  }
            // });
          }
      });*/
    }
  }

  $('body').on('click', '.btn-join', function(event) {
    obj.qrcodeSupport();
  });

	var GLOBAL = {
    show: function($obj){
      $obj.fadeIn(200);
      $('.masklayer').show();
    },
    hide: function($obj){
      $obj.fadeOut(200);
      $('.masklayer').hide();
    }
  };

  //! 弹层
  $('body').on('click', '.btn-join', function(event){
    event.preventDefault();
    GLOBAL.show($(".dialog-wrap").eq(0));
  });

  //! 隐藏弹层
  $('body').on('click', '.masklayer, .dialog .btn-close, .dialog .btn-sure, .dialog .btn-cancel', function(event){
    event.preventDefault();
    GLOBAL.hide($('.dialog-wrap'));
  });

  $('body').on('click', '.myGame', function(event) {
		event.preventDefault();
		$('.four a').each(function(){
			$(this).removeClass('active');
		})
		$(this).addClass('active');
		$('.tbl-wrap').eq(0).hide();
		$('.myGame-wrap').show();
	});

	$('body').on('click', '.refresh', function(event) {
		window.location.reload();
	});
})(jQuery);