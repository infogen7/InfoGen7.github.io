import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { label: '首页', anchor: '#hero' },
  { label: '上传视频', anchor: '#upload' },
  { label: '排行榜', anchor: '#leaderboard' },
  { label: '规则说明', anchor: '#rules' },
];

function scrollToAnchor(anchor: string) {
  const el = document.querySelector(anchor);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass =
    'px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer';

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <a
          onClick={(e) => { e.preventDefault(); scrollToAnchor('#hero'); }}
          href="#hero"
          className="flex items-center gap-2 shrink-0"
        >
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            67速通
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.anchor}
              href={item.anchor}
              onClick={(e) => { e.preventDefault(); scrollToAnchor(item.anchor); }}
              className={navLinkClass}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
        >
          {mobileOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.anchor}
                href={item.anchor}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToAnchor(item.anchor);
                  setMobileOpen(false);
                }}
                className="block px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
