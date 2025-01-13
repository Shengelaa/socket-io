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

    // Cleanup function to remove the listener
    return () => {
      socket.off("sendMessage");
    };
  }, []); // Correct dependency array

  return (
    <div>
      <h1>Hello world</h1>
      {showChat ? (
        <div>
          <input
            type='text'
            placeholder='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage}>send data</button>
          <div className='container'>
            {recievedData.map((el) => (
              <div
                className={`chat ${userName === el.author ? "moveLeft" : ""}`} // Fixed className logic
                key={el.time} // Assuming time is unique
              >
                <h2>{el.message}</h2>
                <div className='flex'>
                  <h5>{el.author}</h5>
                  <h5>{el.time}</h5>
                </div>
              </div>
            ))}
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
