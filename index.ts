import React, { useCallback, useEffect, useReducer, useRef } from 'react'

export interface RoverProps {
  tabIndex: number
  onFocus(e: React.FocusEvent): void
  onKeyDown(e: React.KeyboardEvent): void
}

export interface TargetProps {
  tabIndex: number
  ref(element: HTMLElement | null): void
}

export interface RovingIndexReturn {
  activeIndex: number
  roverProps: RoverProps
  getTargetProps(index: number): TargetProps
}

interface ReducerAction {
  type: 'prev' | 'next'
}

interface ReducerActionWithValue {
  type: 'set'
  value: number
}

function reducer(
  state: number,
  action: ReducerAction | ReducerActionWithValue
): number {
  switch (action.type) {
    case 'set':
      return action.value
    case 'prev':
      return state - 1
    case 'next':
      return state + 1
    default:
      throw new Error()
  }
}

export function useRovingIndex(): RovingIndexReturn {
  const [activeIndex, dispatch] = useReducer(reducer, 0)
  const initialized = useRef(false)
  const targets = useRef<Array<HTMLElement | null>>([])

  // collects all targets during rendering
  const getTargetRef = useCallback((ref: HTMLElement | null) => {
    if (targets.current.includes(ref)) return

    targets.current.push(ref)
  }, [])

  const getTargetProps = useCallback(
    (index: number) => ({
      ref: getTargetRef,
      tabIndex: activeIndex === index ? 0 : -1,
    }),
    [activeIndex, getTargetRef]
  )

  const focusPrevItem = useCallback(() => {
    // clamp to 0 and above only
    if (activeIndex - 1 >= 0) {
      dispatch({ type: 'prev' })
    }
  }, [activeIndex])

  const focusNextItem = useCallback(() => {
    // clamp navigation to target bounds
    if (activeIndex + 1 < targets.current.length) {
      dispatch({ type: 'next' })
    }
  }, [activeIndex])

  // children get focus
  const onFocus = useCallback((e: React.FocusEvent) => {
    // catch unlikely case where container received focus
    if (e.target === e.currentTarget) {
      return
    }

    const targetIndex = targets.current.indexOf(
      e.nativeEvent.target as HTMLElement
    )

    // one of the targets received focus
    if (targetIndex >= 0) {
      // update `activeIndex`
      dispatch({
        type: 'set',
        value: targetIndex,
      })
    }
  }, [])

  // watch for arrow keys
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isRtl =
        getComputedStyle(e.currentTarget as HTMLElement).direction === 'rtl'

      switch (e.key) {
        case isRtl ? 'ArrowLeft' : 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          focusNextItem()
          break
        case isRtl ? 'ArrowRight' : 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          focusPrevItem()
          break
      }
    },
    [focusPrevItem, focusNextItem]
  )

  // watch for new active item and focus it
  useEffect(() => {
    if (initialized.current) {
      targets.current[activeIndex]?.focus()
    } else {
      initialized.current = true
    }
  }, [activeIndex])

  return {
    activeIndex,
    roverProps: { tabIndex: -1, onFocus, onKeyDown },
    getTargetProps,
  }
}
