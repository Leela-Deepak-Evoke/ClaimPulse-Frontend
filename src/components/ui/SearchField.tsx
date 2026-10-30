import { useId, type InputHTMLAttributes } from 'react'
import { SearchIcon } from '../icons.tsx'
import { cx } from './cx.ts'
import InputWrap from './InputWrap.tsx'

interface SearchFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'type' | 'className' | 'children'
> {
  label: string
  wide?: boolean
}

export default function SearchField({ label, wide, ...input }: SearchFieldProps) {
  const id = useId()
  return (
    <div className={cx('search', wide && 'search--wide')}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <InputWrap icon={<SearchIcon />}>
        <input id={id} type="search" className="input" {...input} />
      </InputWrap>
    </div>
  )
}
