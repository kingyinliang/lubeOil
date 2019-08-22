var vm=new Vue({
	el: '#vmObj',
	data: {
		boundNum:'',
		type:1
	},
	created:function(){
		var self=this;
      	mui.plusReady(function(){
			self.getList();
		});
	    window.addEventListener('refresh', function(e){//监听上一个页面fire返回
		    self.getList();
	 	});
	},
	methods:{
		checkCop:function(){
			var self=this;
			$('.boundTab ul li').eq(0).addClass('active').siblings().removeClass('active');
			self.type=1;
		},
		checkServ:function(){
			var self=this;
			$('.boundTab ul li').eq(1).addClass('active').siblings().removeClass('active');
			self.type=2;
		},
		checkBtn:function(){
			var self=this;
			var param={'token':token,'code':self.boundNum,'type':self.type};
			postData('/api/agent/hexiao',param,function(data){
				if(data.code==200){
					mui.toast(data.message);
				}else{
					mui.toast(data.message);
				}
			});
		}
	}
});
$('.headTxt').click(function(){
	mui.openWindow({
        url:'boundRcd.html',
        id:'boundRcd',
        extras:{
        }
   	});
});