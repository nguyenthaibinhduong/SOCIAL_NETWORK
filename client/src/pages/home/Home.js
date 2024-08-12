import Stories from "../../components/stories/stories";
import Posts from "../../components/posts/posts";
import Sharepost from "../../components/sharepost/sharepost";

function Home() {
    return ( 
        <>
            <Stories />
            <Sharepost />
            <Posts />
        </>
        
     );
}

export default Home;