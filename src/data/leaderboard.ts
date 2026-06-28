// EXPORTS: loadRecords, loadRecordsByZone, saveRecord, loadAllRecordsGrouped, loadComments, loadCommentsByRecord, saveComment, type ILeaderboardRecord, type IComment, type ZoneKey
import type { ILeaderboardRecord, IComment, ZoneKey } from '@/types/leaderboard';
import { ZONES } from '@/types/leaderboard';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// ─── 排行榜数据层（Supabase） ───

/** 从 Supabase 加载所有记录 */
export async function loadRecords(): Promise<ILeaderboardRecord[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('leaderboard_records')
    .select('id, zone, username, count_67, duration, score, description, submitted_at, source')
    .order('score', { ascending: false });
  if (error) throw new Error(`查询排行榜失败: ${error.message}`);
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    zone: row.zone as ZoneKey,
    username: row.username as string,
    count67: row.count_67 as number,
    duration: row.duration as number,
    score: row.score as number,
    description: (row.description as string) ?? undefined,
    submittedAt: row.submitted_at as string,
    source: row.source as 'mock' | 'user',
  }));
}

/** 按分区获取记录，按分数降序排列 */
export async function loadRecordsByZone(zone: ZoneKey): Promise<ILeaderboardRecord[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('leaderboard_records')
    .select('id, zone, username, count_67, duration, score, description, submitted_at, source')
    .eq('zone', zone)
    .order('score', { ascending: false });
  if (error) throw new Error(`查询分区排行榜失败: ${error.message}`);
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    zone: row.zone as ZoneKey,
    username: row.username as string,
    count67: row.count_67 as number,
    duration: row.duration as number,
    score: row.score as number,
    description: (row.description as string) ?? undefined,
    submittedAt: row.submitted_at as string,
    source: row.source as 'mock' | 'user',
  }));
}

/** 保存一条新记录到 Supabase */
export async function saveRecord(record: ILeaderboardRecord): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from('leaderboard_records').insert({
    id: record.id,
    zone: record.zone,
    username: record.username,
    count_67: record.count67,
    duration: record.duration,
    score: record.score,
    description: record.description ?? null,
    submitted_at: record.submittedAt,
    source: record.source,
  });
  if (error) throw new Error(`保存记录失败: ${error.message}`);
}

/** 获取所有分区记录，按分区+分数排序 */
export async function loadAllRecordsGrouped(): Promise<Record<ZoneKey, ILeaderboardRecord[]>> {
  const all = await loadRecords();
  const grouped: Record<string, ILeaderboardRecord[]> = {};
  for (const zone of ZONES) {
    grouped[zone] = all.filter((r) => r.zone === zone).sort((a, b) => b.score - a.score);
  }
  return grouped as Record<ZoneKey, ILeaderboardRecord[]>;
}

// ─── 评论数据层（Supabase） ───

/** 加载所有评论 */
export async function loadComments(): Promise<IComment[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('comments')
    .select('id, record_id, username, content, created_at')
    .order('created_at', { ascending: true });
  if (error) throw new Error(`查询评论失败: ${error.message}`);
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    recordId: row.record_id as string,
    username: row.username as string,
    content: row.content as string,
    createdAt: row.created_at as string,
  }));
}

/** 按记录ID获取评论 */
export async function loadCommentsByRecord(recordId: string): Promise<IComment[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('comments')
    .select('id, record_id, username, content, created_at')
    .eq('record_id', recordId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(`查询评论失败: ${error.message}`);
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    recordId: row.record_id as string,
    username: row.username as string,
    content: row.content as string,
    createdAt: row.created_at as string,
  }));
}

/** 保存一条新评论 */
export async function saveComment(comment: IComment): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from('comments').insert({
    id: comment.id,
    record_id: comment.recordId,
    username: comment.username,
    content: comment.content,
    created_at: comment.createdAt,
  });
  if (error) throw new Error(`保存评论失败: ${error.message}`);
}
