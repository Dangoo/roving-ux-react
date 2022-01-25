import React from 'react'
import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import { useRovingIndex } from './index'

describe(useRovingIndex.name, () => {
  it('should return defined keys', () => {
    const { result } = renderHook(() => useRovingIndex())

    expect(Object.keys(result.current)).toEqual(
      expect.arrayContaining(['activeIndex', 'roverProps', 'getTargetProps'])
    )

    expect(result.current).toHaveProperty('activeIndex')
    expect(result.current).toHaveProperty('roverProps')
    expect(result.current).toHaveProperty('getTargetProps')

    expect(result.current.roverProps).toHaveProperty('onFocus')
    expect(result.current.roverProps).toHaveProperty('onKeyDown')
    expect(result.current.roverProps).toHaveProperty('tabIndex')

    const { onFocus, onKeyDown, tabIndex } = result.current.roverProps
    expect(onFocus).toBeInstanceOf(Function)
    expect(onKeyDown).toBeInstanceOf(Function)
    expect(!Number.isNaN(tabIndex)).toBeTruthy()

    expect(result.current.getTargetProps).toBeInstanceOf(Function)
  })

  it('should disable tabIndex for container', () => {
    const { result } = renderHook(() => useRovingIndex())

    expect(result.current.roverProps.tabIndex).toBe(-1)
  })

  it('should set focus to first target initially', () => {
    const Component = () => {
      const { getTargetProps, roverProps } = useRovingIndex()
      return (
        <ul {...roverProps}>
          <li {...getTargetProps(0)}>1</li>
          <li {...getTargetProps(1)}>2</li>
          <li {...getTargetProps(2)}>3</li>
        </ul>
      )
    }
    const { getByText } = render(<Component />)
    expect(document.body).toHaveFocus()
    userEvent.tab()
    expect(getByText('1')).toHaveFocus()
  })

  it('should set the activeIndex correct when using horizontal arrow keys', () => {
    const Component = () => {
      const { getTargetProps, roverProps } = useRovingIndex()

      return (
        <ul {...roverProps}>
          <li {...getTargetProps(0)}>1</li>
          <li {...getTargetProps(1)}>2</li>
          <li {...getTargetProps(2)}>3</li>
        </ul>
      )
    }

    const { getByRole, getByText } = render(<Component />)
    const rover = getByRole('list')

    expect(document.body).toHaveFocus()
    userEvent.tab()
    expect(getByText('1')).toHaveFocus()

    userEvent.keyboard('{arrowLeft}')
    expect(getByText('1')).toHaveFocus()

    userEvent.keyboard('{arrowRight}')
    expect(getByText('2')).toHaveFocus()

    userEvent.keyboard('{arrowRight}')
    expect(getByText('3')).toHaveFocus()

    userEvent.keyboard('{arrowRight}')
    expect(getByText('3')).toHaveFocus()

    userEvent.keyboard('{arrowLeft}')
    expect(getByText('2')).toHaveFocus()
  })

  it('should set the activeIndex correct when using horizontal arrow keys (RTL)', () => {
    const Component = () => {
      const { getTargetProps, roverProps } = useRovingIndex()

      return (
        // Applying `direction: rtl` to emulate cascading `dir="rtl"` which
        // JSDOM does not support
        <ul {...roverProps} style={{ direction: 'rtl' }}>
          <li {...getTargetProps(0)}>1</li>
          <li {...getTargetProps(1)}>2</li>
          <li {...getTargetProps(2)}>3</li>
        </ul>
      )
    }

    const { getByRole, getByText } = render(<Component />, {
      wrapper: ({ children }) => <div dir="rtl">{children}</div>,
    })

    expect(getComputedStyle(getByRole('list')).direction).toBe('rtl')
    const rover = getByRole('list')

    // Remember all directions are inverted to reflect RTL behavior
    expect(document.body).toHaveFocus()
    userEvent.tab()
    expect(getByText('1')).toHaveFocus()

    userEvent.keyboard('{arrowRight}')
    expect(getByText('1')).toHaveFocus()

    userEvent.keyboard('{arrowLeft}')
    expect(getByText('2')).toHaveFocus()

    userEvent.keyboard('{arrowLeft}')
    expect(getByText('3')).toHaveFocus()

    userEvent.keyboard('{arrowLeft}')
    expect(getByText('3')).toHaveFocus()

    userEvent.keyboard('{arrowRight}')
    expect(getByText('2')).toHaveFocus()
  })

  it('should set the activeIndex correct when using vertical arrow keys', () => {
    const Component = () => {
      const { getTargetProps, roverProps } = useRovingIndex()

      return (
        <ul {...roverProps}>
          <li {...getTargetProps(0)}>1</li>
          <li {...getTargetProps(1)}>2</li>
          <li {...getTargetProps(2)}>3</li>
        </ul>
      )
    }

    const { getByText, getByRole } = render(<Component />)
    const rover = getByRole('list')

    expect(document.body).toHaveFocus()
    userEvent.tab()
    expect(getByText('1')).toHaveFocus()

    userEvent.keyboard('{arrowUp}')
    expect(getByText('1')).toHaveFocus()

    userEvent.keyboard('{arrowDown}')
    expect(getByText('2')).toHaveFocus()

    userEvent.keyboard('{arrowDown}')
    expect(getByText('3')).toHaveFocus()

    userEvent.keyboard('{arrowDown}')
    expect(getByText('3')).toHaveFocus()

    userEvent.keyboard('{arrowUp}')
    expect(getByText('2')).toHaveFocus()
  })

  it('should restore focus to last state when returning', () => {
    const Component = () => {
      const { getTargetProps, roverProps } = useRovingIndex()

      return (
        <>
          <ul {...roverProps}>
            <li {...getTargetProps(0)}>1</li>
            <li {...getTargetProps(1)}>2</li>
            <li {...getTargetProps(2)}>3</li>
          </ul>
          <button type="button">Button</button>
        </>
      )
    }

    const { getByText, getByRole } = render(<Component />)
    const rover = getByRole('list')

    expect(document.body).toHaveFocus()
    userEvent.tab()
    expect(getByText('1')).toHaveFocus()

    userEvent.keyboard('{arrowRight}')
    expect(getByText('2')).toHaveFocus()

    userEvent.tab()
    expect(getByRole('button')).toHaveFocus()

    userEvent.tab({ shift: true })
    expect(getByText('2')).toHaveFocus()
  })

  it('should update activeIndex when clicking/tapping element', () => {
    const Component = () => {
      const { getTargetProps, roverProps } = useRovingIndex()

      return (
        <>
          <ul {...roverProps}>
            <li {...getTargetProps(0)}>1</li>
            <li {...getTargetProps(1)}>2</li>
            <li {...getTargetProps(2)}>3</li>
          </ul>
        </>
      )
    }

    const { getByText, getByRole } = render(<Component />)
    const rover = getByRole('list')
    const clickTarget = getByText('2')

    expect(document.body).toHaveFocus()
    userEvent.tab()
    expect(getByText('1')).toHaveFocus()

    userEvent.click(clickTarget)
    expect(clickTarget).toHaveFocus()

    userEvent.tab({ shift: true })
    userEvent.tab()
    expect(clickTarget).toHaveFocus()
  })
})
