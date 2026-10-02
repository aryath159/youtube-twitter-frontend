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
// more about this 2 lines in the end 
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


/*
These two lines are related, but they do two different jobs. The important thing is that navigate() changes the URL, while onSearch() calls a function that was passed into Navbar as a prop.

1. navigate(\/?q=${encodeURIComponent(trimmed)}`)`

Suppose the user types:

node js

Then trimmed is:

"node js"

and:

encodeURIComponent(trimmed)

converts it to something safe to put inside a URL:

node%20js

Therefore:

navigate(`/?q=${encodeURIComponent(trimmed)}`);

changes the browser's React Router URL to:

/?q=node%20js

navigate() comes from:

const navigate = useNavigate();

So this line is basically saying:

"Go to the Home page, and put the search text in the URL as a query parameter."

The important part is that navigate() itself does not call Home.jsx directly. It changes the URL. React Router sees that the URL has changed to /, and because / is associated with your Home component in your router, React renders/updates Home.

For example, if your routes contain something like:

<Route path="/" element={<Home />} />

then:

navigate("/?q=node")
        ↓
URL changes
        ↓
React Router sees path "/"
        ↓
Home component is rendered

Then inside Home.jsx, you can read that q value using:

const [searchParams] = useSearchParams();

const query = searchParams.get("q") || "";

So the complete relationship is:

Navbar
  │
  │ navigate("/?q=node")
  ↓
Browser URL
  │
  │ /?q=node
  ↓
React Router
  │
  ↓
Home.jsx
  │
  │ useSearchParams()
  ↓
query = "node"
2. onSearch?.(trimmed)

This one works completely differently.

onSearch is not a React Router function. It is a prop received by Navbar:

export default function Navbar({ onSearch }) {

That means some parent component can render Navbar like this:

<Navbar onSearch={someFunction} />

For example:

function App() {

    const handleSearch = (query) => {
        console.log("User searched:", query);
    };

    return (
        <Navbar onSearch={handleSearch} />
    );
}

Now inside Navbar:

onSearch?.(trimmed);

is effectively calling:

handleSearch(trimmed);

So if the user searches:

node js

then:

onSearch?.(trimmed);

causes:

handleSearch("node js");

The ?. simply means:

"Call onSearch only if it actually exists."

So:

onSearch?.(trimmed);

is roughly equivalent to:

if (onSearch) {
    onSearch(trimmed);
}
Now the important part: do these two lines actually need each other?

No.

They are independent.

This:

navigate(`/?q=${encodeURIComponent(trimmed)}`);

communicates the search through the URL.

This:

onSearch?.(trimmed);

communicates the search through a React function/prop.

They can both happen because you may have designed your application to have two ways of informing other parts of the application about the search.

For your current architecture, however, if your Home.jsx is already doing:

const [searchParams] = useSearchParams();

const query = searchParams.get("q") || "";

and then:

getAllVideos({ query })

then the URL is already enough to drive your search.

The flow can simply be:

User types "node"
       ↓
Navbar
       ↓
navigate("/?q=node")
       ↓
URL changes
       ↓
Home sees q=node
       ↓
query = "node"
       ↓
useEffect runs
       ↓
getAllVideos({ query })
       ↓
GET /videos?query=node
       ↓
Backend searches videos
       ↓
Home displays results

In that architecture, onSearch?.(trimmed) may not be necessary at all unless some other parent component is actually using the callback.

One important distinction in your code

Earlier your Navbar had:

navigate(`/?query=${encodeURIComponent(trimmed)}`);

while your Home had:

searchParams.get("q")

Those must use the same parameter name.

Either use:

// Navbar
navigate(`/?q=${encodeURIComponent(trimmed)}`);

// Home
searchParams.get("q");

or:

// Navbar
navigate(`/?query=${encodeURIComponent(trimmed)}`);

// Home
searchParams.get("query");

Since your backend expects the parameter to eventually be called query, I would use:

navigate(`/?query=${encodeURIComponent(trimmed)}`);

and:

const query = searchParams.get("query") || "";

Then onSearch is optional and only useful if you have some parent component that specifically needs to receive the search text immediately.
*/


