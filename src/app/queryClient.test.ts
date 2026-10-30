import { describe, expect, it } from 'vitest'
import { queryClient } from './queryClient.ts'

describe('queryClient', () => {
  it('uses the shared default query options', () => {
    expect(queryClient.getDefaultOptions().queries).toMatchObject({
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    })
  })
})
