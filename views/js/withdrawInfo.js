var vm=new Vue({
	el: '#vmObj',
	data: {
	    profileLists: [],
	    page:1
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
      	self.getList();
	},
	methods:{
		getList:function(){
			var self=this;
			var param={'token':token,'page':self.page};
			postData('/api/withdraw/getApplyList',param,function(data){
				if(data.code==200){
					if(data.data.total==0){
						mui.toast('暂无提现明细');
					}else if(data.data.total<=self.profileLists.length){
	            		setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		        		},500);
	            	}else{
	            		self.profileLists=self.profileLists.concat(data.data.data);
	            		$.each(self.profileLists, function(i,v) {
	            			v.addTime=timestampToTime(v.add_time);
	            		});
						self.page++;
			            setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
		        		},500);
		        	}
				}else{
					mui.toast(data.message);
				}
			});
		},
		pulldownRefresh:function() {
	   		var self=this;
	   		self.page=1;
			setTimeout(function(){
				self.profileLists=[];
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