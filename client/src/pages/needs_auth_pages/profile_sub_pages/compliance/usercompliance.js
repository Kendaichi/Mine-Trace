import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../../../config/firebase";
import { UserContext } from "../../../../context/userContext";
import { getAuth } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import AddCompliance from "./addcompliance";
import ComplianceDetails from "./compliancedetails";
import { GiWarPick } from "react-icons/gi";

export default function UserCompliance() {
  const { userData } = useContext(UserContext);

  const navigate = useNavigate();

  const [files, setFiles] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchCompliances = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;

    if (uid) {
      const compliancesColRef = collection(db, "users", uid, "compliances");
      const querySnapshot = await getDocs(compliancesColRef);
      const compliances = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // console.log(compliances);

      const transformedCompliances = compliances.map((compliance) => ({
        description: compliance.documentDescription,
        title: compliance.documentTitle,
        url: compliance.documentURL,
        id: compliance.documentID,
      }));

      setFiles(transformedCompliances);
      // console.log(files);
    } else {
      console.log("No user is logged in.");
    }
  };

  const handleDeleteDocument = async (id) => {
    setIsLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const uid = user?.uid;
      if (uid) {
        const docRef = doc(db, "users", uid, "compliances", id);
        const imgRef = ref(
          storage,
          `userDocuments/${userData.email}/userCompliances/${id}`
        );

        deleteObject(imgRef);
        deleteDoc(docRef);

        alert("Succesfully Deleted");
        setIsLoading(false);
        fetchCompliances();
      } else {
        console.log("No logged in user");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompliances();
  }, []);

  return (
    <div className="w-1/2 h-full bg-white bg-opacity-40 place-self-center rounded shadow px-5 py-2 flex flex-col gap-7 overflow-auto">
      {/* Loading Scree */}

      {isLoading ? (
        <div className="h-full w-full absolute left-0 top-0 bg-opacity-70 flex justify-center z-20 overflow-hidden">
          <div className="place-self-center flex flex-col">
            <GiWarPick
              size={100}
              className="place-self-center animate-bounce"
              color="#ff630f"
            />
            <div className="font-medium text-lg text-center">Loading...</div>
          </div>
        </div>
      ) : null}

      {/* End Loading Screen */}
      <div className="text-2xl font-bold">Compliance</div>

      <button
        className="place-self-end px-2 bg-gray-400 shadow-slate-300 text-white rounded"
        onClick={() => navigate("compliance-add")}
      >
        Add Compliance
      </button>

      <Routes>
        <Route path="/compliance-add" element={<AddCompliance />} />
        <Route path="/compliance-details/:id" element={<ComplianceDetails />} />
      </Routes>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-yellow-100">
          <tr>
            <th scope="col" className="px-2 py-3"></th>
            <th scope="col" className="px-6 py-3">
              Document Image
            </th>
            <th scope="col" className="w-1/2 px-6 py-3">
              Document Name
            </th>
            <th scope="col" className="px-2 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {files &&
            files
              .slice()
              .reverse()
              .map((file, index) => (
                <tr className="bg-white border-b">
                  <td className="px-3 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    {file.url && file.url.length > 0 ? (
                      <img
                        src={file.url}
                        alt="preview"
                        width={100}
                        height={100}
                      />
                    ) : null}
                  </td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis"
                  >
                    {file.title}
                  </th>
                  <td className="px-1 py-4">
                    <button
                      onClick={() => navigate(`compliance-details/${file.id}`)}
                    >
                      <FaEdit size={25} color="blue" />
                    </button>
                    <button onClick={() => handleDeleteDocument(file.id)}>
                      <MdDelete size={25} color="red" />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
