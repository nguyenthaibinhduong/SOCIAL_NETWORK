import { AuthContext } from '../../context/authContext';
import { Link } from "react-router-dom";
import { useContext,useState } from "react";
import Comments from '../comments/comments';
import './post.css'
import moment from "moment";
import {  useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import ListLike from '../listlike/listlike';
function Post({ post }) {
    //open comment effect
    const [opencomment, Setopencomment] = useState(false);
     //open comment menu
    const [openmenu, Setopenmenu] = useState(false);
    const [openlike, Setopenlike] = useState(false);
    const [numComments, SetnumComments] = useState();
    //get current user
    const { currentUser } = useContext(AuthContext);
    //get likes
    const { isPending, data} = useQuery({
        queryKey: ['likes',post.id],
        queryFn: () => makeRequest.get('/likes?post_id=' + post.id).then(res => {
            return res.data;
        }),
    });
    //create and delete likes
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (liked) => {
            if(liked) return makeRequest.delete('/likes?post_id='+post.id)
            return makeRequest.post('/likes?post_id='+post.id);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['likes'] })
        },
    });
    const handleLike = async(e) => {
        e.preventDefault();
        mutation.mutate(data.includes(currentUser.id));
    }
    // delete Post
    const deletemutation = useMutation({
        mutationFn: (post_id) => {
            return makeRequest.delete('/posts/'+post_id);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    });
    const handleDelete = async() => {
        deletemutation.mutate(post.id);
    }
    
    return ( 
        <>
            <div className="row">
                <div className="col-12 p-0">
					<div className="card">
                        <div className="card-body">
                            <div className='w-100 d-flex justify-content-between mb-3'>
                                <div className='user-post d-flex'>
                                    <div className='me-1'>
                                        <Link to={"/profile/"+post.user_id}><img src={'../upload/'+post.profile_image} className="rounded-circle" alt="User" width="50" /></Link>
                                    </div>
                                    <div className='me-4'>
                                        <Link to={"/profile/"+post.user_id}><span className='fw-bolder text-name'>{post.name}</span></Link>
                                        <p>{ moment(post.created_at).fromNow() }</p>
                                    </div>
                                </div>
                               
                                
                                {(post.user_id === currentUser.id) &&
                                    <div className='col-1 offset-1 '>
                                        <button onClick={() => Setopenmenu(!openmenu)} className='btn post-btn'><i className='bi bi-three-dots'></i></button>
                                        {openmenu &&
                                            <div className='menu-post'>
                                                <ul className="list-group">
                                                    <a href='' className="list-group-item">An active item</a>
                                                    <button onClick={handleDelete} className="list-group-item text-start">Delete post</button>
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                            <p className="mb-2">{post.description}</p>
                            { post.img && <img src={"/upload/" + post.img} className="card-img-bottom" alt="Best Admin Dashboards" />}
                            
                            <div className="d-flex mt-2">
                                <div className='align-item-center'>
                                     <button onClick={handleLike} className='btn p-0'>
                                    { isPending ? ("...") :
                                        (data.includes(currentUser.id)) ? (
                                        <i className="bi bi-suit-heart-fill text-danger"></i>
                                    ) : (
                                        <i className="bi bi-suit-heart"></i>
                                    )}
                                    </button>
                                    <button onClick={()=>Setopenlike(!openlike)} className='btn ps-1'>{data ? data.length:0}</button>
                                </div>
                                <button onClick={()=>Setopencomment(!opencomment)} className='btn ps-0 d-flex align-item-center'><i className="bi bi-chat "></i><p className='d-inline ps-1'> {numComments}</p></button>
                                <button className='btn ps-0 d-flex align-item-center'><i className="bi bi-share "></i><p className='d-inline ps-1'>Share</p></button>
                            </div>
                            <Comments post_id={post.id} opencomment={opencomment} SetnumComments={SetnumComments} />
                            {openlike && <ListLike Setopenlike={Setopenlike} post_id={post.id} />}
						</div>

					</div>
			    </div>
            </div>
        </>
     );
}

export default Post;
