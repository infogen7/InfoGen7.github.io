import { motion } from 'framer-motion';
import { ArrowDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

const HERO_IMAGE_URL =
  'https://aka.doubaocdn.com/s/OFcD1wfcnr';

export default function HeroSection() {
  const scrollToUpload = () => {
    document
      .getElementById('upload')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="w-full relative overflow-hidden"
    >
      {/* 暗红背景 + Hero 图叠加 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/70 to-background" />
        <Image
          src={HERO_IMAGE_URL}
          alt=""
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        {/* 闪电纹理装饰 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      </div>

      {/* 内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-36 lg:py-44 flex flex-col items-center text-center">
        {/* 闪电装饰图标 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/40 bg-accent/10 text-accent text-sm font-semibold">
            <Zap className="size-4 fill-accent" />
            速通挑战
          </div>
        </motion.div>

        {/* 大标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground leading-none"
        >
          <span className="inline-block">67</span>
          <span className="inline-block text-accent">速通</span>
        </motion.h1>

        {/* 标语 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-xl"
        >
          一分钟内打出尽可能多的
          <span className="text-accent font-bold"> 67</span>
        </motion.p>

        {/* CTA 按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button
            size="lg"
            onClick={scrollToUpload}
            className="h-14 px-10 text-lg font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow"
          >
            <Zap className="size-5 mr-2" />
            立即挑战
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToUpload}
            className="h-14 px-8 text-base font-semibold rounded-xl border-accent/40 text-accent hover:bg-accent/10"
          >
            上传你的视频
            <ArrowDown className="size-4 ml-2" />
          </Button>
        </motion.div>

        {/* 底部渐变过渡 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
