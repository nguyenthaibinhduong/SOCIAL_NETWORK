import './profile.css'
import Posts from "../../components/posts/posts";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useQuery} from "@tanstack/react-query";
import ScrollToTop from '../../components/scrolltop/scrolltop';
import Info from '../../components/info/info';
function Profile() {
    // Lau user_id tu URL
    const user_id = parseInt(useLocation().pathname.split("/")[2]);
    // Lay thong tin user
    const { isPending, data} = useQuery({
        queryKey: ['user',user_id],
        queryFn: () => makeRequest.get('/users/find/' + user_id ).then(res => {
            return res.data;
        }),
    });

    return (<>
        {isPending ? (
            ""
        ) : (
                <>
                    <ScrollToTop />
                    <Info data={data} />
                    <Posts user_id={data.id} />
                </>
        )}
        
    </>);
    
}

export default Profile;