function procYearMonth(){
	//用self替换this，避免下面使用时混淆
	var self = $(this);
	var strYearMonth = self.text();
	//YYYY
	var strYear = strYearMonth.slice(0,4);
	//MM
	var strMonth = strYearMonth.slice(5,7);
	var strTextDate = '';
	var selectday = $('#selectday');
	self.parent().children().each(function(){
		//循环判断当前对象是否是点击的对象，处理背景颜色等样式
		if($(this).index(self)>-1){
			$(this).addClass('selected');
			return;
		}
		$(this).removeClass('selected');
	});
	//取下个月的第一天
	if(strMonth==12)
		strTextDate = '1 1 ' + eval(Number(strYear)+1);
	else
		strTextDate = eval(Number(strMonth)+1) +'/1/'+ strYear;
	//计算点击的月份的天数
	intLastDate = new Date(Date.parse(strTextDate) - 1).getDate();
	//清空"天"标签容器
	selectday.empty();
	//循环输出"天"标签
	for(var i=1;i<=intLastDate;i++){
		$('<li>'+ i +'</li>').appendTo(selectday).click(procDay);
	}
}

function procDay(){
	//用self替换this，避免下面使用时混淆
	var self = $(this);
	//循环判断当前对象是否是点击的对象，处理背景颜色等样式
	self.parent().children().each(function(){
		if($(this).index(self)>-1){
			$(this).addClass('selected');
			return;
		}
		$(this).removeClass('selected');
	});
	var strYearMonth = $('#selectmonth li.selected').text().replace('-','');
	var strDay = $(this).text();
	//格式化成两位日
	strDay = strDay.length > 1 ? strDay : '0'+strDay;
	var strDate = strYearMonth+strDay;
	$.ajax({
		type: "GET",
		url: "/status/"+strDate,
		dataType: "html",
		//直接写fillResultSet是可以的，但是不能传递参数。
		//其中strData参数是由XMLHttpRequest对象回调时传递的,
		//strDate参数是闭包
		success: function(strData){fillResultSet(strDate,strData);}
	});
}

function fillResultSet(strDate,strData){
	var strTable = '';
	strTable = '<table class="statuscode"><thead><tr><th colspan="2">'+strDate.replace(/(\d\d\d\d)(\d\d)(\d\d)/,'$1-$2-$3')+'</th></tr><tr><th>响应码</th><th>数量</th></tr></thead>';
	//动态解析为JSON数据对象
	var arrData = eval('('+strData+')');
	for(i in arrData)
		for(j in arrData[i]){
			//无HTTP状态码数据
			if(arrData[i][j].hasOwnProperty('null')){
				strTable += '<tbody><tr><td colspan="2">暂无响应码</td></tr></tbody>';
			}else{
			//将返回的HTTP状态码数据组装成表格
				strTable += '<tbody>';
				for(k in arrData[i][j]){
					strTable += '<tr><td>'+k+'</td><td>'+arrData[i][j][k]+'</td></tr>';
				}
				strTable += '</tbody>';
			}
		}
	//追加到结果集容器
	$('#resultset').append(strTable);
}

$(function(){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var strMonth = '',strYearMonth = '';
	for(var i=1;i<=12;i++){
		//格式化成两位月份
		strMonth = String(month).length > 1 ? month : '0'+month;
		//YYYY-MM
		strYearMonth = year+'-'+strMonth;
		$('<li>'+strYearMonth+'</li>').prependTo('#selectmonth').click(procYearMonth);
		month--;
		//解决跨年问题
		if(month<=0){
			month = 12;
			year--;
		}
	}
});