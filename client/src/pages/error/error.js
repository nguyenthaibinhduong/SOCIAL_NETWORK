import { useParams } from "react-router-dom";
import './error.css'
function Error() {
    const error = useParams()
    
    return (<>
        <div className="background-error d-flex justify-content-center align-items-center">
            <div>
                <h1 className="text-white">
                    Error {error&&error.error}
                </h1>
            </div>
                
        </div>
        
    </>);
}

export default Error;