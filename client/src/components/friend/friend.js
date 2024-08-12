import { Link} from "react-router-dom";
import './friend.css'
import Avatar from "../avatar/avatar";
function Friend({ user , isOnline }) {
    
    return (<>
        <Link to={"/profile/"+user.id} className="w-100 d-flex justify-content-start py-2 ps-2 ">
            <Avatar size={40} user={ user } isOnline={isOnline} />
            <span className="ms-2"><p>{ user.name }</p></span>
        </Link>
    </>);
}

export default Friend;