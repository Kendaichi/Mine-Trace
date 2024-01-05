import Nav from "../../components/nav";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="h-[100vh] flex flex-col">
      <div className="h-auto">
        <Nav />
      </div>
      <div className="flex h-full">
        <div className="relative w-full md:w-1/2 bg-mineSite bg-cover">
          <div className="absolute bg-black bg-opacity-50 h-full w-full px-10 py-36 flex flex-col gap-10">
            <div className="text-3xl md:text-4xl xl:text-5xl font-bold text-white leading-normal">
              MineTrace: Ethical Mining Transparency Platform
            </div>
            <div className="text-medium lg:text-lg text-white">
              Welcome to MineTrace, where transparency meets responsibility in
              small-scale mining. Uncover the power of Blockchain technology as
              we pave the way for ethical practices, sustainability, and a
              brighter future for the mining industry. Join us in shaping a new
              era of responsible mining operations.
            </div>
            <button
              onClick={() => navigate("/miningsites")}
              className="place-self-center text-lg lg:text-xl text-center text-white font-bold px-3 py-1 rounded bg-yellow-700 bg-opacity-80 hover:scale-125 duration-150"
            >
              View Mining Sites!
            </button>
          </div>
        </div>
        <div className="relative hidden md:block md:w-1/2 bg-mineSite2 bg-cover">
          <div className="absolute h-full w-full bg-black bg-opacity-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
