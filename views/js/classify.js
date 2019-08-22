var vm=new Vue({
	el: '#vmObj',
	data: {
		page:1,
		idx:0,
		cid:0,
	    classifyLists:'',
	    goodsLists:[]
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
			var param={'parent_id':self.cid,'keyword':''};
			postData('/api/category/getcategorylist',param,function(data){
				if(data.code==200){
					self.classifyLists=data.data;
					self.getGood(0);
				}else{
					mui.toast(data.msg);
				}
			});
		},
		getGood:function(idx){
			var self=this;
			var param={'city_id':self.cityId,'cid':self.classifyLists[idx].id};
			postData('/api/goods/getGoodsList',param,function(data){
				if(data.code==200){
					if(data.data.total==0){
					}else if(data.data.total<=self.goodsLists.length){
	            		setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		        		},500);
	            	}else{
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
		classified:function(index){
			var self=this;
			self.idx=index;
			self.page=1;
			self.goodsLists=[];
			self.getGood(index);
		},
		proCont:function(index){
			var self=this;
			var paramObj={'cid':self.goodsLists[index].cid};
			nextPage('classifyList.html',paramObj);
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
	},
	mounted:function(){
		var wHeight=$(window).height();
		$('.lib_Menubox_sx').height(wHeight);
		$('.lib_Contentbox_sx').height(wHeight);
	}
});
