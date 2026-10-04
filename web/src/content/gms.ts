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

const ALL: GmProfile[] = [
  {
    id: 'kasparov',
    pgnNames: ['Kasparov, Gary', 'Kasparov,G'],
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
    pgnNames: ['Anand,V', 'Anand, Viswanathan'],
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
  {
    id: 'karpov',
    pgnNames: ['Karpov, Anatoly'],
    name: { uk: 'Анатолій Карпов', en: 'Anatoly Karpov' },
    short: { uk: 'Карпов', en: 'Karpov' },
    acc: { uk: 'Карпова', en: 'Karpov' },
    years: '1951',
    title: { uk: '12-й чемпіон світу (1975–1985)', en: '12th World Champion (1975–1985)' },
    bio: {
      uk: 'Став чемпіоном світу в 1975 році, коли Фішер відмовився захищати титул. Двічі відстояв корону в матчах з Віктором Корчним і десять років був найсильнішим шахістом планети, доки не програв Гаррі Каспарову. Згодом ще раз був чемпіоном світу за версією ФІДЕ (1993–1999).',
      en: 'Became World Champion in 1975 when Fischer declined to defend the title. He defended the crown twice against Viktor Korchnoi and was the world\'s best for a decade until losing to Garry Kasparov. He later held the FIDE title again (1993–1999).',
    },
    style: {
      uk: 'Майстер позиційної гри. Повільно стискав суперника, забирав у нього простір і корисні ходи, а потім вигравав майже без ризику. Його партії часто називають «удав, що душить».',
      en: 'A master of positional play. He slowly squeezed opponents, taking away space and useful moves, and then won with almost no risk. His style is often compared to a boa constrictor.',
    },
    strengths: {
      uk: ['Позиційний тиск', 'Профілактика', 'Гра проти слабких полів', 'Техніка реалізації'],
      en: ['Positional pressure', 'Prophylaxis', 'Exploiting weak squares', 'Converting advantages'],
    },
  },
  {
    id: 'capablanca',
    pgnNames: ['Capablanca, Jose Raul'],
    name: { uk: 'Хосе Рауль Капабланка', en: 'José Raúl Capablanca' },
    short: { uk: 'Капабланка', en: 'Capablanca' },
    acc: { uk: 'Капабланку', en: 'Capablanca' },
    years: '1888–1942',
    title: { uk: '3-й чемпіон світу (1921–1927)', en: '3rd World Champion (1921–1927)' },
    bio: {
      uk: 'Кубинець, вундеркінд, який навчився шахів у дитинстві, спостерігаючи за грою батька. У 1921 році виграв титул у Емануїла Ласкера, а в 1927-му програв його Олександру Алехіну.',
      en: 'A Cuban prodigy who learned chess as a small child by watching his father play. He won the title from Emanuel Lasker in 1921 and lost it to Alexander Alekhine in 1927.',
    },
    style: {
      uk: 'Простота і ясність. Капабланка уникав зайвих ускладнень, грав легко й точно, а ендшпіль розігрував так, що його партії досі вивчають як зразкові.',
      en: 'Simplicity and clarity. Capablanca avoided needless complications, played lightly and precisely, and handled endgames so well that his games are still studied as models.',
    },
    strengths: {
      uk: ['Ендшпіль', 'Позиційне чуття', 'Простота рішень', 'Захист'],
      en: ['Endgames', 'Positional feel', 'Simple solutions', 'Defence'],
    },
  },
  {
    id: 'botvinnik',
    pgnNames: ['Botvinnik, Mikhail'],
    name: { uk: 'Михайло Ботвинник', en: 'Mikhail Botvinnik' },
    short: { uk: 'Ботвинник', en: 'Botvinnik' },
    acc: { uk: 'Ботвинника', en: 'Botvinnik' },
    years: '1911–1995',
    title: { uk: '6-й чемпіон світу (1948–1963 з перервами)', en: '6th World Champion (1948–1963, with breaks)' },
    bio: {
      uk: 'Виграв матч-турнір 1948 року і став чемпіоном світу. Двічі втрачав титул — Смислову та Талю — і двічі повертав його в матчах-реваншах. Інженер за фахом, згодом заснував шахову школу, з якої вийшли Карпов, Каспаров і Крамник.',
      en: 'Won the 1948 match-tournament to become World Champion. He lost the title twice, to Smyslov and Tal, and won it back both times in rematches. An engineer by training, he later ran a chess school whose pupils included Karpov, Kasparov and Kramnik.',
    },
    style: {
      uk: 'Науковий підхід. Ретельно готувався, глибоко аналізував власні партії й дебюти, грав логічно і сильно в складних стратегічних позиціях.',
      en: 'A scientific approach. He prepared meticulously, analysed his own games and openings in depth, and played logically and powerfully in complex strategic positions.',
    },
    strengths: {
      uk: ['Підготовка', 'Стратегія', 'Аналіз', 'Дебютні системи'],
      en: ['Preparation', 'Strategy', 'Analysis', 'Opening systems'],
    },
  },
  {
    id: 'alekhine',
    pgnNames: ['Alekhine, Alexander'],
    name: { uk: 'Олександр Алехін', en: 'Alexander Alekhine' },
    short: { uk: 'Алехін', en: 'Alekhine' },
    acc: { uk: 'Алехіна', en: 'Alekhine' },
    years: '1892–1946',
    title: { uk: '4-й чемпіон світу (1927–1935, 1937–1946)', en: '4th World Champion (1927–1935, 1937–1946)' },
    bio: {
      uk: 'У 1927 році сенсаційно переміг Капабланку. У 1935-му програв титул Максу Ейве, але через два роки повернув його в матчі-реванші. Помер у 1946 році чинним чемпіоном світу — єдиний в історії.',
      en: 'In 1927 he sensationally beat Capablanca. He lost the title to Max Euwe in 1935 but regained it two years later. He died in 1946 as the reigning champion, the only one in history.',
    },
    style: {
      uk: 'Атакувальний стиль з глибокими комбінаціями. Алехін вмів створювати складнощі з нічого і розраховував варіанти на багато ходів уперед.',
      en: 'An attacking style built on deep combinations. Alekhine could create complications out of nothing and calculated many moves ahead.',
    },
    strengths: {
      uk: ['Комбінації', 'Атака', 'Глибина розрахунку', 'Ініціатива'],
      en: ['Combinations', 'Attack', 'Depth of calculation', 'Initiative'],
    },
  },
  {
    id: 'morphy',
    pgnNames: ['Morphy, Paul '],
    name: { uk: 'Пол Морфі', en: 'Paul Morphy' },
    short: { uk: 'Морфі', en: 'Morphy' },
    acc: { uk: 'Морфі', en: 'Morphy' },
    years: '1837–1884',
    title: { uk: 'Неофіційний найсильніший шахіст світу 1850-х', en: 'The unofficial world\'s best in the late 1850s' },
    bio: {
      uk: 'Американець з Нового Орлеана. У 1858–1859 роках поїхав до Європи й переграв її найсильніших майстрів, зокрема Адольфа Андерсена. Невдовзі після повернення додому майже повністю покинув шахи.',
      en: 'An American from New Orleans. In 1858–1859 he toured Europe and beat its strongest masters, including Adolf Anderssen. Soon after returning home he all but gave up chess.',
    },
    style: {
      uk: 'Швидкий розвиток фігур, відкриті лінії й атака. Морфі першим послідовно показав, як важливо мобілізувати всі фігури, перш ніж атакувати.',
      en: 'Rapid development, open lines and attack. Morphy was the first to show consistently how important it is to mobilise every piece before attacking.',
    },
    strengths: {
      uk: ['Розвиток фігур', 'Відкриті позиції', 'Комбінації', 'Атака на короля'],
      en: ['Development', 'Open positions', 'Combinations', 'Attacking the king'],
    },
  },
  {
    id: 'lasker',
    pgnNames: ['Lasker, Emanuel'],
    name: { uk: 'Емануїл Ласкер', en: 'Emanuel Lasker' },
    short: { uk: 'Ласкер', en: 'Lasker' },
    acc: { uk: 'Ласкера', en: 'Lasker' },
    years: '1868–1941',
    title: { uk: '2-й чемпіон світу (1894–1921)', en: '2nd World Champion (1894–1921)' },
    bio: {
      uk: 'Німецький шахіст і математик. У 1894 році переміг Стейніца й тримав титул 27 років — найдовше в історії, доки не програв Капабланці в 1921-му.',
      en: 'A German player and mathematician. He beat Steinitz in 1894 and held the title for 27 years — the longest reign in history — until losing to Capablanca in 1921.',
    },
    style: {
      uk: 'Практик і боєць. Ласкер шукав не ідеальний хід, а той, що найбільше незручний конкретному супернику, і блискуче захищав важкі позиції.',
      en: 'A practical fighter. Lasker looked not for the perfect move but for the one most uncomfortable for the specific opponent, and he defended difficult positions brilliantly.',
    },
    strengths: {
      uk: ['Практична гра', 'Захист', 'Психологія', 'Ендшпіль'],
      en: ['Practical play', 'Defence', 'Psychology', 'Endgames'],
    },
  },
  {
    id: 'spassky',
    pgnNames: ['Spassky, Boris V'],
    name: { uk: 'Борис Спаський', en: 'Boris Spassky' },
    short: { uk: 'Спаський', en: 'Spassky' },
    acc: { uk: 'Спаського', en: 'Spassky' },
    years: '1937–2025',
    title: { uk: '10-й чемпіон світу (1969–1972)', en: '10th World Champion (1969–1972)' },
    bio: {
      uk: 'У 1969 році переміг Тиграна Петросяна. У 1972-му в Рейк\'явіку програв знаменитий «матч століття» Бобі Фішеру.',
      en: 'Beat Tigran Petrosian in 1969. In 1972 in Reykjavik he lost the famous "Match of the Century" to Bobby Fischer.',
    },
    style: {
      uk: 'Універсал. Однаково впевнено атакував і захищався, грав гострі дебюти на кшталт королівського гамбіту і спокійно маневрував у рівних позиціях.',
      en: 'A universal player. Equally confident in attack and defence, he played sharp openings like the King\'s Gambit and manoeuvred calmly in level positions.',
    },
    strengths: {
      uk: ['Універсальність', 'Атака', 'Королівський гамбіт', 'Спокій за дошкою'],
      en: ['Versatility', 'Attack', 'King\'s Gambit', 'Composure at the board'],
    },
  },
  {
    id: 'petrosian',
    pgnNames: ['Petrosian, Tigran V'],
    name: { uk: 'Тигран Петросян', en: 'Tigran Petrosian' },
    short: { uk: 'Петросян', en: 'Petrosian' },
    acc: { uk: 'Петросяна', en: 'Petrosian' },
    years: '1929–1984',
    title: { uk: '9-й чемпіон світу (1963–1969)', en: '9th World Champion (1963–1969)' },
    bio: {
      uk: 'У 1963 році переміг Ботвинника, а в 1966-му захистив титул у матчі зі Спаським. У 1969-му програв Спаському реванш. Прозваний «Залізним Тиграном» за неймовірно надійну гру.',
      en: 'Beat Botvinnik in 1963 and defended the title against Spassky in 1966, before losing the 1969 rematch to him. Nicknamed "Iron Tigran" for his incredibly solid play.',
    },
    style: {
      uk: 'Майстер профілактики: передбачав і заздалегідь гасив задуми суперника. Знаменитий позиційними жертвами якості, які роками вивчають шахісти.',
      en: 'A master of prophylaxis who foresaw and neutralised the opponent\'s plans in advance. Famous for positional exchange sacrifices that players still study.',
    },
    strengths: {
      uk: ['Профілактика', 'Захист', 'Жертви якості', 'Надійність'],
      en: ['Prophylaxis', 'Defence', 'Exchange sacrifices', 'Solidity'],
    },
  },
  {
    id: 'kramnik',
    pgnNames: ['Kramnik,V'],
    name: { uk: 'Володимир Крамник', en: 'Vladimir Kramnik' },
    short: { uk: 'Крамник', en: 'Kramnik' },
    acc: { uk: 'Крамника', en: 'Kramnik' },
    years: '1975',
    title: { uk: '14-й чемпіон світу (2000–2007)', en: '14th World Champion (2000–2007)' },
    bio: {
      uk: 'У 2000 році в Лондоні сенсаційно переміг Гаррі Каспарова, не програвши жодної партії. У 2006 році об\'єднав титул, вигравши у Веселина Топалова, і в 2007-му поступився короною Ананду. Завершив кар\'єру в 2019 році.',
      en: 'In London in 2000 he sensationally beat Garry Kasparov without losing a game. In 2006 he unified the title by beating Veselin Topalov and passed the crown to Anand in 2007. He retired in 2019.',
    },
    style: {
      uk: 'Глибоке позиційне розуміння і бездоганна підготовка. Саме Крамник у матчі з Каспаровим зробив популярним «берлінський захист», яким потім грала вся шахова еліта.',
      en: 'Deep positional understanding and flawless preparation. In the match against Kasparov he made the Berlin Defence popular, and the whole elite took it up afterwards.',
    },
    strengths: {
      uk: ['Дебютна підготовка', 'Позиційна гра', 'Ендшпіль', 'Надійність'],
      en: ['Opening preparation', 'Positional play', 'Endgames', 'Solidity'],
    },
  },
  {
    id: 'polgar',
    pgnNames: ['Polgar, Judit', 'Polgar,Ju'],
    name: { uk: 'Юдіт Полгар', en: 'Judit Polgár' },
    short: { uk: 'Полгар', en: 'Polgár' },
    acc: { uk: 'Юдіт Полгар', en: 'Judit Polgár' },
    years: '1976',
    title: { uk: 'Найсильніша шахістка в історії', en: 'The strongest female player in history' },
    bio: {
      uk: 'Угорка. У 1991 році стала гросмейстеркою в 15 років і 4 місяці, побивши рекорд Фішера. Єдина жінка, яка входила до десятки найсильніших шахістів світу (8-ме місце, 2004) і перевищила рейтинг 2700. Завершила кар\'єру в 2014 році.',
      en: 'A Hungarian who became a grandmaster in 1991 at 15 years and 4 months, breaking Fischer\'s record. The only woman to reach the world top ten (8th, 2004) and to pass a 2700 rating. She retired in 2014.',
    },
    style: {
      uk: 'Агресивний атакувальний стиль. Полгар охоче йшла на загострення і жертви, щоб перевести гру в тактичну боротьбу, де вона була особливо сильна.',
      en: 'An aggressive attacking style. Polgár readily sharpened the game and sacrificed material to steer it into tactical battles, where she was especially strong.',
    },
    strengths: {
      uk: ['Атака', 'Тактика', 'Жертви', 'Бойовий характер'],
      en: ['Attack', 'Tactics', 'Sacrifices', 'Fighting spirit'],
    },
  },
  {
    id: 'smyslov',
    pgnNames: ['Smyslov, Vassily'],
    name: { uk: 'Василь Смислов', en: 'Vasily Smyslov' },
    short: { uk: 'Смислов', en: 'Smyslov' },
    acc: { uk: 'Смислова', en: 'Smyslov' },
    years: '1921–2010',
    title: { uk: '7-й чемпіон світу (1957–1958)', en: '7th World Champion (1957–1958)' },
    bio: {
      uk: 'Тричі грав матчі за корону з Ботвинником. У 1957 році виграв, але наступного року програв реванш. Грав на найвищому рівні десятиліттями і в 1984 році, у 63 роки, дійшов до фіналу претендентів.',
      en: 'Played three title matches against Botvinnik, winning in 1957 but losing the rematch a year later. He stayed at the top for decades and reached the Candidates final in 1984 at the age of 63.',
    },
    style: {
      uk: 'Гармонія і природність. Смислов розставляв фігури так, ніби вони самі знали своє місце, і славився майстерністю в ендшпілі.',
      en: 'Harmony and naturalness. Smyslov placed his pieces as if they knew where they belonged, and he was renowned for his endgame skill.',
    },
    strengths: {
      uk: ['Ендшпіль', 'Гармонія фігур', 'Позиційне чуття', 'Довголіття в спорті'],
      en: ['Endgames', 'Piece harmony', 'Positional feel', 'Longevity'],
    },
  },
  {
    id: 'steinitz',
    pgnNames: ['Steinitz, William'],
    name: { uk: 'Вільгельм Стейніц', en: 'Wilhelm Steinitz' },
    short: { uk: 'Стейніц', en: 'Steinitz' },
    acc: { uk: 'Стейніца', en: 'Steinitz' },
    years: '1836–1900',
    title: { uk: '1-й офіційний чемпіон світу (1886–1894)', en: '1st official World Champion (1886–1894)' },
    bio: {
      uk: 'Народився в Празі. У 1886 році переміг Йоганна Цукерторта в першому офіційному матчі за звання чемпіона світу. Тримав титул до 1894 року, коли програв Емануїлу Ласкеру.',
      en: 'Born in Prague. In 1886 he beat Johannes Zukertort in the first official World Championship match and held the title until 1894, when he lost to Emanuel Lasker.',
    },
    style: {
      uk: 'Батько позиційної школи. Стейніц сформулював принципи накопичення дрібних переваг і показав, що атака має бути обґрунтована позицією, а не лише сміливістю.',
      en: 'The father of positional chess. Steinitz formulated the principles of accumulating small advantages and showed that an attack must be justified by the position, not just by daring.',
    },
    strengths: {
      uk: ['Позиційна теорія', 'Захист', 'Накопичення переваг', 'Упертість'],
      en: ['Positional theory', 'Defence', 'Accumulating advantages', 'Tenacity'],
    },
  },
]

// Порядок у списку — від найвідоміших
const ORDER = ['kasparov', 'carlsen', 'fischer', 'karpov', 'capablanca', 'tal', 'botvinnik', 'alekhine', 'morphy',
  'lasker', 'spassky', 'petrosian', 'kramnik', 'anand', 'polgar', 'smyslov', 'steinitz', 'short']
export const GMS: GmProfile[] = ORDER.map((id) => ALL.find((g) => g.id === id)!).filter(Boolean)

export function gmForPgnName(pgnName: string): GmProfile | undefined {
  return GMS.find((g) => g.pgnNames.includes(pgnName))
}

export function gmById(id: string | null): GmProfile | undefined {
  return id ? GMS.find((g) => g.id === id) : undefined
}
