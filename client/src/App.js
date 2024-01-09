import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import { UserContext } from "./context/userContext";
import { db } from "./config/firebase";
import { getDoc, doc } from "firebase/firestore";

import UserProfile from "./pages/needs_auth_pages/UserProfile";
import Home from "./pages/public_pages/Home";
import LoadingScreen from "./components/loadingScreen";
import LogIn from "./pages/Log-in";
import CompanyProfile from "./pages/public_pages/CompanyProfile";
import Compliance from "./pages/public_pages/Compliance";
import Production from "./pages/public_pages/Production";
import Certificates from "./pages/public_pages/Certificates";
import MineSite from "./pages/public_pages/MineSite";
import MiningSites from "./pages/public_pages/MiningSites";
import More from "./pages/public_pages/More";
import NotFound from "./pages/NotFound";
import About from "./pages/public_pages/About";
import PublicBlocks from "./pages/public_pages/PublicBlocks";

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
      if (user) {
        if (!user.emailVerified) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          const uid = user.uid;
          fetchUserData(uid);
        }
      } else {
        setIsAuthenticated(false);
      }

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
          <Route path="/about" element={<About />} />
          <Route path="/public-block/*" element={<PublicBlocks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
