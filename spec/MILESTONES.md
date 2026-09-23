# MILESTONES.md — איקס עיגול

## 1. מטרת המסמך

מסמך זה מגדיר את אבני הדרך המרכזיות לפיתוח אפליקציית **"איקס עיגול"**, בהתאם ל-PRD, למסמך הארכיטקטורה, למסמך העיצוב ול-Technology Stack שנבחר.

המטרה היא לחלק את הפיתוח למספר מצומצם של Milestones משמעותיים, הגיוניים וניתנים לבדיקה, כאשר כל Milestone מממש ככל האפשר **יכולת משתמש שלמה מקצה לקצה (Vertical Slice)** ולא שכבה טכנית מבודדת.

ה-Milestones מסודרים לפי סדר תלות הגיוני. כל Milestone חייב להיות ניתן להרצה, בדיקה ואישור לפני שממשיכים לבא אחריו.

---

## 2. כלל עבודה מחייב

> **לאחר השלמת כל Milestone, על ה-AI לעצור את הפיתוח ולהמתין לבדיקה ולאישור מפורש שלי (המפתח) לפני המעבר ל-Milestone הבא.**

אין להתחיל, להכין או לבצע את ה-Milestone הבא לפני קבלת אישור מפורש.

---

## 3. עקרונות לחלוקת ה-Milestones

- אין להוסיף פיצ'רים שאינם מופיעים במסמכי הפרויקט.
- אין ליצור Milestone נפרד לכל משימה טכנית קטנה.
- יש להעדיף Vertical Slices שמייצרים יכולת משתמש עובדת.
- כל Milestone כולל את ה-UI, הלוגיקה והבדיקות הנדרשות לאותה יכולת.
- אין ליצור Milestones נפרדים עבור Backend, Database או Authentication, משום שרכיבים אלה אינם קיימים במוצר.
- יש לשמור על התאמה ל-Mobile ול-Desktop ולכיוון RTL לאורך כל הפיתוח.
- העיצוב בכל Milestone צריך להתבסס על `DESIGN.md`, ה-Wireframes, ה-Mockups וה-Style Guide.
- בדיקות רלוונטיות לכל יכולת נכללות ב-Definition of Done של אותו Milestone ולא נדחות כולן לסוף.

---

# Milestone 1 — Application Shell, Navigation & Static Screens

## מטרה

להקים גרסה ראשונה עובדת של האפליקציה שבה המשתמש יכול לפתוח את האתר, לראות את מסך הבית, לנווט בין כל המסכים המרכזיים ולקבל את המבנה והסגנון הבסיסי של המוצר.

זהו ה-Vertical Slice הראשון משום שהוא מספק חוויית כניסה וניווט שלמה, גם לפני שלוגיקת המשחק הושלמה.

## מה יש לממש

- יצירת פרויקט React + TypeScript באמצעות Vite.
- הגדרת React Router ב-Declarative Mode.
- יצירת שלושת המסכים:
  - Home.
  - Game.
  - About.
- יצירת Layout וניווט קבוע בין:
  - בית.
  - משחק.
  - אודות.
- מסך Home:
  - כותרת "איקס עיגול".
  - תיאור קצר.
  - אלמנט חזותי של לוח איקס-עיגול בהתאם לעיצוב.
  - כפתור "התחל לשחק" שמעביר למסך המשחק.
- מסך About:
  - כותרת "אודות".
  - הטקסט: **"פותח על ידי איתי גולדנברג"**.
- מסך Game בשלב זה:
  - כותרת.
  - אזור לוח 3×3 במבנה הנכון.
  - ניווט.
  - אין עדיין צורך בלוגיקת משחק מלאה.
- התאמת הממשק ל-RTL.
- יישום בסיסי של ה-Style Guide:
  - רקע כהה.
  - טיפוגרפיה.
  - צבעי Neon Blue / Red.
  - כפתורים.
  - Panels.
  - Navigation state פעיל.
- Responsive בסיסי ל-Mobile ול-Desktop.
- תמיכה ב-Direct Navigation ל-`/`, `/game`, `/about`.

## התוצר המצופה

אפליקציית SPA עובדת שבה:

- האתר נפתח בצורה תקינה.
- המשתמש יכול לעבור בין כל שלושת המסכים.
- כפתור "התחל לשחק" מעביר למסך המשחק.
- העיצוב כבר מזוהה עם ה-Mockups וה-Style Guide.
- הפריסה עובדת הן ב-Mobile והן ב-Desktop.

## Definition of Done

Milestone זה נחשב מושלם כאשר:

- [ ] `npm run dev` מפעיל את האפליקציה ללא שגיאות.
- [ ] קיימים Routes תקינים עבור `/`, `/game`, `/about`.
- [ ] כל שלושת המסכים מוצגים ללא שגיאות.
- [ ] הניווט מופיע ועובד בכל המסכים.
- [ ] כפתור "התחל לשחק" מעביר ל-`/game`.
- [ ] המסך Home תואם למבנה שהוגדר ב-Wireframes.
- [ ] מסך About מציג "פותח על ידי איתי גולדנברג".
- [ ] כיוון המסמך וה-UI הוא RTL.
- [ ] אין Horizontal Scroll ב-Mobile.
- [ ] הפריסה נשארת תקינה ב-Desktop.
- [ ] Navigation active state מוצג בהתאם למסך הנוכחי.
- [ ] העיצוב הבסיסי תואם לשפה החזותית של `DESIGN.md`.
- [ ] קיימות בדיקות בסיסיות לניווט ולרינדור המסכים.
- [ ] אין Backend, Database, Authentication או API חיצוני.

### נקודת עצירה

בסיום Milestone 1 יש לעצור ולהמתין לאישור מפורש של המפתח לפני Milestone 2.

---

# Milestone 2 — Playable Game End-to-End

## מטרה

לאפשר למשתמש לשחק משחק איקס-עיגול מלא מקצה לקצה מול המחשב.

בסיום Milestone זה המשחק כבר צריך להיות **Playable**: המשתמש מבצע מהלך, המחשב מגיב, המשחק מזהה ניצחון/הפסד/תיקו, וניתן להתחיל משחק חדש.

## מה יש לממש

### Game State

- ייצוג Board של 9 תאים.
- המשתמש תמיד X.
- המחשב תמיד O.
- המשתמש תמיד מתחיל.
- ניהול State באמצעות `useReducer` / `useState` בהתאם לארכיטקטורה.

### Game Rules

- בחירת תא פנוי.
- מניעת בחירה בתא תפוס.
- זיהוי כל 8 רצפי הניצחון.
- זיהוי ניצחון של המשתמש.
- זיהוי ניצחון של המחשב.
- זיהוי תיקו.
- מניעת מהלכים לאחר Game Over.

### Computer Player

- זיהוי מהלך מנצח של המחשב.
- חסימת מהלך מנצח של המשתמש.
- בחירת מהלך אסטרטגי כאשר אין Win/Block.
- שימוש ב-controlled randomness כדי שהמחשב לא יהיה בלתי מנוצח.
- אין שימוש ב-Minimax מושלם.
- אין שימוש בשירות AI חיצוני.

### Computer Turn

- לאחר מהלך המשתמש הלוח ננעל.
- לאחר כ-500ms המחשב מבצע מהלך.
- בזמן זה לא ניתן ללחוץ על תא נוסף.
- הטיימר מתנקה כאשר יוצאים ממסך המשחק.

### Game Result

- הצגת הודעה מתאימה עבור:
  - ניצחון.
  - הפסד.
  - תיקו.
- שמירת הלוח במצבו הסופי.

### New Game

- כפתור "משחק חדש".
- איפוס כל מצב המשחק.
- המשתמש חוזר להיות הראשון.

## התוצר המצופה

המשתמש מסוגל:

1. לפתוח את מסך המשחק.
2. לבחור תא.
3. לראות X.
4. להמתין למהלך המחשב.
5. לראות O.
6. להמשיך עד ניצחון, הפסד או תיקו.
7. לראות הודעת תוצאה נכונה.
8. להתחיל משחק חדש.

## Definition of Done

Milestone זה נחשב מושלם כאשר:

- [ ] לוח 3×3 פעיל.
- [ ] המשתמש תמיד משחק X.
- [ ] המחשב תמיד משחק O.
- [ ] המשתמש תמיד מבצע את המהלך הראשון.
- [ ] לא ניתן לשחק בתא תפוס.
- [ ] לאחר מהלך המשתמש הלוח נחסם.
- [ ] המחשב מבצע מהלך לאחר כ-500ms.
- [ ] לא ניתן לבצע שתי לחיצות במהלך תור המחשב.
- [ ] כל 8 Winning Lines מזוהים נכון.
- [ ] ניצחון משתמש מזוהה נכון.
- [ ] ניצחון מחשב מזוהה נכון.
- [ ] תיקו מזוהה נכון.
- [ ] לא ניתן לבצע מהלך לאחר סיום משחק.
- [ ] "משחק חדש" מאפס את המשחק.
- [ ] לאחר reset המשתמש שוב מתחיל כ-X.
- [ ] המחשב יכול לנצח כאשר קיים מהלך ניצחון.
- [ ] המחשב יכול לחסום איום של המשתמש בהתאם ללוגיקת הקושי.
- [ ] המחשב אינו בלתי מנוצח.
- [ ] אין קריאות Network לצורך לוגיקת המשחק.
- [ ] קיימות Unit Tests לחוקי המשחק.
- [ ] קיימות Unit Tests ל-Computer Player.
- [ ] Randomness ניתן לבדיקה באופן דטרמיניסטי.
- [ ] קיימת בדיקת Integration למשחק מלא בסיסי.

### נקודת עצירה

בסיום Milestone 2 יש לעצור ולהמתין לאישור מפורש של המפתח לפני Milestone 3.

---

# Milestone 3 — Complete Game UX, Feedback & Visual Fidelity

## מטרה

להפוך את המשחק העובד מחוויה פונקציונלית לחוויית המשתמש המלאה שהוגדרה ב-PRD, ב-Wireframes וב-Mockups.

Milestone זה משלים את ה-Vertical Slice של המשחק באמצעות פידבק חזותי וקולי, אנימציות, Highlight של ניצחון, Mute/Unmute והתנהגות נכונה בעת ניווט.

## מה יש לממש

### Visual Feedback

- אנימציה קצרה להופעת X.
- אנימציה קצרה להופעת O.
- Highlight ברור לשלושת התאים המנצחים.
- שמירת הלוח במצב הסופי לאחר Game Over.
- Result message בהתאם למצב המשחק.

### Audio

באמצעות Web Audio API:

- צליל להצבת X.
- צליל להצבת O.
- צליל ניצחון.
- צליל הפסד.
- צליל תיקו.

### Mute / Unmute

- כפתור Sound בהתאם ל-Mockup.
- Mute מבטל את כל האפקטים הקוליים.
- Unmute מפעיל אותם מחדש.
- אין שמירה של מצב Mute ב-`localStorage`.
- Reload מחזיר לברירת המחדל.

### Navigation Behavior

- מעבר מ-Game ל-Home מאפס משחק פעיל.
- מעבר מ-Game ל-About מאפס משחק פעיל.
- חזרה ל-Game מציגה משחק חדש.
- טיימר של Computer Move לא ממשיך לפעול לאחר יציאה מהמסך.

### Final Visual Styling

יישום מלא ועקבי של `DESIGN.md`:

- Dark background.
- Neon Blue / Cyan.
- Neon Red.
- Glow.
- Game board styling.
- Primary/Secondary buttons.
- Navigation styling.
- Typography.
- Spacing.
- Border radius.
- Responsive behavior.
- Desktop layout.
- Mobile layout.

### UX Constraints

- אין להציג טקסט קבוע "התור שלך".
- אין להציג טקסט "המחשב חושב".
- חסימת הלוח בזמן תור המחשב היא החיווי להתנהגות זו.
- כל פעולה מרכזית צריכה להיות ברורה ללא הסבר נוסף.

## התוצר המצופה

האפליקציה נראית ומתנהגת קרוב ל-Mockups המאושרים, כולל:

- UI ניאוני מלא.
- אנימציות.
- סאונד.
- Mute.
- Winning highlight.
- Reset נכון בעת ניווט.
- התאמה מלאה ל-Mobile ול-Desktop.

## Definition of Done

Milestone זה נחשב מושלם כאשר:

- [ ] X מופיע עם אנימציה קצרה.
- [ ] O מופיע עם אנימציה קצרה.
- [ ] Winning Line מודגש חזותית.
- [ ] Result message ברורה.
- [ ] לוח המשחק נשאר במצב הסופי.
- [ ] X מפעיל SFX מתאים.
- [ ] O מפעיל SFX מתאים.
- [ ] Win מפעיל SFX מתאים.
- [ ] Loss מפעיל SFX מתאים.
- [ ] Draw מפעיל SFX מתאים.
- [ ] Mute מונע את כל ה-SFX.
- [ ] Unmute מחזיר את ה-SFX.
- [ ] מצב Mute אינו נשמר לאחר Reload.
- [ ] אין שימוש ב-localStorage.
- [ ] יציאה ממסך המשחק מאפסת את המשחק.
- [ ] חזרה למסך המשחק יוצרת Board חדש.
- [ ] אין עדכון State מטיימר לאחר unmount.
- [ ] אין טקסט "התור שלך" או "המחשב חושב".
- [ ] העיצוב תואם ל-Style Guide ול-Mockups.
- [ ] X מוצג באדום Neon.
- [ ] O מוצג בכחול/Cyan Neon.
- [ ] UI נשאר קריא ולא עמוס למרות אפקטי Glow.
- [ ] כל המסכים תקינים ב-Mobile.
- [ ] כל המסכים תקינים ב-Desktop.
- [ ] תאי המשחק נוחים ללחיצה במסכים קטנים.
- [ ] Focus ו-keyboard interaction בסיסיים עובדים בכפתורים.
- [ ] קיימות בדיקות Integration להתנהגות Mute, New Game ו-reset בניווט.

### נקודת עצירה

בסיום Milestone 3 יש לעצור ולהמתין לאישור מפורש של המפתח לפני Milestone 4.

---

# Milestone 4 — Installable PWA & Offline Game

## מטרה

לאפשר למשתמש להתקין את האפליקציה כ-PWA ולהמשיך להשתמש בכל יכולות המשחק גם ללא חיבור לאינטרנט לאחר שהאפליקציה נטענה/הותקנה כנדרש.

זהו Vertical Slice עצמאי של יכולת המשתמש **"לשחק גם Offline"**.

## מה יש לממש

### PWA

- `vite-plugin-pwa`.
- Workbox.
- `generateSW`.
- Web App Manifest.

### Manifest

להגדיר לכל הפחות:

- `name`.
- `short_name`.
- `lang: "he"`.
- `dir: "rtl"`.
- `start_url`.
- `display: "standalone"`.
- `theme_color`.
- `background_color`.
- icons בגודל 192×192 ו-512×512.

### Service Worker

- יצירה באמצעות Workbox.
- רישום תקין ב-Production build.
- Precache של App Shell.

### Offline Assets

יש להבטיח זמינות Offline של:

- Home.
- Game.
- About.
- JavaScript.
- CSS.
- PWA icons.
- כל asset מקומי הדרוש לאפליקציה.

### Constraints

- אין Offline sync.
- אין Database.
- אין IndexedDB.
- אין שמירת Game State.
- אין כפתור התקנה ייעודי בתוך האפליקציה.

## התוצר המצופה

לאחר טעינה/התקנה תקינה:

- האפליקציה מזוהה כ-PWA.
- ניתן להפעיל אותה במצב Standalone.
- ניתן לנתק את החיבור לאינטרנט.
- Home, Game ו-About עדיין עובדים.
- ניתן לשחק משחק מלא Offline.
- סאונד ולוגיקת המחשב ממשיכים לעבוד Offline.

## Definition of Done

Milestone זה נחשב מושלם כאשר:

- [ ] Production build מייצר Manifest תקין.
- [ ] קיימים icons מתאימים ל-PWA.
- [ ] Service Worker נרשם ב-HTTPS/Production.
- [ ] App Shell נכנס ל-precache.
- [ ] האפליקציה ניתנת להתקנה ב-Chrome כאשר תנאי הדפדפן מתקיימים.
- [ ] האפליקציה נפתחת ב-Standalone mode לאחר התקנה.
- [ ] Home עובד Offline.
- [ ] Game עובד Offline.
- [ ] About עובד Offline.
- [ ] ניתן להשלים משחק מלא ללא אינטרנט.
- [ ] Computer Player עובד ללא אינטרנט.
- [ ] Web Audio ממשיך לעבוד Offline.
- [ ] Reload במצב Offline אינו שובר את האפליקציה לאחר caching תקין.
- [ ] אין External API שנדרש בזמן Runtime.
- [ ] אין Backend dependency.
- [ ] אין שמירת Game State ב-Cache Storage.
- [ ] אין כפתור Install ייעודי באפליקציה.
- [ ] קיימת בדיקת Playwright/Chrome רלוונטית ל-Service Worker/Offline ככל שסביבת הבדיקה מאפשרת.

### נקודת עצירה

בסיום Milestone 4 יש לעצור ולהמתין לאישור מפורש של המפתח לפני Milestone 5.

---

# Milestone 5 — Production Release & Full Acceptance

## מטרה

להביא את המוצר למצב Production שבו ניתן לפתוח אותו דרך כתובת ציבורית, להשתמש בו ב-Chrome במובייל וב-Desktop, להתקין אותו כ-PWA, לשחק Online ו-Offline, ולעבור על כל קריטריוני ההצלחה של ה-PRD.

Milestone זה אינו מוסיף פיצ'רים חדשים. הוא מאמת ומסיים את המוצר הקיים.

## מה יש לממש

### Production Build

- Production build תקין באמצעות Vite.
- Build output סטטי ב-`dist/`.
- טיפול בכל warning/error משמעותי.

### Vercel Deployment

- Deployment סטטי.
- HTTPS.
- SPA routing.
- Direct navigation ל:
  - `/`
  - `/game`
  - `/about`
- Reload על route פנימי ללא 404.

### Final Verification

בדיקת כל חוויית המשתמש:

- Home.
- Navigation.
- Game.
- Computer move.
- Win.
- Loss.
- Draw.
- Winning highlight.
- New Game.
- Sound.
- Mute.
- Reset upon navigation.
- Mobile.
- Desktop.
- PWA.
- Offline.

### Automated Tests

- Unit tests ל-Domain Logic.
- Integration tests ל-UI/Gameplay.
- E2E tests לזרימות מרכזיות.
- Chrome/Chromium הוא ה-Browser הראשי לבדיקה בהתאם ל-PRD.

## התוצר המצופה

גרסת Production ציבורית ויציבה של האפליקציה, התואמת למסמכי הפרויקט ומוכנה לאישור סופי.

## Definition of Done

Milestone זה נחשב מושלם כאשר:

- [ ] `npm run build` מסתיים בהצלחה.
- [ ] האפליקציה פרוסה ב-Vercel.
- [ ] האתר נפתח דרך HTTPS.
- [ ] `/` עובד ב-Production.
- [ ] `/game` עובד ב-Direct Navigation.
- [ ] `/about` עובד ב-Direct Navigation.
- [ ] Reload על routes פנימיים אינו מחזיר 404.
- [ ] Home → Game עובד.
- [ ] Home → About עובד.
- [ ] Navigation עובד מכל מסך.
- [ ] משחק מלא ניתן להשלמה ב-Production.
- [ ] Win מזוהה נכון.
- [ ] Loss מזוהה נכון.
- [ ] Draw מזוהה נכון.
- [ ] Winning Line מוצג נכון.
- [ ] New Game עובד.
- [ ] Computer delay פועל כנדרש.
- [ ] board lock בזמן Computer Turn עובד.
- [ ] Audio עובד.
- [ ] Mute עובד.
- [ ] יציאה מ-Game מאפסת את המשחק.
- [ ] PWA installability עובדת ב-Chrome.
- [ ] Offline mode עובד לאחר caching/installation תקין.
- [ ] Mobile layout תקין.
- [ ] Desktop layout תקין.
- [ ] הממשק כולו בעברית וב-RTL.
- [ ] אין Backend.
- [ ] אין Database.
- [ ] אין Authentication.
- [ ] אין localStorage.
- [ ] אין External APIs.
- [ ] אין Analytics.
- [ ] כל הבדיקות האוטומטיות הרלוונטיות עוברות.
- [ ] אין פיצ'רים שאינם חלק מה-PRD.
- [ ] המוצר תואם ל-Wireframes, Mockups ו-Style Guide במידה שנקבעה במסמכי העיצוב.

### נקודת עצירה

בסיום Milestone 5 יש לעצור ולהמתין לבדיקה ולאישור הסופי והמפורש של המפתח.

---

# 4. סדר ותלויות

```text
Milestone 1
Application Shell + Navigation + Static Screens
        ↓
Milestone 2
Playable Game End-to-End
        ↓
Milestone 3
Complete Game UX + Audio + Visual Fidelity
        ↓
Milestone 4
Installable PWA + Offline
        ↓
Milestone 5
Production Release + Full Acceptance
```

### Dependency Rules

- Milestone 2 אינו מתחיל לפני אישור Milestone 1.
- Milestone 3 אינו מתחיל לפני אישור Milestone 2.
- Milestone 4 אינו מתחיל לפני אישור Milestone 3.
- Milestone 5 אינו מתחיל לפני אישור Milestone 4.
- אין לעקוף Milestone שלא אושר.
- אין להתחיל עבודה עתידית "במקביל" ללא אישור מפורש.

---

# 5. Scope Guard

ה-Milestones אינם כוללים ואסור להוסיף במסגרתם:

- Multiplayer.
- משחק מול משתמש אחר.
- שני שחקנים מקומיים.
- הרשמה.
- התחברות.
- Profile.
- Database.
- Backend.
- Game History.
- Statistics.
- Leaderboard.
- Difficulty selector.
- בחירת X/O.
- בחירת מי מתחיל.
- AI בלתי מנוצח.
- Minimax מושלם כחובת מוצר.
- שמירת משחק.
- localStorage.
- Analytics.
- External APIs.
- LLM / Generative AI.
- Push Notifications.
- כפתור Install PWA ייעודי.
- מסכי Settings נוספים.
- תמיכה מחייבת בדפדפנים מעבר ל-Chrome.

אם במהלך הפיתוח נדרש שינוי Scope, יש לעצור ולעדכן תחילה את מסמכי הפרויקט לפני שינוי המימוש.
