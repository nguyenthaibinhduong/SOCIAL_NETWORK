import { useState } from "react";
import {
    useMutation,
    useQueryClient,
    useQuery
} from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import moment from "moment";
import './comments.css'
import { Link } from 'react-router-dom';
import { useUser } from '../../context/userContext';
function Comments({ post_id, opencomment,SetnumComments}) {
    const { CurrentUser:user, isPending:uP} = useUser();

    const [showMore, setShowMore] = useState(true);
    
    //get comments
    const {isPending, isError, data } = useQuery({
    	queryKey: ['comments'+post_id,showMore],
		queryFn: () => makeRequest.get(showMore?('/comments/new?post_id='+post_id):('/comments?post_id='+post_id)).then(res => {
            
            return res.data; 
		}),
    })
    const { data:comment } = useQuery({
    	queryKey: ['comment-num'+post_id,SetnumComments],
        queryFn: () => makeRequest.get(('/comments?post_id=' + post_id)).then(res => {
            SetnumComments(res.data.length);
            return res.data.length; 
        }),
        
    })
    //created comments
    const [description, setDescription] = useState("");
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (newPost) => {
            return makeRequest.post('/comments', newPost);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['comment-num'+post_id,SetnumComments] });
            queryClient.invalidateQueries({ queryKey: ['comments'+post_id] })
        },
    });
    const handleClick = async(e) => {
        e.preventDefault();
        mutation.mutate({description,post_id: post_id});
        setDescription("");
    }
    const deletemutation = useMutation({
        mutationFn: (comment_id) => {
            return makeRequest.delete('/comments/'+comment_id);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['comment-num'+post_id,SetnumComments] });
            queryClient.invalidateQueries({ queryKey: ['comments'+post_id] })
        },
    });
    const handleDelete = async(id) => {
        deletemutation.mutate(id);
    }
    return ( 
        <>
            
            <div className='border-1 border-top py-2'>
                                {comment>2 && 
                    
                               
                                <div className='d-flex justify-content-start'>
                                {!showMore && <button className='btn ps-0 d-flex align-item-center' onClick={()=>setShowMore(true)}><i className="bi bi-caret-up-fill"></i>Hide comments</button>}
                                {showMore && <button className='btn ps-0 d-flex align-item-center' onClick={()=>setShowMore(false)}><i className="bi bi-caret-down-fill"></i>More comments</button>}
                                </div>}
                                {
                                    opencomment &&
                                    
                                
                                <div className="row py-4">
                            <div className='col-1 px-2'>
                                {uP ? '...' :
                                    <img src={ (user.profile_image!== null)?"../upload/"+user.profile_image:"https://avatar.iran.liara.run/username?username="+user.name } className="rounded-circle" alt="User" width="40" />
                                }
                                        
                            </div>
                                
                            <div className='col-11 d-flex'>
                                    <form method='post' className='w-100'>
                                        <div className='input-group'>
                                           
                                            <input 
                                                onChange={(e) =>setDescription(e.target.value)}
                                                value={description}
                                                type="text"
                                                className='form-control'
                                                name={"comment"+post_id}
                                            />
                                            
                                            <button type="submit" onClick={handleClick} className='btn btn-dark btn-comment'>Comment</button>
                                            
                                        </div>
                                        </form>  
                                        
                                </div>
                                
		                        </div>
                                }
                                {isError?"Somthing went wrong !":(isPending?"Loading...":data.map((comment) => (
                                    <Comment key={comment.id} comment={comment} handleDelete={ handleDelete } />
                                )))}  
            </div>
        </>
     );
}
function Comment({ comment,handleDelete }) {
    const { CurrentUser} = useUser();
    const [showmenu, setshowmenu] = useState(false);
    
    return ( 
        <>
             <div  className='row py-1'>
                                        <div className='col-1 px-2'>
                                            <img src={ (comment.profile_image!== null)?"../upload/"+comment.profile_image:"https://avatar.iran.liara.run/username?username="+comment.name } className="rounded-circle" alt="User" width="40" />
                                        </div>
                                        <div className='col-8'>
                                            <p ><Link to={"/profile/"+comment.user_id} className="fw-bolder">{comment.name}</Link> - {moment(comment.created_at).fromNow()}</p>
                                            <p>{comment.description}</p>
                                            
                                        </div>
                                        {((comment.user_id)===CurrentUser.id) &&
                                        <div className='col-3 d-flex justify-content-end'>
                                            <button onClick={()=>setshowmenu(!showmenu)} className='btn post-btn'><i className="bi bi-three-dots"></i></button>
                                            {showmenu &&
                                            <button onClick={()=>handleDelete(comment.id)} className='btn post-btn'>Delete</button>}
                                        </div>
                                        }
            </div>
        </>
     );
}
export default Comments;