import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";
function ChatButton({ user_id }) {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: (user_ids) => {
            return makeRequest.post('/messages/r/new',{user_ids:user_ids} );
        },
        onSuccess: (data) => {
            // Invalidate and refetch
            
            navigate('/chat/'+data.data.room_id);
        },
    });
    const handleClick = () => {
        const user_ids = [currentUser.id,user_id];
        mutation.mutate(user_ids);
    };
    return (<>
        <button onClick={ handleClick} className="btn px-1"><i className='bi bi-chat-text'></i></button>
    </>);
}

export default ChatButton;