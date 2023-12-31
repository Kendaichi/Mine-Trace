import Nav from "../components/nav";
import MinerCard from "../components/minercard";
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import LoadingScreen from "../components/loadingScreen";

const MiningSites = () => {
  const [miners, setMiners] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchMiners = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      let minersSnapshot = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (searchQuery) {
        minersSnapshot = minersSnapshot.filter(
          (miner) =>
            miner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            miner.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setMiners(minersSnapshot);
      setIsLoading(false);
      //   console.log(minersSnapshot);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMiners();
    // eslint-disable-next-line
  }, [searchQuery]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-[100vh] flex flex-col">
      <div className="h-auto">
        <Nav />
      </div>
      <div className="bg-yellow-50 h-full flex flex-col justify-center py-11 px-36">
        <div className="h-full w-full place-self-center flex flex-col gap-2">
          <div className="place-self-end w-1/4 h-14 flex flex-col justify-center px-3 rounded bg-white">
            <div className="flex gap-2 h-full justify-center">
              <IoSearch size={20} className="place-self-center" />
              <input
                type="text"
                name="search input"
                className="w-full h-full focus:outline-none text-gray-800"
                placeholder="Search for email or company"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 px-5 py-5 h-full w-full md:grid-cols-5 overflow-x-hidden gap-5 custom-scrollbar">
            {miners &&
              miners.map((miner, index) => (
                <MinerCard key={index} miner={miner} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningSites;
