import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";

import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { IoMdArrowRoundBack } from "react-icons/io";
import LoadingScreen from "../../components/loadingScreen";

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
    <div className="h-[100vh] bg-yellow-400 flex flex-col">
      <div className="w-full flex py-5 px-5 justify-evenly">
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
        <div
          className="bg-black text-white text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-production/${id}`)}
        >
          Production
        </div>
        <div
          className="bg-black text-white text-3xl py-2 px-4 cursor-pointer"
          onClick={() => navigate(`/company-certificates/${id}`)}
        >
          Certificates
        </div>
        <div className="bg-white text-black text-3xl py-2 px-4 border-2 border-black">
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
        <div className="text-5xl font-bold">Site Navigation</div>
      </div>

      <div className="relative bg-white w-full h-full">
        <div className="w-full">
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
