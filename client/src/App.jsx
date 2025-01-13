import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [input, setInput] = useState("");
  const [recievedData, setRecievedData] = useState([]);
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [showChat, setShowChat] = useState(false);

  const sendMessage = () => {
    const data = {
      author: userName,
      message: input,
      roomId,
      time: new Date().toISOString(),
    };
    socket.emit("sendMessage", data);
    setRecievedData((prev) => [...prev, data]);
    setInput("");
  };

  const joinRoom = () => {
    if (roomId && userName) {
      socket.emit("joinRoom", roomId);
      setShowChat(true);
    }
  };

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      console.log(data, "data from socket");
      setRecievedData((prev) => [...prev, data]);
    });

    return () => {
      socket.off("sendMessage");
    };
  }, []);

  return (
    <div>
      <h1>CHAT MADE BY LEVANI</h1>
      {showChat ? (
        <div>
          <div className='container'>
            {recievedData.map((el) => (
              <div
                className={`chat ${userName === el.author ? "moveLeft" : ""}`}
                key={el.time}>
                <div
                  className={`flex ${userName !== el.author ? "flex1" : ""}`}>
                  {userName !== el.author && <h3>{el.author} :</h3>}
                </div>
                <h5>{el.message}</h5>
              </div>
            ))}
          </div>
          <div className='Sender'>
            <input
              className='inputStyle'
              type='text'
              placeholder='Type Text.'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className='buttonStyle' onClick={sendMessage}>
              Send Message
            </button>
          </div>
        </div>
      ) : (
        <div>
          <input
            type='text'
            placeholder='username'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type='text'
            placeholder='roomId'
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join room</button>
        </div>
      )}
    </div>
  );
}

export default App;
