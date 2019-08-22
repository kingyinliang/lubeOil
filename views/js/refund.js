var mask = mui.createMask(function(){
	$('.reasonList').hide();
});
var vm=new Vue({
	el: '#vmObj',
	data: {
		orderId:'',
		orderInfos:'',
		refundWay:1,
		reasonLists:'',
		reasonName:'',
		rfdDesc:'',
		flag:false
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
		self.reasonList();
	},
	methods:{
		getInfo:function(){
			var self=this;
			var param={'token':token,'order_id':self.orderId};
			postData('/api/order/getOrderInfo',param,function(data){
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
		},
		reasonList:function(){
			var self=this;
			var param={'token':token};
			postData('/api/order/refund_reason',param,function(data){
				if(data.code==200){
					self.reasonLists=data.data;
				}else{
					mui.toast(data.message);
				}
			});
		},
		getReason:function(){
			var self=this;
			console.log(self.flag);
			if(!self.flag){
				$('.reasonList').show();
				self.flag=true;
			}else{
				$('.reasonList').hide();
				self.flag=false;
			}
		},
		selReason:function(index){
			var self=this;
			self.reasonName=self.reasonLists[index].reason;
			$('.reasonList').hide();
			self.flag=false;
		},
		rfdBtn:function(){
			var self=this;
			self.flag=false;
			var param={'token':token,'order_id':self.orderId,'handle':'refund','refund_type':self.refundWay,
			'refund_money':self.orderInfos.pay_money,'reason':self.reasonName,'note':self.rfdDesc};
			postData('/api/order/updateOrderStatus',param,function(data){
				if(data.code==200){
					var paramObj={'orderId':self.orderId};
					nextPage('refundInfo.html',paramObj);
				}else{
					mui.toast(data.message);
				}
			});
		}
	}
});
