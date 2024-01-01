import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Nav = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="w-full bg-yellow-400 px-4 py-2">
      <div className="w-full h-full flex">
        <div
          className="ml-10 w-32 hover:cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="logo_img"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="place-self-center text-3xl font-extrabold text-white hover:cursor-pointer"
          onClick={() => navigate("/")}
        >
          MineTrace
        </div>
        <div className="flex justify-end w-full gap-16 pr-16 text-xl">
          <div
            className="place-self-center hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </div>
          <div className="border border-black h-1/2 place-self-center"></div>
          <div
            className="place-self-center hover:cursor-pointer"
            onClick={() => navigate("/about")}
          >
            About
          </div>
          <div className="border border-black h-1/2 place-self-center"></div>
          {isAuthenticated ? (
            <div
              className="place-self-center hover:cursor-pointer"
              onClick={() => navigate("/user-profile")}
            >
              Profile
            </div>
          ) : (
            <div
              className="place-self-center hover:cursor-pointer"
              onClick={() => navigate("/log-in")}
            >
              Log-In
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
