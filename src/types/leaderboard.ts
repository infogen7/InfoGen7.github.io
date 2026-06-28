// EXPORTS: ILeaderboardRecord, IComment, ZONES, ZONE_LABELS, type ZoneKey

/** 分区标识 */
export type ZoneKey = 'keyboard' | 'mobile' | 'free';

/** 3个分区定义 */
export const ZONES: ZoneKey[] = ['keyboard', 'mobile', 'free'];

/** 分区中文标签 */
export const ZONE_LABELS: Record<ZoneKey, string> = {
  keyboard: '键盘区',
  mobile: '手机区',
  free: '自由区',
};

/** 排行榜记录 */
export interface ILeaderboardRecord {
  /** 记录唯一ID */
  id: string;
  /** 所属分区标识 */
  zone: ZoneKey;
  /** 挑战者用户名 */
  username: string;
  /** AI识别到的67数量 */
  count67: number;
  /** 视频时长（秒） */
  duration: number;
  /** 分数 = count67 / duration */
  score: number;
  /** 视频简介（可选） */
  description?: string;
  /** 提交时间 ISO string */
  submittedAt: string;
  /** 数据来源标记 */
  source: 'mock' | 'user';
}

/** 评论 */
export interface IComment {
  /** 评论唯一ID */
  id: string;
  /** 关联的记录ID */
  recordId: string;
  /** 评论者用户名 */
  username: string;
  /** 评论内容 */
  content: string;
  /** 评论时间 ISO string */
  createdAt: string;
}
