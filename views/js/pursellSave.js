var vm=new Vue({
	el: '#vmObj',
	data: {
		purSort:'add_time',
		page:1,
	    pursellLists:[]
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
	 	// self.getList();
	},
	methods:{
		getList:function(){
			var self=this;
			$.ajax({  
		        dataType:"json",
		        type:"post",  
		        url:Url+'/api/inventorygoods/getList',//接口服务器地址  
		        data:{
		        	token:token,
		        	page:self.page,
		        	order_field:self.purSort
		        },//请求数据
		        success:function(res){
		        	console.log(res);
		        	if(res.code==200){
		        		if(res.data.total==0){
							mui.toast('暂无商品');
						}else if(res.data.total<=self.pursellLists.length){
		            		setTimeout(function(){
			        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			        		},500);
		            	}else{
				        	self.pursellLists=self.pursellLists.concat(res.data.data);
				        	self.page++;
				            setTimeout(function(){
			        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			        		},500);
			        	}
			        }else{
			        	mui.toast(res.message);
			        }
		        },
		        error:function(e){
		        	mui.toast('网络请求失败,请检查网络连接');
		            //失败执行  
		            //mui.toast(e.status+','+ e.statusText);
		        }  
		  	});
		},
		goCheck: function () {
            mui.openWindow({
                url:'checkBound.html',
                id:'checkBound',
                extras:{
                }
            });
		},
		inbound:function(){
           	nextPage('inbound.html');
		},
		outbound:function(){
           	nextPage('outBound.html')
		},
		inventory:function(){
           	nextPage('inventory.html')
		},
		hisRecd:function(){
           	nextPage('hisBound.html')
		},
		userManage:function(){
           	nextPage('userManage.html')
		},
		unsold:function(){
           	nextPage('unsold.html')
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
				self.pursellLists=[];
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
$('.headTxt').click(function(){
	mui.openWindow({
        url:'checkBound.html',
        id:'checkBound',
        extras:{
        }
   	});
});