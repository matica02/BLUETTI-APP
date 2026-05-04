import { render, screen, fireEvent } from '@testing-library/react'
import { CompareProvider, useCompare } from './CompareContext'

function TestConsumer() {
  const { selectedIds, addToCompare, removeFromCompare, clearCompare, isSelected, isFull } = useCompare()
  return (
    <div>
      <span data-testid="ids">{selectedIds.join(',')}</span>
      <span data-testid="is-full">{String(isFull())}</span>
      <span data-testid="selected-ep2000">{String(isSelected('ep2000'))}</span>
      <button onClick={() => addToCompare('ep2000')}>add ep2000</button>
      <button onClick={() => addToCompare('rv5')}>add rv5</button>
      <button onClick={() => addToCompare('apex300')}>add apex300</button>
      <button onClick={() => removeFromCompare('ep2000')}>remove ep2000</button>
      <button onClick={clearCompare}>clear</button>
    </div>
  )
}

function setup() {
  render(<CompareProvider><TestConsumer /></CompareProvider>)
}

test('empieza vacío', () => {
  setup()
  expect(screen.getByTestId('ids').textContent).toBe('')
  expect(screen.getByTestId('is-full').textContent).toBe('false')
})

test('agrega hasta 2 productos', () => {
  setup()
  fireEvent.click(screen.getByText('add ep2000'))
  fireEvent.click(screen.getByText('add rv5'))
  expect(screen.getByTestId('ids').textContent).toBe('ep2000,rv5')
  expect(screen.getByTestId('is-full').textContent).toBe('true')
})

test('no agrega un tercer producto', () => {
  setup()
  fireEvent.click(screen.getByText('add ep2000'))
  fireEvent.click(screen.getByText('add rv5'))
  fireEvent.click(screen.getByText('add apex300'))
  expect(screen.getByTestId('ids').textContent).toBe('ep2000,rv5')
})

test('no agrega duplicados', () => {
  setup()
  fireEvent.click(screen.getByText('add ep2000'))
  fireEvent.click(screen.getByText('add ep2000'))
  expect(screen.getByTestId('ids').textContent).toBe('ep2000')
})

test('quita un producto por id', () => {
  setup()
  fireEvent.click(screen.getByText('add ep2000'))
  fireEvent.click(screen.getByText('remove ep2000'))
  expect(screen.getByTestId('ids').textContent).toBe('')
})

test('clearCompare resetea a vacío', () => {
  setup()
  fireEvent.click(screen.getByText('add ep2000'))
  fireEvent.click(screen.getByText('add rv5'))
  fireEvent.click(screen.getByText('clear'))
  expect(screen.getByTestId('ids').textContent).toBe('')
})

test('isSelected devuelve true solo para productos seleccionados', () => {
  setup()
  expect(screen.getByTestId('selected-ep2000').textContent).toBe('false')
  fireEvent.click(screen.getByText('add ep2000'))
  expect(screen.getByTestId('selected-ep2000').textContent).toBe('true')
})
