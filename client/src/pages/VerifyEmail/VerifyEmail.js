import { useContext, useEffect, useState } from "react";
import { Link,  useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

function VerifyEmail() {
    
    const navigate = new useNavigate()
    const [inputs, setInputs] = useState({
		token: "",
    });
    const [errors, setErrors] = useState(null);
    var handleChange = e => {
        setInputs(prev=>({...prev, [e.target.name]: e.target.value }));
    }
    var type = useParams()
    const { verify_email,verify_reset_password } = useContext(AuthContext);
    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            if (type.type === "verify") {
                await verify_email(inputs);
                navigate("/login");
            } else if (type.type === "reset") {
                const email =sessionStorage.getItem("email")
                await verify_reset_password(inputs, email);
                
                navigate("/change_password/");
            } else {
                console.log(type.type);
                
            }
        } catch (error) {
            // Kiểm tra nếu error.response.data là một đối tượng, bạn có thể chuyển nó thành chuỗi
            setErrors(error.response.data || "An unexpected error occurred");
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
                                <h1 className="text-center text-primary fs-2">Confirm Email</h1>
                            </div>   
                            <div className="mb-3">
                                <label className="form-label text-center w-100">
                                    Your Token Expire in  
                                    <TimeLeft initialMinutes={10 } initialSeconds = {0} />
                                    
                                </label>
                                <input onChange={handleChange} name="token" type="text" className="form-control" />
                            </div>

                            <div className="login-form-actions">
                                <button onClick={handleVerify}  type="submit" className="btn"> <span className="icon"> <i className="bi bi-arrow-right-circle"></i> </span>
                                                    Confirm</button>
                            </div>
                            <div className="login-form-footer">
                                <div className="additional-link">
                                    <Link to="/confirm_email"> Go Back</Link>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </form>
            </div>
        </>
     );
}
function TimeLeft({ initialMinutes = 0,initialSeconds = 0,onTimeUp}) {
    const totalInitialSeconds = initialMinutes * 60 + initialSeconds;
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const savedEndTime = localStorage.getItem('endTime');
            if (savedEndTime) {
                const endTime = parseInt(savedEndTime, 10);
                const now = Date.now();
                const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000));
                return remainingTime;
            } else {
                // Nếu không có thời gian kết thúc, thiết lập mới
                const newEndTime = Date.now() + totalInitialSeconds * 1000;
                localStorage.setItem('endTime', newEndTime);
                return totalInitialSeconds;
            }
        };

        setTimeLeft(calculateTimeLeft());
    }, [totalInitialSeconds]);

    useEffect(() => {
        if (timeLeft <= 0) {
            console.log('Time is up!');
            if (onTimeUp) onTimeUp();
            // Đặt lại thời gian kết thúc để đếm lại
            const newEndTime = Date.now() + totalInitialSeconds * 1000;
            localStorage.setItem('endTime', newEndTime);
            setTimeLeft(totalInitialSeconds);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp, totalInitialSeconds]);

    // Lưu thời gian kết thúc vào localStorage mỗi khi timeLeft thay đổi
    useEffect(() => {
        if (timeLeft > 0) {
            const endTime = Date.now() + timeLeft * 1000;
            localStorage.setItem('endTime', endTime);
        }
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return ( 
        <>
             <span className="fw-bolder ms-1">{minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}</span>
        </>
     );
}
export default VerifyEmail;