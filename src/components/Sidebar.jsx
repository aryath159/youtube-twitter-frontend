
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'


function Sidebar() {

    const {user} = useContext(AuthContext)
  return (
        <aside className='sidebar'>
            <nav>
                    <Link to="/"  className="sidebar-link">
                    Home
                    </Link>

                    <Link to="/history"  className="sidebar-link">
                    History
                    </Link>

                    <Link to="/liked"  className="sidebar-link">
                    Liked Videos
                    </Link>

                    <div className="sidebar-section-title">
                        Creator
                    </div>

                    <Link to="/upload"  className="sidebar-link">
                    Upload
                    </Link>

                    <Link  to="/dashboard"  className="sidebar-link">
                    Dashboard
                    </Link>

                    <Link to={`/channel/${user?.username}`}  className="sidebar-link">
                    Channel
                    </Link>
                   
                    <div  className="sidebar-section-title">
                        Account
                    </div>

                    <Link to="/profile" className="sidebar-link">
                    Profile
                    </Link>

            </nav>
        </aside>
  )
}

export default Sidebar
