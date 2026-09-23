# CLAUDE.md — איקס עיגול

משחק איקס־עיגול 3×3 לשחקן יחיד מול המחשב. React SPA סטטית, Frontend בלבד, בעברית וב־RTL, מותאמת ל־Mobile ול־Desktop ב־Chrome, ניתנת להתקנה כ־PWA ועובדת Offline.

## מסמכי הפרויקט (Source of Truth)

כל ההחלטות כבר התקבלו בתיקיית `spec/`. יש לקרוא את המסמך הרלוונטי לפני מימוש:

| מסמך | תוכן |
|---|---|
| [spec/PRD.md](spec/PRD.md) | התנהגות מוצרית, Scope, מקרי קצה, Out of Scope |
| [spec/ARCHITECTURE.md](spec/ARCHITECTURE.md) | Stack, מבנה תיקיות, טיפוסים, Reducer, Computer Player, PWA, Testing |
| [spec/DESIGN.md](spec/DESIGN.md) | מסכים, Style Guide, צבעים, טיפוגרפיה, Glow, Responsive |
| [spec/MILESTONES.md](spec/MILESTONES.md) | 5 Milestones עם Definition of Done לכל אחד |
| `spec/wireframes.png`, `spec/mockups.png`, `spec/style-guide.png` | ייחוס חזותי — לבדוק לפני עבודת UI |

סדר עדיפות במקרה של סתירה: **PRD → ARCHITECTURE → Technology Stack → קוד קיים**.
אין להרחיב את המוצר על דעת עצמך. אם נדרש שינוי Scope — לעצור ולבקש לעדכן קודם את המסמכים.

## כלל עבודה מחייב — Milestones

- העבודה מתבצעת לפי [spec/MILESTONES.md](spec/MILESTONES.md), Milestone אחד בכל פעם, לפי הסדר.
- **בסיום כל Milestone — לעצור ולהמתין לאישור מפורש של המפתח** לפני שמתחילים את הבא. אין להכין, לפתוח או לבצע עבודה של Milestone עתידי "במקביל".
- כל Milestone הוא Vertical Slice: UI + לוגיקה + בדיקות. הבדיקות הן חלק מה־Definition of Done ולא נדחות לסוף.
- בסיום Milestone יש לעבור על רשימת ה־DoD שלו ולדווח במפורש מה הושלם ומה לא.

**סטטוס נוכחי:** Milestone 1 אושר. Milestone 2 מומש ומחכה לבדיקה ולאישור המפתח. אין להתחיל את Milestone 3 לפני אישור מפורש. (לעדכן שורה זו לאחר אישור כל Milestone.)

## Technology Stack (מחייב — אין להחליף)

TypeScript (`strict: true`) · React 19 · Vite 8 · React Router (Declarative Mode) · `useReducer`/`useState` · CSS / CSS Modules · Web Audio API · `vite-plugin-pwa` + Workbox `generateSW` · Vitest + React Testing Library · Playwright · Hosting: Vercel (סטטי בלבד).

Dependencies מותרים: `react`, `react-dom`, `react-router-dom`, `vite`, `@vitejs/plugin-react`, `typescript` (6.x — לא 7), `@types/react`, `@types/react-dom`, `vite-plugin-pwa`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test`. **אין להוסיף package נוסף ללא צורך ברור ואישור.**

הגופן Heebo מאוחסן מקומית ב־`src/assets/fonts/` (woff2, subsets עברית ולטינית). אין לטעון גופנים או משאבים מ־CDN, כי זה שובר את ה־Offline.

## פקודות

```bash
npm install
npm run dev        # שרת פיתוח (http://localhost:5173)
npm run build      # typecheck + build ל-dist/
npm run preview    # הרצת ה-build (נדרש לבדיקת Service Worker / Offline)
npm run typecheck  # tsc --noEmit
npm test           # Vitest (חד-פעמי); npm run test:watch למצב watch
npm run test:e2e   # Playwright — בונה ומריץ preview על פורט 4173, פרויקטים desktop-chrome ו-mobile-chrome
```

הרצת בדיקה בודדת: `npx vitest run src/app/AppRoutes.test.tsx` או `npx playwright test -g "<שם הבדיקה>"`.
בדיקות Unit ו־Integration נמצאות לצד הקוד (`*.test.tsx`), ובדיקות E2E בתיקייה `e2e/`.

## מבנה תיקיות

לפי [ARCHITECTURE.md §7](spec/ARCHITECTURE.md):

```text
src/
├─ app/            App.tsx, AppRoutes.tsx, app.css
├─ components/     layout/ (Layout, Navigation), ui/
├─ features/       home/, game/ (GamePage, GameBoard, GameCell, GameResult, NewGameButton, MuteButton), about/
├─ game/           Domain טהור: game.types, game.constants, game.reducer, game.rules, computer-player, game.initial-state
├─ services/       audio.service.ts
└─ main.tsx, index.css
public/            pwa-192x192.png, pwa-512x512.png, favicon.ico
```

אין ליצור `server/`, `api/`, `database/`, `auth/`, `repositories/`.

Routes: `/` Home · `/game` Game · `/about` About — כולם תחת `Layout` עם `<Outlet />`.

## החלטות ארכיטקטוניות מרכזיות

- **Domain מופרד מ־UI:** כל חוקי המשחק ובחירת מהלך המחשב ב־`src/game/` כפונקציות TypeScript טהורות, ללא React/DOM, עם Unit Tests.
- **Board:** מערך קבוע של 9 תאים (`CellValue = "X" | "O" | null`), 8 `WINNING_LINES` קבועים.
- **Game State חי בתוך `GamePage`** (`useReducer`). Unmount ביציאה מ־`/game` הוא מנגנון ה־reset — אין Global State / Context למשחק.
- **Invariants:** המשתמש תמיד X ותמיד מתחיל; המחשב תמיד O; אין שינוי תא שאינו `null`; אין מהלך כש־`isComputerTurn` או `status !== "playing"`; אין שני תורי מחשב במקביל. מהלך לא חוקי — מתעלמים בשקט (לא זורקים שגיאה).
- **תור המחשב:** `setTimeout` עם `COMPUTER_MOVE_DELAY_MS = 500` בתוך `useEffect`, עם `clearTimeout` ב־cleanup.
- **Computer Player:** Win → Block (בהסתברות) → Center → Corner/Strategic → Random. **אסור Minimax מושלם** — המחשב חייב להיות ניתן לניצחון. רמת קושי אחת, לא חשופה למשתמש. ערכי ההסתברות מוגדרים במקום אחד ב־constants.
- **Randomness ניתנת להזרקה:** `chooseComputerMove(board, random: RandomFn = Math.random)` — כדי שה־tests יהיו דטרמיניסטיים.
- **Audio:** צלילים מסונתזים ב־Web Audio API בלבד (ללא קבצי MP3/WAV). `AudioContext` נוצר/מופעל רק אחרי אינטראקציה. כשל Audio לא מפיל את המשחק.
- **Mute:** State בזיכרון בלבד; חוזר לברירת מחדל ב־Reload.
- **PWA:** `generateSW` בלבד (לא Service Worker ידני), Precache של ה־App Shell, manifest עם `lang: "he"`, `dir: "rtl"`, `display: "standalone"`. אין כפתור Install.
- **Vercel:** SPA rewrite ל־`index.html` כך ש־`/game` ו־`/about` עובדים ב־Direct Navigation וב־Reload, בלי לשבור static assets.

## איסורים (Scope Guard)

אין לממש או להוסיף — גם לא "כהכנה לעתיד":

- Backend, API Routes, Serverless Functions, Database, Authentication.
- `localStorage`, `sessionStorage`, IndexedDB, Cookies — לשום מטרה (כולל Mute).
- External APIs, Analytics, Monitoring, LLM / AI חיצוני, `fetch` בזמן משחק.
- Multiplayer, בחירת X/O, בחירת מי מתחיל, בורר רמת קושי, סטטיסטיקות, היסטוריה, Leaderboard, שמירת משחק, מסכי Settings/Login/Profile.
- טקסט "התור שלך" / "המחשב חושב" — הנעילה של הלוח היא החיווי.
- ספריות UI / Animation / State חיצוניות (Redux, Zustand, Framer Motion וכו').
- `dangerouslySetInnerHTML`.

## UI ועיצוב

- `<html lang="he" dir="rtl">`. כל הטקסטים בממשק בעברית.
- טקסטים קבועים: כותרת **"איקס עיגול"**, כפתורים **"התחל לשחק"** ו־**"משחק חדש"**, ניווט **בית / משחק / אודות**, מסך אודות: **"פותח על ידי איתי גולדנברג"**.
- סגנון ניאון/ארקייד כהה — פרטים מלאים ב־[DESIGN.md](spec/DESIGN.md). צבעי מפתח:
  - רקע `#0B0F1A` · Card `#111827` · Surface `#1F2937` · Border `#2D3B55` · טקסט משני `#94A3B8`
  - O / פעולות / ניווט פעיל: `#00E5FF`, `#007BFF` · X: `#FF2D55`, `#FF4757` · טקסט `#FFFFFF`
- להגדיר צבעים, מרווחים (בסיס 8px) ו־radius (8/12/16/24px) כ־CSS custom properties במקום אחד.
- לוח: CSS Grid 3×3, תאים עם `aspect-ratio: 1`, גודל עם `min()`/`clamp()`; ללא horizontal scroll ב־Mobile.
- אנימציות ב־CSS בלבד (כניסת X, כניסת O, Highlight לרצף המנצח), מבוססות classes / data attributes.
- נגישות בסיסית: תאים כ־`<button>`, `disabled` אמיתי בזמן נעילה, Focus states נשמרים, X/O מובחנים בצורה ולא רק בצבע.
- היררכיה חזותית: Game Board → Primary Action / Result → Title → Navigation → Supporting Text. Glow חזק שמור ללוח ולפעולה הראשית.

## Coding Guidelines

- TypeScript strict, בלי `any`, union types למצבים סגורים, בלי mutation ישיר של State.
- Functional Components + Hooks בלבד; Components קטנים; אין Game Logic משמעותי בתוך JSX.
- `GameBoard`/`GameCell` הם רכיבי תצוגה בלבד — מקבלים props ו־callback.
- קבועים מערכתיים (`COMPUTER_MOVE_DELAY_MS`, `PLAYER`, `COMPUTER`, הסתברויות) ב־`game.constants.ts`.
- בלי inline styles ל־styling משמעותי.

## בדיקות

- **Unit (Vitest):** `getWinner`, `getWinningLine`, `isDraw`, `isValidMove`, `getAvailableMoves`, `chooseComputerMove`, מעברי reducer. לכסות את כל 8 הקווים, תיקו, תא תפוס, מהלך אחרי Game Over, מחשב מנצח/חוסם, מחשב מחזיר רק תא חוקי.
- **Integration (RTL):** לחיצה מוסיפה X, נעילת לוח בתור מחשב, הודעת תוצאה, New Game, Highlight, Mute, ניווט ו־reset. להשתמש ב־fake timers עבור ה־500ms.
- **E2E (Playwright, Chromium):** זרימות Home→Game, משחק מלא, New Game, Game→About→Game מאפס, viewports של Mobile ו־Desktop, Direct Navigation ו־Reload, Offline (מול `npm run preview`).
- לפני דיווח על סיום Milestone — להריץ את כל הבדיקות הרלוונטיות ולדווח על התוצאה בפועל.
