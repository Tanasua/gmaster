import type { Lang } from '../i18n'

type L<T = string> = Record<Lang, T>

export interface GmProfile {
  id: string
  /** Імена гравця в PGN-файлах */
  pgnNames: string[]
  name: L
  /** Коротке ім'я в реченнях: «Що зіграв Каспаров?» */
  short: L
  /** Знахідний відмінок: «Ви граєте за Каспарова» */
  acc: L
  years: string
  title: L
  bio: L
  style: L
  strengths: L<string[]>
}

// Порядок — від найвідоміших
export const GMS: GmProfile[] = [
  {
    id: 'kasparov',
    pgnNames: ['Kasparov, Gary'],
    name: { uk: 'Гаррі Каспаров', en: 'Garry Kasparov' },
    short: { uk: 'Каспаров', en: 'Kasparov' },
    acc: { uk: 'Каспарова', en: 'Kasparov' },
    years: '1963',
    title: { uk: '13-й чемпіон світу (1985–2000)', en: '13th World Champion (1985–2000)' },
    bio: {
      uk: 'Народився в Баку. У 22 роки виграв титул у Анатолія Карпова й тримав корону 15 років, доки не програв Володимиру Крамнику у 2000-му. Майже двадцять років очолював світовий рейтинг. Завершив кар\'єру у 2005 році.',
      en: 'Born in Baku. At 22 he took the title from Anatoly Karpov and held it for 15 years until losing to Vladimir Kramnik in 2000. He was the world\'s top-rated player for almost twenty years and retired in 2005.',
    },
    style: {
      uk: 'Динамічний атакувальний шахіст: ініціатива важила для нього більше за матеріал. Приходив на партію з глибокою дебютною підготовкою і часто вирішував гру ще до того, як суперник встигав зорієнтуватися.',
      en: 'A dynamic attacking player who valued the initiative above material. He arrived with deep opening preparation and often decided the game before the opponent found their bearings.',
    },
    strengths: {
      uk: ['Атака на короля', 'Дебютна підготовка', 'Розрахунок складних варіантів', 'Жертви заради ініціативи'],
      en: ['Attacking the king', 'Opening preparation', 'Calculating complex lines', 'Sacrifices for the initiative'],
    },
  },
  {
    id: 'carlsen',
    pgnNames: ['Carlsen,M'],
    name: { uk: 'Магнус Карлсен', en: 'Magnus Carlsen' },
    short: { uk: 'Карлсен', en: 'Carlsen' },
    acc: { uk: 'Карлсена', en: 'Carlsen' },
    years: '1990',
    title: { uk: '16-й чемпіон світу (2013–2023)', en: '16th World Champion (2013–2023)' },
    bio: {
      uk: 'Норвежець, гросмейстер у 13 років. У 2013 році виграв титул у Вішванатана Ананда і захищав його до 2023-го, коли сам відмовився від матчу. Автор найвищого рейтингу в історії — 2882.',
      en: 'A Norwegian who became a grandmaster at 13. He won the title from Viswanathan Anand in 2013 and held it until 2023, when he chose not to defend it. He reached the highest rating in history, 2882.',
    },
    style: {
      uk: 'Універсал. Охоче виходить у рівні позиції й довго тисне, вичавлюючи перемогу з мінімальної переваги. Найсильніший у ендшпілі та в практичних рішеннях за дошкою.',
      en: 'A universal player. He happily enters equal positions and keeps pressing, squeezing wins out of tiny advantages. Strongest in endgames and practical decisions at the board.',
    },
    strengths: {
      uk: ['Ендшпіль', 'Гра з мінімальною перевагою', 'Витривалість у довгих партіях', 'Практичні рішення'],
      en: ['Endgames', 'Playing on with a tiny edge', 'Stamina in long games', 'Practical decisions'],
    },
  },
  {
    id: 'fischer',
    pgnNames: ['Fischer, Robert James'],
    name: { uk: 'Роберт Фішер', en: 'Bobby Fischer' },
    short: { uk: 'Фішер', en: 'Fischer' },
    acc: { uk: 'Фішера', en: 'Fischer' },
    years: '1943–2008',
    title: { uk: '11-й чемпіон світу (1972–1975)', en: '11th World Champion (1972–1975)' },
    bio: {
      uk: 'Американець, чемпіон США в 14 років. У 1972 році в Рейк\'явіку переміг Бориса Спаського і перервав радянську монополію на титул. У 1975-му відмовився захищати корону, і вона перейшла до Анатолія Карпова.',
      en: 'An American who won the US championship at 14. In Reykjavik in 1972 he beat Boris Spassky, ending the Soviet hold on the title. In 1975 he refused to defend it, and the crown passed to Anatoly Karpov.',
    },
    style: {
      uk: 'Ясність і точність. Грав чисті класичні позиції, майже завжди починав з 1.e4 і доводив до перемоги навіть невеликі переваги. Боровся в кожній партії, нічиїх без гри не визнавав.',
      en: 'Clarity and precision. He played clean classical positions, almost always opened with 1.e4 and converted even small advantages. He fought in every game and disliked quick draws.',
    },
    strengths: {
      uk: ['Техніка реалізації переваги', 'Класичні дебюти', 'Бойовий характер', 'Точність'],
      en: ['Converting advantages', 'Classical openings', 'Fighting spirit', 'Precision'],
    },
  },
  {
    id: 'tal',
    pgnNames: ['Tal, Mihail'],
    name: { uk: 'Михайло Таль', en: 'Mikhail Tal' },
    short: { uk: 'Таль', en: 'Tal' },
    acc: { uk: 'Таля', en: 'Tal' },
    years: '1936–1992',
    title: { uk: '8-й чемпіон світу (1960–1961)', en: '8th World Champion (1960–1961)' },
    bio: {
      uk: '«Чарівник з Риги». У 1960 році переміг Михайла Ботвинника і став чемпіоном світу, а через рік програв йому матч-реванш. Попри хворобу, залишався в світовій еліті кілька десятиліть.',
      en: '"The Magician from Riga". In 1960 he beat Mikhail Botvinnik to become World Champion and lost the rematch a year later. Despite poor health he stayed among the world\'s elite for decades.',
    },
    style: {
      uk: 'Найяскравіший атакувальний шахіст в історії. Жертвував фігури, щоб заплутати позицію, і вигравав у хаосі, де суперник не встигав усе порахувати.',
      en: 'The most dazzling attacking player in history. He sacrificed pieces to complicate the position and won in the chaos, where opponents could not calculate everything.',
    },
    strengths: {
      uk: ['Жертви фігур', 'Тактика', 'Атака', 'Психологічний тиск'],
      en: ['Piece sacrifices', 'Tactics', 'Attack', 'Psychological pressure'],
    },
  },
  {
    id: 'anand',
    pgnNames: ['Anand,V'],
    name: { uk: 'Вішванатан Ананд', en: 'Viswanathan Anand' },
    short: { uk: 'Ананд', en: 'Anand' },
    acc: { uk: 'Ананда', en: 'Anand' },
    years: '1969',
    title: { uk: '15-й чемпіон світу (2007–2013)', en: '15th World Champion (2007–2013)' },
    bio: {
      uk: 'Перший гросмейстер Індії (1988). Чемпіон світу ФІДЕ 2000 року, а з 2007-го — безперечний чемпіон, доки у 2013-му не програв матч Магнусу Карлсену.',
      en: 'India\'s first grandmaster (1988). FIDE World Champion in 2000 and undisputed champion from 2007 until he lost the 2013 match to Magnus Carlsen.',
    },
    style: {
      uk: 'Швидкий і універсальний. Славився блискавичним розрахунком і глибокою дебютною підготовкою, однаково впевнено грав і гострі, і спокійні позиції.',
      en: 'Fast and universal. Known for lightning calculation and deep opening preparation, equally at home in sharp and quiet positions.',
    },
    strengths: {
      uk: ['Швидкість розрахунку', 'Дебютна підготовка', 'Універсальність', 'Гра у швидкі шахи'],
      en: ['Speed of calculation', 'Opening preparation', 'Versatility', 'Rapid chess'],
    },
  },
  {
    id: 'short',
    pgnNames: ['Short, Nigel D'],
    name: { uk: 'Найджел Шорт', en: 'Nigel Short' },
    short: { uk: 'Шорт', en: 'Short' },
    acc: { uk: 'Шорта', en: 'Short' },
    years: '1965',
    title: { uk: 'Претендент на титул (1993)', en: 'World title challenger (1993)' },
    bio: {
      uk: 'Англієць, один із найсильніших шахістів Заходу 1980–90-х. У 1993 році зіграв матч за світову корону з Гаррі Каспаровим і програв.',
      en: 'An Englishman and one of the strongest Western players of the 1980s and 90s. In 1993 he played a world title match against Garry Kasparov and lost.',
    },
    style: {
      uk: 'Агресивний і винахідливий. Не боявся нестандартних рішень, як-от знаменитий похід короля через усю дошку проти Яна Тіммана.',
      en: 'Aggressive and inventive. Unafraid of unusual ideas, like his famous king march across the board against Jan Timman.',
    },
    strengths: {
      uk: ['Атака', 'Нестандартні ідеї', 'Активний король'],
      en: ['Attack', 'Unusual ideas', 'Active king'],
    },
  },
]

export function gmForPgnName(pgnName: string): GmProfile | undefined {
  return GMS.find((g) => g.pgnNames.includes(pgnName))
}

export function gmById(id: string | null): GmProfile | undefined {
  return id ? GMS.find((g) => g.id === id) : undefined
}
