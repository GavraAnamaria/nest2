import React from "react";

const UserProfilePage = () => (
    <div>
        <div id={'menu'} className={"profile"}>
           <div id={'img'} className={"profile profile_img"}>
               <button  className={"profileImgBtn"}>ADD PHOTO</button>
           </div>
            <ul className={"op"}>
                <li>PROFILE</li>
                <li>SETTINGS</li>
            </ul>
        </div>
    </div>
);

export default UserProfilePage;