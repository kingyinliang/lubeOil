var vm=new Vue({
	el: '#vmObj',
	data: {
		serCont:'',
		selY:'',
		selM:'',
		mArrs:['01','02','03','04','05','06','07','08','09','10','11','12'],
		purSort:'add_time',
		page:1,
	    userLists:[],
	    selCont:''
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
      	var myDate= new Date(); 
		var startYear=myDate.getFullYear()-50;//起始年份 
		var endYear=myDate.getFullYear();//结束年份 
		var obj=document.getElementById('myYear');
		var obj_m=document.getElementById('myMonth');
		for (var i=startYear;i<=endYear;i++){ 
		    obj.options.add(new Option(i,i)); 
		}
		self.selY=myDate.getFullYear();
		self.selM=myDate.getMonth()+1;
		console.log(self.selM);
		obj.options[obj.options.length-51].selected=1;
		obj_m.options[0].selected=1;
        mui.plusReady(function(){
			self.getList();
		});
	    window.addEventListener('refresh', function(e){//监听上一个页面fire返回
	    	//location.reload();
		    self.getList();
	 	});
	},
	methods:{
		getList:function(){
			var self=this;
		    var param={'token':token,'page':self.page,'month':self.selY+'-'+self.selM,'keyword':self.serCont,'pay_type':self.selCont};
			postData('/api/inventoryorder/getList',param,function(res){
	        	if(res.code==200){
	        		if(res.data.total==0){
						mui.toast('暂无商品');
					}else if(res.data.total<=self.userLists.length){
	            		setTimeout(function(){
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		        		},500);
	            	}else{
			        	self.userLists=self.userLists.concat(res.data.data);
			        	$.each(self.userLists, function(i,v) {
			        		v.addTime=timestampToTime(v.add_time);
			        	});
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
		selYear:function(){
			var self=this;
			self.pulldownRefresh();
		},
		selMonth:function(){
			var self=this;
			self.pulldownRefresh();
		},
		selType:function(){
			var self=this;
			self.pulldownRefresh();
		},
		toInfo:function(index){
			var self=this;
			var paramObj={'boundId':self.userLists[index].id};
           	nextPage('hisInfo.html',paramObj);
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