import CarouselCompliance from "../../components/carousel";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import LoadingScreen from "../../components/loadingScreen";
import { IoClose, IoNewspaper } from "react-icons/io5";
import { BsQuestionCircleFill } from "react-icons/bs";
import { FaChartPie } from "react-icons/fa6";
import { RiMapPin2Fill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";
import { MdMore } from "react-icons/md";

const Certificates = () => {
  const { id } = useParams();
  const [certificates, setCertificates] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawer, setIsDrawer] = useState(false);

  async function getCompliances() {
    const certificatesRef = collection(db, "users", id, "certificates");
    const certificatesSnapshot = await getDocs(certificatesRef);

    if (!certificatesSnapshot.empty) {
      const compliances = certificatesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(compliances);
      setCertificates(compliances);
      setIsLoading(false);
    } else {
      console.log("No Compliances Found");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCompliances();
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
              <div
                className="flex gap-2 justify-start"
                onClick={() => navigate(`/company-profile/${id}`)}
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
              <div className="flex gap-2 justify-start">
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
        <div
          className="bg-black text-white md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-profile/${id}`)}
        >
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
        <div className="bg-white text-black md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 border-2 border-black">
          Certificates
        </div>
        <div
          className="bg-black text-white md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-minesite/${id}`)}
        >
          Navigate Mine Site
        </div>
        <div
          className="bg-black text-white md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/more`)}
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
        <div className="hidden lg:block text-5xl font-bold">
          Company Certificates
        </div>
        <div className="place-self-center w-full flex lg:hidden justify-end">
          <button onClick={() => setIsDrawer(true)}>
            <TiThMenu size={25} />
          </button>
        </div>
      </div>

      <div className="bg-white w-full h-full">
        <div className="">
          {certificates ? (
            <CarouselCompliance slides={certificates} />
          ) : (
            <div className="px-10 py-24 text-2xl font-medium">
              No Certificates
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
