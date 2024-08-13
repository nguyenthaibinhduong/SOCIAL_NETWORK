import { useContext, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Loading from "../../components/loading/loading";

function ResetPassword() {
	const [email, setEmail] = useState ('')
	const handleChange = (e) => {
        setEmail(e.target.value);
	};
	const [errors, setErrors] = useState(null);
	const navigate = useNavigate();
	const { request_reset_password } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const handleClick = async (e) => { 
		setLoading(true);
		e.preventDefault();
		try { 
			await request_reset_password(email);
			 sessionStorage.setItem("email", email);
			navigate(`/confirm_email/reset`);
		} catch (error) {
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
								<h1 className="text-center text-primary fs-2">Confirm Email</h1>
							</div>
							<div className="mb-3">
								<label className="form-label">Your Email</label>
								<input onChange={handleChange} name="email" type="email" className="form-control" />
							</div>
							<div className="login-form-actions">
								<button onClick={handleClick} type="submit" className="btn"> <span className="icon"> <i className="bi bi-arrow-right-circle"></i> </span>Confirm</button>
							</div>
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


export default ResetPassword;
