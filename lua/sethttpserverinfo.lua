function set_http_status_to_mem()
	if string.find(ngx.var.request_uri,'^/status') then
		return
	end
	local status = ngx.shared.httpserverinfo
	local key_items = os.date('%Y%m%d',os.time())
	local keys = status:get(key_items)
	if not keys then
		keys = ngx.var.status
	elseif not string.find(keys,ngx.var.status) then
			keys = keys..','..ngx.var.status
	end
	status:set(key_items,keys)
	
	-- proc values
	local key_item = key_items..ngx.var.status
	local key,err = status:get(key_item)
	if key then
		status:incr(key_item,1)
	else
		status:set(key_item,1)
	end
end

set_http_status_to_mem()
