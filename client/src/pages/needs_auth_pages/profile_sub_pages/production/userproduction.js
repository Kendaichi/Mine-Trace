import { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Web3 from "web3";
import { Bar } from "react-chartjs-2";
import ProductionStorage from "../../../../contracts/ProductionStorage.json";
import ProductionDetails from "./details";
import { UserContext } from "../../../../context/userContext";

export default function UserProduction() {
  const [editing, setEditing] = useState(false);
  const [contractInstance, setContractInstance] = useState(null);
  const [account, setAccount] = useState(null);
  const [groups, setGroups] = useState([{ name: "", oreAmount: "" }]);
  const [month, setMonth] = useState("");
  const [productions, setProductions] = useState(null);

  const { userData } = useContext(UserContext);

  const navigate = useNavigate();

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

  const handleSetEditing = () => setEditing(true);

  const handleCancelEditing = () => setEditing(false);

  const addGroup = () => {
    setGroups([...groups, { name: "", oreAmount: "" }]);
  };

  const updateGroup = (index, value, field) => {
    const newGroups = [...groups];
    newGroups[index][field] = value;
    setGroups(newGroups);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  useEffect(() => {
    const init = async () => {
      // Check for account in local storage
      const storedAccount = window.localStorage.getItem("account");
      if (storedAccount) {
        setAccount(storedAccount);
      }

      //Check if Web3 is injected by metamask
      if (window.ethereum) {
        try {
          //request account access if needed
          // await window.ethereum.request({ method: "eth_requestAccounts" })

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
          // handleFetchProduction();
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Please install Metamask to use this Dapp");
      }
    };
    init();
  }, [account]);

  useEffect(() => {
    handleFetchProduction();
    // eslint-disable-next-line
  }, [contractInstance]);

  // wallet connection
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

  const disconnectWallet = () => {
    setAccount(null);
    window.localStorage.removeItem("account");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert the groups array to the format expected by the smart contract
      const minedPerGroup = groups.map(({ name, oreAmount }) => ({
        groupName: name,
        oreMined: oreAmount.toString(), // Assuming oreAmount is a string in your smart contract
      }));

      // console.log(minedPerGroup);
      // Calculate the total ore amount
      const totalOreAmount = minedPerGroup.reduce(
        (total, group) => total + parseInt(group.oreMined),
        0
      );

      // Call the addProduction function on the smart contract
      const receipt = await contractInstance.methods
        .addProduction(
          userData.email,
          totalOreAmount.toString(),
          month,
          "2023",
          minedPerGroup
        )
        .send({
          from: account,
        });

      console.log(receipt);

      // Clear the form or perform any additional actions after the transaction
      setGroups([{ name: "", oreAmount: "" }]);
      setMonth("");

      handleFetchProduction();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchProduction = async () => {
    try {
      // Check if contractInstance is not null
      if (contractInstance) {
        const result = await contractInstance.methods
          .getProductionsBySender(account)
          .call({
            from: account,
          });

        console.log(result);

        // Extract months and totalOreMined from the result
        const months = result.map((production) => production.month);
        const totalOreMined = result.map(
          (production) => production.totalOreMined
        );

        // Update goldData state
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

        setProductions(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  return (
    <div className="w-full md:w-3/4 h-full bg-white bg-opacity-40 place-self-center rounded shadow px-5 py-2 flex flex-col gap-10">
      {/* Additional Details */}

      <Routes>
        <Route
          path="/details/:index"
          element={
            <ProductionDetails
              account={account}
              contractInstance={contractInstance}
            />
          }
        />
      </Routes>

      {/* End of additional Details */}
      <div className="text-2xl font-bold">Production</div>

      <div className="-mb-8 -mt-5 flex justify-end gap-2">
        {account === null ? (
          <button
            className="border px-3 rounded bg-blue-500 text-white"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : editing ? (
          <>
            <button
              className="border px-3 rounded bg-red-500 text-white"
              onClick={handleCancelEditing}
            >
              Cancel
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <button
              className="px-3 rounded bg-gray-400 text-white"
              onClick={handleSetEditing}
            >
              Add Production
            </button>
            <button
              className="px-3 rounded bg-blue-500 text-white"
              onClick={disconnectWallet}
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="w-full flex justify-center h-full gap-2">
          <div className="w-3/4 h-full px-5 py-2">
            <form className="max-w-md mx-auto py-10" onSubmit={handleSubmit}>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="floating_month"
                  id="floating_month"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={month}
                  onChange={handleMonthChange}
                />
                <label
                  htmlFor="floating_month"
                  className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Month
                </label>
              </div>

              {groups.map((group, index) => (
                <div className="grid md:grid-cols-2 md:gap-6" key={index}>
                  <div className="relative z-0 w-full mb-5 group">
                    <input
                      type="text"
                      name={`floating_groupName ${index}`}
                      id={`floating_groupName ${index}`}
                      value={group.name}
                      onChange={(e) =>
                        updateGroup(index, e.target.value, "name")
                      }
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor={`floating_groupName ${index}`}
                      className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Group Name
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-5 group">
                    <input
                      type="number"
                      name={`floating_oreMined ${index}`}
                      id={`floating_oreMined ${index}`}
                      value={group.oreAmount}
                      onChange={(e) =>
                        updateGroup(index, e.target.value, "oreAmount")
                      }
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor={`floating_oreMined ${index}`}
                      className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Ore in bags
                    </label>
                  </div>
                </div>
              ))}

              <button
                onClick={addGroup}
                className="text-sm px-3 rounded bg-yellow-200 shadow"
              >
                Add Group
              </button>

              <button
                type="submit"
                className="text-white float-right bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col md:flex-row h-full overflow-auto gap-2">
          {/* Table and graph */}
          <div className="w-full md:w-1/2 h-full px-2 flex flex-col">
            <div className="overflow-y-auto max-h-[calc(100vh-22rem)] w-full">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-yellow-100">
                  <tr>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="w-1/2 px-6 py-3">
                      Date (mm-dd-yyyy)
                    </th>
                    <th scope="col" className="w-1/2 px-6 py-3">
                      Ore Mined(bags)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productions != null
                    ? Array.isArray(productions)
                      ? productions
                          .slice()
                          .reverse()
                          .map((production, index) => (
                            <tr
                              className="bg-white border-b hover:cursor-pointer"
                              key={index}
                              onClick={() =>
                                navigate(`details/${production.id}`)
                              }
                            >
                              <td className="px-6 py-4">{index + 1}</td>
                              <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis"
                              >
                                {formatDate(production.date.toString())}
                              </th>
                              <td className="px-6 py-4">
                                {production.totalOreMined}
                              </td>
                            </tr>
                          ))
                      : null
                    : null}
                </tbody>
              </table>
            </div>
          </div>
          <div className="border w-full md:w-1/2 h-full px-2">
            <Bar
              data={goldData}
              // height={400}
              width={700}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Monthly Produce (2023)",
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
      )}
    </div>
  );
}
