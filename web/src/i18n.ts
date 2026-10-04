import { createContext, useContext } from 'react'

export type Lang = 'uk' | 'en'

const STRINGS = {
  appTitle: { uk: 'Вгадай хід гросмейстера', en: 'Guess the Grandmaster\'s Move' },
  loading: { uk: 'Завантаження…', en: 'Loading…' },
  loadError: { uk: 'Не вдалося завантажити позиції', en: 'Could not load positions' },
  back: { uk: 'Назад', en: 'Back' },
  points: { uk: 'очок', en: 'pts' },
  streak: { uk: 'серія', en: 'streak' },

  // меню
  menuLead: { uk: 'Чи зможеш ти думати як гросмейстер?', en: 'Can you think like a grandmaster?' },
  menuSub: { uk: 'Реальні партії чемпіонів. Вгадай хід, який зробив майстер, а не той, що радить рушій.', en: 'Real games of champions. Guess the move the master played, not the one the engine suggests.' },
  chooseGm: { uk: 'Обрати гросмейстера', en: 'Choose a grandmaster' },
  chooseGmHint: { uk: 'Грай за улюбленого чемпіона', en: 'Play as your favourite champion' },
  youPlayAs: { uk: 'Ви граєте за', en: 'You play as' },
  tapToChange: { uk: 'натисни, щоб змінити', en: 'tap to change' },
  randomGame: { uk: 'Випадкова партія', en: 'Random game' },
  randomAny: { uk: 'Будь-яка партія з колекції', en: 'Any game from the collection' },
  randomOf: { uk: 'Серед партій', en: 'A random game by' },
  chooseGame: { uk: 'Обрати партію', en: 'Choose a game' },
  chooseGameHint: { uk: 'Найвідоміші партії в історії', en: 'The most famous games in history' },
  daily: { uk: 'Хід дня', en: 'Move of the day' },
  dailyHint: { uk: 'Одна позиція на день, однакова для всіх', en: 'One position a day, the same for everyone' },
  settings: { uk: 'Налаштування', en: 'Settings' },
  settingsHint: { uk: 'Тема, мова, звук', en: 'Theme, language, sound' },
  gmIndex: { uk: 'GM-індекс', en: 'GM index' },
  gmCol: { uk: 'Гросмейстер', en: 'Grandmaster' },
  guessedCol: { uk: 'Вгадано', en: 'Guessed' },
  strongCol: { uk: 'Сильних ходів', en: 'Strong moves' },
  bestStreak: { uk: 'Найдовша серія вгаданих ходів', en: 'Longest streak of guessed moves' },
  photoCredits: { uk: 'Фото гравців', en: 'Player photos' },

  // гросмейстери
  gmsTitle: { uk: 'Гросмейстери', en: 'Grandmasters' },
  gamesCount: { uk: 'партій', en: 'games' },
  playAsBtn: { uk: 'Грати за', en: 'Play as' },
  selected: { uk: 'Обрано', en: 'Selected' },
  unselect: { uk: 'Скасувати вибір', en: 'Clear choice' },
  howPlayed: { uk: 'Як грав', en: 'Playing style' },
  strengths: { uk: 'Сильні сторони', en: 'Strengths' },
  hisGames: { uk: 'Партії в колекції', en: 'Games in the collection' },

  // партії
  gamesTitle: { uk: 'Партії', en: 'Games' },
  youPlayFor: { uk: 'Граєш за', en: 'You play' },
  moves: { uk: 'ходів', en: 'moves' },
  startGame: { uk: 'Почати партію', en: 'Start the game' },
  whyMatters: { uk: 'Чим важлива', en: 'Why it matters' },
  playedBy: { uk: 'Ти граєш за', en: 'You play as' },
  whiteSide: { uk: 'білих', en: 'White' },
  blackSide: { uk: 'чорних', en: 'Black' },

  // гра
  guessed: { uk: 'вгадано', en: 'guessed' },
  of: { uk: 'з', en: 'of' },
  total: { uk: 'усього', en: 'total' },
  move: { uk: 'Хід', en: 'Move' },
  whatPlayed: { uk: 'Що зіграв', en: 'What did' },
  whatPlayedEnd: { uk: '?', en: ' play?' },
  onlyMove: { uk: 'Єдиний можливий хід…', en: 'Only legal move…' },
  opponentMoves: { uk: 'Ходить суперник…', en: 'Opponent to move…' },
  skip: { uk: 'Пропустити — не знаю', en: 'Skip — I don\'t know' },
  hint: { uk: 'Перетягни фігуру або натисни на неї, а потім на поле.', en: 'Drag a piece, or tap it and then a square.' },
  gameStarts: { uk: 'Партія починається з початкової позиції.', en: 'The game starts from the initial position.' },
  white: { uk: 'Білі', en: 'White' },
  black: { uk: 'Чорні', en: 'Black' },
  yourPieces: { uk: 'твої фігури', en: 'your pieces' },
  toMove: { uk: 'хід', en: 'to move' },
  grandmaster: { uk: 'Гросмейстер', en: 'Grandmaster' },

  // відгук
  exact: { uk: 'Вгадав!', en: 'Correct!' },
  played: { uk: 'зіграв', en: 'played' },
  exactShort: { uk: 'так і зіграв', en: 'played exactly that' },
  strongMove: { uk: 'Сильний хід', en: 'Strong move' },
  but: { uk: 'але', en: 'but' },
  youPlayed: { uk: 'Ти зіграв', en: 'You played' },
  skipped: { uk: 'Пропущено.', en: 'Skipped.' },
  engineBest: { uk: 'Рушій: найкращий хід', en: 'Engine: best move' },
  yourMove: { uk: 'твій хід', en: 'your move' },
  engineAgrees: { uk: 'рушій на твоєму боці.', en: 'the engine agrees with you.' },
  engineLine: { uk: 'Далі за рушієм', en: 'Engine line' },
  difficulty: { uk: 'Складність', en: 'Difficulty' },

  // підсумок
  youPlayedLike: { uk: 'Ти зіграв як', en: 'You played like' },
  on: { uk: 'на', en: 'at' },
  guessedOf: { uk: 'Вгадано', en: 'Guessed' },
  movesWord: { uk: 'ходів', en: 'moves' },
  strongAlt: { uk: 'сильних альтернатив', en: 'strong alternatives' },
  skippedN: { uk: 'пропущено', en: 'skipped' },
  share: { uk: 'Поділитися', en: 'Share' },
  copied: { uk: 'Скопійовано ✓', en: 'Copied ✓' },
  again: { uk: 'Ще раз', en: 'Play again' },
  toMenu: { uk: 'У меню', en: 'Menu' },
  dailyDone: { uk: 'сьогодні вже зіграно', en: 'already played today' },
  noPoints: { uk: 'без очок', en: 'no points' },
  whichMove: { uk: 'Який хід зробив гросмейстер?', en: 'Which move did the grandmaster play?' },
  itWas: { uk: 'Це був', en: 'It was' },

  // налаштування
  theme: { uk: 'Кольорова гама', en: 'Colour theme' },
  themeGold: { uk: 'Золото', en: 'Gold' },
  themeIvory: { uk: 'Слонова кістка', en: 'Ivory' },
  themeEmerald: { uk: 'Смарагд', en: 'Emerald' },
  themeMidnight: { uk: 'Опівніч', en: 'Midnight' },
  themeGraphite: { uk: 'Графіт', en: 'Graphite' },
  boardColors: { uk: 'Кольори дошки', en: 'Board colours' },
  boardWood: { uk: 'Дерево', en: 'Wood' },
  boardClassic: { uk: 'Класика', en: 'Classic' },
  boardGreen: { uk: 'Зелена', en: 'Green' },
  boardBlue: { uk: 'Блакитна', en: 'Blue' },
  boardIce: { uk: 'Крига', en: 'Ice' },
  boardPurple: { uk: 'Бузкова', en: 'Purple' },
  boardGrey: { uk: 'Сіра', en: 'Grey' },
  boardCoral: { uk: 'Корал', en: 'Coral' },
  boardOlive: { uk: 'Оливка', en: 'Olive' },
  boardNight: { uk: 'Нічна', en: 'Night' },
  opening: { uk: 'Дебют…', en: 'Opening…' },
  language: { uk: 'Мова', en: 'Language' },
  sound: { uk: 'Звук ходів', en: 'Move sounds' },
  speed: { uk: 'Темп партії', en: 'Game pace' },
  speedSlow: { uk: 'Повільно', en: 'Slow' },
  speedNormal: { uk: 'Звичайно', en: 'Normal' },
  speedFast: { uk: 'Швидко', en: 'Fast' },
  showEngine: { uk: 'Показувати оцінку рушія', en: 'Show engine evaluation' },
  skipOpening: { uk: 'Пропускати дебют (перші 2 ходи)', en: 'Skip the opening (first 2 moves)' },
  resetStats: { uk: 'Скинути статистику', en: 'Reset statistics' },
  resetConfirm: { uk: 'Точно скинути? Очки, серії й GM-індекс зникнуть.', en: 'Reset for sure? Points, streaks and GM index will be lost.' },
  yesReset: { uk: 'Так, скинути', en: 'Yes, reset' },
  cancel: { uk: 'Скасувати', en: 'Cancel' },
  statsReset: { uk: 'Статистику скинуто', en: 'Statistics reset' },
  on_: { uk: 'Увімк.', en: 'On' },
  off_: { uk: 'Вимк.', en: 'Off' },
} as const

export type StringKey = keyof typeof STRINGS

export const LangContext = createContext<Lang>('uk')

export function useT() {
  const lang = useContext(LangContext)
  return (key: StringKey) => STRINGS[key][lang]
}

export function useLang(): Lang {
  return useContext(LangContext)
}
