var newsType=$.getUrlParam('newsType');
var vm=new Vue({
	el: '#cont',
	data: {
	    newsType: '',
	    newsLists:''
	},
	created:function(){
		var self=this;
		if(newsType==1){
			$('.mui-title').html('注册提醒');
		}else if(newsType==2){
			$('.mui-title').html('交易提醒');
		}else if(newsType==3){
			$('.mui-title').html('收入提醒');
		}else if(newsType==4){
			$('.mui-title').html('系统消息');
		}
		self.getNews();
	},
	methods:{
		getNews:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/message/findByType', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		type:newsType
			 	},
			  	xhrFields:{ 
  					withCredentials: true 
				} ,
			  	async : true, //是否异步
			  	error:function(){   
			    	if(status==400){
			  			mui.toast('参数格式有误');
			  		}else{
			  			mui.toast('无法连接到服务器，请稍后重试'); 
			  		}
			  	},   
			  	success:function(data){
			    	if (data.code==0){
			    		self.newsLists=data.data.list;
//			    		self.newsLists=data.data.noRead.concat(data.data.read);
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	}
			});
		},
		toCont:function(index){
			var self=this;
			location.href="newsCont.html?newsId="+self.newsLists[index].id
//			var paramObj={'newsId':self.newsLists[index].id};
//			nextPage('newsCont.html',paramObj);
		}
	}
});