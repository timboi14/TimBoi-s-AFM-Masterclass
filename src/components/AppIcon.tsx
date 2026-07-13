const ICON_PATHS = {
  accessibility: 'M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4M5 9h14M12 9v12M8 21l4-7 4 7',
  arrowRight: 'M5 12h14m-6-6 6 6-6 6',
  arrowUpRight: 'M7 17 17 7M8 7h9v9',
  bars: 'M4 20V10m6 10V4m6 16v-7m4 7V7',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  binoculars: 'M8 6 4 18h6l2-10 2 10h6L16 6M5 18a3 3 0 1 0 6 0m2 0a3 3 0 1 0 6 0',
  book: 'M4 5a3 3 0 0 1 3-2h5v18H7a3 3 0 0 0-3 2V5Zm16 0a3 3 0 0 0-3-2h-5v18h5a3 3 0 0 1 3 2V5Z',
  brain: 'M9 5a3 3 0 0 0-5 2v2a3 3 0 0 0 0 6v2a3 3 0 0 0 5 2m6-14a3 3 0 0 1 5 2v2a3 3 0 0 1 0 6v2a3 3 0 0 1-5 2M9 5v14m6-14v14M6 12h3m6 0h3',
  chart: 'M4 19V5m0 14h16M7 15l4-4 3 2 5-6',
  check: 'M20 6 9 17l-5-5',
  chevronDown: 'm6 9 6 6 6-6',
  circle: 'M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z',
  clipboard: 'M9 5H6v16h12V5h-3M9 3h6v4H9V3Zm0 11 2 2 4-4',
  cloud: 'M7 18h11a4 4 0 0 0 0-8h-1a6 6 0 0 0-11-2 5 5 0 0 0 1 10Zm5-7v7m-3-3 3 3 3-3',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3 6-2 5-5 2 2-5 5-2Z',
  door: 'M5 21V4l11-2v19M5 21h14M13 12h.01',
  fileCheck: 'M6 2h8l4 4v16H6V2Zm8 0v5h5M9 14l2 2 4-5',
  files: 'M7 3h8l4 4v14H7V3Zm8 0v5h5M4 7v14h11',
  flame: 'M12 22c4 0 7-3 7-7 0-5-4-7-3-12-3 2-5 5-4 9-2-1-3-3-3-5-2 2-3 4-3 6 0 4 3 7 7 7Z',
  graduation: 'm2 9 10-5 10 5-10 5L2 9Zm4 3v5c3 3 9 3 12 0v-5M22 9v6',
  grip: 'M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01',
  headset: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2Zm16 0h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2ZM17 20c-1 2-3 2-5 2',
  home: 'M3 11 12 3l9 8M5 10v11h5v-6h4v6h5V10',
  laptop: 'M5 4h14v12H5V4ZM3 20h18M9 20h6',
  lightbulb: 'M9 18h6m-5 3h4m3-9a5 5 0 1 0-10 0c0 2 2 3 2 6h6c0-3 2-4 2-6Z',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  lock: 'M6 10h12v11H6V10Zm3 0V7a3 3 0 0 1 6 0v3M12 15v2',
  menu: 'M4 7h16M4 12h16M4 17h16',
  mic: 'M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V5Zm-4 7a7 7 0 0 0 14 0M12 19v3m-4 0h8',
  pen: 'm4 20 1-5L16 4l4 4L9 19l-5 1Zm10-14 4 4M4 20l5-1-4-4-1 5Z',
  repeat: 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3',
  shield: 'M12 3 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3Zm-4 9 3 3 5-6',
  sparkles: 'm12 3 1 4 4 1-4 1-1 4-1-4-4-1 4-1 1-4Zm6 10 .7 2.3L21 16l-2.3.7L18 19l-.7-2.3L15 16l2.3-.7L18 13ZM6 15l.7 2.3L9 18l-2.3.7L6 21l-.7-2.3L3 18l2.3-.7L6 15Z',
  stopwatch: 'M9 2h6M12 6V3m0 3a8 8 0 1 0 8 8 8 8 0 0 0-8-8Zm0 4v5l3 2m4-10 2 2',
  target: 'M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1M14 10l7-7m-4 0h4v4',
  wand: 'm4 20 12-12 4 4L8 24M14 6l1-3m4 4 3-1M9 4 7 2M20 15l2 2',
  alert: 'M12 3 2 21h20L12 3Zm0 6v5m0 3h.01',
  wrench: 'M14 6a5 5 0 0 0-7 6L3 16l5 5 4-4a5 5 0 0 0 6-7l-3 3-4-4 3-3ZM5 17l2 2',
  x: 'M6 6l12 12M18 6 6 18',
  zap: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
} as const;

export type AppIconName = keyof typeof ICON_PATHS;

export function AppIcon({ name, size = 16, strokeWidth = 2.2, className }: {
  name: AppIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size}
      fill={name === 'circle' ? 'currentColor' : 'none'} stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
