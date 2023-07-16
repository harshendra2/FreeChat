import "./messenger.css"
import Topbar from "../../components/topbar/Topbar"
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext} from "../../context/AuthContext";
import axios from "axios"
import io from "socket.io-client"


function Messenger(){
  const [conversation,setConversation]=useState([])
  const [currentChat,setCurrentChat]=useState(null)
  const [messages,setMessages]=useState([])
  const [newMessage,setNewMessage]=useState("")
  const [arrivalMessage,setArrivalMessage]=useState(null)
  const [onlineUsers,setOnlineUsers]=useState([])
  const socket = useRef(null);
  const {user} = useContext(AuthContext)
  const scrollRef = useRef();

  
  useEffect(() => {
    socket.current = io("http://localhost:8900");

    socket.current.emit("addUser", user._id);
   
      socket.current.on("getMessage",data=>{
       setArrivalMessage({
        sender:data.senderId,
        text:data.text,
        createAt:Date.now()
       })
      })
   

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  useEffect(()=>{
       arrivalMessage && currentChat?.member.includes(arrivalMessage.sender) && 
       setMessages((prev)=>[...prev,arrivalMessage])
  },[arrivalMessage,currentChat])

  useEffect(()=> {
    socket.current.on("getUsers", (users) => {
    setOnlineUsers(user.followings.filter((f)=>users.some((u)=>u.userId === f)))
    });
  },[user])
  

  

  useEffect(()=>{
    const getConversation = async()=>{
      try{
        const res = await axios.get("/conversations/"+user._id)
        setConversation(res.data)
      }catch(error){
       console.log(error)
      }
      
    }
    getConversation();
  },[user._id])

  useEffect(()=>{
    const getMessages = async()=>{
      try{
      const res =await axios.get("/messages/"+currentChat?._id)
      setMessages(res.data)
      }catch(error){
        console.log(error)
      }
      
    }
    getMessages();
  },[currentChat])

 const hndleSubmit = async(e)=>{
  e.preventDefault();
  const message = {
    sender:user._id,
    text:newMessage,
    conversationId: currentChat._id
    };

    const receiverId = currentChat.member.find(member=>member !==user._id)

    socket.current.emit("sendMessage",{
      senderId:user._id,
      receiverId,
      text:newMessage
    })

    try{

      const res= await axios.post("/messages",message)
      setMessages([...messages,res.data])
      setNewMessage("")
    }catch(error){
      console.log(error)
    }
    
 };
  
useEffect(()=>{
  scrollRef.current?.scrollIntoView({behavior:"smooth"});

},[messages])

    return(
        <>
      <Topbar/>
       <div className="messenger">
        <div className="chatMenu">
            <div className="chatMenuWrapper">
              <input placeholder="Search for friends" className="chatMenuInput" />
              {conversation && conversation.map((c)=>(
                <div onClick={()=>setCurrentChat(c)}>
                 <Conversation conversation={c} currentUser={user}/>
                 </div>
              ))}
             

              
            </div>
        </div>
        <div className="chatBox">
            <div className="chatBoxWrapper">
              {
               currentChat ? (
              <>
              <div className="chatBoxTop">
               {messages.map((m)=>(
                <div ref={scrollRef}>
               <Message message={m} own={m.sender === user._id}/>
               </div>
               ))}
              </div>
              <div className="chatBoxBottom">
                <textarea className="chatMessageInput" onChange={(e)=>setNewMessage(e.target.value)}
                value={newMessage}
                 placeholder="write somthing..."></textarea>
                <button onClick={hndleSubmit} className="chatSubmitButton">Send</button>
              </div>
              </>
               ):( <span className="noConversationText">Open a conversation to start chat . </span>)}
            </div>
        </div>
        <div className="chatOnline">
            <div className="chatOnlineWrapper">
               <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat}/>
            </div>
        </div>

       </div>
       </>
    )
}
export default Messenger;