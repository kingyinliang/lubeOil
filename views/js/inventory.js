var vm=new Vue({
	el: '#vmObj',
	data: {
		serCont:'',
		purSort:'add_time',
		page:1,
	    pursellLists:[],
	    pursellData:'',
        selCont:1,
        dataLists: []
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
      	//mui.plusReady(function(){
			self.getList();
		//});
	},
	methods:{
        getList: function () {
            var self=this;
            var param={'token':token,'page':self.page,'month':self.selCont};
            postData('/api/Inventoryorder/index',param,function(res){
                if(res.code==200){
                    if(res.data.total==0){
                        mui.toast('暂无商品');
                        setTimeout(function(){
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                        },500);
                    } else if (self.page === 1) {
                        self.dataLists = res.data.data
                        self.page++;
                        setTimeout(function(){
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                        },500);
                    } else if(res.data.total<=self.dataLists.length){
                        setTimeout(function(){
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                        },500);
                    }else{
                        self.dataLists=self.dataLists.concat(res.data.data);
                        self.page++;
                        setTimeout(function(){
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                        },500);
                    }
                }else{
                    mui.toast(res.message);
                }
            })
        },
		// getList:function(){
		// 	var self=this;
		//     var param={'token':token,'page':self.page,'order_field':self.purSort,'keyword':self.serCont};
		// 	postData('/api/inventorygoods/getList',param,function(res){
	     //    	if(res.code==200){
	     //    		if(res.data.total==0){
		// 				mui.toast('暂无商品');
		// 			}else if(res.data.total<=self.pursellLists.length){
	     //        		setTimeout(function(){
		//         			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		//         		},500);
	     //        	}else{
		// 	        	self.pursellLists=self.pursellLists.concat(res.data.data);
		// 	        	self.page++;
		// 	            setTimeout(function(){
		//         			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
		//         		},500);
		//         	}
		//         }else{
		//         	mui.toast(res.message);
		//         }
		//   	});
		// },
		getData:function(){
			var self=this;
			var param={'token':token};
			postData('/api/inventorygoods/getStatistical',param,function(res){
	        	if(res.code==200){
	        		self.pursellData=res.data;
	        	}else{
		        	mui.toast(res.message);
		        } 
		  	});
		},
		dft:function(){
			var self=this;
			$('.filteTab li').eq(0).addClass('active').siblings().removeClass('active');
			self.purSort='add_time';
			self.pulldownRefresh();
		},
		saleNum:function(){
			var self=this;
			$('.filteTab li').eq(1).addClass('active').siblings().removeClass('active');
			self.purSort='sale_num';
			self.pulldownRefresh();
		},
		saleAmount:function(){
			var self=this;
			$('.filteTab li').eq(2).addClass('active').siblings().removeClass('active');
			self.purSort='sale_amount';
			self.pulldownRefresh();
		},
		editBound:function(index){
			var self=this;
			var paramObj={'boundId':self.pursellLists[index].id};
           	nextPage('editBound.html',paramObj);
		},
		pulldownRefresh:function() {
	   		var self=this;
	   		self.page=1;
			setTimeout(function(){
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