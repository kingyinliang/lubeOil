var vm=new Vue({
	el: '#vmObj',
	data: {
	    envirConts: ''
	},
	created:function(){
		var self=this;
		self.getConts();
	},
	methods:{
		getConts:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/api/program/getEnvironment', // 数据接口地址  
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
			    		self.envirConts=data.data;
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		}
	}
});