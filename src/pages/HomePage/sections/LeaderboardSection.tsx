import { useState, useEffect, useMemo, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Zap, AlertCircle, Crown, MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import type { ILeaderboardRecord, IComment, ZoneKey } from '@/types/leaderboard';
import { ZONES, ZONE_LABELS } from '@/types/leaderboard';
import { loadCommentsByRecord, saveComment, loadRecords } from '@/data/leaderboard';

const rankConfig: Record<number, { icon: typeof Trophy; color: string; label: string }> = {
  1: { icon: Crown, color: 'text-accent', label: '冠军' },
  2: { icon: Trophy, color: 'text-muted-foreground', label: '亚军' },
  3: { icon: Medal, color: 'text-[rgb(180_120_60)]', label: '季军' },
};

export default function LeaderboardSection() {
  const [activeZone, setActiveZone] = useState<ZoneKey>('keyboard');
  const [records, setRecords] = useState<ILeaderboardRecord[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, IComment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentUsernames, setCommentUsernames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const fresh = await loadRecords();
      setRecords((prev) => {
        if (fresh.length > prev.length) {
          const userRecords = fresh.filter((r) => r.source === 'user');
          if (userRecords.length > 0) {
            const newest = userRecords.reduce((a, b) =>
              new Date(a.submittedAt) > new Date(b.submittedAt) ? a : b,
            );
            setHighlightId(newest.id);
            setTimeout(() => setHighlightId(null), 3000);
          }
        }
        return fresh;
      });
      setLoading(false);
    } catch (err) {
      console.error('Failed to load records:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, [refresh]);

  const zoneRecords = useMemo(() => {
    return records
      .filter((r) => r.zone === activeZone)
      .sort((a, b) => b.score - a.score);
  }, [records, activeZone]);

  // 展开/收起评论
  function toggleExpand(recordId: string) {
    setExpandedId((prev) => {
      const next = prev === recordId ? null : recordId;
      if (next && !commentsMap[next]) {
        loadCommentsByRecord(next).then((comments) => {
          setCommentsMap((m) => ({ ...m, [next]: comments }));
        }).catch((err) => console.error('Failed to load comments:', err));
      }
      return next;
    });
  }

  // 提交评论
  async function handleCommentSubmit(e: FormEvent, recordId: string) {
    e.preventDefault();
    const username = (commentUsernames[recordId] || '').trim();
    const content = (commentInputs[recordId] || '').trim();
    if (!username) {
      toast.error('请输入昵称');
      return;
    }
    if (!content) {
      toast.error('请输入评论内容');
      return;
    }

    const newComment: IComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      recordId,
      username,
      content,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveComment(newComment);
      setCommentsMap((m) => ({
        ...m,
        [recordId]: [...(m[recordId] || []), newComment],
      }));
      setCommentInputs((prev) => ({ ...prev, [recordId]: '' }));
      toast.success('评论已发表');
    } catch (err) {
      console.error('Failed to save comment:', err);
      toast.error('评论提交失败，请重试');
    }
  }

  return (
    <section id="leaderboard" className="w-full py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            🏆 排行榜
          </h2>
          <p className="text-muted-foreground text-lg">
            各分区独立排名，分数越高越靠前
          </p>
        </motion.div>

        {/* Zone tabs */}
        <Tabs
          value={activeZone}
          onValueChange={(v) => setActiveZone(v as ZoneKey)}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="bg-muted h-11">
              {ZONES.map((zone) => (
                <TabsTrigger
                  key={zone}
                  value={zone}
                  className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {ZONE_LABELS[zone]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Ranking card */}
          <motion.div
            key={activeZone}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="size-5 text-accent" />
                  {ZONE_LABELS[activeZone]}排名
                  {zoneRecords.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {zoneRecords.length} 条记录
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {zoneRecords.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <AlertCircle className="size-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-lg mb-2">
                      暂无挑战记录
                    </p>
                    <p className="text-muted-foreground text-sm mb-6">
                      快来上传你的视频，抢占排行榜！
                    </p>
                    <a
                      href="#upload"
                      onClick={(e) => { e.preventDefault(); document.querySelector('#upload')?.scrollIntoView({ behavior: 'smooth' }); }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
                    >
                      <Zap className="size-4" />
                      立即挑战
                    </a>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap w-16 text-center">
                            排名
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            用户名
                          </TableHead>
                          <TableHead className="whitespace-nowrap text-right">
                            分数
                          </TableHead>
                          <TableHead className="whitespace-nowrap text-right">
                            67数量
                          </TableHead>
                          <TableHead className="whitespace-nowrap text-right">
                            时长(秒)
                          </TableHead>
                          <TableHead className="whitespace-nowrap text-right">
                            提交时间
                          </TableHead>
                          <TableHead className="whitespace-nowrap text-center w-16">
                            评论
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence mode="popLayout">
                          {zoneRecords.map((record, index) => {
                            const rank = index + 1;
                            const isHighlighted = record.id === highlightId;
                            const isExpanded = expandedId === record.id;
                            const topConfig = rankConfig[rank];
                            const recordComments = commentsMap[record.id] || [];

                            return (
                              <motion.tr
                                key={record.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3, delay: index * 0.04 }}
                                className={`border-b border-border transition-colors ${
                                  isHighlighted
                                    ? 'bg-accent/15'
                                    : rank <= 3
                                      ? 'bg-muted/20'
                                      : ''
                                }`}
                              >
                                <TableCell className="text-center">
                                  {topConfig ? (
                                    <div className="flex items-center justify-center gap-1">
                                      <topConfig.icon
                                        className={`size-5 ${topConfig.color}`}
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-sm font-mono text-muted-foreground tabular-nums">
                                      {rank}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="truncate max-w-[120px]">
                                      {record.username}
                                    </span>
                                    {record.source === 'mock' && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs shrink-0"
                                      >
                                        示例
                                      </Badge>
                                    )}
                                    {isHighlighted && (
                                      <Badge className="text-xs shrink-0 bg-accent text-accent-foreground animate-pulse">
                                        新
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                  <span
                                    className={`font-bold text-lg ${
                                      rank === 1
                                        ? 'text-accent'
                                        : 'text-foreground'
                                    }`}
                                  >
                                    {record.score.toFixed(2)}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                  <span className="font-semibold text-foreground">
                                    {record.count67}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-muted-foreground">
                                  {record.duration}
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-muted-foreground text-sm">
                                  {new Date(
                                    record.submittedAt,
                                  ).toLocaleDateString('zh-CN', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    onClick={() => toggleExpand(record.id)}
                                    aria-label={isExpanded ? '收起评论' : '展开评论'}
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="size-4" />
                                    ) : (
                                      <MessageCircle className="size-4" />
                                    )}
                                  </Button>
                                </TableCell>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </TableBody>
                    </Table>

                    {/* 展开的评论区域 */}
                    {expandedId && (
                      <motion.div
                        key={`comments-${expandedId}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-border/40 bg-muted/10"
                      >
                        <div className="px-6 py-4 space-y-4">
                          {/* 评论列表 */}
                          {commentsMap[expandedId]?.length ? (
                            <div className="space-y-3">
                              {commentsMap[expandedId].map((comment) => (
                                <div
                                  key={comment.id}
                                  className="flex gap-3 p-3 rounded-lg bg-card/60 border border-border/30"
                                >
                                  <div className="size-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-accent">
                                      {comment.username.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-semibold text-foreground">
                                        {comment.username}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(comment.createdAt).toLocaleDateString('zh-CN', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-sm text-foreground/80 leading-relaxed">
                                      {comment.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              暂无评论，来发表第一条吧
                            </p>
                          )}

                          {/* 评论输入 */}
                          <form
                            onSubmit={(e) => handleCommentSubmit(e, expandedId)}
                            className="flex flex-col sm:flex-row gap-2"
                            noValidate
                          >
                            <Input
                              type="text"
                              value={commentUsernames[expandedId] || ''}
                              onChange={(e) =>
                                setCommentUsernames((prev) => ({
                                  ...prev,
                                  [expandedId]: e.target.value,
                                }))
                              }
                              placeholder="你的昵称"
                              maxLength={20}
                              className="sm:w-32 h-9 text-sm shrink-0"
                            />
                            <div className="flex-1 flex gap-2">
                              <Input
                                type="text"
                                value={commentInputs[expandedId] || ''}
                                onChange={(e) =>
                                  setCommentInputs((prev) => ({
                                    ...prev,
                                    [expandedId]: e.target.value,
                                  }))
                                }
                                placeholder="写下你的评论..."
                                maxLength={200}
                                className="flex-1 h-9 text-sm"
                              />
                              <Button
                                type="submit"
                                size="sm"
                                className="h-9 shrink-0"
                              >
                                <Send className="size-3.5" />
                              </Button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Tabs>
      </div>
    </section>
  );
}
