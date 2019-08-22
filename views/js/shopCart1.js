var mask = mui.createMask(function(){
	$('.popRule').hide();
});
var vm=new Vue({
	el: '#vmObj',
	data: {
		isLogin:true,
	    shopLists: [],
	    page:1,
	    selectId:[],
	    totalAmount:0,
	    selIdx:0,
	    flag:true,
	    idx:0,
	    defSel:0,
	    selectArr:[],
	    cartId:[]
	},
	created:function(){
		var self=this;
//		mui.init({
//    		pullRefresh: {
//				container: '#pullrefresh',
//				down: {
//					style:'circle',
//					//auto: true,
//					contentdown : "下拉可以刷新",
//					contentover : "释放立即刷新",
//					contentrefresh : "正在刷新...",
//					callback: self.pulldownRefresh
//				},
//				up: {
//					contentrefresh: '正在加载...',
//					contentnomore:'暂无更多数据',
//					callback: self.pullupRefresh
//				}
//			}
//    	});
		self.getList();
	},
	methods:{
		getList:function(){
			var self=this;
			var param={'token':token,'page':self.page};
			postData('/api/shopcart/getlist',param,function(data){
	        	if(data.code==200){
					self.shopLists=data.data;
					if(self.shopLists.length>0){
					self.selectId.push(self.shopLists[0].goods_id);
					self.cartId.push(self.shopLists[0].id);
					self.selectArr.push(self.shopLists[0]);
					//self.getPrice();
					$.each(self.shopLists, function(i,v) {
						//v.pPrice=v.list[0].price.split('.')[0];
						v.pPrice=v.list[0].price;
					});
					self.selIdx=1;
					self.totalAmount=Calculation('add',self.shopLists[0].list[0].num*self.shopLists[0].pPrice,Calculation('add',self.shopLists[0].peijian_price,self.shopLists[0].service_price));
					}
	        	}else{
	        		if(data.message=='token不能为空'){
	        			self.isLogin=false;
	        		}else{
						mui.toast(data.message);
					}
				}
		  	});
		},
		getPrice:function(){
			var self=this;
			var param={'selectGoodsId':self.selectId};
			postData('/api/Goods/getSelectMoney',param,function(data){
				if(data.code==1){
					self.totalAmount=data.data;
				}else{
					mui.toast(data.msg);
				}
			});
		},
		toLogin:function(){
			var self=this;
			nextPage('login.html');
		},
		toShop:function(){
			var self=this;
			nextPage('index.html');
		},
		add:function(index){
			var self=this;
			var param={'token':token,'id':self.shopLists[index].id,'num':++self.shopLists[index].list[0].num};
			postData('/api/shopcart/updateNum',param,function(data){
				if(data.code==200){
					//self.shopLists[index].list[0].num++;
					self.totalAmount=Calculation('add',self.totalAmount,self.shopLists[index].pPrice);
				}else{
					mui.toast(data.message);
				}
			});
		},
		reduce:function(index){
			var self=this;
			if(self.shopLists[index].list[0].num>1){
				var param={'token':token,'id':self.shopLists[index].id,'num':--self.shopLists[index].list[0].num};
				postData('/api/shopcart/updateNum',param,function(data){
					if(data.code==200){
						//self.shopLists[index].list[0].num--;
						self.totalAmount=Calculation('reduce',self.totalAmount,self.shopLists[index].pPrice);
					}else{
						mui.toast(data.message);
					}
				});
			}
		},
		shopInfo:function(index){
			var self=this;
			console.log(index);
		},
		selBtn:function(index){
			var self=this;
			self.idx=index;
			console.log(self.idx);
			if(!$('input[name="checkbox"]').eq(index).prop("checked")&&self.flag){
				self.selIdx++;
				$('input[name="checkbox"]').eq(index).prop("checked",true);
				self.selectId.push(self.shopLists[index].goods_id);
				self.cartId.push(self.shopLists[index].id);
				self.selectArr.push(self.shopLists[index]);
				if(self.selIdx==self.shopLists.length){
					$('.shopSel_all span').html('全选');
					$('.shopSel_all input').prop("checked",true);
					self.flag=false;
				}
				self.totalAmount=Calculation('add',self.totalAmount,Calculation('add',self.shopLists[index].list[0].num*self.shopLists[index].pPrice,Calculation('add',self.shopLists[index].peijian_price,self.shopLists[index].service_price)));
			}else{
				self.selIdx--;
				$('input[name="checkbox"]').eq(index).prop("checked",false);
				self.selectId.splice($.inArray(self.shopLists[index].goods_id,self.selectId),1);
				self.cartId.splice($.inArray(self.shopLists[index].id,self.cartId),1);
				self.selectArr.splice($.inArray(self.shopLists[index],self.selectArr),1);
				if(!self.flag){
					$('.shopSel_all input').prop("checked",false);
					self.flag=true;
				}
				self.totalAmount=Calculation('reduce',self.totalAmount,Calculation('add',self.shopLists[index].list[0].num*self.shopLists[index].pPrice,Calculation('add',self.shopLists[index].peijian_price,self.shopLists[index].service_price)));
			}
			console.log(self.selIdx);
			console.log(self.selectId);
			console.log(self.totalAmount);
			//self.getPrice();
		},
		selectAll:function(){
			var self=this;
			self.totalAmount=0;
			if(!$('.shopSel_all input').prop("checked")){
				$('input[name="checkbox"]').each(function(index){
	    			$(this).prop("checked",true);
	    			self.selectId.push(self.shopLists[index].goods_id);
	    			self.cartId.push(self.shopLists[index].id);
	    			self.selectArr.push(self.shopLists[index]);
	    			self.selIdx=self.shopLists.length;
	    			self.flag=false;
	    			self.totalAmount=Calculation('add',self.totalAmount,self.shopLists[index].list[0].num*self.shopLists[index].pPrice);
				});
			}else{
				$('input[name="checkbox"]').each(function(index){
	    			$(this).prop("checked",false);
	    			self.selectId=[];
	    			self.cartId=[];
	    			self.selectArr=[];
	    			self.selIdx=0;
	    			self.flag=true;
	    			self.totalAmount=0;
				});
			}
			console.log(self.selectId);
			console.log(self.totalAmount);
			//self.getPrice();
		},
		settlement:function(){
			var self=this;
			var serIdx=0,partIdx=0;
			if(!self.shopLists[0].service_price){
				serIdx=0;
			}else{
				serIdx=1
			}
			if(!self.shopLists[0].peijia_price){
				partIdx=0;
			}else{
				partIdx=1
			}
			var paramObj={'pId':self.shopLists[0].goods_id,'num':self.shopLists[0].list[0].num,
			'specId':self.shopLists[0].list[0].specprice_id,'proPrice':self.shopLists[0].list[0].price,'isServ':serIdx,
			'specName':self.specName1+';'+self.specName2,'isPart':partIdx};
			//localStorage.setItem('cartInfo',JSON.stringify(self.selectArr));
			nextPage('cartOrder.html');
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
	},
	mounted:function(){
		setTimeout(function(){
			$('input[name="checkbox"]').eq(0).prop("checked",true);
		},500);
	}
});
$('.headTxt').click(function(){
	console.log(vm.idx);
	if(vm.cartId.length>0){
	if(vm.flag){
		var param={'token':token,'id':vm.cartId};
		postData('/api/shopcart/delGoods',param,function(data){
			if(data.code==200){
				mui.toast(data.message);
				vm.getList();
				vm.totalAmount=0;
			}else{
				mui.toast(data.message);
			}
		});
	}else{
		var param={'token':token};
		postData('/api/shopcart/clearShopCart',param,function(data){
			if(data.code==200){
				mui.toast(data.message);
				vm.getList();
				vm.totalAmount=0;
			}else{
				mui.toast(data.message);
			}
		});
	}
	}
})
var old_back = mui.back;
mui.back = function(){
	old_back();
	nextPage('index.html');
}