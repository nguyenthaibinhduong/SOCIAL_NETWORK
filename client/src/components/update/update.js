import { useState } from 'react';
import './update.css'
import { makeRequest } from '../../axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
function Update({ setShowUpdate, user }) {
    // state de luu thong tin nguoi dung
    const [info, setInfo] = useState({
        name: user.name,
        city: user.city,
        website: user.website
    });
    const handleChange = (e)=>{
        setInfo((prev) => ({ ...prev, [e.target.name]: [e.target.value] }))
        
    }
    //upload
    const [cover, setCover] = useState(null)
    const [profile, setProfile] = useState(null)
    const upload = async(file) => { 
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post('/upload', formData);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }
    //update profile
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (user) => {
            return makeRequest.put('/users', user);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    });
    const handleClick = async(e) => {
        e.preventDefault();
        //co image thi lay image cu 
        let imgCover ;
        let imgProfile;
        // khong co image upload image moi 
        imgCover = cover ? await upload(cover):user.cover_image;
        imgProfile = profile ? await upload(profile) : user.profile_image;
        let data = { ...info, cover_image: imgCover, profile_image: imgProfile }
        mutation.mutate(data);
        //localStorage.setItem("user", data);
        setShowUpdate(false);
    }
    console.log(cover,profile);
    return ( 
        <>

            <div className="update-box p-3">
                <div className='w-100 d-flex justify-content-between'>
                    <div>
                        <h4 className='text-primary'>Update Profile</h4> 
                    </div>
                    <button className="btn" onClick={() => setShowUpdate(false)}>X</button>
                </div>
                <form className='w-100 p-3'>
                    <div className='row mb-2'>
                        <label> Cover Image</label>
                        <input className='form-control' type="file" onChange={(e) => setCover(e.target.files[0])} />
                    </div>
                    {cover &&
                            <div className='row px-5 py-3'>
                                     <img width={100} height={50} className='img img-fluid' src={URL.createObjectURL(cover)} alt="" />
                            </div>}
                    <div className='row mb-2'>
                        <label> Profile Image</label>
                        <input className='form-control' type="file" onChange={(e) => setProfile(e.target.files[0])} />
                    </div>
                    {profile &&
                            <div className='row px-5 py-3'>
                                     <img width={50} height={50} className='img img-fluid' src={URL.createObjectURL(profile)} alt="" />
                            </div>}
                    <div className='row mb-2'>
                        <label> Full Name</label>
                        <input value={info.name} className='form-control' type="text" name='name' onChange={handleChange} />
                    </div>
                    <div className='row mb-2'>
                        <label>City</label>
                        <input value={info.city} className='form-control' type="text" name='city' onChange={handleChange} />
                    </div>
                    <div className='row mb-2'>
                        <label>Website</label>
                        <input value={info.website} className='form-control' type="text" name='website' onChange={handleChange} />
                    </div>
                    <div className='w-100 d-flex justify-content-center'>
                        <button onClick={handleClick} className='btn btn-success'>Update</button>
                    </div>
                </form>
                </div>

              
        </>
     );
}

export default Update;