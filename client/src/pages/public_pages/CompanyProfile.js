import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { IoMdArrowRoundBack } from "react-icons/io";
import LoadingScreen from "../../components/loadingScreen";
import { FaChartPie, FaUser } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import { BsQuestionCircleFill } from "react-icons/bs";
import { IoClose, IoNewspaper } from "react-icons/io5";
import { RiMapPin2Fill } from "react-icons/ri";
import { MdMore } from "react-icons/md";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [about, setAbout] = useState(null);
  const [logo, setLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawer, setIsDrawer] = useState(false);

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
              <div className="flex gap-2 justify-start">
                <BsQuestionCircleFill
                  size={16}
                  color="gray"
                  className="place-self-center"
                />
                <div className="text-base font-bold">About</div>
              </div>
              <div
                className="flex gap-2 justify-start"
                onClick={() => navigate(`/company-compliance/${id}`)}
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
                onClick={() => navigate(`/company-production/${id}`)}
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
                onClick={() => navigate(`/company-certificates/${id}`)}
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
                onClick={() => navigate(`/company-minesite/${id}`)}
              >
                <RiMapPin2Fill
                  size={16}
                  color="gray"
                  className="place-self-center"
                />
                <div className="text-base font-bold">Minesite</div>
              </div>
              <div
                className="flex gap-2 justify-start"
                onClick={() => navigate(`/more/${id}`)}
              >
                <MdMore size={16} color="gray" className="place-self-center" />
                <div className="text-base font-bold">More</div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="hidden w-full lg:flex py-5 px-5 justify-evenly">
        <div className="bg-white text-black md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 ">
          About
        </div>
        <div
          className="bg-black text-white md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-compliance/${id}`)}
        >
          Compliance
        </div>
        <div
          className="bg-black text-white md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-production/${id}`)}
        >
          Production
        </div>
        <div
          className="bg-black text-white md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-certificates/${id}`)}
        >
          Certificates
        </div>
        <div
          className="bg-black text-white md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 cursor-pointer"
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

      <div className="w-full flex py-3 px-7 justify-between gap-5 pb-5">
        <div className="flex justify-start">
          <button
            onClick={() => navigate("/miningsites")}
            className="place-self-center"
          >
            <IoMdArrowRoundBack size={35} />
          </button>
          <div className="hidden lg:block text-5xl font-bold w-full">
            Company Profile
          </div>
        </div>
        <div className="place-self-center w-full flex lg:hidden justify-end">
          <button onClick={() => setIsDrawer(true)}>
            <TiThMenu size={25} />
          </button>
        </div>
      </div>

      <div className="h-full flex flex-col xl:flex-row p-5 bg-gray-50">
        <div className="w-1/2 flex place-self-center">
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
        <div className="w-full px-4 py-10">
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
