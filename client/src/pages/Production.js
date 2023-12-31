import BarChart from "../components/barchart";
import PieChart from "../components/piechart";
import "chart.js/auto";
import { GoldData, GroupData } from "./data";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Production = () => {
  let goldData = {
    labels: GoldData[0].months.map((month) => month.month),
    datasets: [
      {
        label: "Gold Produced(grams)",
        data: [50, 89, 90, 125, 85, 80, 60, 115, 93, 89],
        // type: "line",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgb(255, 255, 0, 0.8)",
      },
      {
        label: "Gold ore Mined(bags)",
        data: GoldData[0].months.map((data) => data.gold_ore_mined),
        backgroundColor: "gray",
        // ["#EC8F5E", "#F3B664", "#F1EB90", "#9FBB73"],
      },
    ],
  };

  let groupData = {
    labels: GroupData[0].groups.map((data) => data.name),
    datasets: [
      {
        label: "Ore mined for the year 2023(bags)",
        data: GroupData[0].groups.map((data) => data.gold_ore_mined),
        backgroundColor: [
          "rgba(158, 1, 66, 0.7)",
          "rgba(213, 62, 79, 0.7)",
          "rgba(244, 109, 67, 0.7)",
          "rgba(253, 174, 97, 0.7)",
          "rgba(254, 224, 139, 0.7)",
          "rgba(230, 245, 152, 0.7)",
          "rgba(171, 221, 164, 0.7)",
          "rgba(102, 194, 165, 0.7)",
          "rgba(50, 136, 189, 0.7)",
          "rgba(94, 79, 162, 0.7)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="h-[100vh] bg-yellow-400 flex flex-col">
      <div className="w-[full] flex py-5 px-5 justify-evenly">
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
        <div className="bg-white text-black text-3xl py-2 px-4 border-2 border-black">
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
        <div className="text-5xl font-bold">Production Report</div>
      </div>

      <div className="w-full h-full border bg-white flex px-10 justify-between py-4">
        <div className="shadow-md h-auto">
          <BarChart chartData={goldData} />
        </div>

        <div className="shadow-md h-auto">
          <PieChart chartData={groupData} />
        </div>
      </div>
    </div>
  );
};

export default Production;
