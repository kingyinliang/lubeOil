var vm=new Vue({
	el: '#vmObj',
	data: {
		orderId:'',
		orderInfos:''
	},
	created:function(){
		var self=this;
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				self.orderId=muiSelf.orderId;
				console.log("extras:" + self.orderId);
				self.getInfo();
			});
		}else{
			self.orderId=JSON.parse($.getUrlParam('argument')).orderId;
			console.log(self.orderId);
			self.getInfo();
		}
	},
	methods:{
		getInfo:function(){
			var self=this;
			var param={'token':token,'order_id':self.orderId};
			postData('/api/Refund/getRefundInfo',param,function(data){
				if(data.code==200){
					self.orderInfos=data.data;
					self.orderInfos.ordertime=timestampToTime(self.orderInfos.add_time);
					if($('.orderBan img').height()<$('.orderBan img').width()){
						$('.orderBan img').height('1.48rem');
					}else{
						$('.orderBan img').width('1.48rem');
					}
				}else{
					mui.toast(data.message);
				}
			});
		}
	}
});
