import { useQuery } from "@tanstack/react-query";
import Friend from "../friend/friend";
import { makeRequest } from "../../axios";
import './rightbar.css'
import { useSocket } from "../../context/socketContext";
import { Link } from "react-router-dom";
import Avatar from "../avatar/avatar";

function Rightbar() {

	const { isPending, isError, data} = useQuery({
        queryKey: ['friend'],
        queryFn: () => makeRequest.get('/users/friends').then(res => {
            return res.data;
        }),
	});
	const { onlineUsers } = useSocket();
	const {isPending:Pe, isError:Er, data:chat} = useQuery({
    	queryKey: ['listroom'],
		queryFn: () => makeRequest.get('/messages/r/list').then(res => {
		    return res.data;
		}),
    })
    return ( 
        <>
            <div className="row">
                <div className="card px-0 friend-card">
					<div className="card-header">
						<div className="card-title">Your Friends</div>
					</div>
					<div className="card-body">
						{isError?"Somthing went wrong !":(isPending?"Loading...":(data.length>0)?data.map((user) => (
							<Friend key={user.id} user={user} isOnline={onlineUsers.some((userS) => userS.userId === user.id)} />
						))
							:"You don't have any friends"
						)}
					</div>
				</div>
            </div>
            <div className="row">
                <div className="card chat-card">
					<div className="card-header">
						<div className="card-title">Online chat</div>
					</div>
					<div className="card-body">
						{Er?"Some thing went wrong !":
							Pe ? "Loading..." : 
								chat && chat.length > 1 ?
								chat.map((room) => (
									<UserOnline key={room.id} room={room} isOnline={onlineUsers.some((user) => user.userId === room.user_id)} />
								)) :
									("No users to chat !")
						}
					</div>
				</div>
            </div>
        </>
     );
}
function UserOnline({ room, isOnline }) {
	
    return (
        <>
            <Link  to={'/chat/'+room.room_id}  className="w-100 d-flex align-items-center py-2 px-1 friend-link ">
				<Avatar size={40} user={room} isOnline={isOnline} />
				<span className="ms-2"><p>{ room.name }</p></span>
            </Link>
        </>
    )
}

export default Rightbar;