

function Leftbar() {
    return ( 
        <div className="card p-2">
           <ul className="nav flex-column">
                <li className="nav-item">
                    <a className="nav-link friend-link" href="#"><i className="bi bi-house-door-fill"></i> Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link friend-link" href="#"><i className="bi bi-messenger"></i> Chat</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link friend-link" href="#"><i className="bi bi-people-fill"></i> Friend</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link friend-link" href="#" ><i className="bi bi-caret-right-square-fill"></i> Watch</a>
                </li>
            </ul>
            
        </div>
     );
}

export default Leftbar;