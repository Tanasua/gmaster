// Гросмейстери: лише дані; тексти (ім'я, біо, стиль…) — у src/locales/<мова>.json → gms.<id>
export interface GmProfile {
  id: string
  /** Імена гравця в PGN-файлах */
  pgnNames: string[]
  years: string
  /** Жіночий рід у реченнях («Що зіграла Полгар?») */
  female?: boolean
}

const ALL: GmProfile[] = [
  { id: 'kasparov', pgnNames: ['Kasparov, Gary', 'Kasparov,G'], years: '1963' },
  { id: 'carlsen', pgnNames: ['Carlsen,M'], years: '1990' },
  { id: 'fischer', pgnNames: ['Fischer, Robert James'], years: '1943–2008' },
  { id: 'tal', pgnNames: ['Tal, Mihail'], years: '1936–1992' },
  { id: 'anand', pgnNames: ['Anand,V', 'Anand, Viswanathan'], years: '1969' },
  { id: 'short', pgnNames: ['Short, Nigel D'], years: '1965' },
  { id: 'karpov', pgnNames: ['Karpov, Anatoly'], years: '1951' },
  { id: 'capablanca', pgnNames: ['Capablanca, Jose Raul'], years: '1888–1942' },
  { id: 'botvinnik', pgnNames: ['Botvinnik, Mikhail'], years: '1911–1995' },
  { id: 'alekhine', pgnNames: ['Alekhine, Alexander'], years: '1892–1946' },
  { id: 'morphy', pgnNames: ['Morphy, Paul '], years: '1837–1884' },
  { id: 'lasker', pgnNames: ['Lasker, Emanuel'], years: '1868–1941' },
  { id: 'spassky', pgnNames: ['Spassky, Boris V'], years: '1937–2025' },
  { id: 'petrosian', pgnNames: ['Petrosian, Tigran V'], years: '1929–1984' },
  { id: 'kramnik', pgnNames: ['Kramnik,V'], years: '1975' },
  { id: 'polgar', pgnNames: ['Polgar, Judit', 'Polgar,Ju'], years: '1976', female: true },
  { id: 'smyslov', pgnNames: ['Smyslov, Vassily'], years: '1921–2010' },
  { id: 'steinitz', pgnNames: ['Steinitz, William'], years: '1836–1900' },
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
