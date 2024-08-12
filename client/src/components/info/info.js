import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import './info.css';
import { makeRequest } from '../../axios';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import Update from '../update/update';
import FollowButton from '../follow/followBtn';
import ChatButton from '../chatbutton/chatbutton';
function Info({ data }) {
    const { currentUser } = useContext(AuthContext);
    // open Update model 
    const [showUpdate, setShowUpdate] = useState(false);
    const handleUpdate = () => {
        setShowUpdate(!showUpdate);
    }
    return (<>
                <div className="row images">
                        <img src={( data.cover_image!==null)?'../upload/'+ data.cover_image:"https://placeholder.pics/svg/300/DEDEDE/555555/none%20BACKGROUND"} alt="" className="cover-img" />
                        <img src={ (data.profile_image!== null)?"../upload/"+data.profile_image:"https://avatar.iran.liara.run/username?username="+data.name } alt="" className="profile-img" />
                    </div>
                    <div className="row profile-info mb-3">
                        <div className="col-2 d-flex justify-content-start align-items-end">
                        
                        </div>
                        <div className="col-8 center-profile">
                            <h1 className="text-center fs-1">{data.name}</h1>
                            {(data.id == currentUser.id) ?
                                (<div className='d-flex justify-content-center'><button onClick={handleUpdate} className='btn btn-secondary'>Update</button></div>)
                                 :
                                 <FollowButton user_id={data.id} />
                                 }
                        </div>
                        <div className="col-2 d-flex justify-content-end align-items-start pt-3">
                            <ChatButton user_id={ data.id } />
                            <button className="btn px-1"><i className='bi bi-three-dots-vertical'></i></button>
                        </div>
        </div>
        {showUpdate && <Update setShowUpdate={setShowUpdate} user={data} />}
    </>);
}

export default Info;