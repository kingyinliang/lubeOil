var vm=new Vue({
	el: '#vmObj',
	data: {
		selCont:-1,
		serCont:'',
		userLists:[],
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
		mui.plusReady(function(){
			self.getList();
		});
	    window.addEventListener('refresh', function(e){//监听上一个页面fire返回
	    	//location.reload();
//	    	console.log(e.detail.param)
//	    	if(e.detail.param){
//		    	self.getList();
//		    }
	 	},false);
	},
	methods:{
		getList:function(){
			var self=this;
			var param={'token':token,'keyword':self.serCont,'type':self.selCont,'page':self.page};
			postData('/api/customer/getlist',param,function(res){
				if(res.code==200){
	        		if(res.data.total==0){
						mui.toast('未查到客户');
					}else if(res.data.total<=self.userLists.length){
	            		setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		        		},500);
	            	}else{
			        	self.userLists=self.userLists.concat(res.data.data);
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
		addUser:function(){
			var self=this;
			nextPage('addUser.html');
		},
		editUser:function(index){
			var self=this;
			var paramObj={'userId':self.userLists[index].id};
			nextPage('editUser.html',paramObj);
		},
		delBtn:function(index){
			var self=this;
			console.log(index)
			var param={'token':token,'id':self.userLists[index].id};
			postData('/api/customer/delCustomer',param,function(data){
				if(data.code==200){
					mui.toast('删除成功');
					self.page=1;
					self.userLists=[];
					self.getList();
				}else{
					mui.toast(data.message);
				}
			});
		},
		serUser:function(){
			var self=this;
			self.page=1;
			self.selCont=-1;
			self.userLists=[];
			self.getList();
		},
		selType:function(){
			var self=this;
			self.page=1;
			self.userLists=[];
			self.getList();
		},
		pulldownRefresh:function() {
	   		var self=this;
	   		self.page=1;
			setTimeout(function(){
				self.userLists=[];
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