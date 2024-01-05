import { FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function MinerCard({ miner }) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white bg-opacity-30 shadow-md h-72 w-56 m-auto rounded-lg flex flex-col py-5 px-1 cursor-pointer"
      onClick={() => navigate(`/company-profile/${miner.id}`)}
    >
      {miner.logoURL ? (
        <span
          className="block w-28 h-28 rounded-full m-auto shadow bg-white bg-opacity-90"
          style={{
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundImage: `url(${miner.logoURL})`,
          }}
        />
      ) : (
        <div className="w-28 h-28 m-auto rounded-full shadow bg-gray-400 bg-opacity-20 flex justify-center">
          <div className="place-self-center">
            <FaUser size={40} />
          </div>
        </div>
      )}

      {miner.name ? (
        <p className="text-center text-sm font-medium">{miner.name}</p>
      ) : null}
      <p className="text-center text-xs">{miner.email}</p>
    </div>
  );
}
