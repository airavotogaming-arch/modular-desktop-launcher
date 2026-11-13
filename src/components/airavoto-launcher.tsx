import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  Bell,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  CloudSun,
  Crown,
  Disc3,
  Gamepad2,
  Gift,
  Grid2X2,
  Headphones,
  House,
  LibraryBig,
  Monitor,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Volume2,
  Wifi,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import featuredArt from "@/assets/featured-fantasy.jpg";
import wallpaper from "@/assets/launcher-wallpaper.jpg";

const games = [
  { name: "VALORANT", short: "V", kind: "valorant", category: "Tactical shooter" },
  { name: "GTA V", short: "V", kind: "gta", category: "Open world" },
  { name: "Fortnite", short: "f", kind: "fortnite", category: "Battle royale" },
  { name: "Minecraft", short: "▦", kind: "minecraft", category: "Sandbox" },
  { name: "Call of Duty", short: "COD", kind: "call-of-duty", category: "Action" },
  { name: "EA FC 26", short: "EA", kind: "fc", category: "Sports" },
  { name: "Among Us", short: "●", kind: "among-us", category: "Party" },
  { name: "Steam", short: "S", kind: "steam", category: "Game library" },
  { name: "Discord", short: "◖", kind: "discord", category: "Community" },
  { name: "Spotify", short: "≋", kind: "spotify", category: "Music" },
  { name: "Roblox", short: "□", kind: "roblox", category: "Games" },
  { name: "Netflix", short: "N", kind: "netflix", category: "Entertainment" },
];

const railItems = [
  { id: "home", label: "Home", icon: House, target: "dashboard-top" },
  { id: "games", label: "Games", icon: Gamepad2, target: "all-games" },
  { id: "tools", label: "Tools", icon: Swords, target: "quick-actions" },
  { id: "stats", label: "Stats", icon: ChartNoAxesColumnIncreasing, target: "your-stats" },
  { id: "calendar", label: "Calendar", icon: CalendarDays, target: "weekly-activity" },
  { id: "rewards", label: "Rewards", icon: Gift, target: "rewards-panel" },
];

type DialogContent = { title: string; description: string; action?: string | undefined };

function ClockDisplay() {
  const [now, setNow] = useState({ time: "9:37 PM", date: "12/11/2026" });

  useEffect(() => {
    const update = () => {
      const date = new Date();
      setNow({
        time: date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        date: date.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" }),
      });
    };
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="taskbar-clock" aria-label={`Local time ${now.time}`}>
      <span>{now.time}</span>
      <span>{now.date}</span>
    </div>
  );
}

export function AiravotoLauncher() {
  const [query, setQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<(typeof games)[number] | null>(null);
  const [dialog, setDialog] = useState<DialogContent | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [sessionRunning, setSessionRunning] = useState(true);
  const [sessionSeconds, setSessionSeconds] = useState(1 * 3600 + 23 * 60 + 17);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const visibleGames = games.filter((game) =>
    game.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const formattedSession = [
    Math.floor(sessionSeconds / 3600),
    Math.floor((sessionSeconds % 3600) / 60),
    sessionSeconds % 60,
  ]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");

  useEffect(() => {
    if (!sessionRunning) return;
    const timer = window.setInterval(() => setSessionSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [sessionRunning]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMinimized(false);
        setSearchOpen(true);
        window.requestAnimationFrame(() => searchRef.current?.focus());
      }
      if (event.key === "Escape") {
        setDialog(null);
        setSelectedGame(null);
        setNotificationsOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const openDialog = (title: string, description: string, action?: string) => {
    setNotificationsOpen(false);
    setDialog({ title, description, action });
  };

  const chooseTab = (id: string, target: string) => {
    setActiveTab(id);
    if (id === "home") {
      document.querySelector(".launcher-workspace")?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (id === "calendar") {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const openGame = (game: (typeof games)[number]) => {
    setSelectedGame(game);
    setQuery("");
    setSearchOpen(false);
  };

  const gameTiles = (className = "games-grid") =>
    visibleGames.map((game) => (
      <Button
        key={game.name}
        variant="ghost"
        className={`game-tile game-mark-${game.kind}`}
        onClick={() => openGame(game)}
        aria-label={`Open ${game.name}`}
      >
        <span className="game-app-mark" aria-hidden="true">
          {game.short}
        </span>
        <span className="game-name">{game.name}</span>
      </Button>
    ));

  return (
    <main className={`launcher-shell${isExpanded ? " launcher-shell-expanded" : ""}`}>
      <img className="desktop-wallpaper" src={wallpaper} alt="" />
      <div className="wallpaper-tint" aria-hidden="true" />

      <header className="launcher-header" id="dashboard-top">
        <Button
          variant="ghost"
          className="brand-lockup"
          onClick={() => chooseTab("home", "dashboard-top")}
          aria-label="Airavoto home"
        >
          <span className="brand-icon" aria-hidden="true">A</span>
          <span className="brand-copy">
            <span className="brand-name">Airavoto</span>
            <span className="brand-caption">Gaming Launcher</span>
          </span>
        </Button>

        <label className={`launcher-search${searchOpen ? " launcher-search-active" : ""}`}>
          <Search aria-hidden="true" />
          <input
            ref={searchRef}
            value={query}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => window.setTimeout(() => setSearchOpen(false), 160)}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search games, apps, or anything..."
            aria-label="Search games, apps, or anything"
          />
          {!query && <kbd>Ctrl + K</kbd>}
          {searchOpen && query && (
            <div className="search-results" role="listbox" aria-label="Game search results">
              {visibleGames.length ? (
                visibleGames.slice(0, 6).map((game) => (
                  <Button
                    key={game.name}
                    variant="ghost"
                    className="search-result"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => openGame(game)}
                  >
                    <span className={`search-result-mark game-mark-${game.kind}`} aria-hidden="true">
                      {game.short}
                    </span>
                    <span>{game.name}</span>
                    <ChevronRight aria-hidden="true" />
                  </Button>
                ))
              ) : (
                <p className="search-empty">No matches found</p>
              )}
            </div>
          )}
        </label>

        <div className="header-actions">
          <Button
            variant="ghost"
            className="venue-button"
            onClick={() =>
              openDialog("Your gaming lounge", "This launcher is ready for your favorite games and apps.", "Browse games")
            }
          >
            <Monitor aria-hidden="true" />
            <span className="venue-copy">
              <strong>PC Client</strong>
              <span>Gaming Lounge</span>
            </span>
            <ChevronDown aria-hidden="true" />
          </Button>

          <span className="header-divider" aria-hidden="true" />

          <Button
            variant="ghost"
            className="profile-button"
            onClick={() => openDialog("Player_007", "Your local player profile and gaming highlights.", "View profile")}
          >
            <span className="profile-avatar">
              <img src={featuredArt} alt="" />
            </span>
            <span className="profile-copy">
              <strong>Player_007</strong>
              <span><Crown aria-hidden="true" /> Pro Member</span>
            </span>
            <ChevronDown aria-hidden="true" />
          </Button>

          <span className="notification-anchor">
            <Button
              variant="ghost"
              size="icon"
              className="header-icon-button notification-trigger"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell aria-hidden="true" />
              <span className="notification-count">3</span>
            </Button>
            {notificationsOpen && (
              <section className="notification-popover glass-panel" aria-label="Notifications">
                <div className="popover-heading">
                  <strong>Notifications</strong>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setNotificationsOpen(false)}
                    aria-label="Close notifications"
                  >
                    <X aria-hidden="true" />
                  </Button>
                </div>
                <p><Sparkles aria-hidden="true" /> Your weekly gaming recap is ready.</p>
                <p><Gift aria-hidden="true" /> A new reward is waiting in your collection.</p>
                <p><Gamepad2 aria-hidden="true" /> Your game library is ready to explore.</p>
              </section>
            )}
          </span>

          <span className="window-controls">
            <Button variant="ghost" size="icon" className="window-control" aria-label="Minimize launcher" onClick={() => setMinimized(true)}><span /></Button>
            <Button variant="ghost" size="icon" className="window-control" aria-label={isExpanded ? "Restore launcher size" : "Maximize launcher"} onClick={() => setIsExpanded((expanded) => !expanded)}><span className="window-square" /></Button>
            <Button variant="ghost" size="icon" className="window-control window-close" aria-label="Close launcher" onClick={() => openDialog("Close launcher?", "Your game library and session are right here when you return.", "Minimize") }><X aria-hidden="true" /></Button>
          </span>
        </div>
      </header>

      <div className="launcher-content">
        <nav className="launcher-rail glass-panel" aria-label="Launcher sections">
          {railItems.map(({ id, label, icon: Icon, target }) => (
            <Button
              key={id}
              variant="ghost"
              size="icon"
              className={`rail-button${activeTab === id ? " rail-button-active" : ""}`}
              onClick={() => chooseTab(id, target)}
              aria-label={label}
              aria-current={activeTab === id ? "page" : undefined}
              title={label}
            >
              <Icon aria-hidden="true" />
            </Button>
          ))}
          <span className="rail-spacer" />
          <Button
            variant="ghost"
            size="icon"
            className={`rail-button${activeTab === "settings" ? " rail-button-active" : ""}`}
            onClick={() => {
              setActiveTab("settings");
              openDialog("Launcher settings", "Personalize your gaming space, sound, and notifications.", "Done");
            }}
            aria-label="Settings"
            title="Settings"
          >
            <Settings2 aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rail-button"
            onClick={() => openDialog("Player support", "Find help with your launcher, gaming setup, and library.", "Got it")}
            aria-label="Support"
            title="Support"
          >
            <Headphones aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rail-button rail-add-button"
            onClick={() => openDialog("Add a game or app", "Your launcher is ready for more of your favorite games.", "Explore library")}
            aria-label="Add game or app"
            title="Add game or app"
          >
            <Plus aria-hidden="true" />
          </Button>
        </nav>

        <div className={`launcher-workspace${minimized ? " launcher-workspace-minimized" : ""}`}>
          {minimized ? (
            <section className="minimized-notice glass-panel">
              <div className="brand-icon" aria-hidden="true">A</div>
              <div><strong>Airavoto is ready</strong><span>Your games and widgets are waiting.</span></div>
              <Button className="restore-button" onClick={() => setMinimized(false)}><ArrowRight aria-hidden="true" /> Restore launcher</Button>
            </section>
          ) : (
            <div className="dashboard-layout">
              <div className="dashboard-main-column">
                <section className="featured-game glass-panel" aria-label="Featured game">
                  <img className="featured-art" src={featuredArt} alt="Fantasy heroine before a moonlit ruined citadel" />
                  <div className="featured-shade" aria-hidden="true" />
                  <Button variant="ghost" size="icon" className="featured-arrow featured-arrow-left" aria-label="Previous featured game" onClick={() => openDialog("Featured games", "Discover more new worlds in your game library.", "Browse games")}><ChevronLeft aria-hidden="true" /></Button>
                  <div className="featured-copy">
                    <span className="featured-label"><Sparkles aria-hidden="true" /> Featured game</span>
                    <h1>League of<br className="featured-break" /> Legends</h1>
                    <p>Play. Compete. Win.</p>
                  <Button className="play-button" onClick={() => { const game = games.find((item) => item.name === "VALORANT"); if (game) openGame(game); }}>Play now <Play aria-hidden="true" fill="currentColor" /></Button>
                  </div>
                  <Button variant="ghost" size="icon" className="featured-arrow featured-arrow-right" aria-label="Next featured game" onClick={() => openDialog("Featured games", "Discover more new worlds in your game library.", "Browse games")}><ChevronRight aria-hidden="true" /></Button>
                  <div className="carousel-dots" aria-label="Featured game 1 of 5"><span className="carousel-dot carousel-dot-active" /><span className="carousel-dot" /><span className="carousel-dot" /><span className="carousel-dot" /><span className="carousel-dot" /></div>
                </section>

                <div className="stats-row">
                  <section className="widget-panel activity-widget glass-panel" id="weekly-activity">
                    <div className="widget-heading">
                      <span className="widget-title"><Activity aria-hidden="true" /> Weekly activity</span>
                      <Button variant="ghost" className="text-action" onClick={() => chooseTab("stats", "your-stats")}>View details <ArrowRight aria-hidden="true" /></Button>
                    </div>
                    <div className="activity-chart" aria-label="Weekly play activity, Monday to Sunday">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                        <div className="activity-day" key={day}>
                          <span className={`activity-bar activity-bar-${index + 1}`} />
                          <span>{day}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="widget-panel stats-widget glass-panel" id="your-stats">
                    <div className="widget-heading"><span className="widget-title"><ChartNoAxesColumnIncreasing aria-hidden="true" /> Your stats</span></div>
                    <div className="stat-pair">
                      <div><strong>66%</strong><span>Win rate</span></div>
                      <span className="stat-divider" />
                      <div><strong>3.15</strong><span>K/D</span></div>
                    </div>
                    <Button variant="ghost" className="text-action stats-action" onClick={() => chooseTab("stats", "weekly-activity")}>View stats <ArrowRight aria-hidden="true" /></Button>
                  </section>

                  <section className="widget-panel performers-widget glass-panel">
                    <div className="widget-heading">
                      <span className="widget-title"><Trophy aria-hidden="true" /> Top performances</span>
                      <Button variant="ghost" className="text-action" onClick={() => chooseTab("stats", "your-stats")}>See all <ArrowRight aria-hidden="true" /></Button>
                    </div>
                    <div className="performer-list">
                      {["Astra", "Phoenix", "Jett"].map((name, index) => (
                        <Button variant="ghost" className={`performer-avatar performer-avatar-${index + 1}`} key={name} aria-label={`${name} top performer`} onClick={() => openDialog(`${name} · top performer`, "A look at your standout plays and recent performance.", "View stats")}>
                          <img src={featuredArt} alt="" />
                        </Button>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="library-row">
                  <section className="widget-panel library-widget glass-panel" id="all-games">
                    <div className="widget-heading">
                      <span className="widget-title"><Grid2X2 aria-hidden="true" /> All games</span>
                      <Button variant="ghost" className="text-action" onClick={() => chooseTab("games", "all-games")}>See all <ArrowRight aria-hidden="true" /></Button>
                    </div>
                    <div className="games-grid">{gameTiles()}</div>
                    {visibleGames.length === 0 && <p className="empty-games">No apps match “{query}”.</p>}
                  </section>

                  <section className="widget-panel popular-widget glass-panel">
                    <div className="widget-heading">
                      <span className="widget-title"><Sparkles aria-hidden="true" /> Popular games</span>
                      <Button variant="ghost" className="text-action" onClick={() => chooseTab("games", "all-games")}>See all <ArrowRight aria-hidden="true" /></Button>
                    </div>
                    <div className="popular-games">
                      {[games[1], games[4], games[5], games[0]].filter((game): game is (typeof games)[number] => Boolean(game)).map((game) => (
                        <Button variant="ghost" className="popular-game" key={game.name} onClick={() => openGame(game)}>
                          <span className={`popular-cover game-mark-${game.kind}`}>{game.short}</span>
                          <span>{game.name}</span>
                        </Button>
                      ))}
                    </div>
                  </section>

                  <section className="widget-panel food-widget glass-panel">
                    <div className="widget-heading">
                      <span className="widget-title"><ShoppingBag aria-hidden="true" /> Food &amp; drinks</span>
                      <Button variant="ghost" className="text-action" onClick={() => openDialog("Food & drinks", "Take a quick break between matches.", "Browse menu")}>See all <ArrowRight aria-hidden="true" /></Button>
                    </div>
                    <div className="food-content">
                      <div className="food-photo" aria-label="Burger meal illustration"><span aria-hidden="true">🍔</span></div>
                      <div className="food-details"><strong>Burger combo</strong><span className="food-price">₹199</span><Button className="food-order" onClick={() => openDialog("Burger combo", "A quick snack for your next gaming session.", "View menu")}>Order now <ArrowRight aria-hidden="true" /></Button></div>
                    </div>
                  </section>
                </div>

                <section className="widget-panel quick-actions-widget glass-panel" id="quick-actions">
                  <div className="widget-heading"><span className="widget-title"><Sparkles aria-hidden="true" /> Quick actions</span></div>
                  <div className="quick-actions-list">
                    <Button variant="ghost" className="quick-action" onClick={() => openDialog("Food & drinks", "Find a snack or drink for your next gaming session.", "Browse menu")}><span className="quick-icon quick-icon-food">🍕</span><span>Order food</span></Button>
                    <Button variant="ghost" className="quick-action" onClick={() => openDialog("Book a PC", "Choose a gaming setup and plan your next session.", "Choose a setup")}><Monitor aria-hidden="true" /><span>Book a PC</span></Button>
                    <Button variant="ghost" className="quick-action" onClick={() => chooseTab("stats", "your-stats")}><ChartNoAxesColumnIncreasing aria-hidden="true" /><span>View stats</span></Button>
                    <Button variant="ghost" className="quick-action" onClick={() => openDialog("Player support", "Find help with your launcher, setup, or game library.", "Got it")}><Headphones aria-hidden="true" /><span>Support</span></Button>
                    <Button variant="ghost" className="quick-action quick-more" onClick={() => openDialog("More for your session", "Your games, stats, rewards, and tools are all in one place.", "Explore launcher")}><MoreHorizontal aria-hidden="true" /><span>More</span><ArrowRight aria-hidden="true" /></Button>
                  </div>
                </section>
              </div>

              <aside className="dashboard-aside" aria-label="Session and rewards">
                <section className="widget-panel session-widget glass-panel">
                  <div className="widget-heading">
                    <span className="widget-title"><span className="live-indicator" /> Current session</span>
                    <Clock3 className="subtle-icon" aria-hidden="true" />
                  </div>
                  <div className="session-time" aria-live="off">{formattedSession}</div>
                  <Button className="session-button" onClick={() => setSessionRunning((running) => !running)}>
                    {sessionRunning ? <Pause aria-hidden="true" fill="currentColor" /> : <Play aria-hidden="true" fill="currentColor" />}
                    {sessionRunning ? "Pause" : "Resume"}
                  </Button>
                  <span className="session-streak" aria-hidden="true"><Sparkles /></span>
                </section>

                <section className="widget-panel lounge-widget glass-panel">
                  <div className="widget-heading">
                    <span className="widget-title">Gaming lounge</span>
                    <span className="open-badge"><span className="live-indicator" /> Open</span>
                  </div>
                  <div className="lounge-details">
                    <div className="lounge-icon"><Monitor aria-hidden="true" /></div>
                    <div><strong>PC Client</strong><span>Ready when you are</span></div>
                  </div>
                  <div className="lounge-features"><span><Wifi aria-hidden="true" /> Fast Wi-Fi</span><span><Volume2 aria-hidden="true" /> Headsets ready</span></div>
                  <Button className="lounge-book" onClick={() => openDialog("Book your PC", "Choose a gaming setup and plan your next session.", "Choose a setup")}>Book a PC <ArrowRight aria-hidden="true" /></Button>
                </section>

                <section className="widget-panel rewards-widget glass-panel" id="rewards-panel">
                  <div className="widget-heading">
                    <span className="widget-title"><Gift aria-hidden="true" /> Your rewards</span>
                    <span className="open-badge">Member</span>
                  </div>
                  <div className="reward-art" aria-hidden="true"><Gift /><Sparkles /><Star /></div>
                  <div className="reward-copy"><strong>A little something for you</strong><span>Your next session comes with a surprise.</span></div>
                  <Button className="reward-button" onClick={() => openDialog("Your rewards", "Your next gaming session comes with a little something extra.", "View rewards")}>Explore rewards <ArrowRight aria-hidden="true" /></Button>
                </section>

                <section className="promo-widget glass-panel" aria-label="Player membership offer">
                  <div className="promo-gift" aria-hidden="true"><Gift /><Sparkles /></div>
                  <div><strong>Play more, get more</strong><span>Good things come with your next session.</span></div>
                  <Button variant="ghost" size="icon" aria-label="Learn about membership" onClick={() => openDialog("Player perks", "Discover more from your gaming membership.", "Learn more")}><ArrowRight aria-hidden="true" /></Button>
                </section>

                <section className="support-strip glass-panel" id="support-panel">
                  <CircleHelp aria-hidden="true" />
                  <div><strong>Need a hand?</strong><span>We’re here to help.</span></div>
                  <Button variant="ghost" size="icon" aria-label="Contact player support" onClick={() => openDialog("Player support", "Find help with your launcher, setup, or game library.", "Got it")}><ArrowRight aria-hidden="true" /></Button>
                </section>
              </aside>
            </div>
          )}
        </div>
      </div>

      <footer className="desktop-taskbar" aria-label="Desktop taskbar">
        <Button variant="ghost" className="weather-widget" onClick={() => openDialog("Local weather", "Partly cloudy and 29° in your area.")}>
          <CloudSun aria-hidden="true" />
          <span><strong>29°C</strong><span>Mostly cloudy</span></span>
        </Button>

        <div className="taskbar-center">
          <Button variant="ghost" size="icon" className="taskbar-start" aria-label="Launcher start" onClick={() => chooseTab("home", "dashboard-top")}><span className="windows-mark" aria-hidden="true"><i /><i /><i /><i /></span></Button>
          <Button variant="ghost" className="taskbar-search" onClick={() => { setMinimized(false); setSearchOpen(true); window.requestAnimationFrame(() => searchRef.current?.focus()); }}><Search aria-hidden="true" /> Search</Button>
          <Button variant="ghost" size="icon" className="taskbar-app taskbar-folder" aria-label="Open app library" onClick={() => chooseTab("games", "all-games")}><LibraryBig aria-hidden="true" /></Button>
          <Button variant="ghost" size="icon" className="taskbar-app taskbar-browser" aria-label="Open launcher browser" onClick={() => openDialog("Explore games", "Browse your game library and find something new to play.", "Browse games")}><Disc3 aria-hidden="true" /></Button>
          <Button variant="ghost" size="icon" className="taskbar-app taskbar-active" aria-label="Airavoto launcher" onClick={() => setMinimized(false)}><span className="mini-brand-mark">A</span></Button>
        </div>

        <div className="taskbar-system"><Button variant="ghost" size="icon" aria-label="Network status: connected" onClick={() => openDialog("Network connected", "Your gaming lounge Wi-Fi is ready.")}><Wifi aria-hidden="true" /></Button><Button variant="ghost" size="icon" aria-label="Sound settings" onClick={() => openDialog("Sound settings", "Your gaming headset is ready to use.")}><Volume2 aria-hidden="true" /></Button><Button variant="ghost" size="icon" aria-label="Launcher downloads" onClick={() => openDialog("Game library", "Your saved and recently played apps are ready.")}><ArrowDownToLine aria-hidden="true" /></Button><ClockDisplay /></div>
      </footer>

      {(selectedGame || dialog) && (
        <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setSelectedGame(null); setDialog(null); } }}>
          <section className="launcher-dialog glass-panel" role="dialog" aria-modal="true" aria-labelledby="launcher-dialog-title">
            <Button variant="ghost" size="icon" className="dialog-close" aria-label="Close dialog" onClick={() => { setSelectedGame(null); setDialog(null); }}><X aria-hidden="true" /></Button>
            {selectedGame ? (
              <>
                <span className={`dialog-game-mark game-mark-${selectedGame.kind}`}>{selectedGame.short}</span>
                <span className="dialog-eyebrow">{selectedGame.category}</span>
                <h2 id="launcher-dialog-title">{selectedGame.name}</h2>
                <p>Ready when you are. Pick up where you left off and make this session yours.</p>
                <Button className="dialog-primary" onClick={() => { setSessionRunning(true); setSelectedGame(null); }}>{sessionRunning ? <Play aria-hidden="true" fill="currentColor" /> : <Play aria-hidden="true" fill="currentColor" />} Play now</Button>
              </>
            ) : dialog ? (
              <>
                <span className="dialog-app-mark"><Sparkles aria-hidden="true" /></span>
                <span className="dialog-eyebrow">Airavoto gaming launcher</span>
                <h2 id="launcher-dialog-title">{dialog.title}</h2>
                <p>{dialog.description}</p>
                <Button className="dialog-primary" onClick={() => { if (dialog.title === "Close launcher?") setMinimized(true); setDialog(null); }}>{dialog.action ?? "Got it"}<ArrowRight aria-hidden="true" /></Button>
              </>
            ) : null}
          </section>
        </div>
      )}

      <span className="visually-hidden"><LibraryBig /> Airavoto modular game launcher</span>
    </main>
  );
}