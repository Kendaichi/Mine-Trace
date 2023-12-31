import CarouselCompliance from "../components/carousel";

import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import LoadingScreen from "../components/loadingScreen";

const Compliance = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [compliance, setCompliances] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getCompliances() {
    const complianceRef = collection(db, "users", id, "compliances");
    const compliancesSnapshot = await getDocs(complianceRef);

    if (!compliancesSnapshot.empty) {
      const compliances = compliancesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCompliances(compliances);
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
        <div className="bg-white text-black text-3xl py-2 px-4 border-2 border-black">
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
        <div className="text-5xl font-bold">Government Compliance</div>
      </div>

      <div className="bg-white w-full h-full">
        {compliance ? (
          <CarouselCompliance slides={compliance} />
        ) : (
          <div className="px-10 py-24 text-2xl font-medium">No Compliances</div>
        )}
      </div>
    </div>
  );
};

export default Compliance;
