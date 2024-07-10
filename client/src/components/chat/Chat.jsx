import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./chat.scss";
import { apiRequest } from "../../lib/apiRequests";
import { format } from "timeago.js"
import { SocketContext } from "../../context/SocketConext";

function Chat({chatsMessage}) {
    const [chats, setChat] = useState();
    const { userChats } = chatsMessage;
    const { currentUser } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);

    const handleOpenChat = async (id, reciver) => {
        const response = await apiRequest(`/chats/${id}`);
        await setChat({...response.data, reciver});
    }

    useEffect(() => {
        const read = async () => {
            try {
                await apiRequest.put(`/chats/read/${chats.chat.id}`)
            } catch (error) {
                console.log(error);
            }
        }

        if(chats && socket) {
            socket.on('getMessage', (data) => {
                if(chats.chat.id === data.chatId) {
                    setChat(prev => ({...prev, message: [...prev.message, data]}));
                    read();
                }
            })
        }

        return () => {
            socket.off('getMessage');
        };
    }, [socket, chats]);

    const handleChatSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const text = formData.get('text');
        if(!text) return;
        try {
            const response = await apiRequest.post(`/messages/${chats.chat.id}`, { text: text });
            setChat((prev) => ({ ...prev, message: [...prev.message, response.data] }));
            e.target.reset();
            socket.emit("sendMessage", {
                reciverId: chats.reciver.id,
                data: response.data
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="chat">
            <div className="messages">
                <h1>Messages</h1>
                {userChats.map((chat) => (
                    <div 
                        className="message" 
                        key={chat.id}
                        style={{
                            backgroundColor: 
                                JSON.parse(chat.seenBy).includes(currentUser.userInfo.id) ? "white" : "#fecd154e"

                        }}
                        onClick={() => handleOpenChat(chat.id, chat.reciver)}
                    >
                        <img
                            src={chat.reciver.avatar || "/noavatar.png"}
                            alt="user"
                        />
                        <span>{chat.reciver.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                ))}
            </div>
            {chats && (
                <div className="chatBox">
                    <div className="top">
                        <div className="user">
                            <img
                                src={chats.reciver.avatar || "/noavatar.png"}
                                alt=""
                            />
                            {chats.reciver.username}
                        </div>
                        <span className="close" onClick={()=>setChat(null)}>X</span>
                    </div>
                    <div className="center">
                        {chats.chat.message?.map((message)=>(
                            <div 
                                className="chatMessage" 
                                key={message.id}
                                style={{
                                    alignSelf: message.userId === currentUser.userInfo.id ? 'flex-end' : 'flex-start',
                                    textAlign: message.userId === currentUser.userInfo.id ? 'right' : 'left'
                                }}
                            >
                                <p>{message.text}</p>
                                <span>{format(message.created_at)}</span>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleChatSubmit} className="bottom">
                        <textarea name="text"></textarea>
                        <button>Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Chat;
