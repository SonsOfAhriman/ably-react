import { fire } from "../config/fire";
import Login from "../components/Login";
import CreateRoom from "../components/CreateRoom";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authListener();
  }, [user]);

  function authListener() {
    fire.onAuthStateChanged((user: any) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }

  return user ? <CreateRoom /> : <Login />;
}
