import Home from "./pages/Home";
import LogIn from "./pages/Log-in";
import CompanyProfile from "./pages/CompanyProfile";
import Compliance from "./pages/Compliance";
import Production from "./pages/Production";
import Certificates from "./pages/Certificates";
import MineSite from "./pages/MineSite";
import More from "./pages/More";
import LoadingScreen from "./components/loadingScreen";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import MiningSites from "./pages/MiningSites";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { AuthContext } from "./context/authContext";
import { UserContext } from "./context/userContext";

import { db } from "./config/firebase";
import { getDoc, doc } from "firebase/firestore";

function App() {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [userData, setUserData] = useState({
    logoURL: "",
    email: "",
    name: "",
    address: "",
    mobileNumber: "",
    telephone: "",
  });

  const fetchUserData = async (uid) => {
    if (uid) {
      // console.log("called");
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userDataFromDB = docSnap.data();

        // console.log(userDataFromDB);

        const selectedFields = {
          logoURL: userDataFromDB.logoURL,
          email: userDataFromDB.email,
          name: userDataFromDB.name,
          telephone: userDataFromDB.telephone,
          mobileNumber: userDataFromDB.mobileNumber,
          address: userDataFromDB.address,
        };
        setUserData(selectedFields);

        // console.log(userData);
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No user is logged in.");
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);

      const currentUser = auth.currentUser;
      const uid = currentUser?.uid;

      fetchUserData(uid);

      setIsChecking(false);
    });

    return unsubscribe;
  }, []);

  if (isChecking) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          {isAuthenticated ? (
            <Route path="/user-profile/*" element={<UserProfile />} />
          ) : null}
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/company-profile/:id" element={<CompanyProfile />} />
          <Route path="/company-compliance/:id" element={<Compliance />} />
          <Route path="/company-production/:id" element={<Production />} />
          <Route path="/company-certificates/:id" element={<Certificates />} />
          <Route path="/company-minesite/:id" element={<MineSite />} />
          <Route path="/miningsites" element={<MiningSites />} />
          <Route path="/more/:id" element={<More />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
