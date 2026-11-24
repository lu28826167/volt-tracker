# VOLT Workout Tracker — setup guide (beginner friendly)

This folder is a complete app. You don't need to write or change any code. Follow the steps below once and you'll have VOLT on your Samsung home screen, opening without a browser address bar and working offline.

**What's in the folder (all 10 files go together, at the top level):**

| File | What it is |
|---|---|
| `index.html` | The whole app (your tracker, timers, rest timer, history, backups) |
| `manifest.webmanifest` | Tells Android the app's name, icon and full-screen mode |
| `sw.js` | Service worker: makes the app work offline and sends rest notifications |
| `icon-192.png`, `icon-512.png` | App icons |
| `icon-maskable-192.png`, `icon-maskable-512.png` | Icons Samsung can crop into its own shape |
| `apple-touch-icon.png`, `favicon-32.png` | Small extra icons |
| `README.md` | This guide |

---

## Part 1 — Move your history out of the OLD tracker (do this first)

Your old `VOLT_Workout_Tracker_Timer_v2.html` saved data inside whatever browser you opened it in. The new app will live at a new web address, and **browsers never share saved data between different addresses**, so nothing transfers on its own.

1. On the device where you've been using the old tracker, open the old HTML file the same way you usually do (same browser).
2. Scroll to the bottom → tap **Export backup (.json)**. A file named like `VOLT_backup_2026-11-23.json` lands in **Downloads**.
3. Check that the file exists (Samsung **My Files → Downloads**). If you used the old tracker on a computer, send the file to your phone (email it to yourself or put it in Google Drive).
4. Keep this file. You'll import it in Part 4.

> If the old tracker shows no workouts, there's nothing to move and you can skip this.

---

## Part 2 — Put the app on GitHub (free)

It's easiest on a computer. A phone can do it too (see the tip at the end of this part).

1. **Unzip** `VOLT-Tracker.zip`. You'll get a folder with the 10 files.
2. Go to **https://github.com** → **Sign up** (free). Pick your username carefully, because it becomes part of your app's address.
3. Once signed in, click **+** (top right) → **New repository**.
   - **Repository name:** `volt-tracker` (lowercase, no spaces).
   - Choose **Public**. Free GitHub Pages needs a public repository. Your *workout data* never goes to GitHub; only the app code does.
   - Leave everything else as is → **Create repository**.
4. On the new empty repository page, click the link **"uploading an existing file"**. If you don't see it: **Add file → Upload files**.
5. Open the unzipped folder, select **all 10 files** (not the folder itself) and drag them into the upload box.
   - ✅ Correct: the repository's file list shows `index.html`, `sw.js`, etc. directly.
   - ❌ Wrong: you only see a folder called `VOLT-Tracker`. If that happens, delete it and upload the files themselves.
6. Scroll down → **Commit changes**.

**Phone-only tip:** In Samsung **My Files**, long-press the zip → **Extract**. In Chrome, open github.com, tap **⋮ → Desktop site**, and follow the same steps. In the upload screen, use "choose your files" and multi-select all 10 files.

---

## Part 3 — Turn on GitHub Pages and get your app's address

1. In your repository, click **Settings** (top tab bar; on a phone it may be under the **⋯** menu).
2. In the left menu, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose **main** and folder **/ (root)** → **Save**.
5. Wait 1–3 minutes, then refresh the page. A box appears: **"Your site is live at …"**

Your app address will be:

```
https://YOUR-USERNAME.github.io/volt-tracker/
```

(Use your real GitHub username, all lowercase, and **keep the slash at the end**.) It's HTTPS automatically.

Open that address on your computer once to check it loads. If you see a 404 error, wait another minute. If it still fails, check that `index.html` sits at the top of the repository (step 5 of Part 2).

---

## Part 4 — Install it on your Samsung Galaxy

1. On the phone, open **Chrome** (use Chrome, not Samsung Internet, for the most reliable install and notifications).
2. Go to `https://YOUR-USERNAME.github.io/volt-tracker/`.
3. Install:
   - Tap the **Install** button at the top of the app, **or**
   - Tap Chrome's **⋮** menu → **Add to Home screen** → **Install** (it may say **Install app**).
4. Find the **VOLT** icon on your home screen or in the app drawer. Open it from there. It opens full-screen with no address bar.
5. **Import your old history:** on the Workout screen tap **Import backup →** (or go to the **History** tab → **Import backup**). Pick the `.json` file from Part 1, then confirm. Your workouts, logs, goals and increments come back.
6. Open **Settings** (bottom tab) and set up the rest timer:
   - **Sound** and **Vibration**: on by default. **Chime volume** and **Sharp tone** are there too.
   - **Notifications**: turn on and tap **Allow** when Android asks.
   - Tap **Test notification (10 s)**, then lock your phone. You should see a notification.
   - Optional: **Keep screen on during workouts**. This is the most reliable way to get rest alerts on time.
7. Samsung battery tip (helps background alerts): **Settings → Apps → Chrome → Battery → Unrestricted**. Also check **Settings → Apps → Chrome → Notifications → Allowed**.

---

## How the app is laid out

- **Workout tab:** the day chips at the top (today has a dot), today's exercises, and a big **Start Workout** button. Each exercise shows its suggested weight: **▲ green** = you hit your rep goal last time, so go heavier. **= amber** = you missed it, so keep the same weight. **new** = no history yet.
- **During a workout:** each exercise has a Hevy-style table: **SET · PREVIOUS · LBS · REPS · ✓**.
  - **PREVIOUS** shows what you did last time for that set (e.g. `45 × 10`).
  - **LBS** is pre-filled in grey with the suggested weight for that set. Type to change it, or leave it and tap ✓ to use the suggestion. Each set can have its own weight.
  - A coloured chip under the exercise name tells you straight away whether you hit last time (**▲ Hit 30/30 last time → +5 lb**) or missed (**● Missed 27/30 last time → same weight**).
  - The line under the sets keeps a running total (**22 / 30 reps**) and turns green with **✓ Goal hit → +5 lb next time** once you reach the goal.
  - **⋮** on an exercise opens its options: rest time, rep goal, weight step, move up/down, remove last set, remove exercise. Tapping the **⏱ rest chip** opens the same options.
- **History tab:** past workouts (tap one for details or to delete it), exercise progress, and backups.
- **Settings tab:** rest timer options, routine editor, storage status.

## How progression works

- Each exercise has one **total-rep goal**, the sum of reps across all its sets. There are no per-set rep targets.
- Hit the goal → next time every set is suggested **+ the weight step** (e.g. 45/50/50 → 50/55/55). Miss it → the same weights are suggested again.
- **Exercises with the same name AND the same number of sets share progression.** Friday's and Sunday's 4-set *Lateral Raise (Machine)* are one progression; Tuesday's 5-set one is separate. The same goes for any exercise that appears on more than one day.
- If you change the number of sets for an exercise, it joins the progression of any other exercise with that name and set count, or starts fresh if there isn't one.

## Using the rest timer

- Type your reps as usual. Typing **never** starts the timer.
- When you finish a set, tap its **✓**. The rest countdown starts right away using that exercise's rest time.
- The big ring sits at the bottom of the screen, and you can keep logging while it runs. Its buttons:
  - **−15s / +15s** adjust the time.
  - **Pause / Resume** stop and restart the countdown.
  - **Skip Rest** ends it early.
  - **▾** shrinks it to a small bar.
- Tap ✓ again to un-mark a set. This doesn't start a timer.
- At zero you get a chime and vibration, and the ring shows **GO!**
- **Change rest times:** tap the **⏱** chip on an exercise during a workout, or use **Edit** on the Workout tab → *Rest (s)*. Each day's copy of an exercise has its own rest time.

**Starting rest times.** Your original file had no rest times, so these are starting values you can change:
- 150 s: main presses, pulldowns and rows
- 180 s: hack squat
- 120 s: secondary rows, pullover, back extension, leg curl, shoulder press
- 90 s: isolation (lateral raise, rear delt fly, curls, triceps, pec deck, leg extension, calves, crunch)

## Editing your routine

Tap **Edit** next to the workout name on the Workout tab (or **Settings → Edit routine**). Make your changes, then tap **Save**. **Cancel** throws away everything you changed since opening the editor.

- **Rename a workout:** tap its name (e.g. "Pull A") and type a new one.
- **Change its day of the week:** use the day dropdown. Choose *No set day* for a flexible workout. The app auto-selects today's workout based on these days.
- **Reorder workouts:** use the ↑ ↓ next to each workout. 🗑 deletes a workout. Your past workouts stay in history.
- **Add a workout day:** tap **+ Add workout day** at the bottom.
- **Exercises:** tap **▾ Edit exercises** on a workout. For each exercise you can:
  - **rename it.** If the same exercise is on other days, you're asked whether to rename it everywhere (it keeps sharing progression, and its history moves to the new name) or only on this day (it starts its own progression).
  - change **Sets** with − / +. The rep goal adjusts in proportion, and you can then type any goal you want.
  - change the **Rep goal**, the **weight step (+ lb)** and the **Rest** time
  - **↑ Up / ↓ Down** to reorder, or **✕** to remove it. Its history is kept.
- **+ Add exercise:** create a new one by name, or pick from your existing exercises. Picking an existing one keeps its weight history, so suggestions continue where you left off.
- **Reset to original VOLT program** brings back the original 95-set routine. Your workout history is kept.

**During a workout** (like Hevy):
- **+ Add Set** sits under each exercise's sets.
- **⋮** lets you remove the last set, move the exercise up or down, or remove it.
- **+ Add Exercise** is at the bottom of the list.
- Goal, weight step and rest changes are saved to your routine right away. Set, order and exercise changes only apply to today's workout. When you tap Finish, the app asks whether to save them to your routine too.

**Deleting workouts:** in the **History** tab, tap a workout, then **Delete this workout**. Its logs are removed, and weight suggestions go back to what they were before it. To wipe all history after testing, go to **Settings → Delete all workout history**. This keeps your routine and settings, and asks you to type DELETE first.

### What Android allows (honest limits)

- **The countdown is always correct.** It's based on the end time, so locking the phone, switching apps or closing VOLT never makes it drift. Reopen the app and it shows the right time.
- **With VOLT open on screen**, the chime, vibration and on-screen alert are reliable.
- **With the phone locked or VOLT in the background**, Android and Chrome may pause web apps to save battery. The background notification and chime are a **best effort**. They usually work for normal rests, but they can be late or missing, especially with battery saver on, rests over about 5 minutes, or if you swipe VOLT away. Vibration from the page itself only works while VOLT is on screen; the notification can still vibrate based on your phone's settings.
- The chime plays at **media volume**, not ringer volume.
- If you come back long after a rest ended, VOLT shows "Rest finished while you were away" instead of beeping late.

---

## Keeping your workout history safe

- Your data is saved **on your phone only**, in two places inside the app: the main database (IndexedDB) and a backup copy (local storage). It's saved every time you type, so closing the app, locking the phone, restarting the phone or refreshing the page doesn't lose anything. An unfinished workout reopens exactly where you left it.
- ⚠️ **These actions CAN erase your records:** clearing Chrome's browsing data or site data, clearing storage for `github.io`, "Clear storage" on Chrome in Android Settings, uninstalling the VOLT app, or a factory reset.
- **Export a backup every week or two:** History tab → **Export backup**. Save the file to Google Drive or email it to yourself. The app shows when you last exported.
- To restore on any phone: install VOLT → **Import backup** → pick the file.

---

## Updating the app later (history stays safe)

Your history lives on your phone, not in the GitHub files, so replacing the files never deletes it.

1. (Recommended) Export a backup first.
2. In your GitHub repository: **Add file → Upload files**, drag in the new file(s) with the **same names**, then **Commit changes**. GitHub replaces the old versions.
3. If `sw.js` was changed, its first line of code (`const VERSION = 'volt-v4.0.0'`) should get a new number, e.g. `volt-v4.0.1`. That tells phones to refresh the offline copy.
4. Wait about 1–2 minutes, then open VOLT while online. You'll get the new version, or a **"New version installed — Reload"** banner. Tap Reload. Your workout in progress is saved first.

**Don't** rename the repository or create a different one. Different address = a different app with empty storage. If you ever must move, export a backup first and import it in the new one.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| 404 page | Wait 2–3 min after enabling Pages; make sure `index.html` is at the top level of the repo; use the address ending in `/volt-tracker/` |
| No "Install" option | Use Chrome, open the exact `https://…github.io/volt-tracker/` address, reload once, then check ⋮ → Add to Home screen |
| Notification toggle won't turn on | Android Settings → Apps → Chrome → Notifications → Allow, then try again |
| No sound | Turn up **media** volume; in Settings tap "Test sound + vibration" |
| Doesn't open offline | Open the app once while online, then reload once; after that it works without signal |
| Import says "not a VOLT backup" | Pick the `.json` file exported from VOLT, not the `.csv` |
