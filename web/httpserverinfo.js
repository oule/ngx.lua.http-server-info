var objDate = {},arrDate,fd,rs;
$(function(){
	fd = $('#formdate');
	rs = $('#resultset');
	$("#datepicker").datepicker({
		monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNamesMin:['日','一','二','三','四','五','六'],
		minDate:'-29d',
		maxDate:'0d',
		dateFormat:'yymmdd',
		onSelect:function(dateText,srcobj){
			objDate[dateText]=1;
			arrDate=[];
			for(i in objDate)arrDate.push(i);
			fd.val(arrDate.toString());
		}
	});
});
function lookup(){
	$.ajax({
	type: "GET",
	url: "/status/"+fd.val(),
	dataType: "html",
	success: function(strData){
		var strTable = '';
		var arrData = eval('('+strData+')');
		//alert(arrData.length);return;
		for(i in arrData)
			for(j in arrData[i]){
				strTable += '<table class="statuscode"><thead><tr><th colspan="2">'+j.replace(/(\d\d\d\d)(\d\d)(\d\d)/,'$1-$2-$3')+'</th></tr><tr><th>响应码</th><th>数量</th></tr></thead>';
				if(arrData[i][j].hasOwnProperty('null')){
					strTable += '<tbody><tr><td colspan="2">暂无响应码</td></tr></tbody>';
				}else{
					strTable += '<tbody>';
					for(k in arrData[i][j]){
						strTable += '<tr><td>'+k+'</td><td>'+arrData[i][j][k]+'</td></tr>';
					}
					strTable += '</tbody>';
				}
			}
		rs.html(strTable);
	},
	error: function(msg){alert('error:'+msg)}
	}); 
}
function setempty(){
	fd.val('');
	objDate = {};
}