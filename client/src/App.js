import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([...messages, message]);
    };
    socket.on("message", receiveMessage);
    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  const handleSutmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessages([
      ...messages,
      {
        body: message,
        from: "Me",
      },
    ]);
    setMessage("");
  };

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center ">
      <form onSubmit={handleSutmit} className="bg-zinc-900 p-10">
        <h1 className="text-2x1 font-bold my-2">Chat React</h1>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border-2 border-zinc-500 p-2 text-black w-full"
        />
        <ul className="h-80 overflow-y-auto">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`bg-sky-700 p-2 my-2 rounded-md table ${
                message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"
              }`}
            >
              <p>{message.from + " " + message.body}</p>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
