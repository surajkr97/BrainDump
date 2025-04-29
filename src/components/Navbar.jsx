import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex flex-row justify-center gap-4 text-blue-600'>
      <NavLink to="/">
        <h1>Home</h1>
      </NavLink>
      <NavLink to="/notes">
        <h1>Note1</h1>
        <h1>Note2</h1>
      </NavLink>
    </div>
  )
}

export default Navbar
