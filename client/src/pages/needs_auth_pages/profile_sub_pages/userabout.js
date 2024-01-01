import { useEffect, useState } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { getAuth } from "firebase/auth";

export default function UserAbout() {
  const [about, setAbout] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [editing, setEditing] = useState(false);

  const handleAboutChange = (event) => {
    setAbout(event.target.value);
    setCharacterCount(event.target.value.length);
  };

  const handleSetEditing = () => setEditing(true);

  const handleCancelEditing = () => setEditing(false);

  async function handleSave() {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;

    if (uid) {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, { about: about });
      alert("About Updated");
    } else {
      console.log("No user is logged in.");
    }
  }

  async function getAbout() {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;

    if (uid) {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const aboutField = docSnap.data().about;
        // console.log("About Field: ", aboutField);
        setAbout(aboutField);
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No user is logged in.");
    }
  }

  useEffect(() => {
    getAbout();
  }, []);

  return (
    <div className="w-1/2 h-full bg-white bg-opacity-40 place-self-center rounded shadow px-5 py-2 flex flex-col gap-10">
      <div className="text-2xl font-bold">About</div>

      <div className="-mb-8 -mt-5 flex justify-end gap-2">
        {editing ? (
          <>
            <button
              className="border px-3 rounded bg-red-500 text-white"
              onClick={handleCancelEditing}
            >
              Cancel
            </button>
            <button
              className="border px-3 rounded bg-green-500 text-white"
              onClick={() => {
                handleSave();
                handleCancelEditing();
              }}
            >
              Save
            </button>
          </>
        ) : (
          <button
            className="border px-3 rounded bg-gray-400 text-white"
            onClick={handleSetEditing}
          >
            Edit
          </button>
        )}
      </div>
      <textarea
        className="shadow h-3/4 rounded"
        value={about}
        onChange={handleAboutChange}
        maxLength="1500"
        disabled={!editing}
      />
      <p className="-mt-10">{characterCount}/1500</p>
    </div>
  );
}
