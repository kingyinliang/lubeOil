var mask = mui.createMask(function(){
	$('.tabCont').hide();
	$('.typeCont').hide();
});
var vm=new Vue({
	el: '#vmObj',
	data: {
		isSer:0,
		isSerch:0,
		cityId:'',
		serCont:'',
	    hotLists:'',
	    historyLists:[],
	    goodsLists:[],
	    page:1,
	    selCond:'zonghe',
	    sort:'',
	    cid:0,
	    cLists:'',
	    idx:0,
	    brand_id:0,
	    bLists:'',
	    idx1:0
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
		var historyLists=JSON.parse(localStorage.getItem('historyLists'));
		if(!historyLists){
			self.historyLists=[];
		}else{
			self.historyLists=historyLists;
		}
		self.getHotkey();
		if(!self.serCont){
			self.isSer=0;
		}else{
			self.isSer=1;
		}
	},
	methods:{
		getList:function(){
			var self=this;
			var param={'token':token,'city_id':self.cityId,'keyword':self.serCont,'order_field':self.selCond,'order_sort':self.sort,
			'brand_id':self.brand_id,'cid':self.cid};
			postData('/api/goods/getGoodsList',param,function(data){
				if(data.code==200){
					if(data.data.total==0){
						self.isSerch=2;
					}else if(data.data.total<=self.goodsLists.length){
	            		setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		        		},500);
	            	}else{
	            		$('.isSerch').show();
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
		isInput:function(){
			$('.idxSearch').addClass('mui-active');
		},
		getHotkey:function(){
			var self=this;
			postData('/api/search/getHotSearch','',function(data){
				if(data.code==200){
					self.hotLists=data.data;
				}else{
					mui.toast(data.msg);
				}
			});
		},
		serBtn:function(){
			var self=this;
			if(!self.serCont){
				mui.toast('请输入搜索内容');
			}else{
				self.getList();
				self.historyLists.push(self.serCont);
				localStorage.setItem('historyLists',JSON.stringify(self.historyLists));
			}
		},
		hotSerch:function(index){
			var self=this;
			self.isInput();
			self.serCont=self.hotLists[index];
			self.getList();
			self.historyLists.push(self.serCont);
			localStorage.setItem('historyLists',JSON.stringify(self.historyLists));
		},
		histSerch:function(index){
			var self=this;
			self.serCont=self.historyLists[index];
			self.getList();
		},
		delHistory:function(){
			localStorage.removeItem('historyLists');
			location.reload();
		},
		all:function(){
			var self=this;
			$('.filteTab li').eq(0).addClass('active').siblings().removeClass('active');
			$('.tabCont').show();
			mask.show();
		},
		sale:function(){
			var self=this;
			$('.filteTab li').eq(1).addClass('active').siblings().removeClass('active');
			$('.tabCont').hide();
			mask.close();
			self.selCond='sell_count';
			self.page=1;
			self.goodsLists=[];
			self.getList();
		},
		filter:function(){
			var self=this;
			$('.tabCont').hide();
			mask.show();
			$('.typeCont').show();
			self.getBrand();
			self.getType();
		},
		selAll:function(){
			var self=this;
			mask.close();
			$('.tabCont li').eq(0).addClass('active').siblings().removeClass('active');
			self.selCond='zonghe';
			self.page=1;
			self.goodsLists=[];
			self.getList();
		},
		price_desc:function(){
			var self=this;
			mask.close();
			$('.tabCont li').eq(1).addClass('active').siblings().removeClass('active');
			self.sort='desc';
			self.page=1;
			self.goodsLists=[];
			self.getList();
		},
		price_asc:function(){
			var self=this;
			mask.close();
			$('.tabCont li').eq(2).addClass('active').siblings().removeClass('active');
			self.sort='asc';
			self.page=1;
			self.goodsLists=[];
			self.getList();
		},
		getType:function(){
			var self=this;
			var param={'token':token,'parent_id':self.cid,'keyword':self.serCont};
			postData('/api/category/getcategorylist',param,function(data){
				if(data.code==200){
					self.cLists=data.data;
				}else{
					mui.toast(data.msg);
				}
			});
		},
		selType:function(index){
			var self=this;
			self.idx=index+1;
			$('.cType li').eq(index+1).addClass('active').siblings().removeClass('active');
			self.c_id=self.cLists[index].id;
		},
		getBrand:function(index){
			var self=this;
			var param={'token':token,'keyword':self.serCont};
			postData('/api/goods/getbrands',param,function(data){
				if(data.code==200){
					self.bLists=data.data;
				}else{
					mui.toast(data.msg);
				}
			});
		},
		selBrand:function(index){
			var self=this;
			self.idx=index+1;
			$('.brand li').eq(index+1).addClass('active').siblings().removeClass('active');
			self.brand_id=self.bLists[index].id;
		},
		confirm:function(){
			var self=this;
			mask.close();
			self.page=1;
			self.goodsLists=[];
			self.getList();
		},
		reset:function(){
			var self=this;
			mask.close();
			self.selCond='zonghe';
			self.sort='';
			self.c_id='';
			self.brand_id='';
			self.page=1;
			self.goodsLists=[];
			self.getList();
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
