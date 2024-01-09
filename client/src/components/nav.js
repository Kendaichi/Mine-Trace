import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { RiLoginCircleFill } from "react-icons/ri";
import { BsQuestionCircleFill } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { AiOutlineBlock } from "react-icons/ai";

const Nav = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [isDrawer, setIsDrawer] = useState(false);

  return (
    <div className="w-full bg-yellow-400 px-4 py-2">
      <div className="w-full h-full flex px-5">
        <div
          className="w-32 hover:cursor-pointer"
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

        <div className="flex justify-end w-full lg:hidden">
          <div className="place-self-center">
            <button onClick={() => setIsDrawer(true)}>
              <TiThMenu size={25} />
            </button>
          </div>
        </div>

        {isDrawer ? (
          <>
            <div
              className={`absolute right-0 top-0 h-full w-full z-10 bg-white bg-opacity-50 backdrop-blur-md`}
            ></div>
            <div
              className={`absolute z-10 right-0 top-0 h-full w-72 bg-white flex flex-col px-2 py-5 gap-10 `}
            >
              <div className="flex w-full justify-between pl-5 text-2xl">
                <div className="text-gray-500 font-medium">Menu</div>
                <button onClick={() => setIsDrawer(false)}>
                  <IoClose size={25} color="gray" />
                </button>
              </div>

              <div className="flex flex-col gap-5 px-3">
                <div
                  className="flex gap-2 justify-start"
                  onClick={() => navigate("/")}
                >
                  <IoHome
                    size={25}
                    color="gray"
                    className="place-self-center"
                  />
                  <div className="text-lg font-bold">Home</div>
                </div>
                <div
                  className="flex gap-2 justify-start"
                  onClick={() => navigate("/public-block")}
                >
                  <AiOutlineBlock
                    size={25}
                    color="gray"
                    className="place-self-center"
                  />
                  <div className="text-lg font-bold">Blocks</div>
                </div>
                {isAuthenticated ? (
                  <div
                    className="flex gap-2 justify-start"
                    onClick={() => navigate("/log-in")}
                  >
                    <FaUserAlt
                      size={25}
                      color="gray"
                      className="place-self-center"
                    />
                    <div className="text-lg font-bold">Profile</div>
                  </div>
                ) : (
                  <div
                    className="flex gap-2 justify-start"
                    onClick={() => navigate("/log-in")}
                  >
                    <RiLoginCircleFill
                      size={25}
                      color="gray"
                      className="place-self-center"
                    />
                    <div className="text-lg font-bold">Log-in</div>
                  </div>
                )}

                <div className="border"></div>
                <div
                  className="flex gap-2 justify-start pl-0.5"
                  onClick={() => navigate("/about")}
                >
                  <BsQuestionCircleFill
                    size={20}
                    color="gray"
                    className="place-self-center"
                  />
                  <div className="text-lg font-bold">About Us</div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <div className="hidden lg:flex justify-end w-full gap-16 pr-6 text-xl">
          <div
            className="place-self-center hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </div>
          <div className="border border-black h-1/2 place-self-center"></div>
          <div
            className="place-self-center hover:cursor-pointer"
            onClick={() => navigate("/public-block")}
          >
            Blocks
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
