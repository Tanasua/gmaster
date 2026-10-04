export type Side = 'white' | 'black'

export interface Position {
  fen: string
  ply: number
  moveNumber: number
  lastMove: string | null
  gmMove: string
  gmSan: string
  /** Хід гросмейстера + продовження рушія (SAN) */
  gmLine: string[]
  bestMove: string
  bestSan: string
  /** Оцінка найкращого ходу в сантипішаках з погляду того, хто ходить */
  bestCp: number
  /** uci → оцінка після ходу (сантипішаки, з погляду того, хто ходить) */
  evals: Record<string, number>
  /** 1 — очевидний, 3 — неочевидний на малій глибині */
  difficulty: 1 | 2 | 3
  /** Ключова позиція партії — кандидат на «Хід дня» */
  key: boolean
}

/** Партія в індексі (без ходів і позицій — вони довантажуються окремо) */
export interface GameMeta {
  id: string
  title: string
  hero: Side
  heroName: string
  white: string
  black: string
  event: string
  site: string
  year: string
  result: string
  /** id гросмейстера-героя (content/gms) */
  gm?: string
  /** Кількість півходів у партії */
  plies: number
  /** Позиції, де ходить герой (кандидати на «Хід дня» — keys) */
  positionCount: number
  keys: number[]
}

export interface Game extends GameMeta {
  /** Усі ходи партії (uci) від початкової позиції */
  moves: string[]
  /** Позиції, де ходить герой і є вибір (єдиний легальний хід не загадується) */
  positions: Position[]
}

export interface IndexData {
  version: number
  goodMoveCp: number
  games: GameMeta[]
}

export type Verdict = 'exact' | 'good' | 'miss' | 'skip'

export interface Attempt {
  /** '' — хід пропущено */
  userMove: string
  userSan: string
  verdict: Verdict
  points: number
  /** Втрата відносно найкращого ходу рушія, сантипішаки */
  cpLoss: number
}
