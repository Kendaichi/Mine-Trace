import { useNavigate, useParams } from "react-router-dom";
import blockchainPic from "../../assets/blockchain.jpeg";
import transparency from "../../assets/transparency.jpg";
import { IoMdArrowRoundBack } from "react-icons/io";

const More = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
        <div className="bg-white text-black text-3xl py-2 px-4 border-2 border-black">
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
        <div className="text-5xl font-bold">Why Blockchain?</div>
      </div>

      <div className="h-full flex p-5 bg-white gap-2">
        <div className="w-1/2">
          <img src={transparency} alt="logo_img" className="w-full h-full" />
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="h-3/4">
            <img src={blockchainPic} alt="logo_img" className="w-full h-full" />
          </div>
          <div className="h-1/4 text-justify text-xl">
            Blockchain provides an immutable and transparent ledger, ensuring
            data integrity and traceability in small-scale mining operations.
            Its decentralized nature enhances security and reduces the risk of
            tampering or fraud.
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;
