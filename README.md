ngx.lua.http-server-info
========================

ngx.lua.http-server-info 是一个通过lua语言实现的基于共享词典的服务器应用。用于实时统计，并通过Web展现nginx服务器状态信息，如请求的响应状态码。

Version
=======

2013-08-26 发布 ngx.lua.http-server-info version 1.0 (v1.0)。

Description
===========

* 应用是在nginx+lua的基础上开发出来的，运用了共享词典做数据存储。
* 用来实时记录每个请求的响应状态，就是http响应码。
* 将其记录到共享词典，也就是内存，因此速度和效率是很高的。
* 现在的内存很便宜，基本上常见的服务器内存少则4G、8G，高则16G、32G，甚至64G。
* 应用涉及的数据做了存储优化，所以占用的空间少之又少，不必担心将内存吃尽问题。
* 应用数据还设置了过期时间，默认是1年，可以自己调整。
* 具体的数据占用内存量可以粗略的计算出来。

Data Archive
============

数据存储结构如下：

* YYYYMMDD：存储整天的响应码种类
* YYYYMMDDXXX ：存储每个响应码的数量，其中XXX是响应码，如：200、304

Install
=======

1. 安装nginx的lua支持，参见：  
*[http://wiki.nginx.org/HttpLuaModule#Installation](http://wiki.nginx.org/HttpLuaModule#Installation)*
2. 在nginx.conf配置文件的http段加入下面设置：

        lua_shared_dict httpserverinfo 10m;
        log_by_lua_file conf/sethttpserverinfo.lua;
3. 在server段配置location：

        location /status {
            default_type  text/plain;
		    content_by_lua_file conf/gethttpserverinfo.lua;
        }
4. 拷贝sethttpserverinfo.lua和gethttpserverinfo.lua文件到nginx配置文件目录：

        cp lua/*.lua /path/to/nginx/conf/dir;
5. 拷贝web前端访问所需文件到web跟目录：

        cp web/httpserverinfo.* /path/to/webroot
6. 重启 Ningx：

        nginx -s reload
**注意：**
使用 nginx -s reload 重启服务器不会丢失存储的数据，其他方式会丢失。

Usage
=====

在浏览器地址栏输入下面地址进行访问：  
*[http://domainname/httpserverinfo.html](http://domainname/httpserverinfo.html)*