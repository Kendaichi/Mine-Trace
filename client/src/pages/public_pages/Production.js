import BarChart from "../../components/barchart";
import PieChart from "../../components/piechart";
import "chart.js/auto";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useEffect, useState } from "react";
import Web3 from "web3";
import ProductionStorage from "../../contracts/ProductionStorage.json";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import LoadingScreen from "../../components/loadingScreen";

const Production = () => {
  const [contractInstance, setContractInstance] = useState(null);
  const [account, setAccount] = useState(null);
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [goldData, setGoldData] = useState({
    labels: [],
    datasets: [
      {
        label: "Gold Produced(grams)",
        data: [],
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgb(255, 255, 0, 0.8)",
      },
    ],
  });

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

  const navigate = useNavigate();
  const { id } = useParams();

  const connectWallet = async () => {
    try {
      //request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });

      //get the user's account
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        window.localStorage.setItem("account", accounts[0]);

        // Wallet Connection to the database - using test-auth-wallet access-point
        const response = await fetch(
          `http://localhost:3000/test-auth-wallet?wallet=${accounts[0]}`
        );

        const json = await response.json();

        console.log(json);

        if (json.status) {
          alert(json.message);
        } else {
          alert(json.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function getEmailAccount() {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const email = docSnap.data().email;

        // console.log(email);

        if (email) setEmail(email);
      } else {
        console.log("No such document!");
      }
    }

    const init = async () => {
      // Check for account in local storage
      const storedAccount = window.localStorage.getItem("account");
      if (storedAccount) {
        setAccount(storedAccount);
      } else {
        // If no account is found in local storage, call the connectWallet function
        await connectWallet();
      }

      //Check if Web3 is injected by metamask
      if (window.ethereum) {
        try {
          //request account access if needed
          // await window.ethereum.request({ method: "eth_requestAccounts" })

          const storedAccount = window.localStorage.getItem("account");
          if (storedAccount) {
            setAccount(storedAccount);
          } else {
            // If no account is found in local storage, call the connectWallet function
            await connectWallet();
          }

          //get web3 instance
          const web3 = new Web3(window.ethereum);

          //get the contract instance
          const networkId = await web3.eth.net.getId();
          const deployedContract = ProductionStorage.networks[networkId];
          // console.log(deployedContract);
          // console.log(deployedContract.address);

          if (!deployedContract) {
            console.error(`Contract not deployed on network ${networkId}`);
            return;
          }

          const contractABI = ProductionStorage.abi;
          // console.log(contractABI)
          const myContract = new web3.eth.Contract(
            contractABI,
            deployedContract.address
          );
          setContractInstance(myContract);
          getEmailAccount();
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Please install Metamask to use this Dapp");
      }
    };
    init();
    setIsLoading(false);

    // eslint-disable-next-line
  }, []);

  // This is a helper function that will group the result by Group Name
  const groupAllProductions = (productions) => {
    return productions.reduce((acc, production) => {
      production.minedpergroups.forEach((group) => {
        const existingGroup = acc.find(
          (item) => item.groupName === group.groupName
        );
        if (existingGroup) {
          existingGroup.oreMined += Number(group.oreMined);
        } else {
          acc.push({
            groupName: group.groupName,
            oreMined: Number(group.oreMined),
          });
        }
      });
      return acc;
    }, []);
  };

  const handleFetchProduction = async () => {
    try {
      if (contractInstance) {
        const result = await contractInstance.methods
          .getProductionsByEmail(email)
          .call({
            from: account,
          });

        // console.log(result);
        const months = result.map((production) => production.month);
        const totalOreMined = result.map(
          (production) => production.totalOreMined
        );

        setGoldData({
          labels: months,
          datasets: [
            {
              // type: "line",
              label: "Gold Produced(grams)",
              data: totalOreMined,
              fill: true,
              lineTension: 0.1,
              backgroundColor: "rgb(255, 255, 0, 0.7)",
            },
          ],
        });

        const groups = await groupAllProductions(result);
        const groupName = groups.map((group) => group.groupName);
        const groupOreMined = groups.map((group) => group.oreMined);

        setGroupData({
          labels: groupName,
          datasets: [
            {
              label: "Ore mined for the year 2023(bags)",
              data: groupOreMined,
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
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchProduction();
    // eslint-disable-next-line
  }, [email]);

  if (isLoading) {
    return <LoadingScreen />;
  }

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
