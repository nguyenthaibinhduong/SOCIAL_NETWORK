function Avatar({size,user,isOnline}) {
    return (<>
        <img src={(user.profile_image!== null)?"../upload/"+user.profile_image:"https://avatar.iran.liara.run/username?username="+user.name} className={(isOnline)?'rounded-circle online-avt':'rounded-circle'} alt="User" width={size} height={size} />
        {isOnline&&<span class="online-dot"></span>}
    </>);
}

export default Avatar;