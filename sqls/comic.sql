CREATE TABLE `comics` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `channel` int(11) unsigned NOT NULL COMMENT '枚举值：0.未知 1.腾讯漫画 2.漫画牛',
  `comic_id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL COMMENT '漫画名称',
  `pic` varchar(255) NOT NULL COMMENT '漫画封面',
  `intro` varchar(1000) NOT NULL COMMENT '漫画简介',
  `is_deleted` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>正常，1删除',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='漫画列表';

CREATE TABLE `images` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `page_id` int(11) unsigned NOT NULL COMMENT '关联： pages.id',
  `sequence` int(11) unsigned NOT NULL,
  `src` varchar(255) NOT NULL COMMENT '关联： 图片地址',
  `progress` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>待下载，1=>下载中，2下载成功',
  `is_deleted` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>正常，1删除',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx-page_id` (`page_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='漫画章节对应图片列表';

CREATE TABLE `pages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `channel` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0.未知 1.腾讯漫画 2.漫画牛',
  `comic_id` int(11) unsigned NOT NULL COMMENT '关联comics.comic_id',
  `sequence` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `progress` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>未爬取，1=>处理中，2处理结束',
  `is_deleted` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>正常，1删除',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx-channel-comic_id` (`channel`,`comic_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='漫画章节列表';

INSERT INTO `comics`(`id`, `channel`, `comic_id`, `name`, `pic`, `intro`, `is_deleted`, `updated_at`, `created_at`) VALUES (1, 2, 5830, '戒魔人', '', '大一新生周小安偶然戴上一枚来历不明的商代戒指，从他口中吐出了一个恐怖的血魔人。一个人类历史上的惊天秘...', 0, '2019-08-27 14:20:02', '2019-08-27 14:20:25');
INSERT INTO `comics`(`id`, `channel`, `comic_id`, `name`, `pic`, `intro`, `is_deleted`, `updated_at`, `created_at`) VALUES (2, 2, 10660, '一人之下', '', '随着爷爷尸体被盗，神秘少女冯宝宝的造访，少年张楚岚的平静校园生活被彻底颠覆。急于解开爷爷和自身秘密的...', 0, '2019-08-27 14:20:24', '2019-08-27 14:20:28');
INSERT INTO `comics`(`id`, `channel`, `comic_id`, `name`, `pic`, `intro`, `is_deleted`, `updated_at`, `created_at`) VALUES (3, 2, 6416, '最强农民工', '', '一个小小的维修工李青，原本过着普普通通的打工生活，却莫名的被牵扯到大家族的斗争中，而他本人的背后却有...', 0, '2019-08-27 14:21:18', '2019-08-27 14:21:20');
