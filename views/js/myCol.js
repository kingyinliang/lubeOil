var mask = mui.createMask(function(){
	$('.tabCont').hide();
	$('.typeCont').hide();
});
var vm=new Vue({
	el: '#vmObj',
	data: {
	    goodsLists:[],
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
			var param={'token':token};
			postData('/api/goods/getCollcetList',param,function(data){
				if(data.code==200){
					if(data.data.total==0){
						mui.toast('暂无收藏的产品');
					}else if(data.data.total<=self.goodsLists.length){
	            		setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		        		},500);
	            	}else{
	            		self.isSerch=1;
						self.goodsLists=self.goodsLists.concat(data.data.data);
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
		toInfo:function(index){
			var self=this;
			var paramObj={'pId':self.goodsLists[index].id};
			nextPage('goodsInfo.html',paramObj);
		},
		pulldownRefresh:function() {
	   		var self=this;
	   		self.page=1;
			setTimeout(function(){
				self.goodsLists=[];
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
