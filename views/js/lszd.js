var vm=new Vue({
	el: '#vmObj',
	data: {
	    billLists:''
	},
	created:function(){
		var self=this;
		self.myList();
	},
	methods:{
		myList:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/billLog/getMyBill', // 数据接口地址  
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
			  			mui.toast('参数格式有误');
			  		}else{
			  			mui.toast('无法连接到服务器，请稍后重试'); 
			  		}
			  	},
			  	success:function(data){
			  		console.log(data);
			    	if (data.code==0) {
			    		if(!data.data){
			    			mui.toast('暂无收支记录');
			    		}else{
			    			self.billLists=data.data;
			    			$.each(self.billLists, function(i,v) {
			    				if(v.type==1){
			    					v.typeName='钱包充值';
			    				}else if(v.type==2){
			    					v.typeName='钱包使用';
			    				}else if(v.type==3){
			    					v.typeName='积分获得';
			    				}else if(v.type==4){
			    					v.typeName='积分消费';
			    				}else if(v.type==5){
			    					v.typeName='在线支付';
			    				}
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
		directList:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/billLog/getMyDirectReferralsBill', // 数据接口地址  
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
			    		if(!data.data){
			    			mui.toast('暂无收支记录');
			    		}else{
			    			self.billLists=data.data;
			    			$.each(self.billLists, function(i,v) {
			    				if(v.type==1){
			    					v.typeName='钱包充值';
			    				}else if(v.type==2){
			    					v.typeName='钱包使用';
			    				}else if(v.type==3){
			    					v.typeName='积分获得';
			    				}else if(v.type==4){
			    					v.typeName='积分消费';
			    				}else if(v.type==5){
			    					v.typeName='在线支付';
			    				}
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
		indirectList:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/billLog/getMyIndirectRecommendationBill', // 数据接口地址  
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
			    		if(!data.data){
			    			mui.toast('暂无收支记录');
			    		}else{
			    			self.billLists=data.data;
			    			$.each(self.billLists, function(i,v) {
			    				if(v.type==1){
			    					v.typeName='钱包充值';
			    				}else if(v.type==2){
			    					v.typeName='钱包使用';
			    				}else if(v.type==3){
			    					v.typeName='积分获得';
			    				}else if(v.type==4){
			    					v.typeName='积分消费';
			    				}else if(v.type==5){
			    					v.typeName='在线支付';
			    				}
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
		myBalance:function(){
			var self=this;
			$('#tab_t li:eq(0)').addClass('act').siblings().removeClass('act');
			self.myList();
		},
		direct:function(){
			var self=this;
			$('#tab_t li:eq(1)').addClass('act').siblings().removeClass('act');
			self.directList();
		},
		indirect:function(){
			var self=this;
			$('#tab_t li:eq(2)').addClass('act').siblings().removeClass('act');
			self.indirectList();
		},
		billInfo:function(index){
			var self=this;
			location.href="zdxq.html?billId="+self.billLists[index].id;
		}
	}
});