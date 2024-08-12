import { Link } from "react-router-dom";
import { useSocket } from "../../context/socketContext";
import Avatar from "../avatar/avatar";
import { useEffect, useState } from "react";

function NavChat({room}) {
    const [roomnav, setRoomnav] = useState(room);
    useEffect(() => {
        setRoomnav(room)
    },[room])
    const { onlineUsers } = useSocket();
    return (<>
        <div className="chat-nav">
            <h4 className="chat-nav-title text-center pt-2">List Messages</h4>
            <div className="px-2 chat-nav-content">
                {roomnav.map((room) => (
                    < UserInfo
                        key={room.id}
                        room={room}
                        isOnline={onlineUsers.some((user) => user.userId === room.user_id)}
                        isSeen={false}
                    />
                ))}
                
            </div>
        </div>
    </>);
}
function UserInfo({ room ,isOnline, isSeen  }) {
    

    const truncatedString = (str, length) => {
        if (!str) return "No messages yet"; // Xử lý trường hợp chuỗi null hoặc undefined
        str = str.toString();
        if (str.length <= length) {
            return str;
        }
        return str.slice(0, length) + '...'; 
    };
    return (
        <>
            <Link  to={'/chat/'+room.room_id}  className="w-100 d-flex align-items-center py-2 px-1 friend-link ">
                <Avatar size={40} user={room} isOnline={isOnline} />
                <span className="ms-2"><p className="fw-bolder">{ room.name }</p><p className={isSeen&&"fw-bolder"}>{truncatedString(room.latest_message,30)}</p></span>       
            </Link>
        </>
    )
}
export default NavChat;