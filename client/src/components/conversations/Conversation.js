import { useEffect, useState } from "react";
import "./conversation.css"
import axios from "axios";

function Conversation({conversation,currentUser}){
    const [user,setUser]=useState("");
    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    useEffect(()=>{
     const friendId = conversation.member.find(m=>m === currentUser._id);

     const getUser = async()=>{
        try{
            const res = await axios.get("/users?userId="+ friendId);
            setUser(res.data)
            console.log(res)
        }catch(error){
            console.log(error)
        }
       
     }
     getUser()
    },[currentUser,conversation])
    return(
        <div className="conversation">
            <img className="conversationImg" src={user?.profilePicture ? PF+user.profilePicture : PF+"person/noAvatar.png"} alt="" />
            <span className="conversationName">{user.username}</span>

        </div>
    )
}
export default Conversation;