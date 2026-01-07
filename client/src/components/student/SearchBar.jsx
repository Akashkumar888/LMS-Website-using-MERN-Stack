import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const SearchBar = ({ data }) => {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()

  const [input, setInput] = useState(data ? data : '')
  const [error, setError] = useState('')

  const onSearchHandler = (event) => {
    event.preventDefault()

    if (!isSignedIn) {
      setError('Please login first to search courses')
      return
    }

    setError('')
    navigate('/course-list/' + input)
  }

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={onSearchHandler}
        className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded"
      >
        <img
          src={assets.search_icon}
          alt=""
          className="md:w-auto w-10 px-3"
        />

        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Search for courses"
          className="w-full h-full outline-none text-gray-500/80"
        />

        <button
          type="submit"
          className="bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Warning message */}
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  )
}

export default SearchBar
