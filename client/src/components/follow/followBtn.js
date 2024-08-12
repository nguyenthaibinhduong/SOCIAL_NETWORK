import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useContext } from "react";

function FollowButton({ user_id }) {
    //Add follow
    const { currentUser } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (followed) => {
            if(followed) return makeRequest.delete('/relationships?user_id='+user_id)
            return makeRequest.post('/relationships?user_id='+user_id);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['relationships'+user_id] })
        },
    });
    // Get follower_user_id
    const { isPending:rPending, isError:rError, data:rData} = useQuery({
        queryKey: ['relationships'+user_id,user_id],
        queryFn: () => makeRequest.get('/relationships?followed_user_id=' + user_id ).then(res => {
            return res.data;
        }),
    });
    const handleFollow = () => {
        mutation.mutate(rData.includes(currentUser.id));
    }
    return ( 
        <>
            {
                ((rPending) ?
                    ("...")
                        :((rData.includes(currentUser.id)) ?
                        (<div className='d-flex justify-content-center'><button onClick={handleFollow} className='btn btn-outline-secondary'>Unfollow</button></div>) 
                        :(<div className='d-flex justify-content-center'><button onClick={handleFollow} className='btn btn-secondary text-white'>Follow</button></div>)
                    )
                )
           }
        </>
     );
}

export default FollowButton;