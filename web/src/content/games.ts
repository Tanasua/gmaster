import type { Lang } from '../i18n'

type L = Record<Lang, string>

export interface GameInfo {
  title: L
  /** Чим важлива партія — для превʼю перед стартом */
  why: L
}

// Порядок — від найвизначніших
export const GAME_ORDER = [
  'byrne-fischer-1956',
  'kasparov-topalov-1999',
  'fischer-spassky-1972-g6',
  'karpov-kasparov-1985-g16',
  'short-timman-1991',
  'carlsen-karjakin-2016-tb4',
  'tal-larsen-1965-g10',
  'aronian-anand-2013',
  'carlsen-anand-2013-g5',
  'carlsen-karjakin-2016-g10',
]

export const GAME_INFO: Record<string, GameInfo> = {
  'byrne-fischer-1956': {
    title: { uk: '«Гра століття»', en: '"The Game of the Century"' },
    why: {
      uk: '13-річний Фішер проти Дональда Бірна на турнірі в Нью-Йорку. Жертва ферзя 17…Be6 і розгром — партія, після якої про Фішера дізнався весь шаховий світ.',
      en: '13-year-old Fischer against Donald Byrne in New York. The queen sacrifice 17…Be6 and the rout that followed made the whole chess world notice Fischer.',
    },
  },
  'kasparov-topalov-1999': {
    title: { uk: '«Безсмертна» Каспарова', en: 'Kasparov\'s Immortal' },
    why: {
      uk: 'Вейк-ан-Зее, 1999. Жертва тури 24.Rxd4 і полювання на чорного короля через усю дошку. Одна з найкрасивіших атак в історії шахів.',
      en: 'Wijk aan Zee, 1999. The rook sacrifice 24.Rxd4 and a hunt for the black king across the whole board. One of the most beautiful attacks in chess history.',
    },
  },
  'fischer-spassky-1972-g6': {
    title: { uk: 'Матч століття, партія 6', en: 'Match of the Century, game 6' },
    why: {
      uk: 'Рейк\'явік, 1972. Фішер, який майже завжди починав з 1.e4, відкрив партію ходом 1.c4 і переграв Спаського в класичному стилі. Перемога вивела його вперед у матчі за корону.',
      en: 'Reykjavik, 1972. Fischer, who almost always opened 1.e4, started with 1.c4 and outplayed Spassky in classical style. The win put him ahead in the title match.',
    },
  },
  'karpov-kasparov-1985-g16': {
    title: { uk: 'Кінь на d3', en: 'The knight on d3' },
    why: {
      uk: 'Матч за світову корону 1985 року. Кінь Каспарова на d3 скував усю білу армію — одна з найвідоміших партій їхнього суперництва. Того ж року Каспаров став чемпіоном.',
      en: 'The 1985 world title match. Kasparov\'s knight on d3 paralysed the whole white army — one of the best-known games of their rivalry. Kasparov became champion that year.',
    },
  },
  'short-timman-1991': {
    title: { uk: 'Похід короля', en: 'The King March' },
    why: {
      uk: 'Тілбург, 1991. Посеред міттельшпілю Шорт повів свого короля Kh2–g3–f4–g5 просто до табору суперника, щоб допомогти в атаці на чорного короля.',
      en: 'Tilburg, 1991. In the middlegame Short marched his king Kh2–g3–f4–g5 into the enemy camp to join the attack on the black king.',
    },
  },
  'carlsen-karjakin-2016-tb4': {
    title: { uk: 'Тай-брейк за корону, 2016', en: 'Title tiebreak, 2016' },
    why: {
      uk: 'Нью-Йорк, 2016, остання партія тай-брейку. Карлсен у свій день народження завершив її жертвою ферзя 50.Qh6+ і зберіг титул чемпіона світу.',
      en: 'New York, 2016, the final tiebreak game. On his birthday Carlsen finished it with the queen sacrifice 50.Qh6+ and kept his world title.',
    },
  },
  'tal-larsen-1965-g10': {
    title: { uk: 'Вирішальна партія в Бледі', en: 'The decider in Bled' },
    why: {
      uk: 'Півфінал матчів претендентів у Бледі. Рахунок перед партією 4,5 : 4,5. Таль пожертвував коня 16.Nd5, виграв і вийшов у фінал претендентів.',
      en: 'The Candidates semifinal in Bled. The score before this game was 4.5–4.5. Tal sacrificed a knight with 16.Nd5, won and reached the Candidates final.',
    },
  },
  'aronian-anand-2013': {
    title: { uk: 'Розгром за 23 ходи', en: 'A 23-move demolition' },
    why: {
      uk: 'Вейк-ан-Зее, 2013. Чинний чемпіон світу Ананд чорними розгромив Ароняна за 23 ходи серією жертв — одна з найкращих партій у його кар\'єрі.',
      en: 'Wijk aan Zee, 2013. Reigning champion Anand, with Black, crushed Aronian in 23 moves with a series of sacrifices — one of the finest games of his career.',
    },
  },
  'carlsen-anand-2013-g5': {
    title: { uk: 'Матч за корону 2013, партія 5', en: 'Title match 2013, game 5' },
    why: {
      uk: 'Ченнаї, 2013. Після чотирьох нічиїх Карлсен виграв першу партію матчу, крок за кроком дотиснувши Ананда в ендшпілі. Цей матч зробив його чемпіоном світу.',
      en: 'Chennai, 2013. After four draws Carlsen won the first game of the match, grinding Anand down in the endgame. The match made him World Champion.',
    },
  },
  'carlsen-karjakin-2016-g10': {
    title: { uk: 'Матч за корону 2016, партія 10', en: 'Title match 2016, game 10' },
    why: {
      uk: 'Нью-Йорк, 2016. Карякін вів у матчі після 8-ї партії. У 10-й Карлсен у довгій боротьбі відновив рівновагу, і матч зрештою дійшов до тай-брейку.',
      en: 'New York, 2016. Karjakin led the match after game 8. In game 10 Carlsen levelled the score after a long fight, and the match eventually went to a tiebreak.',
    },
  },
}
