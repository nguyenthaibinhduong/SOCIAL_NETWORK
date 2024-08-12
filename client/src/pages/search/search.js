import { useLocation } from "react-router-dom";
import PostResults from "../../components/result/postsResult";
import UserResults from "../../components/result/usersResult";
import './search.css'
import { useEffect, useState } from "react";
function Search() {
    // Lau key tu URL
    const key = useLocation().pathname.split("/")[2];
    const [page, setPage] = useState('post')
    const [searchKey, setSearchKey] = useState(key);

   useEffect(() => {
        setSearchKey(key); // Cập nhật searchKey mỗi khi key thay đổi
    }, [key]);
    return (<>
         <div className="w-100 p-0 d-flex justify-content-between">
            <button style={page === 'post' ? { backgroundColor: '#000', color:'#fff'}:{} } onClick={()=>setPage('post')} className="btn result-btn post-btn">
                Posts
            </button>
            <button style={page === 'user'? {backgroundColor:'#000',color:'#fff'}:{} } onClick={()=>setPage('user')} className="btn result-btn user-btn">
                Users
            </button>

            
        </div>
       
        { 
            page ==="post" &&<PostResults keyword={searchKey} />
        }
        { 
            page ==="user" &&<UserResults keyword={searchKey} />
        }
    </>);
}

export default Search;