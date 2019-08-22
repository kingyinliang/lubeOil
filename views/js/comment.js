var vm=new Vue({
	el: '#vmObj',
	data: {
		pId:'',
	    commentLists: [],
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
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				self.pId=muiSelf.pId;
				console.log("extras:" + self.pId);
				self.getList();
			});
			window.addEventListener("refresh", function(event) {
				console.log(event);
				self.pId=event.detail.pId;
				console.log("extras:" + self.pId);
				self.getList();
		    }, false);
		}else{
			self.pId=JSON.parse($.getUrlParam('argument')).pId;
			console.log(self.pId);
			self.getList();
		}
	},
	methods:{
		getList:function(){
			var self=this;
			var param={'token':token,'goods_id':self.pId};
			postData('/api/comment/getCommentByGoods',param,function(data){
				if(data.code==200){
					if(data.data.total==0){
						mui.toast('暂无评论');
					}else if(data.data.total<=self.commentLists.length){
	            		setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		        		},500);
	            	}else{
	            		self.commentLists=self.commentLists.concat(data.data.data);
						self.page++;
			            setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
		        		},500);
		        	}
				}else{
					mui.toast(data.msg);
				}
			});
		},
		pulldownRefresh:function() {
	   		var self=this;
	   		self.page=1;
			setTimeout(function(){
				self.commentLists=[];
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