import { useEffect, useRef, useState} from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";
import { useSocket } from "../../context/socketContext";
import './message.css'
import moment from "moment";
import NavChat from "../navchat/navchat";
function Messages({ room_id, user_id }) {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const {isPending, isError} = useQuery({
    	queryKey: ['message','messages'+room_id,room_id,setMessages],
        queryFn: () => makeRequest.get('/messages/' + room_id).then(res => {
            setMessages(res.data);
            return res.data;
        })
    })
    
    
    // Khởi tạo kết nối Socket.IO
    const { socket } = useSocket();

    useEffect(() => {
        if (socket) {
            // Tham gia phòng
            socket.emit('joinRoom', room_id);

            // Nhận tin nhắn mới
            socket.on('receiveMessage', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
                queryClient.invalidateQueries({ queryKey: ['listroom'] });
            });

            return () => {
                socket.off('receiveMessage');
            };
        }
    }, [room_id, socket]);

   // cuon len dau trang
    const scrollRef = useRef(null);

    
    // render message theo id room va id user
    
    //get user chat
    const {isPending:fPending, isError:fError, data:friend} = useQuery({
    	queryKey: ['friend',room_id],
		queryFn: () => makeRequest.get('/users/rooms/'+room_id).then(res => {
		    return res.data;
		}),
    })
    
    //luu messages
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (messageData) => {
            return makeRequest.post('/messages/' + messageData.room_id, messageData)
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['messages'+room_id] })
        },
    });
    // SCroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    // Upload
    const [file, setFile] = useState(null);
    const upload = async() => { 
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post('/upload', formData);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }
    // Send message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        let imgUrl = "";
        if (file) imgUrl = await upload();
            const messageData = {
                room_id:room_id,
                user_id:user_id,
                message:newMessage,
                image: imgUrl
            };
            
            // Lưu tin nhắn vào cơ sở dữ liệu
            mutation.mutate(messageData);
            // Gửi tin nhắn qua Socket.IO
            if (socket) {
            // Gửi tin nhắn qua Socket.IO
                socket.emit('sendMessage', messageData);
            } else {
                console.error('Socket is not initialized');
            }
            setNewMessage('');
            setFile(null);
            queryClient.invalidateQueries({ queryKey: ['listroom'] });
    };
    //Navchat 
    
    const {isPending:rP, data:roomm} = useQuery({
    	queryKey: ['listroom'],
        queryFn: () => makeRequest.get('/messages/r/list').then(res => {
		    return res.data;
		}),
    })
    return (<>
        { rP?'...': <NavChat room={roomm}   />}
        <div className="card  chat-container product-list-block">  
        <div className='card m-0 chat-title p-2 '>
            {fError?"Somthing went wrong !":(fPending?"Loading...":friend.map((user) => (
                    <Link key={user.id} to={'/profile/'+user.id} className="w-100 d-flex justify-content-start align-items-center ps-4">
                        <img src={ (user.profile_image!== null)?"../upload/"+user.profile_image:"https://avatar.iran.liara.run/username?username="+user.name } className="rounded-circle" alt="User" width="40" height="40" />
                        <span className="ms-2"><h5>{user.name}</h5></span>
                    </Link>
            )))}
                       
            </div>
        <div ref={scrollRef} style={{ overflowY: 'scroll' }} className='chat-content px-3 pt-2'>
            {isError?"Somthing went wrong !":(isPending?"Loading...":messages.map((message) => (
                        <Message key={message.id} message={message} user_id={user_id} />
            )))}
        </div>
        {file &&
                            <div className='w-100 d-flex'>
                                     <img className='img w-25' src={URL.createObjectURL(file)} alt="" />
                            </div>}
        <div className='m-0 p-2 d-flex align-items-center'>
            <input
                type="file"
                id="file"
                style={{ display: "none" }}
                                        onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
                <div className='btn px-2 d-flex text-center align-items-center'><i className='bi bi-images text-success'></i></div> 
            </label>
            <textarea
                className="form-control chat-input"
                id="inputMessage"
                placeholder="Enter Message"
                rows="1"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            ></textarea>
           <button onClick={handleSendMessage}  className="btn btn-primary btn-rounded">Send</button>
        </div>
        </div>
    </>);
}
function Message({ message, user_id }) {
    const [opentime, setopentime] = useState(false);
    return (<>
        <div className={user_id===message.user_id?'w-100 d-flex justify-content-end':'w-100 d-flex justify-content-start'}>
            {(message.message !=='')?
                <div onClick={() => setopentime(!opentime)} className={user_id === message.user_id ? "card my-2 py-2 px-3 float-end message bg-primary text-white" : "card my-2 py-2 px-3 float-end message "}>
                
                    < p >
                        {message.message}
                    </p>
                
                {(message.image !== null) &&
                    <img src={"../upload/" + message.image} alt="" />
                    
                }
                </div>:
                (message.image !== null) &&
                        < img onClick={() => setopentime(!opentime)} src={"../upload/" + message.image} className={user_id === message.user_id ? "my-2 py-2 float-end message" : "my-2 py-2 float-end message"} alt="" />
                    
            }
            
        </div>
        {
            opentime &&
            <div className={user_id===message.user_id?'w-100 d-flex justify-content-end':'w-100 d-flex justify-content-start'}>
                <div className={user_id===message.user_id?"px-3 float-end":" px-3 float-end"}>
                    {
                        moment(message.latest_message_time).format('LLL')
                    }
                </div>
            </div>
        }
        
        

        
        
        
       
    </>);
}
export default Messages;