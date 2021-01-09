/*
 Navicat Premium Data Transfer

 Source Server         : _local
 Source Server Type    : MySQL
 Source Server Version : 50633
 Source Host           : 192.168.56.110:3306
 Source Schema         : curl_avatar

 Target Server Type    : MySQL
 Target Server Version : 50633
 File Encoding         : 65001

 Date: 09/01/2021 20:49:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for comic
-- ----------------------------
DROP TABLE IF EXISTS `comic`;
CREATE TABLE `comic`  (
  `id` int(1) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `related_id` int(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '绑定的渠道id.表supplier.id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '漫画名称',
  `pic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '漫画封面',
  `intro` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '漫画简介',
  `weight` int(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '权重值.值越大,越靠前展示',
  `tag` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '标记。枚举值: 0:没有标记,1:热门,2:连载,3:完结',
  `method` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '枚举值(获取漫画详情的方式):0:未知,1:爬取时自动获取(每次),2:爬取时自动获取(仅限初始时),3:手动',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT 100 COMMENT '状态(0:删除,100:下线,200:上线)',
  `created_at` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updated_at` datetime(0) NOT NULL DEFAULT '1000-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx-related_id-status`(`related_id`, `status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '漫画基本信息' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for supplier
-- ----------------------------
DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier`  (
  `id` int(1) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `related_id` int(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '绑定的漫画基本信息.表 comic.id',
  `channel` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '枚举值 0:未知 1:古风漫画 2:奇漫屋 3:六漫画',
  `source_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '对应渠道唯一ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '漫画名称',
  `pic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '漫画封面',
  `intro` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '漫画简介',
  `max_sequence` int(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '当前渠道的最大章节序号',
  `ext_1` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '扩展字段1.针对不同场景使用',
  `ext_2` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '扩展字段2.针对不同场景使用',
  `ext_3` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '扩展字段3.针对不同场景使用',
  `weight` int(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '权重值.值越大,前台越优先使用,一般用于平滑切换渠道数据',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT 200 COMMENT '状态(0:删除,50:渠道不可用,100:手动下线,200:正常)',
  `created_at` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updated_at` datetime(0) NOT NULL DEFAULT '1000-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx-related_id-status`(`related_id`, `status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '渠道基本信息' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for supplier_chapter
-- ----------------------------
DROP TABLE IF EXISTS `supplier_chapter`;
CREATE TABLE `supplier_chapter`  (
  `id` int(1) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `related_id` int(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '绑定的渠道id.表supplier.id',
  `sequence` int(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '章节顺序号',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '章节名',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT 200 COMMENT '状态(0:删除,100:待爬取图片,200:正常)',
  `created_at` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updated_at` datetime(0) NOT NULL DEFAULT '1000-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique-related_id-sequence`(`related_id`, `sequence`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 45260 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '渠道章节列表' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for supplier_image
-- ----------------------------
DROP TABLE IF EXISTS `supplier_image`;
CREATE TABLE `supplier_image`  (
  `id` int(1) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `related_id` int(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '绑定的渠道id.表supplier_chapter.id',
  `sequence` int(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '图片顺序号',
  `src_origin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '图片源地址.有跨域限制可能',
  `src_own` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '自维护图片地址',
  `progress` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '枚举值 0:待下载,1:下载中,2:下载成功',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT 200 COMMENT '状态(0:删除,200:正常)',
  `created_at` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updated_at` datetime(0) NOT NULL DEFAULT '1000-01-01 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique-related_id-sequence`(`related_id`, `sequence`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 113449 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '渠道章节图片列表' ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
