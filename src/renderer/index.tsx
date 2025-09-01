import React from 'react'
import ReactDOM from 'react-dom'

export const App = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">Hello World!</h1>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)
