import axios from "axios";
import {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/loading/loading";
function Register() {

	const [inputs, setInputs] = useState({
		username: "",
		email: "",
		password: "",
		confirm_password: "",
		name: "",
	});

    const [errors, setErrors] = useState(null);
	const navigate = useNavigate()
    var handelChange = e => {
        setInputs(prev=>({...prev, [e.target.name]: e.target.value }));
    }
    const [loading, setLoading] = useState(false);
	var handleClick = async (e) => {
		setLoading(true);
        e.preventDefault();
        try {
			await axios.post(process.env.REACT_APP_API_URL+"/api/auth/register", inputs);
			navigate("/confirm_email/verify");
		} catch (error) {
			//console.error(error);
		setLoading(true);
           	setErrors(error.response.data);
        }
	}
	
    return ( 
		<>
			{loading && <Loading />}
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
						<h1 className="text-center text-primary fs-2">Resgister</h1>
					</div>
					<div className="mb-3">
						<label className="form-label">Your Full Name</label>
						<input onChange={handelChange} name="name" type="text" className="form-control" />
                    </div>
					<div className="mb-3">
						<label className="form-label">Username</label>
						<input onChange={handelChange} name="username" type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
						<label className="form-label">Email</label>
						<input onChange={handelChange} name="email" type="email" className="form-control" />
					</div>

					<div className="mb-3">
						<div className="d-flex justify-content-between">
							<label className="form-label">Password</label>
						</div>
						<input onChange={handelChange} name="password" type="password" className="form-control" />
                            </div>
                    <div className="mb-3">
						<div className="d-flex justify-content-between">
							<label className="form-label"> Confirm Password</label>
						</div>
						<input onChange={handelChange} name="confirm_password" type="password" className="form-control" />
					</div>
					<div className="login-form-actions">
						<button onClick={handleClick} type="submit" className="btn"> <span className="icon"> <i className="bi bi-arrow-right-circle"></i> </span>
							Signup</button>
					</div>
					{/* <div className="login-form-actions">
						<button type="submit" className="btn"> <img src="assets/images/google.svg" className="login-icon"
								alt="Signup using Gmail" />
							Signup using Gmail</button>
					</div> */}
					<div className="login-form-footer">
						<div className="additional-link">
							Already have an account? <Link to="/login"> Login</Link>
						</div>
					</div>
				</div>
			</div>
		</form>
            </div>

        </>
     );
}

export default Register;
