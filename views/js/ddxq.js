var orderId=$.getUrlParam('orderId');
var mask = mui.createMask(function(){
	$('.payWay').hide();
	$('.orderMa').hide();
});
var vm=new Vue({
	el: '#vmObj',
	data: {
	    orderInfos:'',
	    orderMa:''
	},
	created:function(){
		var self=this;
		self.getInfo();
	},
	methods:{
		getInfo:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/getOrderInfo', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		id:orderId
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
			    		self.orderInfos=data.data;
			    		if(self.orderInfos.status==1){
			    			self.orderInfos.statusName='待支付';
			    		}else if(self.orderInfos.status==2){
			    			self.orderInfos.statusName='待使用';
			    		}else if(self.orderInfos.status==3){
			    			self.orderInfos.statusName='待评价';
			    		}else if(self.orderInfos.status==4){
			    			self.orderInfos.statusName='已评价';
			    		}else if(self.orderInfos.status==5){
			    			self.orderInfos.statusName='已过期';
			    		}else if(self.orderInfos.status==0){
			    			self.orderInfos.statusName='已关闭';
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		buy:function(){
			var self=this;
			mask.show();
			$('.payWay').show();
		},
		wxWay:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/toBeWxPaid', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		orderId:orderId
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
					        	   window.location.href="wcdd.html?orderId="+orderId;
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
			 		orderId:orderId
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
			 		orderId:orderId
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
		use:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/toFinishNo', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		orderId:orderId
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
			    		self.orderMa=data.data;
			    		mask.show();
						$('.orderMa').show();
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		appraseOrder:function(){
			var self=this;
			location.href="sppj.html?orderId="+orderId+"&proId="+self.orderLists[index].productId;
		}
	}
});