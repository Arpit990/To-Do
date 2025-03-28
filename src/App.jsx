import { useState } from 'react'

import { InlineIcon } from '@iconify/react';
import TodoApp from './components/ToDo';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TodoApp />
    </>
  )
}

export default App
