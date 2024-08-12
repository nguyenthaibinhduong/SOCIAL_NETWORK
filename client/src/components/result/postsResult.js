import Post from "../post/post";
import { useQuery} from '@tanstack/react-query'
import { makeRequest } from '../../axios'
import { useEffect, useState } from "react";
function PostResults({ keyword }) {
    const [datalength,setdatalength] = useState()
    const [key, setKey] = useState(keyword)
    useEffect(() => {
        setKey(keyword); // Cập nhật searchKey mỗi khi key thay đổi
    }, [keyword]);
    const {isPending, isError, data} = useQuery({
    	queryKey: ['posts',key,setdatalength],
        queryFn: () => makeRequest.get('/search/posts?key=' + key).then(res => {
            setdatalength(res.data.length);
		    return res.data;
		}),
    })
    
    return (<>
        {datalength === 0 && <p className="text-dark text-primary fs-6">No result post for { key } !</p>}
        {isError?"Somthing went wrong !":(isPending?"Loading...":data.map((post) => (
			<Post key={post.id} post={post} />
		)))}
    </>);
}

export default PostResults;