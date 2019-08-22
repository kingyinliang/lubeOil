var vm=new Vue({
	el: '#xx',
	data: {
		idx:0,
	    rechargeLists:'',
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
			  	url:testUrl+'/user/Recharge/templateList', // 数据接口地址  
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
			    			mui.toast('暂无联系人，请添加');
			    		}else{
			    			self.rechargeLists=data.data;
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		selMode:function(index){
			var self=this;
			self.idx=index;
		},
		recharge:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/Recharge/wxOrder', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		templateId:self.rechargeLists[self.idx].id
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
			  		self.prePayData=data.data;
			    	if (data.code==0) {
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
						           mui.toast("充值成功")
					        	   window.location.href="grzx.html?orderId="+self.orderId;
					           	}else{
					        	   mui.toast("充值失败，提示【" + res.err_msg + "】");
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
		}
	}
});