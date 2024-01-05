import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { getAuth } from "firebase/auth";
import { FaTrash } from "react-icons/fa";

export default function UserMineSite() {
  const [mainCoordinates, setMainCoordinates] = useState({ lat: "", long: "" });
  const [polygonCoordinates, setPolygonCoordinates] = useState([
    { lat: "", long: "" },
  ]);
  const [editing, setEditing] = useState(false);

  const handleMainLatLngChange = (field, event) => {
    setMainCoordinates({ ...mainCoordinates, [field]: event.target.value });
  };

  const handlePolygonLatLngChange = (index, field, event) => {
    const newPolygonCoordinates = [...polygonCoordinates];
    newPolygonCoordinates[index][field] = event.target.value;
    setPolygonCoordinates(newPolygonCoordinates);
  };

  const handleRemovePolygon = (e, index) => {
    e.preventDefault();
    setPolygonCoordinates((prevPolygonCoordinates) =>
      prevPolygonCoordinates.filter((_, i) => i !== index)
    );
  };

  const handleSetEditing = () => setEditing(true);

  const handleCancelEditing = () => setEditing(false);

  async function handleSave(e) {
    e.preventDefault();
    if (polygonCoordinates.length > 2) {
      const auth = getAuth();
      const user = auth.currentUser;
      const uid = user?.uid;

      if (uid) {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, {
          mainCoordinates: mainCoordinates,
          polygonCoordinates: polygonCoordinates,
        });

        alert("Data Updated");
        setEditing(false);
      } else {
        console.log("No user is logged in");
      }
    } else {
      alert("Your Polygon Coordinates should be not less than 3");
    }
  }

  async function getCoordinates() {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;

    if (uid) {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const mainCoor = docSnap.data().mainCoordinates;
        const polygonCoor = docSnap.data().polygonCoordinates;

        if (mainCoor) {
          setMainCoordinates(mainCoor);
        }

        if (polygonCoor) {
          setPolygonCoordinates(polygonCoor);
        }
      } else {
      }
    }
  }

  useEffect(() => {
    getCoordinates();
  }, []);

  return (
    <div className="w-3/4 h-full bg-white bg-opacity-40 place-self-center rounded shadow px-5 py-2 flex flex-col gap-10">
      <div className="text-2xl font-bold">Location</div>
      <form className="h-full flex flex-col gap-10 py-2" onSubmit={handleSave}>
        <label className="font-medium -mt-3">Main Coordinates:</label>
        <div className="flex gap-2 -mt-8">
          <input
            type="text"
            value={mainCoordinates.lat}
            onChange={(event) => handleMainLatLngChange("lat", event)}
            placeholder="Latitude"
            disabled={!editing}
            className="w-1/2 px-2 shadow rounded"
            required
          />
          <input
            type="text"
            value={mainCoordinates.long}
            onChange={(event) => handleMainLatLngChange("long", event)}
            placeholder="Longitude"
            disabled={!editing}
            className="w-1/2 px-2 shadow rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Polygon Coordinates:</label>
          {polygonCoordinates.map((coordinate, index) => (
            <div key={index} className="w-full flex gap-2 mt-2">
              <input
                type="text"
                value={coordinate.lat}
                onChange={(event) =>
                  handlePolygonLatLngChange(index, "lat", event)
                }
                placeholder="Latitude"
                className="w-1/2 shadow rounded px-2"
                disabled={!editing}
                required
              />
              <input
                type="text"
                value={coordinate.long}
                onChange={(event) =>
                  handlePolygonLatLngChange(index, "long", event)
                }
                placeholder="Longitude"
                className="w-1/2 shadow rounded px-2"
                disabled={!editing}
                required
              />

              {editing ? (
                <button onClick={(e) => handleRemovePolygon(e, index)}>
                  <FaTrash color="red" />
                </button>
              ) : null}
            </div>
          ))}
        </div>

        {editing ? (
          <button
            className="rounded place-self-center bg-yellow-100 py-1 px-4 font-medium"
            onClick={() =>
              setPolygonCoordinates([
                ...polygonCoordinates,
                { lat: "", long: "" },
              ])
            }
          >
            Add Polygon
          </button>
        ) : null}

        {editing ? (
          <div className="place-self-end flex gap-3">
            <button
              className="place-self-end border px-3 rounded bg-red-300 font-medium"
              onClick={handleCancelEditing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="place-self-end border px-3 rounded bg-green-300 font-medium"
            >
              Submit
            </button>
          </div>
        ) : (
          <button
            className="place-self-end border px-3 rounded bg-gray-300 font-medium"
            onClick={handleSetEditing}
          >
            Edit
          </button>
        )}
      </form>
    </div>
  );
}
