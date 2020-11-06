/*
 Navicat Premium Data Transfer

 Source Server         : _local
 Source Server Type    : MySQL
 Source Server Version : 50633
 Source Host           : 192.168.56.110:3306
 Source Schema         : zhihu_avatar

 Target Server Type    : MySQL
 Target Server Version : 50633
 File Encoding         : 65001

 Date: 25/10/2020 17:17:52
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for zhihu_user_base_info
-- ----------------------------
DROP TABLE IF EXISTS `zhihu_user_base_info`;
CREATE TABLE `zhihu_user_base_info`  (
  `id` int(1) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '知乎头像地址',
  `people` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '知乎主页名',
  `upload_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '上传第三方后的CDN地址',
  `pic_type` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '枚举值 0未知 1默认头像 2用户自己上传的头像',
  `progress` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '枚举值 0 未下载头像 1 已上传到第三方',
  `is_deleted` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '枚举值 0正常 1删除',
  `updated_at` datetime(0) NOT NULL DEFAULT '1000-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique-people`(`people`) USING BTREE,
  INDEX `idx-progress`(`progress`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '知乎用户基础信息表' ROW_FORMAT = Compact;

DROP TABLE IF EXISTS `trd_spider_pic`;
CREATE TABLE `trd_spider_pic` (
  `id` int(1) unsigned NOT NULL AUTO_INCREMENT,
  `avatar_url` varchar(255) NOT NULL DEFAULT '' COMMENT '头像生地址',
  `upload_url` varchar(255) NOT NULL DEFAULT '' COMMENT '上传第三方后的CDN地址',
  `channel` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值,详见对应代码枚举',
  `progress` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值 0 未下载头像 1 已上传到第三方',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值 0正常 1删除',
  `updated_at` datetime NOT NULL DEFAULT '1000-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='用户头像爬取—线下使用，不上线';
SET FOREIGN_KEY_CHECKS = 1;
