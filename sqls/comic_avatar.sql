CREATE DATABASE IF NOT EXISTS `curl_avatar` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `curl_avatar`;

CREATE TABLE `comics` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `channel` int(11) unsigned NOT NULL COMMENT '枚举值：0.未知 1.腾讯漫画 2.漫画牛',
  `source_id` int(11) unsigned NOT NULL COMMENT '对应渠道资源ID',
  `name` varchar(255) NOT NULL COMMENT '漫画名称',
  `pic` varchar(255) NOT NULL COMMENT '漫画封面',
  `intro` varchar(1000) NOT NULL COMMENT '漫画简介',
  `ext_1` varchar(50) NOT NULL COMMENT '扩展字段1，针对不同情况使用',
  `ext_2` varchar(50) NOT NULL COMMENT '扩展字段2，针对不同情况使用',
  `ext_3` varchar(50) NOT NULL COMMENT '扩展字段3，针对不同情况使用',
  `method` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值(获取漫画详情的方式):0->未知,1->爬取时自动获取,2->手动',
  `is_complete` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值(信息填充状态):0->未填充完整,1->填充完整',
  `is_online` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值(上线状态):0->未上线,1->已上线',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>正常，1删除',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='漫画列表';

CREATE TABLE `comic_pages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `channel` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0.未知 1.腾讯漫画 2.漫画牛',
  `source_id` int(11) unsigned NOT NULL COMMENT '关联comics.source_id',
  `sequence` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `progress` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>未爬取，1=>处理中，2处理结束',
  `is_deleted` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>正常，1删除',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx-channel-comic_id` (`channel`,`source_id`)
) ENGINE=InnoDB COMMENT='漫画章节列表';

CREATE TABLE `comic_images` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `page_id` int(11) unsigned NOT NULL COMMENT '关联： pages.id',
  `sequence` int(11) unsigned NOT NULL,
  `src` varchar(255) NOT NULL COMMENT '关联： 图片地址',
  `progress` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>待下载，1=>下载中，2下载成功',
  `is_deleted` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值：0=>正常，1删除',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx-page_id` (`page_id`)
) ENGINE=InnoDB COMMENT='漫画章节对应图片列表';

INSERT INTO `comics` (`id`, `channel`, `source_id`, `name`, `pic`, `intro`, `ext_1`, `ext_2`, `ext_3`, `method`, `is_complete`, `is_online`, `is_deleted`, `updated_at`, `created_at`) VALUES
(1, 2, 5830, '戒魔人', 'https://i.loli.net/2019/09/08/czSNHV3fnyaox65.jpg', '大一新生周小安偶然戴上一枚来历不明的商代戒指，从他口中吐出了一个恐怖的血魔人。一个人类历史上的惊天秘...', '1', '', '', 2, 1, 1, 0, '2019-09-14 06:20:16', '2019-09-03 12:37:31'),
(2, 2, 10660, '一人之下', 'https://i.loli.net/2019/09/05/F4nyW9iHltuK6Ur.jpg', '随着爷爷尸体被盗，神秘少女冯宝宝的造访，少年张楚岚的平静校园生活被彻底颠覆。急于解开爷爷和自身秘密的...', '1', '', '', 2, 1, 1, 0, '2019-09-14 06:20:16', '2019-09-03 12:37:33'),
(3, 2, 6416, '最强农民工', 'https://i.loli.net/2019/08/25/sHCQO3BN8XabP2m.jpg', '一个小小的维修工李青，原本过着普普通通的打工生活，却莫名的被牵扯到大家族的斗争中，而他本人的背后却有...', '1', '', '', 2, 1, 1, 0, '2019-09-14 06:20:16', '2019-08-27 06:21:20'),
(4, 2, 2876, '一拳超人', 'https://i.loli.net/2019/09/08/lq79x52GREBJSrA.jpg', '一拳超人漫画 ，主人公埼玉原本是一名整日奔波于求职的普通人。3年前的一天偶然遇到了要对淘气少年下杀手...', '1', '', '', 2, 1, 1, 0, '2019-09-14 06:20:16', '2019-09-04 12:41:40'),
(5, 2, 3181, '妖怪名单', 'https://i.loli.net/2019/09/08/sQ1Cm4vYTAViL8y.jpg', '魅惑众生的九尾狐狸？吸人精气的合欢树妖？道家妹子求双修，仙家女神若即离。游走在这些危险分子中间可不是...', '1', '', '', 2, 1, 1, 0, '2019-09-14 06:20:16', '2019-09-08 07:24:27'),
(6, 2, 5855, '斗破苍穹', 'https://i.loli.net/2019/09/08/FhgpoHqLyY2nPDU.png', '斗破苍穹漫画是根据著名作家天蚕土豆作品斗破苍穹改编的漫画，这是一个属于斗气的世界，没有花俏艳丽的魔法...', '1', '', '', 2, 1, 1, 0, '2019-09-14 06:20:16', '2019-09-08 07:30:24'),
(7, 2, 4419, '偷星九月天', 'https://res.nbhbzl.com/images/cover/201804/1524371582VN_mppKONpcP64E6.jpg', '一场爱与梦想的奇妙冒险…… 是男仆还是热血的少年侦探？江洋大盗竟是如花美眷？！ 迷雾一层接一层，悬念...', '3', '', '', 2, 1, 1, 0, '2019-09-14 12:35:09', '2019-09-13 12:43:58'),
(8, 2, 3232, '全职法师', 'https://res.nbhbzl.com/images/cover/201805/1526863299TscidLRww7sSpNI2.jpg', '周三、周五、周六上午10点准时更新！官方1群号：598116890 官方2群号：637220919 ...', '1', '', '', 1, 1, 1, 0, '2019-09-16 14:57:27', '2019-09-16 14:53:23'),
(9, 2, 2644, '星海镖师', 'https://res.nbhbzl.com/images/cover/201805/1527674978UY_M_vtS2NJXWbcF.jpg', '作品讲述了D.B星河纪元3000年左右的人类进入第二次大开发时代，以唐小镖为代表的英雄式职业“星海镖...', '3', '', '', 1, 1, 1, 1, '2019-09-19 05:38:29', '2019-09-16 15:42:30');