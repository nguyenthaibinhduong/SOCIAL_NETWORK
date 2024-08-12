import { useQuery } from '@tanstack/react-query';
import './listlike.css'
import { Link } from "react-router-dom";
import { makeRequest } from '../../axios';
import FollowButton from '../follow/followBtn';
import { AuthContext } from '../../context/authContext';
import { useContext } from 'react';
function ListLike({ Setopenlike, post_id }) {
    const { isPending, isError, data} = useQuery({
        queryKey: ['likeuser'+post_id,post_id],
        queryFn: () => makeRequest.get('/likes/users?post_id=' + post_id).then(res => {
            return res.data;
        }),
    });
    const { currentUser } = useContext(AuthContext);
    return (<>
                <div className="update-box p-3">
                    <div className='w-100 d-flex justify-content-between'>
                        <div>
                            <h4 className='text-primary'>List users liked</h4> 
                        </div>
                        <button className="btn" onClick={() => Setopenlike(false)}>X</button>
                    </div>
                    <div className="table-responsive">
						<table className="table v-middle m-0">
                    <tbody>
                        {isError?"Somthing went wrong !":(isPending?"Loading...":data.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <img src={"../upload/"+user.profile_image} className="rounded-circle" alt="User" width="40" />
                                        <span className='ms-2'><Link to={"/profile/"+user.id}>{user.name}</Link></span>
                                    </td>
                                 {currentUser.id!==user.id ?   
                                    <td className='d-flex justify-content-end'>
                                     
                                        <FollowButton user_id={user.id} />
                                    
                                    </td>
                                    :
                                    <td></td>
                                }
								</tr>
                        )))}
                        
								
   
							</tbody>
						</table>
					</div>
                    
                </div>
    </>);
}

export default ListLike;