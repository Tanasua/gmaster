# Публікація в Google Play — покроково

Усе, що можна було підготувати в репозиторії, вже готово. Нижче — кроки, які робиш ти (вони потребують твого акаунта).

## 0. Що вже є

| Що | Де |
|---|---|
| Підписаний AAB для Play | GitHub Actions → «Android release (AAB)» (після кроку 2) |
| Тестовий APK | GitHub Actions → «Android APK» → Artifacts |
| Тексти сторінки (17 мов) | `store/listings/<мова>.md` (назва ≤30, короткий опис ≤80, повний ≤4000) |
| Скриншоти телефона (17 мов × 4, 1080×2160) | `store/screenshots/<мова>/` |
| Банер 1024×500 (17 мов) | `store/feature-graphic/<мова>.jpg` |
| Іконка 512×512 | `store/icon-512.png` |
| Політика конфіденційності (uk/en) | `docs/privacy/` → https://tanasua.github.io/gmaster/privacy/ (після кроку 1) |

## 1. Увімкнути GitHub Pages (для політики конфіденційності)

1. GitHub → репозиторій `Tanasua/gmaster` → **Settings → Pages**.
2. **Source: GitHub Actions**.
3. **Actions → Pages → Run workflow**.
4. Перевір: https://tanasua.github.io/gmaster/privacy/ відкривається.

## 2. Ключ підпису (upload key)

Ключ створюєш ти і зберігаєш у себе. **Не публікуй його і не губи.** (Google Play App Signing зберігає власний ключ підпису застосунку; твій — лише ключ завантаження. Якщо його втратити, його можна скинути через підтримку Play Console, але це займає час.)

1. Встанови JDK 17+ (або Android Studio — `keytool` є в комплекті).
2. Створи ключ (придумай і запиши паролі):
   ```bash
   keytool -genkeypair -v -keystore upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```
3. Перетвори файл у текст base64:
   - macOS: `base64 -i upload.jks | pbcopy`
   - Linux: `base64 -w0 upload.jks`
   - Windows (PowerShell): `[Convert]::ToBase64String([IO.File]::ReadAllBytes("upload.jks")) | Set-Clipboard`
4. GitHub → **Settings → Secrets and variables → Actions → New repository secret**, додай чотири:
   - `ANDROID_KEYSTORE_BASE64` — текст із кроку 3
   - `ANDROID_KEYSTORE_PASSWORD` — пароль сховища
   - `ANDROID_KEY_ALIAS` — `upload`
   - `ANDROID_KEY_PASSWORD` — пароль ключа
5. **Actions → Android release (AAB) → Run workflow**, версія `1.0.0`. Готовий файл — у Artifacts запуску.
   `versionCode` збільшується автоматично з кожним запуском.

## 3. Акаунт розробника

- Play Console, разовий внесок $25.
- **Особистий акаунт, створений після 13.11.2023:** перед виходом у продакшн потрібне закрите тестування — **щонайменше 12 тестувальників, безперервно 14 днів** (див. крок 7).

## 4. Створити застосунок

- Назва: `Вгадай хід гросмейстера` (або англійська — мову за замовчуванням обираєш тут).
- Тип: **Гра**, безкоштовна.
- Категорія: **Ігри → Настільні** (Board), теги: шахи.
- Контактна пошта — обов'язкова й публічна (вкажи ту, яку готовий показувати).

## 5. Сторінка в Play (Store listing)

- **Main store listing** → мова за замовчуванням → вставити текст із `store/listings/<мова>.md`.
- Графіка: іконка `store/icon-512.png`, банер `store/feature-graphic/<мова>.jpg`, 4 скриншоти з `store/screenshots/<мова>/`.
- **Manage translations → Add your own translations** → додати решту мов, для кожної — тексти, банер і скриншоти тієї ж мови. Коди мов Play — у `store/listings/README.md`.

## 6. Розділ «App content» — готові відповіді

| Форма | Відповідь |
|---|---|
| **Privacy policy** | `https://tanasua.github.io/gmaster/privacy/` |
| **Ads** | Застосунок **не містить реклами** |
| **App access** | Увесь функціонал доступний без входу (All functionality is available without special access) |
| **Data safety** | «Does your app collect or share any of the required user data types?» → **No**. Дані (статистика, налаштування) зберігаються лише на пристрої й нікуди не передаються; входу й акаунтів немає |
| **Content rating** (анкета IARC) | Категорія — гра; насильства, страшного контенту, ненормативної лексики, азартних ігор, взаємодії між користувачами, покупок — **немає**. Очікуваний результат — найнижчий віковий рейтинг (на кшталт PEGI 3 / Everyone), але остаточно його визначає анкета |
| **Target audience** | Рекомендую для старту **13+** (або 18+). Якщо обрати вік молодше 13, застосунок підпадає під вимоги програми Families — ми їх формально не порушуємо (немає даних і реклами), але перевірка суворіша; це можна розширити пізніше |
| News app / Government / Financial features / Health | Ні |

## 7. Закрите тестування (12 тестувальників × 14 днів)

1. **Testing → Closed testing → Create track**.
2. Завантаж AAB із кроку 2, заповни примітки до релізу.
3. **Testers** → список адрес Gmail (мінімум 12 людей) → збережи → скопіюй **посилання для участі** і надішли тестувальникам. Кожен має прийняти запрошення й встановити гру з Play.
4. Тримай ≥12 учасників **14 днів поспіль** (якщо стане менше — відлік починається заново).
5. Після цього в **Dashboard** з'явиться **Apply for production** — відповідаєш на кілька питань про тестування й подаєш застосунок у продакшн.

## 8. Наступні оновлення

1. Зміни в коді → `Actions → Android release (AAB) → Run workflow` з новою версією (`1.0.1`, …).
2. Play Console → потрібний трек → **Create new release** → завантажити AAB.

## Що ще варто перевірити людині перед релізом

- Переклади (зроблені ШІ) — бажано показати носіям мов, особливо: назва фільму про Бонда в pt, термін 弃半子 у zh, назва фільму в ko, «počítač» як «рушій» у cs.
- Біографії та описи партій (`web/src/locales/*.json`, розділи `gms` і `games`).
- Ліцензії фото (CC BY / CC BY-SA вимагають зазначення автора — у застосунку це зроблено на головному екрані, «Фото гравців»).
- Умови використання архівів pgnmentor.com для комерційного застосунку.
