var vm=new Vue({
	el: '#vmObj',
	data: {
		cityId:'',
	    goodsLists:[],
	    page:1,
	    cid:0
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
		self.cityId=localStorage.getItem('cityId');
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				self.cid=muiSelf.cid;
				console.log("extras:" + self.cid);
				self.getList();
			});
			window.addEventListener("refresh", function(event) {
				console.log(event);
				self.cid=event.detail.cid;
				console.log("extras:" + self.cid);
				self.getList();
		    }, false);
		}else{
			self.cid=JSON.parse($.getUrlParam('argument')).cid;
			console.log(self.cid);
			self.getList();
		}
	},
	methods:{
		getList:function(){
			var self=this;
			var param={'city_id':self.cityId,'cid':self.cid};
			postData('/api/goods/getGoodsList',param,function(data){
				if(data.code==200){
					if(data.data.total==0){
						mui.toast('暂无数据');
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
