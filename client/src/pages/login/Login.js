import { useContext, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
function Login() {
	const [inputs, setInputs] = useState({
		username: "",
        password: "",
	});

	const [errors, setErrors] = useState(null);
	const navigate = useNavigate() 

	var handleChange = e => {
        setInputs(prev=>({...prev, [e.target.name]: e.target.value }));
	}
	
	const { login } = useContext(AuthContext);
	
	const handleLogin = async (e) => {
		e.preventDefault();
		try { 
			await login(inputs);
			navigate("/")
		} catch (error) {
			 setErrors(error.response.data);
		}

	}
	return (
		 

		<>
			<div className="container py-5">
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
						<h1 className="text-center text-primary fs-2">Login</h1>
					</div>
					<div className="mb-3">
						<label className="form-label">Username</label>
						<input onChange={handleChange} name="username" type="text" className="form-control" />
					</div>
					<div className="mb-3">
						<div className="d-flex justify-content-between">
							<label className="form-label">Password</label>
							<Link to="/reset_password" className="btn-link ml-auto">Forgot password?</Link>
						</div>
						<input onChange={handleChange} name="password" type="password" className="form-control" />
					</div>
					<div className="login-form-actions">
						<button onClick={handleLogin} type="submit" className="btn"> <span className="icon"> <i className="bi bi-arrow-right-circle"></i> </span>
							Login</button>
					</div>
					{/* <div className="login-form-actions">
						<button type="submit" className="btn"> <img src="assets/images/google.svg" className="login-icon"
								alt="Login with Google" />
							Login with Google</button>
						<button type="submit" className="btn"> <img src="assets/images/facebook.svg" className="login-icon"
								alt="Login with Facebook" />
							Login with Facebook</button>
					</div> */}
					<div className="login-form-footer">
						<div className="additional-link">
							Don't have an account? <Link to="/register"> Signup</Link>
						</div>
					</div>
				</div>
			</div>
		</form>
			</div>
		
			
        </>
    );
}

export default Login;