import { useState } from 'react';
import './sharepost.css'
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { makeRequest } from '../../axios'
import { useUser } from '../../context/userContext';
import { Link } from "react-router-dom";
function Sharepost() {
    const { CurrentUser, isPending} = useUser();
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => {
        setIsFocused(true);
    };
    const handleBlur = () => {
    setIsFocused(false);
    };
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");

    const upload = async() => { 
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post('/upload', formData);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (newPost) => {
            return makeRequest.post('/posts', newPost);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    });

    const handleClick = async(e) => {
        e.preventDefault();
        let imgUrl = "";
        if (file) imgUrl = await upload();
        mutation.mutate({description, img:imgUrl});
        setDescription("");
        setFile(null);
    }
    return ( 
        <>
             {isPending ? (
            ""
        ) : (
                <>
                    <div className="row">
                <div className="col-12 p-0">
					<div className="card">
						<div className="card-body">
							<div className='row mb-3'>
                                <div className='col-1 px-2'>
                                    <Link to={"/profile/"+CurrentUser.id}><img src={ (CurrentUser.profile_image!== null)?"../upload/"+CurrentUser.profile_image:"https://avatar.iran.liara.run/username?username="+CurrentUser.name } className="rounded-circle" alt="User" width="50" /></Link>
                                </div>
                                <div className='col-11' >
                                    <input
                                        type="text"
                                        onChange={(e) =>setDescription(e.target.value)}
                                        value={description}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        className="form-control text-start share-input "
                                        placeholder={`What's on your mind ${CurrentUser.name}?`}
                                    />
                                </div>
                            </div>
                            {file &&
                            <div className='row px-5 py-3'>
                                     <img className='img img-fluid' src={URL.createObjectURL(file)} alt="" />
                            </div>}
                                
                            <div className={`row d-flex justify-content-between pt-3 ${isFocused ? "share-button-focus" : "share-button"}`}>
                                <div className='col-8 d-flex align-items-center'>
                                    <button className='btn ps-0 d-flex align-items-center'><i className='bi bi-geo-alt-fill text-danger'></i> Location</button>
                                    <input
                                        type="file"
                                        id="file"
                                        style={{ display: "none" }}
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <label htmlFor="file">
                                       <div className='btn ps-0 d-flex align-items-center'><i className='bi bi-images text-success'></i> Image</div> 
                                    </label>
                                    <button className='btn ps-0 d-flex align-items-center'><i className='bi bi-tags-fill text-primary'></i> Tag friends</button>
                                </div>
                               <button onClick={handleClick} className='btn btn-info w-25'>Share</button>
                            </div>
						</div>
					</div>
			    </div>
            </div>
                </>
        )}
            
        </>
     );
}

export default Sharepost;