import { Routes, Route, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, storage } from "../../config/firebase";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { UserContext } from "../../context/userContext";
import { AuthContext } from "../../context/authContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { FiEdit } from "react-icons/fi";
import {
  IoArrowBackOutline,
  IoClose,
  IoHome,
  IoNewspaper,
  IoLogOut,
} from "react-icons/io5";
import { FaUser, FaChartPie } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import { RiMapPin2Fill } from "react-icons/ri";

import LoadingScreen from "../../components/loadingScreen";
import UserAbout from "./profile_sub_pages/userabout";
import UserCompliance from "./profile_sub_pages/compliance/usercompliance";
import UserCertificates from "./profile_sub_pages/certificates/usercertificates";
import UserMineSite from "./profile_sub_pages/userminesite";
import UserProduction from "./profile_sub_pages/production/userproduction";
import UserProfileNotFound from "../ProfileNotFound";
import { BsQuestionCircleFill } from "react-icons/bs";

export default function UserProfile() {
  const navigate = useNavigate();

  const { userData, setUserData } = useContext(UserContext);
  const { setIsAuthenticated } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isDrawer, setIsDrawer] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [field]: value,
    }));
  };

  const [imageUpload, setImageUpload] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserData({
        logo: "",
        email: "",
        name: "",
        address: "",
        mobileNumber: "",
        telephone: "",
      });

      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateData = async (updatedData) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;

    if (uid) {
      const downloadUrl = await uploadFile();

      if (downloadUrl) {
        updatedData.logoURL = downloadUrl;
      }

      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, updatedData);

      setEditing(false);
      alert("Data Updated");
    } else {
      console.log("No user is logged in.");
    }
  };

  const uploadFile = async () => {
    if (!imageUpload) {
      alert("There is no Image selected");
    } else {
      const fileFirestore = ref(storage, `userLogos/${userData.email} logo`);
      await uploadBytes(fileFirestore, imageUpload, {
        contentType: imageUpload.type,
      });

      const downloadUrl = await getDownloadURL(fileFirestore);
      alert("Image uploaded");
      return downloadUrl;
    }
  };

  useEffect(() => {
    if (userData.email !== "") {
      setIsLoading(false);
      console.log("User Data has been populated");
    } else {
      console.log("User Data is not populated yet");
    }
  }, [userData]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col h-[100vh]">
      <div className="hidden h-44 bg-yellow-400 md:flex justify-center gap-10 py-2">
        <div className="col-span-6 ml-2 sm:col-span-4 md:mr-3">
          <input
            type="file"
            hidden
            accept="image/*"
            multiple={false}
            onChange={(e) => {
              setImageUpload(e.target.files[0]);
            }}
          />

          <div className="text-center">
            {userData?.logoURL ? (
              <div className="mt-2">
                <span
                  className="block w-28 h-28 rounded-full m-auto shadow"
                  style={{
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    backgroundImage: `url(${userData?.logoURL})`,
                  }}
                />
              </div>
            ) : (
              <div className="w-28 h-28 m-auto rounded-full shadow bg-white bg-opacity-20 flex justify-center">
                <div className="place-self-center">
                  <FaUser size={40} />
                </div>
              </div>
            )}

            {editing ? (
              <button
                type="button"
                className="inline-flex items-center px-2 py-1 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 mt-2"
                onClick={() =>
                  document.querySelector('input[type="file"]').click()
                }
              >
                Select New Photo
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex items-center px-2 py-1 bg-yellow-50 border rounded-md font-medium text-xs text-gray-900 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 transition ease-in-out duration-150 mt-2"
                onClick={() =>
                  document.querySelector('input[type="file"]').click()
                }
                disabled
              >
                {userData?.name}
              </button>
            )}
          </div>
        </div>

        <div className="absolute left-3 top-3 hover:cursor-pointer">
          <IoArrowBackOutline onClick={() => navigate("/")} />
        </div>
        <div className="absolute right-3 top-3 hover:cursor-pointer">
          {editing ? (
            <div className="flex gap-2">
              <button
                className="px-3 rounded bg-red-500 text-white"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 rounded bg-green-500 text-white"
                onClick={() => handleUpdateData(userData)}
              >
                Save
              </button>
            </div>
          ) : (
            <FiEdit onClick={() => setEditing(!editing)} />
          )}
        </div>
        <div className="place-self-center flex flex-col text-gray-600 font-semibold gap-1">
          <input
            type="text"
            value={userData.email}
            placeholder="Company Email"
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled
            className="bg-transparent focus:outline-none text-gray-600 w-64 placeholder-slate-800"
          />

          {editing ? (
            <input
              type="text"
              name="companyname"
              value={userData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Company Name"
              disabled={!editing}
              className={` ${
                editing
                  ? "border-b bg-white bg-opacity-50 rounded px-2"
                  : "bg-transparent"
              } focus:outline-none text-gray-600 w-64 placeholder-slate-800`}
            />
          ) : null}

          <input
            type="text"
            value={userData.telephone}
            placeholder="Telephone"
            onChange={(e) => handleInputChange("telephone", e.target.value)}
            disabled={!editing}
            className={` ${
              editing
                ? "border-b bg-white bg-opacity-50 rounded px-2"
                : "bg-transparent"
            } focus:outline-none text-gray-600 w-64 placeholder-slate-800`}
          />

          <input
            type="text"
            value={userData.mobileNumber}
            placeholder="Mobile Number"
            onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
            disabled={!editing}
            className={` ${
              editing
                ? "border-b bg-white bg-opacity-50 rounded px-2"
                : "bg-transparent"
            } focus:outline-none text-gray-600 w-64 placeholder-slate-800`}
          />

          <input
            type="text"
            value={userData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            disabled={!editing}
            placeholder="Company Address"
            className={` ${
              editing
                ? "border-b bg-white bg-opacity-50 rounded px-2"
                : "bg-transparent"
            } focus:outline-none text-gray-600 w-64 placeholder-slate-800`}
          />
        </div>
      </div>

      {isDrawer ? (
        <>
          <div className="absolute right-0 top-0 h-full w-full z-10 bg-white bg-opacity-50 backdrop-blur-md"></div>

          <div className="absolute z-10 right-0 top-0 h-full w-72 bg-white flex flex-col px-2 py-5 gap-5">
            <div className="flex w-full justify-between pl-5 text-2xl">
              <div className="text-gray-600 font-semibold">Menu</div>
              <button onClick={() => setIsDrawer(false)}>
                <IoClose size={25} color="gray" />
              </button>
            </div>

            <div className="relative flex flex-col gap-5 px-3">
              {editing ? (
                <div className="absolute right-0 text-xs flex gap-1">
                  <button
                    className="px-2 rounded bg-red-500 text-white"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-2 rounded bg-green-500 text-white"
                    onClick={() => handleUpdateData(userData)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <FiEdit
                  onClick={() => setEditing(!editing)}
                  className="absolute left-0"
                />
              )}
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple={false}
                  onChange={(e) => {
                    setImageUpload(e.target.files[0]);
                  }}
                />
                {userData?.logoURL ? (
                  <span
                    className="block m-auto w-24 h-24 rounded-full shadow"
                    style={{
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      backgroundImage: `url(${userData?.logoURL})`,
                    }}
                  />
                ) : (
                  <div className="w-24 m-auto h-24 rounded-full shadow bg-white bg-opacity-20 flex justify-center">
                    <div className="place-self-center">
                      <FaUser size={40} />
                    </div>
                  </div>
                )}

                {editing ? (
                  <button
                    type="button"
                    className="px-2 py-1 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 mt-2"
                    onClick={() =>
                      document.querySelector('input[type="file"]').click()
                    }
                  >
                    Select New Photo
                  </button>
                ) : null}

                <div className="place-self-center flex flex-col text-xs text-gray-600">
                  <input
                    type="text"
                    value={userData.email}
                    placeholder="Company Email"
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled
                    className="bg-transparent focus:outline-none text-center text-gray-600 w-64 placeholder-slate-800"
                  />

                  <input
                    type="text"
                    name="companyname"
                    value={userData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Company Name"
                    disabled={!editing}
                    className={` ${
                      editing
                        ? "border-b bg-yellow-100 bg-opacity-50 rounded "
                        : "bg-transparent"
                    } focus:outline-none text-center text-gray-600 w-64 placeholder-slate-800`}
                  />

                  <input
                    type="text"
                    value={userData.telephone}
                    placeholder="Telephone"
                    onChange={(e) =>
                      handleInputChange("telephone", e.target.value)
                    }
                    disabled={!editing}
                    className={` ${
                      editing
                        ? "border-b bg-yellow-100 bg-opacity-50 rounded "
                        : "bg-transparent"
                    } focus:outline-none text-center text-gray-600 w-64 placeholder-slate-800`}
                  />

                  <input
                    type="text"
                    value={userData.mobileNumber}
                    placeholder="Mobile Number"
                    onChange={(e) =>
                      handleInputChange("mobileNumber", e.target.value)
                    }
                    disabled={!editing}
                    className={` ${
                      editing
                        ? "border-b bg-yellow-100 bg-opacity-50 rounded "
                        : "bg-transparent"
                    } focus:outline-none text-center text-gray-600 w-64 placeholder-slate-800`}
                  />

                  <input
                    type="text"
                    value={userData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    disabled={!editing}
                    placeholder="Company Address"
                    className={` ${
                      editing
                        ? "border-b bg-yellow-100 bg-opacity-50 rounded "
                        : "bg-transparent"
                    } focus:outline-none text-center text-gray-600 w-64 placeholder-slate-800`}
                  />
                </div>
              </div>
              <div
                className="flex gap-2 justify-start"
                onClick={() => navigate("/")}
              >
                <IoHome size={16} color="gray" className="place-self-center" />
                <div className="text-base font-bold">Home</div>
              </div>
              <div
                className="flex gap-2 justify-start"
                onClick={() => navigate("")}
              >
                <BsQuestionCircleFill
                  size={16}
                  color="gray"
                  className="place-self-center"
                />
                <div className="text-base font-bold">About</div>
              </div>
              <div
                className="flex gap-2 justify-start"
                onClick={() => navigate("compliance")}
              >
                <IoNewspaper
                  size={16}
                  color="gray"
                  className="place-self-center"
                />
                <div className="text-base font-bold">Compliance</div>
              </div>
              <div
                className="flex gap-2 justify-start"
                onClick={() => navigate("production")}
              >
                <FaChartPie
                  size={16}
                  color="gray"
                  className="place-self-center"
                />
                <div className="text-base font-bold">Production</div>
              </div>
              <div
                className="flex gap-2 justify-start"
                onClick={() => navigate("certificates")}
              >
                <IoNewspaper
                  size={16}
                  color="gray"
                  className="place-self-center"
                />
                <div className="text-base font-bold">Certificates</div>
              </div>
              <div
                className="flex gap-2 justify-start"
                onClick={() => navigate("minesite")}
              >
                <RiMapPin2Fill
                  size={16}
                  color="gray"
                  className="place-self-center"
                />
                <div className="text-base font-bold">Minesite</div>
              </div>

              <div className="border-b-2"></div>

              <div className="flex gap-2 justify-start" onClick={handleLogout}>
                <IoLogOut
                  size={20}
                  color="gray"
                  className="place-self-center"
                />
                <div className="text-base font-bold">Logout</div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="bg-yellow-50 px-5 py-1 flex justify-end w-full md:hidden">
        <div className="place-self-center">
          <button onClick={() => setIsDrawer(true)}>
            <TiThMenu size={25} />
          </button>
        </div>
      </div>

      <div className="hidden bg-yellow-300 md:flex justify-center gap-5 md:gap-7 lg:gap-10 text-gray-600 font-medium py-2">
        <div className="hover:cursor-pointer" onClick={() => navigate("")}>
          About
        </div>
        <div className="border border-gray-600"></div>
        <div
          className="hover:cursor-pointer"
          onClick={() => navigate("compliance")}
        >
          Compliance
        </div>
        <div className="border border-gray-600"></div>
        <div
          className="hover:cursor-pointer"
          onClick={() => navigate("production")}
        >
          Production
        </div>
        <div className="border border-gray-600"></div>
        <div
          className="hover:cursor-pointer"
          onClick={() => navigate("certificates")}
        >
          Certificates
        </div>
        <div className="border border-gray-600"></div>
        <div
          className="hover:cursor-pointer"
          onClick={() => navigate("minesite")}
        >
          Minesite
        </div>
        <div className="border border-gray-600"></div>
        <div
          className="hover:cursor-pointer bg-red-600 px-2 rounded bg-opacity-50 text-white"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
      <div className="flex justify-center h-full py-5 bg-yellow-50">
        <Routes>
          <Route path="" element={<UserAbout />} />
          <Route path="/compliance/*" element={<UserCompliance />} />
          <Route path="/certificates/*" element={<UserCertificates />} />
          <Route path="/minesite" element={<UserMineSite />} />
          <Route path="/production/*" element={<UserProduction />} />
          <Route path="*" element={<UserProfileNotFound />} />
        </Routes>
      </div>
    </div>
  );
}
