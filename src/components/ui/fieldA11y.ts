export function describedBy(
  id: string,
  { error, hint }: { error?: string | undefined; hint?: string | undefined },
): string | undefined {
  if (error) return `${id}-error`
  return hint ? `${id}-hint` : undefined
}
