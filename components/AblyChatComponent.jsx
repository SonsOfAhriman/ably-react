import React, { useEffect, useState } from "react";
import { useChannel } from "./AblyReactEffect";
import styles from "./AblyChatComponent.module.css";
import { getDatabase, ref, set, update, get, child } from "firebase/database";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

const AblyChatComponent = () => {
  let inputBox = null;
  let messageEnd = null;
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [chatId, setChatId] = useState(router.query.id);
  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState([]);
  const [originalMessages, setOriginalMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(user);
  const messageTextIsEmpty = messageText.trim().length === 0;

  const [channel, ably] = useChannel(chatId, (message) => {
    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

  useEffect(() => {
    messageEnd.scrollIntoView({ behaviour: "smooth" });
  }, [messageEnd]);

  useEffect(() => {
    if (user && chatId) {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `chatrooms/${chatId}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val().members) {
              let exists = Object.keys(snapshot.val().members).includes(
                user.uid
              );
              if (!exists) {
                setUser();
              }
            }
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    async function setUser() {
      await update(ref(getDatabase(), `chatrooms/${chatId}/members`), {
        [user.uid]: true,
      });
      console.log(user.uid);
      console.log("user saved");
    }
  }, [user, user?.email, chatId]);

  const sendChatMessage = (messageText) => {
    channel.publish({
      name: "chat-message",
      data: `${user?.email} : ${messageText}`,
    });
    setMessageText("");
    inputBox.focus();
    update(ref(getDatabase(), `chatrooms/${chatId}/messages`), {
      [(Math.random() + 1).toString(36).substring(7)]: {
        authorName: user?.email,
        authorUid: user.uid,
        created: Date.now(),
        message: messageText,
        type: "text",
      },
    });
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const handleKeyPress = (event) => {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    event.preventDefault();
  };

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `chatrooms/${chatId}/messages`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          if (snapshot.val()) {
            let existingMessages = Object.values(snapshot.val());

            setOriginalMessages(existingMessages);
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [chatId]);

  const existingMessages = originalMessages?.map((message, index) => {
    const author = message.authorUid === user.uid ? "me" : "other";
    console.log(message);
    return (
      <>
        <span key={index} className={styles.message} data-author={author}>
          {" "}
          {message.authorName} : {message.message}
        </span>
      </>
    );
  });

  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? "me" : "other";
    return (
      <>
        {console.log(message)}
        <span key={index} className={styles.message} data-author={author}>
          {" "}
          {message.data}
        </span>
      </>
    );
  });

  return (
    <div className={styles.chatHolder}>
      <div className={styles.chatText}>
        {existingMessages}
        {messages}
        <div
          ref={(element) => {
            messageEnd = element;
          }}
        ></div>
      </div>
      <form onSubmit={handleFormSubmission} className={styles.form}>
        <textarea
          ref={(element) => {
            inputBox = element;
          }}
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.textarea}
        ></textarea>
        <button
          type="submit"
          className={styles.button}
          disabled={messageTextIsEmpty}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AblyChatComponent;
