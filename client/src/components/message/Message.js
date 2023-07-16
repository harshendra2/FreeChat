import "./message.css"
import {format} from "timeago.js"

function Message({message,own}){
    return(
        <div className={own ? "message own" : "message"}>
        <div className="messageTop">
            <img className="messageImg" src="https://th.bing.com/th/id/OIP.Bt86cFV63I4JaLKFhk6sPwHaEK?w=319&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt=""/>
            <p className="messageText">{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    )
}
export default Message;