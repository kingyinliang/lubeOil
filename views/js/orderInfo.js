var vm=new Vue({
	el: '#vmObj',
	data: {
		orderId:'',
		orderInfos:'',
		refundWay:1
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
		payment:function(){
			var self=this;
			var param={'token':token,'order_sn':self.orderInfos.order_sn};
			postData('/api/pay/pay',param,function(res){
				if(res.code==200){
					console.log(res.data);
					WeixinJSBridge.invoke(
				       'getBrandWCPayRequest', {
				    	   "appId" : res.data.appId, /* 微信支付，坑一 冒号是中文字符 */
				           "timeStamp": res.data.timeStamp,         //时间戳，自1970年以来的秒数     
				           "nonceStr": res.data.nonceStr, //随机串     
				           "package": res.data.package,     
				           "signType": res.data.signType,         //微信签名方式：     
				           "paySign": res.data.paySign //微信签名 
				       	},
				       	function(res){  
					      	//alert(JSON.stringify(res))
				           	if(res.err_msg == "get_brand_wcpay_request:ok" ) {
					           mui.toast("支付成功");
				        	   window.location.href="myOrder.html";
				           	}else{
				        	   mui.toast("支付失败");
				        	   //window.location.href="wcdd.html";
				           	}
				       	}
				   	);
				}else{
					mui.toast(data.message);
				}
			});
		},
		cancelOrder:function(){
			var self=this;
			var btnArray = ['确定', '取消'];
			mui.confirm('您确定要取消此订单吗？', '温馨提示', btnArray, function(e) {
				if (e.index == 0) {
					var param={'token':token,'order_id':self.orderId,'handle':'cancel'};
					postData('/api/order/updateOrderStatus',param,function(data){
						if(data.code==200){
							mui.toast(data.message);
							self.getInfo();
							//window.location.href="myOrder.html";
						}else{
							mui.toast(data.message);
						}
					});
				}
			});
		},
		cfmGood:function(){
			var self=this;
			var param={'token':token,'order_id':self.orderId,'handle':'finish'};
			postData('/api/order/updateOrderStatus',param,function(data){
				if(data.code==200){
					mui.toast('已确认');
					self.getInfo();
					//window.location.href="myOrder.html";
				}else{
					mui.toast(data.message);
				}
			});
		},
        cfmService: function () {
            var self=this;
            var param={'token':token,'order_id':self.orderId,'handle':'service'};
            postData('/api/order/updateOrderStatus',param,function(data){
                if(data.code==200){
                    mui.toast('已确认');
                    self.getInfo();
                    //window.location.href="myOrder.html";
                }else{
                    mui.toast(data.message);
                }
            });
        },
		refund:function(){
			var self=this;
			var paramObj={'orderId':self.orderId};
			nextPage('refund.html',paramObj);
		},
		checkLogis:function(){
			var self=this;
			var paramObj={'orderId':self.orderId};
			nextPage('logistic_o.html',paramObj);
		},
		evaluate:function(){
			var self=this;
			var paramObj={'orderId':self.orderId, 'sendType': self.orderInfos.send_type};
			nextPage('evalOrder.html',paramObj);
		}
	}
});
