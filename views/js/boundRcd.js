var vm=new Vue({
	el: '#vmObj',
	data: {
		type:1,
		page:1,
	    boundLists:[]
	},
	created:function(){
		var self=this;
		mui.init({
      		pullRefresh: {
				container: '#pullrefresh',
				down: {
					style:'circle',
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
      	mui.plusReady(function(){
			self.getList();
		});
	    window.addEventListener('refresh', function(e){//监听上一个页面fire返回
		    self.getList();
	 	});
	},
	methods:{
		getList:function(){
			var self=this;
			var param={'token':token,'page':self.page,'type':self.type};
			postData('/api/agent/hexiao_records',param,function(res){
	        	if(res.code==200){
	        		if(res.data.total==0){
						mui.toast('暂无核销记录');
					}else if(res.data.total<=self.boundLists.length){
	            		setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		        		},500);
	            	}else{
			        	self.boundLists=self.boundLists.concat(res.data.data);
			        	$.each(self.boundLists, function(i,v) {
			        		v.creatTime=v.create_time.split(' ')[0];
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
		checkCop:function(){
			var self=this;
			$('.boundTab ul li').eq(0).addClass('active').siblings().removeClass('active');
			self.type=1;
			self.pulldownRefresh();
		},
		checkServ:function(){
			var self=this;
			$('.boundTab ul li').eq(1).addClass('active').siblings().removeClass('active');
			self.type=2;
			self.pulldownRefresh();
		},
		pulldownRefresh:function() {
	   		var self=this;
	   		self.page=1;
			setTimeout(function(){
				self.boundLists=[];
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