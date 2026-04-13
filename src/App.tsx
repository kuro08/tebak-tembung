import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Delete, 
  Info, 
  Settings, 
  Share2, 
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BarChart2,
  Heart,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { format } from 'date-fns';
import { MAX_ATTEMPTS } from './constants';
import { cn } from './lib/utils';

type Language = 'id' | 'jv' | 'en';
type Theme = 'light' | 'dark';

const TRANSLATIONS = {
  id: {
    title: 'TEBAK KATA',
    howToPlay: 'Cara Bermain',
    description: 'Tebak kata bahasa Jawa. Anda punya 6 kesempatan.',
    correct: 'Huruf benar dan di posisi yang benar.',
    present: 'Huruf benar tapi di posisi yang salah.',
    absent: 'Huruf tidak ada dalam kata tersebut.',
    start: 'Mulai Bermain',
    tooShort: 'Kurang huruf!',
    notFound: 'Kata tidak ditemukan!',
    won: 'Selamat! Anda benar!',
    lost: 'Aduh! Kesempatan habis.',
    theWordWas: 'Kata hari ini adalah:',
    share: 'Bagikan Hasil',
    copied: 'Hasil disalin ke clipboard!',
    nextWord: 'Kata baru akan tersedia besok!',
    nextWordTimer: 'Kata berikutnya:',
    settings: 'Pengaturan',
    language: 'Bahasa',
    theme: 'Tema',
    hint: 'Petunjuk',
    back: 'Kembali ke Permainan',
    meaning: 'Arti / Makna:',
    statistics: 'Statistik',
    played: 'Dimainkan',
    winRate: 'Persentase Menang',
    currentStreak: 'Streak Saat Ini',
    bestStreak: 'Streak Terbaik',
    history: 'Riwayat Permainan',
    timezone: 'Zona Waktu',
    updateInfo: 'Kata diperbarui setiap hari mengikuti waktu Pulau Jawa (UTC+7).',
    aboutTitle: 'Tentang Tebak Tembung',
    aboutText1: 'Tebak Tembung merupakan project pribadi saya yang terinspirasi dari ',
    aboutText2: ' dengan berberapa penambahan fitur seperti jumlah huruf yang variatif (4-8 huruf) dan tampilan yang unik.',
    aboutText3: 'Aplikasi mini-game ini saya buat untuk orang-orang yang ingin dan berminat untuk mempelajari bahasa Jawa.',
    aboutSupport: 'Jika Anda menikmati game ini dan ingin mendukung karya saya, silakan pertimbangkan untuk mentraktir saya melalui Saweria♥️.',
    supportButton: 'Dukung di Saweria ♥️',
    close: 'Tutup',
    metaTitle: 'Tebak Tembung - Game Tebak Kata Bahasa Jawa Harian',
    metaDesc: 'Uji kemampuan bahasa Jawa Anda dengan Tebak Tembung. Game tebak kata harian yang seru untuk belajar kosakata bahasa Jawa dengan cara yang menyenangkan.',
  },
  jv: {
    title: 'TEBAK TEMBUNG',
    howToPlay: 'Cara Dolanan',
    description: 'Tebak tembung basa Jawa. Sampeyan duwe 6 kesempatan.',
    correct: 'Aksara bener lan panggone bener.',
    present: 'Aksara bener nanging panggone salah.',
    absent: 'Aksara ora ana ing tembung kasebut.',
    start: 'Mulai Dolanan',
    tooShort: 'Kurang aksara!',
    notFound: 'Tembung ora ketemu!',
    won: 'Sugeng! Sampeyan bener!',
    lost: 'Aduh! Kesempatan entek.',
    theWordWas: 'Tembung dina iki yaiku:',
    share: 'Bagikan Asil',
    copied: 'Asil disalin menyang clipboard!',
    nextWord: 'Tembung anyar bakal ana sesuk!',
    nextWordTimer: 'Tembung sesuke:',
    settings: 'Setelan',
    language: 'Basa',
    theme: 'Tema',
    hint: 'Pituduh',
    back: 'Bali menyang Dolanan',
    meaning: 'Tegese / Makna:',
    statistics: 'Statistik',
    played: 'Dolanan',
    winRate: 'Persentase Menang',
    currentStreak: 'Streak Saiki',
    bestStreak: 'Streak Paling Apik',
    history: 'Riwayat Dolanan',
    timezone: 'Zona Waktu',
    updateInfo: 'Tembung dianyari saben dina melu wektu Pulo Jawa (UTC+7).',
    aboutTitle: 'Babagan Tebak Tembung',
    aboutText1: 'Tebak Tembung yaiku proyek pribadi kula sing kailhami saka ',
    aboutText2: ' kanthi sawetara tambahan fitur kayata gunggung aksara sing variatif (4-8 aksara) lan tampilan sing unik.',
    aboutText3: 'Aplikasi mini-game iki kula damel kanggo wong-wong sing pengin lan kepengin sinau basa Jawa.',
    aboutSupport: 'Yen sampeyan seneng dolanan iki lan pengin ndhukung karya kula, mangga dipunpenggalihaken kagem nraktir kula liwat Saweria♥️.',
    supportButton: 'Dukung ing Saweria ♥️',
    close: 'Tutup',
    metaTitle: 'Tebak Tembung - Dolanan Tebak Tembung Basa Jawa Saben Dina',
    metaDesc: 'Ayo asah kepinteran basa Jawa sampeyan nganggo Tebak Tembung. Dolanan tebak tembung saben dina sing gayeng kanggo sinau kosakata basa Jawa.',
  },
  en: {
    title: 'WORD GUESS',
    howToPlay: 'How to Play',
    description: 'Guess the Javanese word. You have 6 attempts.',
    correct: 'Letter is correct and in the right spot.',
    present: 'Letter is correct but in the wrong spot.',
    absent: 'Letter is not in the word.',
    start: 'Start Playing',
    tooShort: 'Not enough letters!',
    notFound: 'Word not found!',
    won: 'Congrats! You got it!',
    lost: 'Oops! Out of attempts.',
    theWordWas: "Today's word was:",
    share: 'Share Result',
    copied: 'Result copied to clipboard!',
    nextWord: 'New word available tomorrow!',
    nextWordTimer: 'Next word in:',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    hint: 'Hint',
    back: 'Back to Game',
    meaning: 'Meaning / Definition:',
    statistics: 'Statistics',
    played: 'Played',
    winRate: 'Win %',
    currentStreak: 'Current Streak',
    bestStreak: 'Best Streak',
    history: 'Game History',
    timezone: 'Timezone',
    updateInfo: 'The word is updated daily following Java Time (UTC+7).',
    aboutTitle: 'About Tebak Tembung',
    aboutText1: 'Tebak Tembung is my personal project inspired by ',
    aboutText2: ' with several added features such as varied word lengths (4-8 letters) and a unique look.',
    aboutText3: 'I created this mini-game app for people who want and are interested in learning the Javanese language.',
    aboutSupport: 'If you enjoy this game and would like to support my work, please consider treating me via Saweria♥️.',
    supportButton: 'Support on Saweria ♥️',
    close: 'Close',
    metaTitle: 'Tebak Tembung - Daily Javanese Word Guessing Game',
    metaDesc: 'Master Javanese vocabulary with Tebak Tembung. A fun daily word game designed for anyone wanting to learn Javanese language in an engaging way.',
  }
};

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

interface Guess {
  word: string;
  statuses: LetterStatus[];
}

interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  lastWinDate: string | null;
  history: {
    date: string;
    word: string;
    won: boolean;
    attempts: number;
  }[];
}

const DEFAULT_STATS: Statistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastWinDate: null,
  history: [],
};

export default function App() {
  const [targetWord, setTargetWord] = useState('');
  const [wordLength, setWordLength] = useState(5);
  const [hints, setHints] = useState<Record<string, string>>({});
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showResult, setShowResult] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<Statistics>(() => {
    const saved = localStorage.getItem('tebak-tembung-stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_STATS, ...parsed, history: parsed.history || [] };
    }
    return DEFAULT_STATS;
  });
  const [message, setMessage] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('tebak-tembung-lang') as Language) || 'jv');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('tebak-tembung-theme') as Theme) || 'dark');
  const [timezone, setTimezone] = useState<number>(() => {
    const saved = localStorage.getItem('tebak-tembung-timezone');
    return saved ? parseInt(saved) : 7; // Default to UTC+7
  });
  const [timeToNext, setTimeToNext] = useState('');
  
  const adsenseClient = import.meta.env.VITE_ADSENSE_CLIENT;

  const t = TRANSLATIONS[language];

  const getDateInTimezone = (offset: number) => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * offset));
  };

  // Timer for next word (Fixed to UTC+7 Java Time)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      
      // Calculate current time in UTC+7
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const javaTime = new Date(utc + (3600000 * 7));
      
      // Calculate next midnight in UTC+7
      const nextMidnightJava = new Date(javaTime);
      nextMidnightJava.setHours(24, 0, 0, 0);
      
      const diff = nextMidnightJava.getTime() - javaTime.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeToNext(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save timezone
  useEffect(() => {
    localStorage.setItem('tebak-tembung-timezone', timezone.toString());
  }, [timezone]);

  // Update SEO Meta Tags dynamically
  useEffect(() => {
    document.title = t.metaTitle;
    
    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', t.metaDesc);

    // Update Open Graph tags
    const updateOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOgTag('og:title', t.metaTitle);
    updateOgTag('og:description', t.metaDesc);
    updateOgTag('og:type', 'website');
    updateOgTag('og:url', window.location.href);

    // Schema.org JSON-LD
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": "Tebak Tembung",
      "description": t.metaDesc,
      "genre": "Word Game",
      "inLanguage": ["jv", "id", "en"],
      "author": {
        "@type": "Person",
        "name": "Akkun"
      }
    };

    let scriptTag = document.querySelector('#schema-ld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-ld';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);

  }, [t]);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tebak-tembung-theme', theme);
  }, [theme]);

  // Save language
  useEffect(() => {
    localStorage.setItem('tebak-tembung-lang', language);
  }, [language]);

  // Initialize game with daily word from Server API
  useEffect(() => {
    const initGame = async () => {
      try {
        console.log("Fetching daily word...");
        const res = await fetch('/api/daily-word');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        console.log("Daily word data received:", data);
        
        if (!data.word) throw new Error("No word in data");

        setTargetWord(data.word.toUpperCase());
        setWordLength(data.word.length);
        
        const receivedHints = data.hints || { 
          jv: 'Pituduh ora kasedhiya', 
          id: 'Petunjuk tidak tersedia', 
          en: 'Hint not available' 
        };
        setHints(receivedHints);
        
        const today = format(getDateInTimezone(timezone), 'yyyy-MM-dd');
        // Check local storage for today's progress
        const saved = localStorage.getItem(`tebak-tembung-${today}`);
        if (saved) {
          const { guesses: savedGuesses, state } = JSON.parse(saved);
          setGuesses(savedGuesses);
          setGameState(state);
          if (state !== 'playing') {
            setShowResult(true);
          }
        }
      } catch (error) {
        console.error("Init error:", error);
        setMessage("Gagal nyambung menyang server. Coba refresh kaca iki.");
      } finally {
        setIsLoading(false);
      }
    };

    initGame();
  }, []);

  // Save stats
  useEffect(() => {
    localStorage.setItem('tebak-tembung-stats', JSON.stringify(stats));
  }, [stats]);

  // Save progress
  useEffect(() => {
    if (targetWord) {
      const today = format(getDateInTimezone(timezone), 'yyyy-MM-dd');
      localStorage.setItem(`tebak-tembung-${today}`, JSON.stringify({
        guesses,
        state: gameState
      }));
    }
  }, [guesses, gameState, targetWord]);

  const showToast = (msg: string, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  };

  const checkGuess = (guess: string): LetterStatus[] => {
    const statuses: LetterStatus[] = Array(wordLength).fill('absent');
    const targetArr = targetWord.split('');
    const guessArr = guess.split('');

    // First pass: Correct positions
    guessArr.forEach((char, i) => {
      if (char === targetArr[i]) {
        statuses[i] = 'correct';
        targetArr[i] = ''; // Mark as used
      }
    });

    // Second pass: Present but wrong position
    guessArr.forEach((char, i) => {
      if (statuses[i] !== 'correct') {
        const targetIndex = targetArr.indexOf(char);
        if (targetIndex !== -1) {
          statuses[i] = 'present';
          targetArr[targetIndex] = ''; // Mark as used
        }
      }
    });

    return statuses;
  };

  const onKeyPress = useCallback((key: string) => {
    if (gameState !== 'playing') return;

    if (key === 'ENTER') {
      if (currentGuess.length !== wordLength) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        showToast(t.tooShort);
        return;
      }

      /* 
      // Optional: Remove or relax this check to allow any 5-letter word
      */

      const statuses = checkGuess(currentGuess);
      const newGuesses = [...guesses, { word: currentGuess, statuses }];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === targetWord) {
        setGameState('won');
        setShowResult(true);
        
        // Update stats
        setStats(prev => {
          const newStreak = prev.currentStreak + 1;
          const newHistory = [
            {
              date: format(getDateInTimezone(timezone), 'yyyy-MM-dd'),
              word: targetWord,
              won: true,
              attempts: newGuesses.length
            },
            ...prev.history
          ].slice(0, 10); // Keep last 10

          return {
            ...prev,
            gamesPlayed: prev.gamesPlayed + 1,
            gamesWon: prev.gamesWon + 1,
            currentStreak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak),
            lastWinDate: format(getDateInTimezone(timezone), 'yyyy-MM-dd'),
            history: newHistory
          };
        });

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#4ade80', '#ffffff']
        });
        showToast(t.won);
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameState('lost');
        setShowResult(true);
        
        // Update stats
        setStats(prev => {
          const newHistory = [
            {
              date: format(getDateInTimezone(timezone), 'yyyy-MM-dd'),
              word: targetWord,
              won: false,
              attempts: MAX_ATTEMPTS
            },
            ...prev.history
          ].slice(0, 10);

          return {
            ...prev,
            gamesPlayed: prev.gamesPlayed + 1,
            currentStreak: 0,
            history: newHistory
          };
        });

        showToast(`${t.theWordWas} ${targetWord}`);
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameState, guesses, targetWord]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        onKeyPress(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  const getLetterClass = (status: LetterStatus) => {
    switch (status) {
      case 'correct': return 'bg-jawa-correct border-jawa-correct text-white';
      case 'present': return 'bg-jawa-present border-jawa-present text-white';
      case 'absent': return 'bg-jawa-absent border-jawa-absent text-white';
      default: return 'border-[var(--border-app)] text-[var(--text-app)]';
    }
  };

  const getKeyStatus = (key: string): LetterStatus => {
    let bestStatus: LetterStatus = 'empty';
    guesses.forEach(g => {
      g.word.split('').forEach((char, i) => {
        if (char === key) {
          const status = g.statuses[i];
          if (status === 'correct') bestStatus = 'correct';
          else if (status === 'present' && bestStatus !== 'correct') bestStatus = 'present';
          else if (status === 'absent' && bestStatus === 'empty') bestStatus = 'absent';
        }
      });
    });
    return bestStatus;
  };

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
        <Loader2 className="w-12 h-12 text-jawa-gold animate-spin" />
      </div>
    );
  }

  const displayHint = () => {
    if (!hints || Object.keys(hints).length === 0) return '...';
    return hints[language] || hints['jv'] || hints['id'] || hints['en'] || '...';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col lg:flex-row justify-center items-start lg:gap-16 xl:gap-24 p-2 sm:p-4">
      {/* Sidebar Ad (Left - Desktop Only) */}
      <aside className="hidden lg:block w-48 xl:w-64 sticky top-4">
        <div className="h-[600px] flex flex-col items-center justify-center text-jawa-gold/20 text-[10px] text-center p-4">
          {/* Ad Space */}
        </div>
      </aside>

      {/* Main Game Content */}
      <div className="flex flex-col items-center w-full max-w-md relative">
        {/* Header */}
      <header className="w-full flex items-center justify-between border-b border-[var(--border-app)] pb-2 sm:pb-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-1">
          <button onClick={() => setShowHelp(true)} className="p-1.5 sm:p-2 hover:bg-jawa-gold/10 rounded-full transition-colors" title={t.howToPlay}>
            <Info className="w-5 h-5 sm:w-6 sm:h-6 text-jawa-gold/60" />
          </button>
          <button onClick={() => setShowAbout(true)} className="p-1.5 sm:p-2 hover:bg-red-500/10 rounded-full transition-colors" title="About">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500/60 fill-red-500/10" />
          </button>
        </div>

        <h1 className="text-xl sm:text-3xl font-black tracking-tighter text-jawa-gold text-center flex-1 drop-shadow-sm">
          TEBAK TEMBUNG
        </h1>

        <div className="flex items-center gap-1">
          <button onClick={() => setShowStats(true)} className="p-1.5 sm:p-2 hover:bg-jawa-gold/10 rounded-full transition-colors" title={t.statistics}>
            <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 text-jawa-gold/60" />
          </button>
          
          {gameState !== 'playing' && (
            <button 
              onClick={() => setShowResult(true)} 
              className="p-1.5 sm:p-2 bg-jawa-gold/10 hover:bg-jawa-gold/20 rounded-full transition-colors animate-pulse"
              title={t.share}
            >
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-jawa-gold" />
            </button>
          )}

          <button onClick={() => setShowSettings(true)} className="p-1.5 sm:p-2 hover:bg-jawa-gold/10 rounded-full transition-colors" title={t.settings}>
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-jawa-gold/60" />
          </button>
        </div>
      </header>

      {/* Hint */}
      <div className="mb-4 sm:mb-6 text-center px-6 py-3 bg-jawa-gold/10 rounded-2xl border border-jawa-gold/20">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-jawa-gold font-black">{t.hint}</span>
        <p className="text-lg sm:text-xl font-bold text-[var(--text-app)] leading-tight mt-1">{displayHint()}</p>
      </div>

      {/* Grid */}
      <div className="flex-1 flex flex-col gap-1.5 sm:gap-2 mb-6 sm:mb-8 justify-center">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
          const guess = guesses[i];
          const isCurrent = i === guesses.length;
          const word = isCurrent ? currentGuess.padEnd(wordLength, ' ') : (guess?.word || ' '.repeat(wordLength));
          
          return (
            <div key={i} className={cn("flex gap-1.5 sm:gap-2", isCurrent && shake && "animate-shake")}>
              {word.split('').map((char, j) => {
                const status = guess ? guess.statuses[j] : 'empty';
                return (
                  <motion.div
                    key={j}
                    initial={false}
                    animate={guess ? { rotateX: 360 } : {}}
                    transition={{ delay: j * 0.1, duration: 0.5 }}
                    className={cn(
                      "w-12 h-12 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-xl sm:text-2xl font-black rounded-xl uppercase transition-all duration-500 shadow-sm",
                      wordLength > 6 ? "w-10 h-10 sm:w-14 sm:h-14 text-lg sm:text-xl" : "",
                      getLetterClass(status),
                      isCurrent && char !== ' ' && "border-jawa-gold scale-110 shadow-lg shadow-jawa-gold/30"
                    )}
                  >
                    {char !== ' ' ? char : ''}
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Keyboard */}
      <div className="w-full flex flex-col gap-1.5 sm:gap-2 pb-2 sm:pb-0">
        {keyboardRows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1 sm:gap-1.5 px-1">
            {row.map(key => {
              const status = getKeyStatus(key);
              const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
              return (
                <button
                  key={key}
                  onClick={() => onKeyPress(key)}
                  className={cn(
                    "h-12 sm:h-14 flex items-center justify-center font-bold rounded-md transition-all active:scale-95 touch-manipulation",
                    isSpecial 
                      ? "px-2 sm:px-4 text-[10px] sm:text-xs bg-[var(--key-bg)] text-[var(--key-text)] min-w-[3.5rem] sm:min-w-[4rem]" 
                      : "flex-1 sm:w-9 text-xs sm:text-sm max-w-[2.5rem]",
                    status === 'correct' && "bg-jawa-correct text-white",
                    status === 'present' && "bg-jawa-present text-white",
                    status === 'absent' && "bg-[var(--key-bg)] opacity-40 text-[var(--key-text)]",
                    status === 'empty' && "bg-[var(--key-bg)] text-[var(--key-text)]"
                  )}
                >
                  {key === 'BACKSPACE' ? <Delete className="w-4 h-4" /> : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
        <footer className="w-full py-6 mt-auto text-center border-t border-[var(--border-app)]">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            Made with love by 
            <a 
              href="https://github.com/kuro08/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-jawa-gold font-bold hover:underline flex items-center gap-0.5"
            >
              Akkun <ExternalLink className="w-3 h-3" />
            </a> 
            ♥️
          </p>
        </footer>

        {/* Mobile Ad Space (Below Footer) */}
        <div className="lg:hidden w-full py-4 flex justify-center">
          <div className="w-full max-w-[320px] h-[100px] flex items-center justify-center text-jawa-gold/20 text-[10px]">
            {/* Ad Space */}
          </div>
        </div>
      </div>

      {/* Sidebar Ad (Right - Desktop Only) */}
      <aside className="hidden lg:block w-48 xl:w-64 sticky top-4">
        <div className="h-[600px] flex flex-col items-center justify-center text-jawa-gold/20 text-[10px] text-center p-4">
          {/* Ad Space */}
        </div>
      </aside>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[var(--bg-app)] border border-[var(--border-app)] p-6 sm:p-8 rounded-2xl max-w-sm w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setShowHelp(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-jawa-gold">{t.howToPlay}</h2>
              <p className="text-lg text-[var(--text-app)] opacity-70 mb-4">
                {t.description}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-jawa-correct flex items-center justify-center font-bold rounded text-white">A</div>
                  <p className="text-base text-[var(--text-app)] opacity-70">{t.correct}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-jawa-present flex items-center justify-center font-bold rounded text-white">B</div>
                  <p className="text-base text-[var(--text-app)] opacity-70">{t.present}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-jawa-absent flex items-center justify-center font-bold rounded text-white">C</div>
                  <p className="text-base text-[var(--text-app)] opacity-70">{t.absent}</p>
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-[var(--text-app)] opacity-50 mt-8 text-center italic">
                * {t.updateInfo}
              </p>
              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-2 bg-jawa-gold text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                {t.start}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[var(--bg-app)] border border-[var(--border-app)] p-6 sm:p-8 rounded-2xl max-w-sm w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-jawa-gold">{t.settings}</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{t.language}</span>
                  <div className="flex gap-2 bg-[var(--key-bg)] p-1 rounded-lg">
                    {(['id', 'jv', 'en'] as Language[]).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={cn(
                          "px-3 py-1 rounded-md text-sm font-bold transition-all",
                          language === lang ? "bg-jawa-gold text-black" : "text-gray-500"
                        )}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{t.theme}</span>
                  <button
                    onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                    className="w-12 h-6 bg-[var(--key-bg)] rounded-full relative transition-colors"
                  >
                    <motion.div
                      animate={{ x: theme === 'dark' ? 24 : 4 }}
                      className="absolute top-1 w-4 h-4 bg-jawa-gold rounded-full"
                    />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold">{t.timezone}</span>
                  <select 
                    value={timezone} 
                    onChange={(e) => setTimezone(parseInt(e.target.value))}
                    className="w-full p-2 bg-[var(--key-bg)] text-[var(--text-app)] rounded-lg border border-[var(--border-app)] font-bold outline-none"
                  >
                    {Array.from({ length: 25 }).map((_, i) => {
                      const offset = i - 12;
                      return (
                        <option key={offset} value={offset}>
                          UTC {offset >= 0 ? '+' : ''}{offset}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full mt-8 bg-jawa-gold text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                OK
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Feedback: <a href="https://github.com/kuro08/tebak-tembung" target="_blank" rel="noopener noreferrer" className="text-jawa-gold hover:underline font-bold">Github</a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[var(--bg-app)] border border-[var(--border-app)] p-6 sm:p-8 rounded-2xl max-w-sm w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setShowStats(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold mb-8 text-center text-jawa-gold uppercase tracking-widest">{t.statistics}</h2>
              
              <div className="grid grid-cols-4 gap-2 mb-8">
                <div className="flex flex-col items-center p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                  <span className="text-2xl font-black text-[var(--text-app)]">{stats.gamesPlayed}</span>
                  <span className="text-[8px] uppercase text-gray-500 text-center leading-tight mt-1">{t.played}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                  <span className="text-2xl font-black text-[var(--text-app)]">
                    {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
                  </span>
                  <span className="text-[8px] uppercase text-gray-500 text-center leading-tight mt-1">{t.winRate}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                  <span className="text-2xl font-black text-[var(--text-app)]">{stats.currentStreak}</span>
                  <span className="text-[8px] uppercase text-gray-500 text-center leading-tight mt-1">{t.currentStreak}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                  <span className="text-2xl font-black text-[var(--text-app)]">{stats.bestStreak}</span>
                  <span className="text-[8px] uppercase text-gray-500 text-center leading-tight mt-1">{t.bestStreak}</span>
                </div>
              </div>

              {stats.history.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{t.history}</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {stats.history.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-app)]">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-jawa-gold">{item.word}</span>
                          <span className="text-[10px] text-gray-500">{format(new Date(item.date), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-400">{item.attempts} tries</span>
                          {item.won ? (
                            <CheckCircle2 className="w-4 h-4 text-jawa-correct" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowStats(false)}
                className="w-full bg-jawa-gold text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-jawa-gold/20"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {showResult && gameState !== 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[var(--bg-app)] border border-[var(--border-app)] p-6 sm:p-8 rounded-2xl max-w-sm w-full text-center max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {gameState === 'won' ? (
                <>
                  <Trophy className="w-16 h-16 text-jawa-gold mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">{t.won}</h2>
                </>
              ) : (
                <>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">{t.lost}</h2>
                </>
              )}

              <div className="my-6 p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-app)]">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">{t.theWordWas}</p>
                <p className="text-3xl font-black text-jawa-gold mb-3 tracking-widest">{targetWord}</p>
                <div className="h-px bg-[var(--border-app)] w-full mb-3" />
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t.meaning}</p>
                <p className="text-lg font-medium text-[var(--text-app)]">{displayHint()}</p>
              </div>

              <div className="mb-6 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t.nextWordTimer}</p>
                <p className="text-2xl font-mono font-bold text-jawa-gold">{timeToNext}</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    const emojiGrid = guesses.map(g => 
                      g.statuses.map(s => s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛').join('')
                    ).join('\n');
                    const text = `Tebak Tembung ${format(getDateInTimezone(timezone), 'dd/MM/yyyy')}\n${guesses.length}/${MAX_ATTEMPTS}\n\n${emojiGrid}`;
                    navigator.clipboard.writeText(text);
                    showToast(t.copied);
                  }}
                  className="w-full bg-jawa-gold text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Share2 className="w-4 h-4" /> {t.share}
                </button>

                <button
                  onClick={() => setShowResult(false)}
                  className="w-full bg-[var(--key-bg)] text-[var(--text-app)] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  {t.back}
                </button>

                <p className="text-xs text-gray-500 mt-2">{t.nextWord}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-md font-bold shadow-xl z-[100]"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[110]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[var(--bg-app)] border border-[var(--border-app)] p-6 sm:p-8 rounded-2xl max-w-sm w-full relative"
            >
              <button
                onClick={() => setShowAbout(false)}
                className="absolute top-4 right-4 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-jawa-gold">{t.aboutTitle}</h2>
                
                <div className="text-sm text-[var(--text-app)] leading-relaxed space-y-4 text-left">
                  <p>
                    {t.aboutText1}
                    <a href="https://github.com/cwackerfuss/react-wordle" target="_blank" rel="noopener noreferrer" className="text-jawa-gold font-bold hover:underline">Open Source Version Wordle</a>
                    {' dan '}
                    <a href="https://tlembung.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-jawa-gold font-bold hover:underline">Temblung</a>
                    {t.aboutText2}
                  </p>
                  
                  <p>
                    {t.aboutText3}
                  </p>
                  
                  <p className="p-3 bg-jawa-gold/5 border border-jawa-gold/20 rounded-xl italic">
                    "{t.aboutSupport}"
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <a 
                    href="https://saweria.co/akkun08" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-jawa-gold text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    {t.supportButton}
                  </a>
                  <button
                    onClick={() => setShowAbout(false)}
                    className="w-full bg-[var(--key-bg)] text-[var(--text-app)] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
