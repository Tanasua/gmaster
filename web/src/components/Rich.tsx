import { Fragment, type ReactNode } from 'react'

/** Шаблон з React-вставками: <Rich text="Що зіграв {name}?" vars={{ name: <b>…</b> }} /> */
export function Rich({ text, vars }: { text: string; vars: Record<string, ReactNode> }) {
  const parts = text.split(/(\{\w+\})/)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\{(\w+)\}$/)
        return <Fragment key={i}>{m && m[1] in vars ? vars[m[1]] : p}</Fragment>
      })}
    </>
  )
}

