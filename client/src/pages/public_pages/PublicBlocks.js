import { useEffect, useState } from "react";
import Nav from "../../components/nav";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProductionStorage from "../../contracts/ProductionStorage.json";
import Web3 from "web3";
import BlocksDetails from "./BlocksDetails";

export default function PublicBlocks() {
  const [productions, setProductions] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [account, setAccount] = useState(null);

  const navigate = useNavigate();

  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  const handleFetchProduction = async () => {
    try {
      // Check if contractInstance is not null
      if (contractInstance) {
        const result = await contractInstance.methods.getAllProductions().call({
          from: account,
        });

        // console.log(result);

        setProductions(result);
      }
    } catch (error) {
      console.error(error);
    }
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
          await window.ethereum.request({ method: "eth_requestAccounts" });

          //get web3 instance
          const web3 = new Web3(window.ethereum);

          //get the contract instance
          const networkId = await web3.eth.net.getId();
          const deployedContract = ProductionStorage.networks[networkId];
          //   console.log(deployedContract);
          // console.log(deployedContract.address);

          if (!deployedContract) {
            console.error(`Contract not deployed on network ${networkId}`);
            return;
          }

          const contractABI = ProductionStorage.abi;
          //   console.log(contractABI);
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
  }, []);

  useEffect(() => {
    handleFetchProduction();
    // eslint-disable-next-line
  }, [contractInstance]);

  return (
    <div className="h-auto flex flex-col">
      <div className="h-auto">
        <Nav />
      </div>

      <Routes>
        <Route
          path="/details/:index"
          element={
            <BlocksDetails
              account={account}
              contractInstance={contractInstance}
            />
          }
        />
      </Routes>

      <div className="h-full p-10 overflow-y-auto max-h-[calc(100vh-22rem)] w-full">
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
              <th scope="col" className="w-1/2 px-6 py-3">
                Sender Address
              </th>
            </tr>
          </thead>
          <tbody>
            {productions
              ? Array.isArray(productions)
                ? productions
                    .slice()
                    .reverse()
                    .map((production, index) => (
                      <tr
                        className="bg-white border-b hover:cursor-pointer"
                        key={index}
                        onClick={() => navigate(`details/${production.id}`)}
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
                        <td className="px-6 py-4">{production.sender}</td>
                      </tr>
                    ))
                : null
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
