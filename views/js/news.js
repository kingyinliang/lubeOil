var vm=new Vue({
	el: '#vmObj',
	data: {
	    newsType: ''
	},
	created:function(){
		var self=this;
		self.getNews();
	},
	methods:{
		getNews:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/message/allMessage', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{},   //
			  	xhrFields : { 
  					withCredentials: true 
				} ,
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
			    	if (data.code==0) {
			    		if (data.data['1']>0) {
			    			$(".p1").show();
//			    			$(".p1").html(data.data['1']);
			     		}
			     		if (data.data['2']>0) {
			     			$(".p2").show();
			     		}
			     		if(data.data['3']>0) {
			     			$(".p3").show();
			     		}
			     		if(data.data['4']>0) {
			     			$(".p4").show();
			     		}
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		registerNews:function(){
			var self=this;
			self.newsType=1;
			location.href="newsList.html?newsType="+self.newsType;
//			var paramObj={'newsType':self.newsType};
//			nextPage('newsList.html',paramObj);
		},
		tradeNews:function(){
			var self=this;
			self.newsType=2;
			location.href="newsList.html?newsType="+self.newsType;
		},
		incomeNews:function(){
			var self=this;
			self.newsType=3;
			location.href="newsList.html?newsType="+self.newsType;
		},
		systemNews:function(){
			var self=this;
			self.newsType=4;
			location.href="newsList.html?newsType="+self.newsType;
		}
	}
});