import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { getAuth } from "firebase/auth";

export const CreateRoom = () => {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `chatrooms/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          if (snapshot.val()) {
            setChatrooms(Object.entries(snapshot.val()));
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  async function goToRoom(e) {
    const chatId = (Math.random() + 1).toString(36).substring(7);
    e.preventDefault();

    await set(ref(getDatabase(), "chatrooms/" + chatId), {
      name: chatId + " " + "Chatroom",
    });

    await set(ref(getDatabase(), "chatrooms/" + `${chatId}/` + "members"), {
      [user.uid]: true,
    });

    router.push({
      pathname: `/chatrooms/${chatId}`,
    });
  }

  async function goToExistingChat(id) {
    router.push({
      pathname: `/chatrooms/${id}`,
    });
  }

  return (
    <div style={{ textAlign: "center" }}>
      <button style={{ margin: "10px" }} onClick={goToRoom}>
        Create Room
      </button>
      <h1>My Chatrooms</h1>
      <ul>
        {chatrooms
          ?.filter((chat) => Object.keys(chat[1].members).includes(user.uid))
          .map((chat) => {
            return (
              <li sx={{ font: "white" }} key={chat[1].name}>
                <button onClick={() => goToExistingChat(chat[0])}>
                  {chat[1].name}
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default CreateRoom;
