import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/pages/HomePage/sections/HeroSection';
import UploadSection from '@/pages/HomePage/sections/UploadSection';
import LeaderboardSection from '@/pages/HomePage/sections/LeaderboardSection';
import RulesSection from '@/pages/HomePage/sections/RulesSection';
import type { ILeaderboardRecord } from '@/types/leaderboard';

export default function HomePage() {
  const [, setNewRecord] = useState<ILeaderboardRecord | null>(null);

  const handleNewRecord = useCallback((record: ILeaderboardRecord) => {
    setNewRecord(record);
    // 滚动到排行榜区
    setTimeout(() => {
      document
        .getElementById('leaderboard')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="space-y-0">
        <HeroSection />
        <UploadSection onNewRecord={handleNewRecord} />
        <LeaderboardSection />
        <RulesSection />
      </main>
      <footer className="w-full bg-card border-t border-border/30 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>67速通 — 一分钟内打出尽可能多的67</p>
          <p className="mt-1">© 2026 67速通挑战平台</p>
        </div>
      </footer>
    </div>
  );
}
