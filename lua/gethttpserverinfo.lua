function get_http_status_from_mem()
	local status = ngx.shared.httpserverinfo
	local uri = ngx.var.request_uri
	local day,i,j,ret
	local tbl = {}

	i,j = string.find(uri,'%d+')
	if i then
		for day in string.gmatch(uri,'%d+') do
			ret = get_status_by_day(status,day)
			table.insert(tbl,ret)
		end
		ngx.say('['..table.concat(tbl,',')..']')
		return
	end

	i,j = string.find(uri,'all')
	if i then
		day = string.sub(uri,i,j)
		local t = os.time()
		for i=1,30,1 do
			day = os.date('%Y%m%d',t)
			ret = get_status_by_day(status,day)
			table.insert(tbl,ret)
			t = t - 60*60*24
		end
		ngx.say('['..table.concat(tbl,',')..']')
		return
	end
	day = os.date('%Y%m%d',os.time())
	ret = get_status_by_day(status,day)
	ngx.say('['..ret..']')
end

function get_status_by_day(status,day)
	local key_items = day
	local key_item_s = status:get(key_items)
	local json_t = {}

	if key_item_s then
		loadstring('key_item_t = {'..key_item_s..'}')()
		for key,val in pairs(key_item_t) do
			table.insert(json_t,"'"..val.."':"..status:get(key_items..val))
			--ngx.say(val..':'..status:get(key_items..':'..val))
		end
		return "{'"..day.."':{"..table.concat(json_t,',')..'}}'
	else
		return "{'"..day.."':{'null':1}}"
	end
end

get_http_status_from_mem()
