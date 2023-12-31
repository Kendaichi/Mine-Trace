import CarouselCompliance from "../components/carousel";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import LoadingScreen from "../components/loadingScreen";

const Certificates = () => {
  const { id } = useParams();
  const [certificates, setCertificates] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="w-full flex py-5 px-5 justify-evenly">
        <div
          className="bg-black text-white text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-profile/${id}`)}
        >
          About
        </div>
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
        <div className="bg-white text-black text-3xl py-2 px-4 border-2 border-black">
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
        <div className="text-5xl font-bold">Company Certificates</div>
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
