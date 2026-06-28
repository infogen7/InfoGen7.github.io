import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { Upload, Film, User, FileText, Send, Zap, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ZONES, ZONE_LABELS, type ZoneKey, type ILeaderboardRecord } from '@/types/leaderboard';
import { saveRecord } from '@/data/leaderboard';

const MAX_DURATION_SEC = 60;
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.mov'];

interface UploadSectionProps {
  onNewRecord?: (record: ILeaderboardRecord) => void;
}

export default function UploadSection({ onNewRecord }: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [zone, setZone] = useState<ZoneKey>('keyboard');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // ─── 视频文件校验 ───
  function validateVideo(file: File): string | null {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      return '仅支持 mp4 / webm / mov 格式的视频文件';
    }
    return null;
  }

  function handleFile(file: File) {
    const err = validateVideo(file);
    if (err) {
      toast.error(err);
      return;
    }

    // 读取视频时长
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const dur = video.duration;
      if (dur > MAX_DURATION_SEC) {
        toast.error(`视频时长 ${Math.round(dur)} 秒，超过 ${MAX_DURATION_SEC} 秒限制`);
        setVideoFile(null);
        setVideoDuration(null);
        return;
      }
      setVideoFile(file);
      setVideoDuration(dur);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      toast.error('无法读取视频信息，请检查文件是否损坏');
    };
    video.src = url;
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset input so same file can be re-selected
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  // ─── 模拟 AI 分析 ───
  async function simulateAnalysis(_file: File, durationSec: number): Promise<number> {
    // 模拟 1.5-3 秒分析延迟
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500));
    // 模拟结果：根据时长随机生成 67 数量（1秒约 1-4 个）
    const base = Math.floor(durationSec * (1 + Math.random() * 3));
    return Math.max(1, base);
  }

  // ─── 提交 ───
  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!videoFile || videoDuration == null) {
      toast.error('请先上传挑战视频');
      return;
    }
    if (!username.trim()) {
      toast.error('请输入挑战者昵称');
      return;
    }

    setSubmitting(true);
    try {
      const count67 = await simulateAnalysis(videoFile, videoDuration);
      const score = count67 / videoDuration;

      const record: ILeaderboardRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        zone,
        username: username.trim(),
        count67,
        duration: Math.round(videoDuration * 100) / 100,
        score: Math.round(score * 100) / 100,
        description: description.trim() || undefined,
        submittedAt: new Date().toISOString(),
        source: 'user',
      };

      await saveRecord(record);
      onNewRecord?.(record);

      toast.success(`挑战成功！你的分数：${record.score.toFixed(2)}（${count67} 个 67 / ${record.duration.toFixed(1)} 秒）`);

      // 重置表单
      setVideoFile(null);
      setVideoDuration(null);
      setUsername('');
      setDescription('');
    } catch {
      toast.error('分析失败，请重试');
    } finally {
      setSubmitting(false);
    }
  }

  // ─── 格式化时长 ───
  const durationDisplay =
    videoDuration != null
      ? videoDuration >= 60
        ? `${Math.floor(videoDuration / 60)}分${Math.round(videoDuration % 60)}秒`
        : `${videoDuration.toFixed(1)} 秒`
      : null;

  return (
    <section id="upload" className="w-full py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
            <Upload className="size-3.5" />
            上传挑战
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            提交你的 <span className="text-accent">67</span> 挑战
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            上传一分钟以内的视频，AI 自动识别你打出了多少个 67，计算分数并上榜
          </p>
        </motion.div>

        {/* 表单卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Film className="size-5 text-accent" />
                挑战信息
              </CardTitle>
              <CardDescription>
                填写以下信息提交你的挑战视频
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6" noValidate>
                {/* ── 视频上传区 ── */}
                <div className="space-y-2">
                  <Label htmlFor="video-upload" className="text-sm font-medium">
                    挑战视频 <span className="text-destructive">*</span>
                  </Label>

                  {/* 已选文件预览 */}
                  {videoFile ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-accent/30 bg-accent/5">
                      <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="size-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {videoFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                          {durationDisplay && (
                            <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0 h-5">
                              {durationDisplay}
                            </Badge>
                          )}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => {
                          setVideoFile(null);
                          setVideoDuration(null);
                        }}
                      >
                        移除
                      </Button>
                    </div>
                  ) : (
                    /* 拖拽上传区 */
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                        dragOver
                          ? 'border-accent bg-accent/10'
                          : 'border-border/50 hover:border-accent/40 hover:bg-muted/30'
                      }`}
                    >
                      <div className="size-14 rounded-2xl bg-muted flex items-center justify-center">
                        <Upload className="size-6 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          拖拽视频到此处，或<span className="text-accent">点击上传</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          支持 mp4 / webm / mov，时长 ≤ 60 秒
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        id="video-upload"
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                        onChange={onFileChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* ── 分区选择 ── */}
                <div className="space-y-2">
                  <Label htmlFor="zone-select" className="text-sm font-medium">
                    挑战分区 <span className="text-destructive">*</span>
                  </Label>
                  <Select value={zone} onValueChange={(v) => setZone(v as ZoneKey)}>
                    <SelectTrigger id="zone-select" className="h-11">
                      <SelectValue placeholder="选择分区" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZONES.map((z) => (
                        <SelectItem key={z} value={z}>
                          <span className="flex items-center gap-2">
                            <Zap className="size-3.5 text-accent" />
                            {ZONE_LABELS[z]}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    3 个分区独立排名，选择你的挑战设备类型
                  </p>
                </div>

                {/* ── 用户名 ── */}
                <div className="space-y-2">
                  <Label htmlFor="username-input" className="text-sm font-medium">
                    挑战者昵称 <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="username-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="输入你的昵称"
                      maxLength={20}
                      className="pl-9 h-11"
                    />
                  </div>
                </div>

                {/* ── 视频简介 ── */}
                <div className="space-y-2">
                  <Label htmlFor="desc-input" className="text-sm font-medium">
                    视频简介 <span className="text-muted-foreground font-normal">（可选）</span>
                  </Label>
                  <div className="relative">
                    <FileText className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Textarea
                      id="desc-input"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="简短描述你的挑战心得..."
                      maxLength={200}
                      rows={3}
                      className="pl-9 resize-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {description.length}/200
                  </p>
                </div>

                {/* ── 时长超限提示 ── */}
                {videoDuration != null && videoDuration > MAX_DURATION_SEC && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    <AlertCircle className="size-4 shrink-0" />
                    视频时长超过 60 秒限制，请剪辑后再上传
                  </div>
                )}

                {/* ── 提交按钮 ── */}
                <Button
                  type="submit"
                  disabled={submitting || !videoFile}
                  size="lg"
                  className="w-full h-12 text-base font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      AI 分析中...
                    </>
                  ) : (
                    <>
                      <Send className="size-5" />
                      提交挑战
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  提交后 AI 将自动分析视频中的 67 数量，计算分数并更新排行榜
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
