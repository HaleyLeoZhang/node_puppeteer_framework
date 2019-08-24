CREATE TABLE `comics` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `channel` int(11) unsigned NOT NULL COMMENT '枚举值：0.未知 1.腾讯漫画 2.漫画牛',
  `comic_id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL COMMENT '漫画名称',
  `pic` varchar(255) NOT NULL COMMENT '漫画封面',
  `intro` varchar(1000) NOT NULL COMMENT '漫画简介',
  `is_deleted` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>正常，1删除',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='漫画列表';

CREATE TABLE `images` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `page_id` int(11) unsigned NOT NULL COMMENT '关联： pages.id',
  `sequence` int(11) unsigned NOT NULL,
  `src` varchar(255) NOT NULL COMMENT '关联： 图片地址',
  `progress` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>待下载，1=>下载中，2下载成功',
  `is_deleted` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>正常，1删除',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='漫画章节对应图片列表';

CREATE TABLE `pages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `channel` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0.未知 1.腾讯漫画 2.漫画牛',
  `comic_id` int(11) unsigned NOT NULL,
  `sequence` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `progress` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>未爬取，1=>处理中，2处理结束',
  `is_deleted` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>正常，1删除',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=542 DEFAULT CHARSET=utf8mb4 COMMENT='漫画章节列表';