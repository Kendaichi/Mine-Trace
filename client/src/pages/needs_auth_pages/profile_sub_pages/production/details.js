import { Pie } from "react-chartjs-2";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function ProductionDetails({ account, contractInstance }) {
  const navigate = useNavigate();
  const { index } = useParams();
  const [production, setProduction] = useState(null);
  const [groupData, setGroupData] = useState({
    labels: [],
    datasets: [
      {
        label: "Ore mined for the year 2023(bags)",
        data: [],
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
  });

  useEffect(() => {
    const fetchProduction = async () => {
      try {
        // Check if contractInstance is not null
        if (contractInstance) {
          const result = await contractInstance.methods
            .getProductionByIdAndSender(index, account)
            .call({
              from: account,
            });

          // Update production state
          setProduction(result);
          //   console.log(result);
          const groups = result.minedpergroups.map((group) => group.groupName);
          const oreMined = result.minedpergroups.map((group) => group.oreMined);
          //   console.log(groups, oreMined);

          setGroupData({
            labels: groups,
            datasets: [
              {
                label: "Ore mined for the year 2023(bags)",
                data: oreMined,
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
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (contractInstance) {
      fetchProduction();
    }
  }, [contractInstance, account, index]);

  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  return (
    <div className="absolute bg-black w-full h-full left-0 top-0 bg-opacity-30 flex justify-center">
      <div className="place-self-center w-3/4 h-3/4 bg-gray-50 rounded-lg flex flex-col px-5 py-3 gap-3">
        <button className="w-5" onClick={() => navigate(-1)}>
          <IoMdArrowRoundBack size={20} />
        </button>
        {/* <div className="text-sm font-medium place-self-start">
          Production ID:
          <span className="ml-1 text-gray-500">{index}</span>
        </div> */}
        <div className="text-sm font-medium place-self-start">
          Date:
          <span className="ml-1 text-gray-500">
            {formatDate(production?.date.toString())}
          </span>
        </div>
        <div className="text-sm font-medium place-self-start">
          Ore Mined(bags):
          <span className="ml-1 text-gray-500">
            {production?.totalOreMined}
          </span>
        </div>
        <div className="place-self-center w-full h-full p-2 flex gap-1">
          <div className="w-full">
            <Pie
              data={groupData}
              // height={400}
              width={700}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Ore Mined per Group",
                    font: {
                      size: 20,
                    },
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
