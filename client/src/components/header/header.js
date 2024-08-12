import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
    useQuery
} from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useUser } from "../../context/userContext";
function Header() {
	const { logout } = useContext(AuthContext);
	const navigate = useNavigate() 
	const handleLogout = async () => {
		try { 
			await logout();
			navigate("/login");
		} catch (error) {
			console.log(error.response.data);
		}

	}
	const { CurrentUser, isPending} = useUser();
	
	
	const [inputs, setInputs] = useState({
		keyword:""
	});
	var handleChange = e => {
		e.preventDefault();
        setInputs(prev=>({...prev, [e.target.name]: e.target.value }));
	}
	
	const handleSearch = (e,key) => {
		e.preventDefault();
		//window.location.href ="/search/"+key;
		navigate("/search/"+key);
	}
	return ( 
	<>
			 {isPending ? (
            ""
        ) : (
                <>
                  <div className="page-header w-100 px-5 pt-4">


					
					<ol className="breadcrumb d-md-flex d-none logo-brand">
						<li className="breadcrumb-item">
							<Link className="" to="/"><i className="bi bi-house"></i></Link>
						</li>

					</ol>
		
					<div className="header-actions-container">

						
						<div className="search-container">

							<form method="post">
							<div className="input-group">
								<input onChange={handleChange} name="keyword" type="text" className="form-control bg-light " placeholder="Search anything" />
								<button onClick={(e)=>handleSearch(e,inputs.keyword)} className="btn" type="submit">
									<i className="bi bi-search"></i>
								</button>
							</div>
							</form>

						</div>
						
						<MessengerButton   />
						
						<ul className="header-actions">
							<li className="dropdown">
								<a href="#" id="userSettings" className="user-settings" data-toggle="dropdown" aria-haspopup="true">
                            <span className="user-name d-none d-md-block">{ CurrentUser.name }</span>
									<span className="avatar">
										<img src={ (CurrentUser.profile_image!== null)?"../upload/"+CurrentUser.profile_image:"https://avatar.iran.liara.run/username?username="+CurrentUser.name } alt="Admin Templates" />
										<span className="status online"></span>
									</span>
								</a>
								<div className="dropdown-menu dropdown-menu-end" aria-labelledby="userSettings">
									<div className="header-profile-actions">
										<Link to={"/profile/"+CurrentUser.id}>Profile</Link>
										<a href="#" onClick={handleLogout}>Logout</a >
									</div>
								</div>
							</li>
                        </ul>

					</div>


				</div> 
                </>
        )}
	</>
		
        		
     );
}
function MessengerButton() {
	const { isPending,isError, data:chatroom} = useQuery({
        queryKey: ['chatroom'],
        queryFn: () => makeRequest.get('/messages/r/recent').then(res => {
            return res.data;
        }),
	});
	return (
		<>
			{isError?"Somthing went wrong !":(isPending?"Loading...":chatroom.map((room) => (
				<Link key={room.room_id} to={"/chat/"+room.room_id} className="leads d-none d-xl-flex fs-4 text-primary messenger-btn">
					<i className="bi bi-messenger"></i>
				</Link>
			)))}
		</>
	)
}
export default Header;