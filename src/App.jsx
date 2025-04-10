import { useState } from 'react'

import { InlineIcon } from '@iconify/react';
import TodoApp from './components/ToDo';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div class="container">
      <div class="mx-auto p-3 w-50">
        <TodoApp />
      </div>
    </div>
  )
}

export default App
