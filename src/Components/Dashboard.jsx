import React, { useState, useRef, useEffect } from "react";
import "./Dashboard.css";

const initialChats = [
  {
    id: 1,
    title: "Welcome Chat",
    messages: [{ from: "bot", text: "Hello! How can I help you today?" }]
  }
];

const Dashboard = ({ user, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(initialChats[0].id);
  const [input, setInput] = useState("");
  const [deleteChatId, setDeleteChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, isLoading]);

  const handleSend = async () => {
    if (input.trim() === "") return;
    
    // Append user's message to the current chat
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, { from: "user", text: input }]
        };
      }
      return chat;
    });
    setChats(updatedChats);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Call the backend which integrates with Azure OpenAI
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput })
      });
      const data = await response.json();

      if (data && data.reply) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    { from: "bot", text: data.reply }
                  ]
                }
              : chat
          )
        );
      } else {
        throw new Error("No reply from backend");
      }
    } catch (error) {
      console.error("Error calling backend:", error);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { from: "bot", text: "Error retrieving response." }
                ]
              }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleNewChat = () => {
    const newId = chats.length ? Math.max(...chats.map((c) => c.id)) + 1 : 1;
    const newChat = {
      id: newId,
      title: `Chat ${newId}`,
      messages: [
        { from: "bot", text: "New chat started! How can I help you?" }
      ]
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newId);
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
  };

  const handleFileButtonClick = () => {
    alert("File upload coming soon!");
  };

  const handleDeeperResearch = () => {
    alert("Deeper research triggered!");
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setDeleteChatId(id);
  };

  const handleConfirmDelete = () => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== deleteChatId));
    if (activeChatId === deleteChatId) {
      const remaining = chats.filter((chat) => chat.id !== deleteChatId);
      setActiveChatId(remaining.length ? remaining[0].id : null);
    }
    setDeleteChatId(null);
  };

  const handleCancelDelete = () => {
    setDeleteChatId(null);
  };

  return (
    <div className="dashboard-root">
      <div className={`sidebar${sidebarCollapsed ? " collapsed" : ""}`}>
        <div className="sidebar-header">
          <button
            className="sidebar-toggle-btn"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setSidebarCollapsed((c) => !c)}
          >
            {sidebarCollapsed ? (
              <svg width="28" height="28" viewBox="0 0 24 24">
                <path fill="#fff" d="M9.41 7.41 14 12l-4.59 4.59L11 18l6-6-6-6z" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24">
                <path fill="#fff" d="M14.59 16.59 10 12l4.59-4.59L13 6l-6 6 6 6z" />
              </svg>
            )}
          </button>
          {!sidebarCollapsed && (
            <>
              <h2>Chats</h2>
              <button className="new-chat-btn" onClick={handleNewChat}>+</button>
            </>
          )}
        </div>
        <ul className="chat-list">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={chat.id === activeChatId ? "active" : ""}
              onClick={() => handleSelectChat(chat.id)}
              title={sidebarCollapsed ? chat.title : undefined}
            >
              <span className="chat-title">
                {sidebarCollapsed ? (
                  <svg style={{ verticalAlign: "middle" }} width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" fill="#90e0ef" />
                  </svg>
                ) : (
                  chat.title
                )}
              </span>
              {!sidebarCollapsed && (
                <span
                  className="delete-chat-btn"
                  title="Delete chat"
                  onClick={(e) => handleDeleteClick(chat.id, e)}
                >
                  &#10006;
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="sidebar-bottom">
          <button
            className={`logout-btn${sidebarCollapsed ? " collapsed" : ""}`}
            onClick={onLogout}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M16 13v-2H7V8l-5 4 5 4v-3zm3-10H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
              />
            </svg>
            {!sidebarCollapsed && <span className="logout-text">Logout</span>}
          </button>
        </div>
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <h2>{activeChat?.title || "Chat"}</h2>
        </div>
        <div className="chat-messages">
          {activeChat?.messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.from === "user" ? "user" : "bot"}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="chat-message bot">
              <span style={{ display: "flex", alignItems: "center" }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  style={{ marginRight: 6 }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#ccc"
                    strokeWidth="2"
                    fill="none"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 12 12"
                      to="360 12 12"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
                <span style={{ color: "#aaa" }}>Thinking...</span>
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-area">
          <button
            className="icon-btn file-btn"
            title="Attach File"
            onClick={handleFileButtonClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-paperclip"
              viewBox="0 0 24 24"
            >
              <path d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l10.61-10.61a3.5 3.5 0 014.95 4.95l-10.61 10.61a2 2 0 01-2.83-2.83l9.19-9.19" />
            </svg>
          </button>
          <button
            className="icon-btn research-btn"
            title="Deeper Research"
            onClick={handleDeeperResearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-search"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <button className="send-btn" onClick={handleSend} title="Send">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
      {deleteChatId !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">Delete Chat</div>
            <div className="modal-body">Are you sure you want to delete this chat?</div>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleConfirmDelete}>
                Confirm
              </button>
              <button className="cancel-btn" onClick={handleCancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;