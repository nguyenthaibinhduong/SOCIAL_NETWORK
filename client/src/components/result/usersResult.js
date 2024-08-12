
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../axios'
import Info from '../info/info';
import { useEffect, useState } from 'react';
function UserResults({ keyword }) {
    const [datalength,setdatalength] = useState()
    const [key, setKey] = useState(keyword)
    useEffect(() => {
        setKey(keyword); // Cập nhật searchKey mỗi khi key thay đổi
    }, [keyword]);
    const {isPending, isError, data} = useQuery({
    	queryKey: ['users', key,setdatalength],
        queryFn: () => makeRequest.get('/search/users?key=' + key).then(res => {
            setdatalength(res.data.length)
		    return res.data;
		}),
    })
    return (<>
        {datalength===0 && <p className="text-dark text-primary fs-6">No result user for { key } !</p>}
        {isError?"Somthing went wrong !":(isPending?"Loading...":data.map((user) => (
			<Info data={user} />
		)))}
    </>);
}

export default UserResults;