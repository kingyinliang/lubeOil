var mask = mui.createMask(function(){
	$('.Cns').hide();
});
//var proId=$.getUrlParam('proId');
//var proNum=$.getUrlParam('proNum');
//var proSpec=decodeURI(decodeURI($.getUrlParam('proSpec')));
//var specId=$.getUrlParam('specId');
var proData=JSON.parse(localStorage.getItem('proObj'));
console.log(JSON.stringify(proData));
var vm=new Vue({
	el: '#vmObj',
	data: {
	    proNum:'',
	    proSpec:'',
	    proPrice:'',
	    productInfos:'',
	    amount:'',
	    contactInfos:'',
	    contactId:'',
	    orderNum:'',
	    payWay:0,
	    prePayData:''
	},
	created:function(){
		var self=this;
		self.proNum=proData.proNum;
		self.proSpec=proData.proSpec;
		self.proPrice=proData.proPrice;
		self.proInfo();
		//self.getContact();
	},
	methods:{
		proInfo:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/api/prodoct/getProduct', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		id:proData.proId
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
			    		self.productInfos=data.data;
			    		self.amount=(self.proPrice*self.proNum).toFixed(2);
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		getContact:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/contact/getDefault', // 数据接口地址  
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
			    		if(data.data){
			    			self.contactInfos=data.data;
			    			self.contactId=self.contactInfos.id;
			    		}else{
			    			location.href="contacter.html";
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		editContact:function(){
			location.href="contacter.html";
		},
		wxWay:function(){
			var self=this;
			self.payWay=0;
		},
		aliWay:function(){
			var self=this;
			self.payWay=1;
		},
		integralWay:function(){
			var self=this;
			self.payWay=2;
		},
		walletWay:function(){
			var self=this;
			self.payWay=3;
		},
		wxPay:function(){
			var self=this;
			if(!proData.specId){
				var postData={'productId':proData.proId,'count':proData.proNum,'contactId':self.contactId};
			}else{
				var postData={'productId':proData.proId,'specificationId':proData.specId,'count':proData.proNum,'contactId':self.contactId};
			}
			
			$.ajax({   
			  	url:testUrl+'/user/order/wxOrder', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:postData,
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
			    		self.prePayData=data.data.ret;
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
						      	//alert(JSON.stringify(res));
					           	if(res.err_msg == "get_brand_wcpay_request:ok" ) {
						           mui.toast("支付成功")
					        	   window.location.href="wcdd.html?orderId="+data.data.orderId;
					           	}else{
					        	   mui.toast("支付失败，提示【" + res.err_msg + "】");
					        	   //alert("支付失败，提示【" + res.err_msg + "】");
					        	   //window.location.href="wcdd.html?orderId="+data.data.orderId;
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
		wxOrder:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/api/callback/testwxPayBack', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		payNo:self.orderNum
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
			    			location.href="wcdd.html";
			    		},500);
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		alipay:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/aliOrder', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		productId:proData.proId,
			 		specificationId:proData.specId,
			 		count:proData.proNum,
			 		contactId:self.contactId
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
			    		self.orderNum=data.data;
			    		//self.aliOrder();
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		aliOrder:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/api/callback/testalixPayBack', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		payNo:self.orderNum
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
			    			location.href="wcdd.html";
			    		},500);
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		integralPay:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/integralPay', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		productId:proData.proId,
			 		specificationId:proData.specId,
			 		count:proData.proNum,
			 		contactId:self.contactId
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
		walletPay:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/accountPay', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		productId:proData.proId,
			 		specificationId:proData.specId,
			 		count:proData.proNum,
			 		contactId:self.contactId
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
		payOrder:function(){
			var self=this;
			if(self.payWay==0){
				self.wxPay();
			}else if(self.payWay==1){
				self.alipay();
			}else if(self.payWay==2){
				self.integralPay();
			}else if(self.payWay==3){
				self.walletPay();
			}
		}
	}
});