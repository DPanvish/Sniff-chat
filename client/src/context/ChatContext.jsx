import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";


export const ChatContext = createContext();

export const ChatProvider = ({children}) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {axios, socket} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers = async() => {
        try{
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        }catch(err){
            toast.error(err.message);
        }
    } 

    // function to get messages for the selected user
    const getMessages = async(userId) => {
        try{
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        }catch(err){
            toast.error(err.message);
        }
    }

    // function to send message to the selected user
    const sendMessage = async(messageData) => {
        try{
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((previousMessages) => [...previousMessages, data.newMessage]);
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message);
        }
    }

    // function to subscribe to message for selected user
    const subscribeToMessasges = async() => {
        if(!socket){
            return;
        }

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((previousMessages) => [...previousMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((previousUnseenMessages) => ({
                    ...previousUnseenMessages,
                    [newMessage.senderId] : previousUnseenMessages[newMessage.senderId] ? previousUnseenMessages[newMessage.senderId] + 1 : 1,
                }))
            }
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if(socket){
            socket.off("newMessage");
            setUnseenMessages({});
        }
    }

    useEffect(() => {
        subscribeToMessasges();
        return () => {
            unsubscribeFromMessages();
        }
    }, [socket, selectedUser])

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}