import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
	const [inputs, setInputs] = useState({
		'password': '',
		'confirm_password': ''
	})
	const [errors, setErrors] = useState(null);
	var handleChange = e => {
        setInputs(prev=>({...prev, [e.target.name]: e.target.value }));
	}
	const { change_password } = useContext(AuthContext)
	const navigate = useNavigate();
	const handleClick = async (e) => {
		e.preventDefault();
		try { 
			await change_password(inputs);
			navigate("/login");
		} catch (error) {
			 setErrors(error.response.data);
		}

	}
    return ( 
        <>
           <div className="container py-4">
				<div className="row justify-content-center">
					{errors&&
                    <div className="alert alert-danger" role="alert">
                       { errors}
					</div>
				}
				</div>
				<form method="post">
					<div className="login-box">
						<div className="login-form">
                            <div className="login-welcome">
						<h1 className="text-center text-primary fs-2">Change Password</h1>
					</div>
					<div className="mb-3">
						<div className="d-flex justify-content-between">
							<label className="form-label">New Password</label>
						</div>
						<input onChange={handleChange}  name="password" type="password" className="form-control" />
                            </div>
                    <div className="mb-3">
						<div className="d-flex justify-content-between">
							<label className="form-label"> Confirm Password</label>
						</div>
						<input onChange={handleChange}  name="confirm_password" type="password" className="form-control" />
					</div>
					<div className="login-form-actions">
						<button onClick={handleClick}  type="submit" className="btn"> <span className="icon"> <i className="bi bi-arrow-right-circle"></i> </span>
							Change Password</button>
					</div>
						</div>
					</div>
				</form>
            </div> 
        </>
     );
}
export default ChangePassword;