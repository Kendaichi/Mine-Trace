import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { IoMdArrowRoundBack } from "react-icons/io";
import LoadingScreen from "../../components/loadingScreen";
import { FaUser } from "react-icons/fa6";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [about, setAbout] = useState(null);
  const [logo, setLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getAboutandLogo() {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const aboutField = docSnap.data().about;
      const logoField = docSnap.data().logoURL;

      if (aboutField) setAbout(aboutField);
      if (logoField) setLogo(logoField);

      setIsLoading(false);
    } else {
      console.log("No such document!");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAboutandLogo();
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-[100vh] bg-yellow-400 flex flex-col">
      <div className="w-full flex py-5 px-5 justify-evenly">
        <div className="bg-black text-white text-3xl py-2 px-4 ">About</div>
        <div
          className="bg-black text-white text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-compliance/${id}`)}
        >
          Compliance
        </div>
        <div
          className="bg-black text-white text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-production/${id}`)}
        >
          Production
        </div>
        <div
          className="bg-black text-white text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-certificates/${id}`)}
        >
          Certificates
        </div>
        <div
          className="bg-black text-white text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-minesite/${id}`)}
        >
          Navigate Mine Site
        </div>
        <div
          className="bg-black text-white text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/more/${id}`)}
        >
          More
        </div>
      </div>
      <div className="w-full flex py-3 px-7 justify-start gap-5 pb-5">
        <button
          onClick={() => navigate("/miningsites")}
          className="place-self-center"
        >
          <IoMdArrowRoundBack size={35} />
        </button>
        <div className="text-5xl font-bold">Company Profile</div>
      </div>

      <div className="h-full flex p-5 bg-gray-50">
        <div className="w-1/2 flex">
          {logo ? (
            <img
              src={logo}
              alt="logo_img"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-56 h-56 m-auto rounded-full shadow bg-gray-400 bg-opacity-20 flex justify-center">
              <div className="place-self-center">
                <FaUser size={100} />
              </div>
            </div>
          )}
        </div>
        <div className="w-full px-4">
          <div className="text-4xl font-bold mb-5">About Us</div>
          {about ? (
            <div className="w-full text-justify px-4 text-xl">{about}</div>
          ) : (
            <div className="w-full text-justify px-4 text-xl">
              No provided About
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
