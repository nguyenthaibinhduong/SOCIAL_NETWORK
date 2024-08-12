
import { useContext, useEffect } from 'react';
import Messages from '../../components/messages/messages';
import NavChat from '../../components/navchat/navchat';
import './chat.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import Loading from '../../components/loading/loading';
function Chat() {
    // Lay User hien tai 
    const { currentUser } = useContext(AuthContext);
    const room_id = parseInt(useLocation().pathname.split("/")[2]);
    // Lau user_id tu URL
    const navigate = useNavigate();

    // Gọi API để lấy messages
    const { isPending, isError } = useQuery({
        queryKey: ['messages', room_id],
        queryFn: () => makeRequest.get('/messages/' + room_id).then(res => res.data),
    });

    // Điều hướng sang trang lỗi nếu xảy ra lỗi
    useEffect(() => {
        if (isError) {
            navigate('/error/404');
        }
    }, [isError, navigate]);
    
    

    return ( 
        <>

                                 
                <Messages room_id={room_id} user_id={ currentUser.id } />                           
  
        </>
        
     );
}

export default Chat;