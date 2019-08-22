var vm=new Vue({
	el: '#vmObj',
	data: {
		curType:1,
	    cursonLists: [],
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
				self.getList();
			});
		}else{
			self.getList();
		}
	},
	methods:{
		getList:function(){
			var self=this;
			var param={'page':self.page,'type':self.curType};
			postData('/api/coupon/getShopCoupon',param,function(data){
				if(data.code==200){
					if(data.data.total==0){
						mui.toast('暂无优惠券');
					}else if(data.data.total<=self.cursonLists.length){
	            		setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		        		},500);
	            	}else{
	            		self.cursonLists=self.cursonLists.concat(data.data.data);
	            		$.each(self.cursonLists, function(i,v) {
	            			v.couMoney=v.money.split('.')[0];
	            			v.fullMoney=v.min_money.split('.')[0];
	            			v.couTime=timestampToTime(v.expire_time);
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
		tab_v:function(){
			var self=this;
			$('.tabs').eq(0).addClass('active').siblings().removeClass('active');
			self.curType=1;
			self.page=1;
			self.cursonLists=[];
			self.getList();
			mui('#pullrefresh').pullRefresh().scrollTo(0, 0, 100);//滚动到顶部
			window.scrollTo(0, 100);
		},
		tab_n:function(){
			var self=this;
			$('.tabs').eq(1).addClass('active').siblings().removeClass('active');
			self.curType=2;
			self.page=1;
			self.cursonLists=[];
			self.getList();
			mui('#pullrefresh').pullRefresh().scrollTo(0, 0, 100);//滚动到顶部
			window.scrollTo(0, 100);
		},
		getCoupon:function(index){
			var self=this;
			if(!token){
				mui.toast('您还未登录,请先登录');
				setTimeout(function(){
					location.href="login.html";
				},500);
			}else{
			var param={'token':token,'coupon_id':self.cursonLists[index].id};
			postData('/api/coupon/addUserCoupon',param,function(data){
				if(data.code==200){
					mui.toast('领取成功');
				}else{
					mui.toast(data.message);
				}
			});
			}
		},
		pulldownRefresh:function() {
	   		var self=this;
	   		self.page=1;
			setTimeout(function(){
				self.cursonLists=[];
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