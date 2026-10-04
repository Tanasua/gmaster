import type { Lang } from '../i18n'

type L = Record<Lang, string>

export interface GameInfo {
  title: L
  /** Чим важлива партія — для превʼю перед стартом */
  why: L
}

// Порядок — від найвизначніших
export const GAME_ORDER = [
  'morphy-opera-1858',
  'byrne-fischer-1956',
  'kasparov-topalov-1999',
  'fischer-spassky-1972-g6',
  'lasker-bauer-1889',
  'botvinnik-capablanca-1938',
  'spassky-bronstein-1960',
  'steinitz-bardeleben-1895',
  'capablanca-marshall-1918',
  'kramnik-kasparov-2000-g2',
  'reti-alekhine-1925',
  'karpov-unzicker-1974',
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
  'morphy-opera-1858': {
    title: { uk: '«Оперна партія»', en: 'The Opera Game' },
    why: {
      uk: 'Париж, 1858, ложа оперного театру. Морфі грав проти герцога Карла Брауншвейзького та графа Ізуара, які радилися між собою. Жертва ферзя 16.Qb8+ і мат 17.Rd8# — найвідоміша коротка партія в історії шахів і зразок того, як швидко розвивати фігури.',
      en: 'Paris, 1858, in a box at the opera. Morphy played the Duke of Brunswick and Count Isouard, who consulted each other. The queen sacrifice 16.Qb8+ and mate with 17.Rd8# make it the most famous short game in chess history and a model of rapid development.',
    },
  },
  'lasker-bauer-1889': {
    title: { uk: 'Жертва двох слонів', en: 'The double bishop sacrifice' },
    why: {
      uk: 'Амстердам, 1889. Ласкер пожертвував обох слонів — 15.Bxh7+ і 17.Bxg7 — і зруйнував прикриття чорного короля. Відтоді цю ідею так і називають: жертва двох слонів Ласкера.',
      en: 'Amsterdam, 1889. Lasker sacrificed both bishops — 15.Bxh7+ and 17.Bxg7 — and tore open the black king\'s shelter. The idea has been known as Lasker\'s double bishop sacrifice ever since.',
    },
  },
  'botvinnik-capablanca-1938': {
    title: { uk: 'Слон на a3', en: 'The bishop on a3' },
    why: {
      uk: 'Турнір AVRO, 1938. Молодий Ботвинник переграв колишнього чемпіона світу Капабланку і завершив партію знаменитою жертвою слона 30.Ba3.',
      en: 'The AVRO tournament, 1938. The young Botvinnik outplayed former World Champion Capablanca and finished the game with the famous bishop sacrifice 30.Ba3.',
    },
  },
  'spassky-bronstein-1960': {
    title: { uk: 'Партія з фільму про Бонда', en: 'The James Bond game' },
    why: {
      uk: 'Чемпіонат СРСР, Ленінград, 1960. Королівський гамбіт, жертва коня 16.Nxf7 і атака на короля. Позицію з цієї партії показали на початку фільму про Джеймса Бонда «З Росії з любов\'ю» (1963).',
      en: 'USSR Championship, Leningrad, 1960. The King\'s Gambit, the knight sacrifice 16.Nxf7 and an attack on the king. A position from this game appears at the start of the James Bond film "From Russia with Love" (1963).',
    },
  },
  'steinitz-bardeleben-1895': {
    title: { uk: 'Гастінгс, 1895', en: 'Hastings, 1895' },
    why: {
      uk: 'Ветеран Стейніц проти Курта фон Барделебена. Після 22.Rxe7+ тура білих раз у раз дає шах, а забрати її не можна. Фон Барделебен не став чекати мату і просто покинув турнірний зал.',
      en: 'The veteran Steinitz against Curt von Bardeleben. After 22.Rxe7+ the white rook keeps checking and cannot be taken. Von Bardeleben did not wait for the mate and simply left the tournament hall.',
    },
  },
  'capablanca-marshall-1918': {
    title: { uk: 'Народження атаки Маршалла', en: 'The birth of the Marshall Attack' },
    why: {
      uk: 'Нью-Йорк, 1918. Френк Маршалл застосував проти Капабланки нову гостру жертву пішака 8…d5 в іспанській партії. Капабланка відбився від атаки й переміг, а ідея досі зветься атакою Маршалла і грається на найвищому рівні.',
      en: 'New York, 1918. Frank Marshall surprised Capablanca with a new, sharp pawn sacrifice 8…d5 in the Ruy Lopez. Capablanca beat off the attack and won, yet the idea is still called the Marshall Attack and is played at the highest level.',
    },
  },
  'kramnik-kasparov-2000-g2': {
    title: { uk: 'Лондон, 2000, партія 2', en: 'London 2000, game 2' },
    why: {
      uk: 'Матч за світову корону. Перша перемога Крамника над Каспаровим. Крамник виграв увесь матч, не програвши жодної партії, і став 14-м чемпіоном світу.',
      en: 'The World Championship match. Kramnik\'s first win over Kasparov. Kramnik won the whole match without losing a single game and became the 14th World Champion.',
    },
  },
  'reti-alekhine-1925': {
    title: { uk: 'Комбінація в Баден-Бадені', en: 'The Baden-Baden combination' },
    why: {
      uk: 'Баден-Баден, 1925. Алехін чорними провів одну з найвідоміших своїх комбінацій, розраховану на багато ходів уперед, і виграв у Ріхарда Реті — одного з батьків гіпермодерністської школи.',
      en: 'Baden-Baden, 1925. With Black, Alekhine played one of his most famous combinations, calculated many moves ahead, against Richard Réti, one of the fathers of the hypermodern school.',
    },
  },
  'karpov-unzicker-1974': {
    title: { uk: 'Удав у Ніцці', en: 'The boa constrictor in Nice' },
    why: {
      uk: 'Шахова олімпіада в Ніцці, 1974. Хрестоматійний приклад стилю Карпова: він крок за кроком забрав у суперника простір і корисні ходи, доки чорні не опинилися в повному затиску.',
      en: 'The Nice Olympiad, 1974. A textbook example of Karpov\'s style: step by step he took away his opponent\'s space and useful moves until Black was completely squeezed.',
    },
  },
}
