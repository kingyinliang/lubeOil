var mask = mui.createMask(function(){
	$('.popRule').hide();
});
var setTime;
var vm=new Vue({
	el: '#vmObj',
	data: {
	    orderLists: [],
	    page:1,
	    status:''
	},
	created:function(){
		var self=this;
		mui.init({
      		pullRefresh: {
				container: '#pullrefresh',
				down: {
					style:'circle',
					//auto: true,
					contentdown : "下拉可以刷新",
					contentover : "释放立即刷新",
					contentrefresh : "正在刷新...",
					callback: self.pulldownRefresh
				},
				up: {
					contentrefresh: '正在加载...',
					contentnomore:'暂无更多数据',
					callback: self.pullupRefresh
				}
			}
      	});
      	if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				self.status=muiSelf.status;
				console.log("extras:" + self.status);
				if(self.status==0){
					$('.head-title').html('待付款');
				}else if(self.status==1){
					$('.head-title').html('待发货');
				}else if(self.status==2){
					$('.head-title').html('待收货');
				}else if(self.status==3){
					$('.head-title').html('待评价');
				}else if(self.status==6){
					$('.head-title').html('退换货');
				}else if(self.status==7){
					$('.head-title').html('待服务');
				}else if(self.status==-1){
					$('.head-title').html('全部订单');
				}
				self.getList();
			});
			window.addEventListener('refresh', function(e){//监听上一个页面fire返回
				self.status=e.detail.status;
			    self.getList();
		 	});
		}else{
			console.log(JSON.parse($.getUrlParam('argument')));
			self.status=JSON.parse($.getUrlParam('argument')).status;
			console.log(self.status);
			if(self.status==0){
				$('.head-title').html('待付款');
			}else if(self.status==1){
				$('.head-title').html('待发货');
			}else if(self.status==2){
				$('.head-title').html('待收货');
			}else if(self.status==3){
				$('.head-title').html('待评价');
			}else if(self.status==6){
				$('.head-title').html('退换货');
			}else if(self.status==7){
				$('.head-title').html('待服务');
			}else if(self.status==-1){
				$('.head-title').html('全部订单');
			}
			self.getList();
		}
		
	},
	methods:{
		getList:function(){
			var self=this;
			var param={'token':token,'page':self.page,'status':self.status};
			postData('/api/order/getOrderList',param,function(res){
	        	if(res.code==200){
	        		if(res.data.total==0){
						mui.toast('暂无订单');
					}else if (self.page === 1) {
                        self.orderLists = res.data.data
                        self.page++;
                        setTimeout(function(){
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                        },500);
					}else if(res.data.total<=self.orderLists.length){
	            		setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		        		},500);
	            	}else{
						self.orderLists=self.orderLists.concat(res.data.data);
						$.each(self.orderLists, function(i,v) {
							//v.totalAmount=v.order_amount.split('.')[0];
							v.ordertime=timestampToTime(v.add_time);
						});
						self.page++;
			            setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
		        		},500);
	        		}
	        	}else{
					mui.toast(res.message);
				}
		  	});
		},
		toOrderInfo:function(index){
			var self=this;
			var paramObj={'orderId':self.orderLists[index].id};
			if(self.orderLists[index].status==6){
				nextPage('refundInfo.html',paramObj);
			}else{
				nextPage('orderInfo.html',paramObj);
			}
		},
		payment:function(index){
			var self=this;
			var param={'token':token,'order_sn':self.orderLists[index].order_sn};
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
					      	alert(JSON.stringify(res))
				           	if(res.err_msg == "get_brand_wcpay_request:ok" ) {
					           mui.toast("支付成功");
					           self.getList();
				        	   //window.location.href="myOrder.html?orderId="+self.orderId;
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
		cancelOrder:function(index){
			var self=this;
			var btnArray = ['确定', '取消'];
			mui.confirm('您确定要取消此订单吗？', '温馨提示', btnArray, function(e) {
				if (e.index == 0) {
					var param={'token':token,'order_id':self.orderLists[index].id,'handle':'cancel'};
					postData('/api/order/updateOrderStatus',param,function(data){
						if(data.code==200){
							mui.toast(data.message);
							self.page=1;
							self.orderLists=[];
							self.getList();
						}else{
							mui.toast(data.message);
						}
					});
				}
			});
		},
		cfmGood:function(index){
			var self=this;
			var param={'token':token,'order_id':self.orderLists[index].id,'handle':'finish'};
			postData('/api/order/updateOrderStatus',param,function(data){
				if(data.code==200){
					mui.toast('已确认');
					self.page=1;
					self.orderLists=[];
					self.getList();
				}else{
					mui.toast(data.message);
				}
			});
		},
        cfmService: function (index) {
            var self=this;
            var param={'token':token,'order_id':self.orderLists[index].id,'handle':'service'};
            postData('/api/order/updateOrderStatus',param,function(data){
                if(data.code==200){
                    mui.toast('已确认');
                    self.page=1;
                    self.orderLists=[];
                    self.getList();
                }else{
                    mui.toast(data.message);
                }
            });
		},
		refund:function(index){
			var self=this;
			var paramObj={'orderId':self.orderLists[index].id};
			nextPage('refund.html',paramObj);
		},
		checkLogis:function(index){
			var self=this;
			var paramObj={'orderId':self.orderLists[index].id};
			nextPage('logistic_o.html',paramObj);
		},
		evaluate:function(index){
			var self=this;
			var paramObj={'orderId':self.orderLists[index].id, 'sendType': self.orderLists[index].send_type};
			nextPage('evalOrder.html',paramObj);
		},
		pulldownRefresh:function() {
	   		var self=this;
	   		self.page=1;
			setTimeout(function(){
				self.getList();
               	mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
           	},1500);
       	},
	   	pullupRefresh:function() {
	   		var self=this;
       		self.getList();
       	}
	}
});