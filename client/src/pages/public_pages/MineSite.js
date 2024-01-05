import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";

import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { IoMdArrowRoundBack } from "react-icons/io";
import LoadingScreen from "../../components/loadingScreen";
import { RiMapPin2Fill } from "react-icons/ri";
import { IoClose, IoNewspaper } from "react-icons/io5";
import { FaChartPie } from "react-icons/fa6";
import { BsQuestionCircleFill } from "react-icons/bs";
import { TiThMenu } from "react-icons/ti";
import { MdMore } from "react-icons/md";

const MineSite = () => {
  const markerIcon = new Icon({
    iconUrl: require("../../assets/locationMarker.png"),
    iconSize: [38, 38],
    iconAnchor: [17, 30],
  });

  const [polygons, setPolygons] = useState(null);
  const [mainCoordinates, setMainCooredinates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isDrawer, setIsDrawer] = useState(false);

  const { id } = useParams();

  async function getAboutandLogo() {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log(docSnap.data());
      const mainCoordinatesData = docSnap.data().mainCoordinates;
      const polygonCoordinatesData = docSnap.data().polygonCoordinates;

      if (mainCoordinatesData) {
        const mainCoordinatesArray = [
          parseFloat(mainCoordinatesData.lat),
          parseFloat(mainCoordinatesData.long),
        ];
        setMainCooredinates(mainCoordinatesArray);
      }

      if (polygonCoordinatesData) {
        const polygonsArray = polygonCoordinatesData.map((coord) => [
          parseFloat(coord.lat),
          parseFloat(coord.long),
        ]);
        setPolygons(polygonsArray);
      }

      setIsLoading(false);
    } else {
      console.log("No such document!");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAboutandLogo();
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-[100vh] bg-yellow-400 flex flex-col overflow-hidden">
      {isDrawer ? (
        <>
          <div className="absolute right-0 top-0 h-full w-full z-[1000] bg-white bg-opacity-50 backdrop-blur-md"></div>

          <div className="absolute z-[1000] right-0 top-0 h-full  w-72 bg-white flex flex-col px-2 py-5 gap-5">
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
              <div className="flex gap-2 justify-start">
                <RiMapPin2Fill
                  size={16}
                  color="gray"
                  className="place-self-center"
                />
                <div className="text-base font-bold">Minesite</div>
              </div>
              <div
                className="flex gap-2 justify-start"
                onClick={() => navigate(`/more/${id}`)}
              >
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
        <div className="bg-white text-black md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 border-2 border-black">
          Navigate Mine Site
        </div>
        <div
          className="bg-black text-white md:text-xl lg:text-2xl xl:text-3xl py-2 px-4 cursor-pointer"
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
        <div className="hidden lg:block text-5xl font-bold">
          Government Compliance
        </div>
        <div className="place-self-center w-full flex lg:hidden justify-end">
          <button onClick={() => setIsDrawer(true)}>
            <TiThMenu size={25} />
          </button>
        </div>
      </div>

      <div className="bg-white w-full h-full">
        <div className="absolute w-full">
          {mainCoordinates ? (
            <MapContainer
              center={mainCoordinates}
              zoom={13}
              scrollWheelZoom={true}
              minZoom={5}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={mainCoordinates} icon={markerIcon}>
                <Popup>Del Pillar Mining Site</Popup>
              </Marker>
              {polygons && (
                <Polygon positions={polygons} color="orange" weight={1} />
              )}
            </MapContainer>
          ) : (
            <div className="px-10 py-24 text-2xl font-medium">
              No Mining Site Coordinates
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MineSite;
