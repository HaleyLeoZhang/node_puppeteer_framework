
##### 简介

后台会维护一些漫画信息  
提供给外部访问  
但是这批漫画数据的资源  
来自于第三方的漫画网站  
这些漫画网站，在本文中称为 `渠道`  
所以本站给外访问的漫画章节列表、漫画图片  
都是来自于绑定的`渠道`  


##### 语言与系统

 - `php` 后台系统
 - `node` 爬虫系统
 - `golang` 数据归集、API系统
 
##### 中间件选型

受限于云服务资源  
并且数据量不大  
目前的选型都使用 `Rabbitmq`  

等 [云天河](http://www.hlzblog.top/) 有钱了，再上 `Kafka`  

#### 架构设计

数据流程过程大致如下

后台，如 `图 01`  
![](./framework_v3-backend.svg)  
`图 01`  

爬虫系统（一）后台请求处理，如 `图 02`  
![](./framework_v3-spider_1.svg)  
`图 02`  

爬虫系统（一）后台请求处理 如 `图 03`  
![](./framework_v3-spider_2.svg)  
`图 03`  

渠道数据统一入库（一）漫画基础信息，如 `图 04`  
![](./framework_v3-data_uniform_1.svg)  
`图 04`  

渠道数据统一入库（二）漫画章节信息，如 `图 05`  
![](./framework_v3-data_uniform_2.svg)  
`图 05`  

#### 表设计

###### 漫画基本信息

~~~bash
CREATE TABLE `comic` (
  `id` int(1) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `related_id` int(1) unsigned NOT NULL DEFAULT '0' COMMENT '关联ID. 表supplier.id',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '漫画名称',
  `pic` varchar(255) NOT NULL DEFAULT '' COMMENT '漫画封面',
  `intro` varchar(1000) NOT NULL DEFAULT '' COMMENT '漫画简介',
  `weight` int(1) unsigned NOT NULL DEFAULT '0' COMMENT '权重值.值越大,越靠前展示',
  `tag` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '标记。枚举值: 0:没有标记,1:热门,2:连载,3:完结',
  `method` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值(获取漫画详情的方式):0:未知,1:爬取时自动获取(每次),2:爬取时自动获取(仅限初始时),3:手动',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '100' COMMENT '状态(0:删除,100:下线,200:上线)',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT '1000-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx-related_id-status` (`related_id`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='漫画基本信息';
~~~

###### 渠道基本信息

~~~bash
CREATE TABLE `supplier` (
    `id` INT ( 1 ) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    `related_id` INT ( 1 ) UNSIGNED NOT NULL DEFAULT '0' COMMENT '关联ID. 表comic.id',
    `channel` TINYINT ( 1 ) UNSIGNED NOT NULL DEFAULT '0' COMMENT '枚举值 0:未知 1:古风漫画 2:奇漫屋',
    `source_id` VARCHAR ( 100 ) NOT NULL DEFAULT '' COMMENT '对应渠道唯一ID',
    `name` VARCHAR ( 255 ) NOT NULL DEFAULT '' COMMENT '漫画名称',
    `pic` VARCHAR ( 255 ) NOT NULL DEFAULT '' COMMENT '漫画封面',
    `intro` VARCHAR ( 1000 ) NOT NULL DEFAULT '' COMMENT '漫画简介',
    `ext_1` VARCHAR ( 50 ) NOT NULL DEFAULT '' COMMENT '扩展字段1.针对不同场景使用',
    `ext_2` VARCHAR ( 50 ) NOT NULL DEFAULT '' COMMENT '扩展字段2.针对不同场景使用',
    `ext_3` VARCHAR ( 50 ) NOT NULL DEFAULT '' COMMENT '扩展字段3.针对不同场景使用',
    `weight` INT ( 1 ) UNSIGNED NOT NULL DEFAULT '0' COMMENT '权重值.值越大,前台越优先使用,一般用于平滑切换渠道数据',
    `status` TINYINT ( 1 ) UNSIGNED NOT NULL DEFAULT '200' COMMENT '状态(0:删除,50:渠道不可用,100:手动下线,200:正常)',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime NOT NULL DEFAULT '1000-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY ( `id` ),
KEY `idx-related_id-status` ( `related_id`, `status` ) 
) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COMMENT = '渠道基本信息';
~~~

###### 渠道章节信息

~~~bash
CREATE TABLE `supplier_chapter` (
    `id` INT ( 1 ) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    `related_id` INT ( 1 ) UNSIGNED NOT NULL DEFAULT '0' COMMENT '关联ID. 表supplier.id',
    `sequence` INT ( 1 ) UNSIGNED NOT NULL DEFAULT '0' COMMENT '章节顺序号',
    `name` VARCHAR ( 255 ) NOT NULL DEFAULT '' COMMENT '章节名',
    `status` TINYINT ( 1 ) UNSIGNED NOT NULL DEFAULT '200' COMMENT '状态(0:删除,200:正常)',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime NOT NULL DEFAULT '1000-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY ( `id` ),
UNIQUE KEY `uk-related_id-sequence` ( `related_id`, `sequence` ) 
) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COMMENT = '渠道章节列表';
~~~

###### 渠道章节图片列表

~~~bash
CREATE TABLE `supplier_image` (
    `id` INT ( 1 ) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    `related_id` INT ( 1 ) UNSIGNED NOT NULL DEFAULT '0' COMMENT '关联ID. 表supplier_chapter.id',
    `sequence` INT ( 1 ) UNSIGNED NOT NULL DEFAULT '0' COMMENT '图片顺序号',
    `src_origin` VARCHAR ( 255 ) NOT NULL DEFAULT '' COMMENT '图片源地址.有跨域限制可能',
    `src_own` VARCHAR ( 255 ) NOT NULL DEFAULT '' COMMENT '自维护图片地址',
    `progress` TINYINT ( 1 ) UNSIGNED NOT NULL DEFAULT '0' COMMENT '枚举值 0:待下载,1:下载中,2:下载成功',
    `status` TINYINT ( 1 ) UNSIGNED NOT NULL DEFAULT '200' COMMENT '状态(0:删除,200:正常)',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime NOT NULL DEFAULT '1000-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY ( `id` ),
UNIQUE KEY `uk-related_id-sequence` ( `related_id`, `sequence` ) 
) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COMMENT = '渠道章节图片列表';
~~~
