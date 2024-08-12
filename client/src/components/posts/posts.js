import Post from "../post/post";
import { useQuery} from '@tanstack/react-query'
import { makeRequest } from '../../axios'
function Posts({user_id}) {
	const {isPending, isError, data} = useQuery({
    	queryKey: ['posts',user_id],
		queryFn: () => makeRequest.get((user_id !== undefined)?('/posts?user_id='+user_id):('/posts')).then(res => {
		    return res.data;
		}),
	})
	return (<>
		{isError?"Somthing went wrong !":(isPending?"Loading...":data.map((post) => (
			<Post key={post.id} post={post} />
		)))}
    </>);
}

export default Posts;