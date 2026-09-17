import React, { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ onSearch }) {

  const navigate = useNavigate() ;

  const { user , logout} = useContext(AuthContext);
  const [searchquery , setSearchquery] = useState(null) ;

  const handlelogout = async () =>{
      await logout() ;
      navigate("/login") ;
  }

  const handleSearch = (e) =>{

    e.preventDefault() ;

    const trimmed = searchquery.trim() ;

    if(trimmed){

      navigate(`/?q=${encodeURIComponent(trimmed)}`) ;

      onSearch?.(trimmed) ;


    }else{

        navigate('/');
        onSearch?.('') ;
    }


  }

  return (
    <>
      <header className="navbar">
        {/* navbar left  */}
        <div  className="navbar-left">
          <Link
            to="/"
            className="navbar-logo">
            <span className='logo-icon'>▶</span>VideoTube
          </Link>
        </div>

        {/* navbar central */}
        <form onSubmit={handleSearch} className="navbar-search">

          <input 
            type='text'
            placeholder='Search Videos ...'
            value={searchquery}
            onChange={(e) => setSearchquery(e.target.value)}
            // for screen readers 
            aria-label="Search videos" 
          />
          <button
          type="submit" >🔍</button>

        </form>


        {/* navbar right */}
        <div className="navbar-right">
          {user ? (<>
            {/* logged in */}
            <Link to='/upload'   className="btn btn-outline" >Upload</Link>
            <Link to='/dashboard' className="btn btn-outline">Studio</Link>

            <div className='navbar-user'>
              <img
                src={user.avatar}
                className='navbar-avatar'
              />

              {/* drop down - when clicked the avatar */}


              <div className="navbar-dropdown">

                <div className="dropdown-username">{user?.username}
                </div> 



                <button
                  type='button'
                  onClick={handlelogout}>
                  Logout
                </button>

              </div>
            </div>
          </>)
          
          :
          
          (<>

            <Link
              to="/login"
              className="btn btn-outline">
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-primary">
              Sign Up
            </Link>



          </>)}
        </div>

      </header>
    </>
  )
}

export default Navbar;

{/* <header>
│
├── navbar-left
│   └── Logo
│
├── navbar-search
│   ├── input
│   └── button
│
└── navbar-right
    ├── If logged in
    │   ├── Upload
    │   ├── Studio
    │   └── User avatar/dropdown
    │
    └── If NOT logged in
        ├── Login
        └── Sign Up */}


// This code creates the top navigation bar (Navbar) of your VideoTube application.

// Think of it as the bar that stays at the top of the website:

// ┌─────────────────────────────────────────────────────────────────────┐
// │ ▶ VideoTube     [ Search videos... 🔍 ]       Upload  Studio  👤   │
// └─────────────────────────────────────────────────────────────────────┘

// And importantly, what appears on the right depends on whether the user is logged in or not.


// handle search function - how it is related to home .. (check this )
