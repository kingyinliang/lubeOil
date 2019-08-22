var mask = mui.createMask(function(){
	$('.payWay').hide();
});
var vm=new Vue({
	el: '#vmObj',
	data: {
	    orderLists:'',
	    orderId:'',
	    prePayData:''
	},
	created:function(){
		var self=this;
		self.getList();
	},
	methods:{
		getList:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/toBePaidList', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{},
			  	xhrFields : { 
  					withCredentials: true 
				},
			  	async : true, //是否异步
			  	//processData : false, 
				// 告诉jQuery不要去设置Content-Type请求头
				//contentType : false,
			  	error:function(){
			    	if(status==400){
			  			mui.toast('参数格式有误')
			  		}else{
			  			mui.toast('无法连接到服务器，请稍后重试'); 
			  		}
			  	},
			  	success:function(data){
			  		console.log(data);
			    	if (data.code==0) {
			    		if(data.data.length==0){
			    			mui.toast('暂无订单');
			    		}else{
			    			self.orderLists=data.data;
			    			
			    			$.each(self.orderLists, function(i,v) {
			    				v.createTime=v.createDate.split(' ')[0];
			    			});
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		toOrderinfo:function(index){
			var self=this;
			location.href="ddxq.html?orderId="+self.orderLists[index].id;
		},
		cancalOrder:function(index){
			var self=this;
			var btnArray = ['确定', '取消'];
			mui.confirm('您确定要取消此订单吗？', '温馨提示', btnArray, function(e) {
				if (e.index == 0) {
					$.ajax({   
					  	url:testUrl+'/user/order/closeOrder', // 数据接口地址  
					  	type:'post',        //请求方式
					  	dataType:"json",   //返回数据类型
					 	data:{
					 		orderId:self.orderLists[index].id
					 	},
					  	xhrFields : { 
		  					withCredentials: true 
						},
					  	async : true, //是否异步
					  	//processData : false, 
						// 告诉jQuery不要去设置Content-Type请求头
						//contentType : false,
					  	error:function(){
					    	if(status==400){
					  			mui.toast('参数格式有误')
					  		}else{
					  			mui.toast('无法连接到服务器，请稍后重试'); 
					  		}
					  	},
					  	success:function(data){
					  		console.log(data);
					    	if (data.code==0) {
					    		mui.toast('取消订单成功');
					    		self.orderLists=[];
					    		self.getList();
					     	}else if(data.code==-1){
					     		location.href='ljzc.html';
					     	}else{
					     		mui.toast(data.msg);
					     	}
					  	} 
					});
				} else {
					
				}
			});
		},
		payOrder:function(index){
			var self=this;
			mask.show();
			$('.payWay').show();
			self.orderId=self.orderLists[index].id
		},
		wxWay:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/toBeWxPaid', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		orderId:self.orderId
			 	},
			  	xhrFields : { 
  					withCredentials: true 
				},
			  	async : false, //是否异步
			  	//processData : false, 
				// 告诉jQuery不要去设置Content-Type请求头
				//contentType : false,
			  	error:function(){
			    	if(status==400){
			  			mui.toast('参数格式有误')
			  		}else{
			  			mui.toast('无法连接到服务器，请稍后重试'); 
			  		}
			  	},
			  	success:function(data){
			  		console.log(data);
			    	if (data.code==0) {
			    		self.prePayData=data.data;
			    		//self.wxOrder();
			    		WeixinJSBridge.invoke(
					       'getBrandWCPayRequest', {
					    	   "appId" : self.prePayData.appId, /* 微信支付，坑一 冒号是中文字符 */
					           //"appId": data.appId,     //公众号名称，由商户传入     
					           "timeStamp": self.prePayData.timeStamp,         //时间戳，自1970年以来的秒数     
					           "nonceStr": self.prePayData.nonceStr, //随机串     
					           "package": self.prePayData.packageValue,     
					           "signType": self.prePayData.signType,         //微信签名方式：     
					           "paySign": self.prePayData.paySign //微信签名 
					       	},
					       	function(res){  
						      	//alert(JSON.stringify(res))
					           	if(res.err_msg == "get_brand_wcpay_request:ok" ) {
						           mui.toast("支付成功")
					        	   window.location.href="wcdd.html?orderId="+self.orderId;
					           	}else{
					        	   mui.toast("支付失败，提示【" + res.err_msg + "】");
					        	   //window.location.href="wcdd.html";
					           	}
					       	}
					   	);
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		integralWay:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/toBeJfPaid', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		orderId:self.orderId
			 	},
			  	xhrFields : { 
  					withCredentials: true 
				},
			  	async : false, //是否异步
			  	//processData : false, 
				// 告诉jQuery不要去设置Content-Type请求头
				//contentType : false,
			  	error:function(){
			    	if(status==400){
			  			mui.toast('参数格式有误')
			  		}else{
			  			mui.toast('无法连接到服务器，请稍后重试'); 
			  		}
			  	},
			  	success:function(data){
			  		console.log(data);
			    	if (data.code==0) {
			    		mui.toast('支付成功');
			    		setTimeout(function(){
			    			location.href="wcdd.html?orderId="+data.data.id;
			    		},500);
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		walletWay:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/toBeAccountPaid', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		orderId:self.orderId
			 	},
			  	xhrFields : { 
  					withCredentials: true 
				},
			  	async : false, //是否异步
			  	//processData : false, 
				// 告诉jQuery不要去设置Content-Type请求头
				//contentType : false,
			  	error:function(){
			    	if(status==400){
			  			mui.toast('参数格式有误')
			  		}else{
			  			mui.toast('无法连接到服务器，请稍后重试'); 
			  		}
			  	},
			  	success:function(data){
			  		console.log(data);
			    	if (data.code==0) {
			    		mui.toast('支付成功');
			    		setTimeout(function(){
			    			location.href="wcdd.html?orderId="+data.data.id;
			    		},500);
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		}
	}
});