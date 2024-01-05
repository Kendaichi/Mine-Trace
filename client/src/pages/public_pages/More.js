import { useNavigate, useParams } from "react-router-dom";
import blockchainPic from "../../assets/blockchain.jpeg";
import transparency from "../../assets/transparency.jpg";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoClose, IoNewspaper } from "react-icons/io5";
import { BsQuestionCircleFill } from "react-icons/bs";
import { FaChartPie } from "react-icons/fa6";
import { RiMapPin2Fill } from "react-icons/ri";
import { MdMore } from "react-icons/md";
import { useState } from "react";
import { TiThMenu } from "react-icons/ti";

const More = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDrawer, setIsDrawer] = useState(false);
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
              <div className="flex gap-2 justify-start">
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
        <div className="bg-white text-black md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 border-2 border-black">
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
        <div className="text-5xl font-bold hidden lg:block">
          Why Blockchain?
        </div>
        <div className="place-self-center w-full flex lg:hidden justify-end">
          <button onClick={() => setIsDrawer(true)}>
            <TiThMenu size={25} />
          </button>
        </div>
      </div>

      <div className="h-full flex flex-col lg:flex-row justify-center p-5 bg-white gap-2">
        <div className="w-3/4 place-self-center lg:w-1/2">
          <img src={transparency} alt="logo_img" className="w-full h-full" />
        </div>
        <div className="w-3/4 place-self-center lg:w-1/2 flex flex-col gap-10">
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
