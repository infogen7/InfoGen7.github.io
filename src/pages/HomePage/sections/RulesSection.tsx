import { motion } from 'framer-motion';
import { Zap, Clock, Hash, Calculator, Trophy, Layers } from 'lucide-react';

const RULES = [
  {
    icon: Clock,
    title: '视频时长限制',
    desc: '上传一分钟（60秒）以内的挑战视频',
  },
  {
    icon: Hash,
    title: '挑战内容',
    desc: '视频内容为在输入框中尽可能多地打出"67"',
  },
  {
    icon: Zap,
    title: 'AI 自动分析',
    desc: '上传视频后，AI 自动识别视频中打出的"67"数量',
  },
  {
    icon: Calculator,
    title: '计分规则',
    desc: '分数 = 67 的数量 ÷ 视频时长（秒），分数越高排名越前',
  },
  {
    icon: Layers,
    title: '分区独立排名',
    desc: '键盘区、手机区、自由区三个分区各自独立计算排行榜',
  },
  {
    icon: Trophy,
    title: '冲击榜首',
    desc: '提交挑战后自动更新排行榜，看看你能排第几！',
  },
];

export default function RulesSection() {
  return (
    <section id="rules" className="w-full py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            挑战规则
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            了解规则，冲击更高排名
          </p>
        </motion.div>

        {/* Rules grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {RULES.map((rule, i) => {
            const Icon = rule.icon;
            return (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-xl border border-border/40 bg-card/50 p-6 hover:border-accent/30 hover:bg-card/80 transition-colors"
              >
                <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="size-5 text-accent" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {rule.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rule.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Formula highlight card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/5 via-card to-card p-6 md:p-10 text-center"
        >
          <p className="text-sm text-muted-foreground mb-3">计分公式</p>
          <div className="inline-flex items-center gap-3 md:gap-5 flex-wrap justify-center">
            <span className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
              分数
            </span>
            <span className="text-2xl md:text-4xl font-black text-accent">=</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
                67 的数量
              </span>
              <span className="w-full h-0.5 bg-accent/60 mt-1 rounded-full" />
              <span className="text-2xl md:text-4xl font-black text-foreground tracking-tight mt-1">
                视频时长（秒）
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            例如：视频中打出 30 个"67"，视频时长 45 秒 → 分数 = 30 ÷ 45 ≈ 0.67
          </p>
        </motion.div>
      </div>
    </section>
  );
}
