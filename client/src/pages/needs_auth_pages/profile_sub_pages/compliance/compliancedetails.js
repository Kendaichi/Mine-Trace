import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../../context/userContext";
import { GiWarPick } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db, storage } from "../../../../config/firebase";

import { MdDescription, MdOutlineTitle } from "react-icons/md";
import { FaRegImage } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi2";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function ComplianceDetails() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [editingText, setEditingText] = useState(false);
  const [editingImage, setEditingImage] = useState(false);

  const handleSetEditingImage = () => setEditingImage(true);
  const handleCancelEditingImage = () => setEditingImage(false);

  const handleSetEditingText = () => setEditingText(true);
  const handleCancelEditingText = () => setEditingText(false);

  const { id } = useParams();

  const navigate = useNavigate();

  const { userData } = useContext(UserContext);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setFile({ file, url });
    } else {
      setFile(null);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const fetchSpecificCompliance = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;

    if (uid) {
      const docRef = doc(db, "users", uid, "compliances", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const compliance = {
          ...docSnap.data(),
          id: docSnap.id,
        };

        setFile({
          file: null,
          url: compliance.documentURL,
        });
        setTitle(compliance.documentTitle);
        setDescription(compliance.documentDescription);
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No user is logged in.");
    }
  };

  const handleOnSaveImage = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;
    if (uid) {
      const downloadUrl = await uploadFile();
      const docRef = doc(db, "users", uid, "compliances", id);
      await updateDoc(docRef, {
        documentURL: downloadUrl,
      });
      alert(`Image with title "${title}" uploaded`);
      handleCancelEditingImage();
      setIsLoading(false);
    } else {
      console.log("There is no user logged in");
    }
  };

  const uploadFile = async () => {
    if (!file || !file.file) {
      alert("No Image selected");
    } else {
      const fileObj = file;
      const fileFirestore = ref(
        storage,
        `userDocuments/${userData.email}/userCompliances/${id}`
      );
      await uploadBytes(fileFirestore, fileObj.file, {
        contentType: fileObj.file.type,
      });
      const downloadUrl = await getDownloadURL(fileFirestore);
      return downloadUrl;
    }
  };

  const handleOnSaveText = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    console.log("called");
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;
    if (uid) {
      const docRef = doc(db, "users", uid, "compliances", id);
      await updateDoc(docRef, {
        documentTitle: title,
        documentDescription: description,
      });
      alert("Text updated");
      handleCancelEditingText();
      setIsLoading(false);
    } else {
      console.log("There is no user logged in");
    }
  };

  useEffect(() => {
    fetchSpecificCompliance();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-30 flex justify-center">
      {/* Loading Screen */}
      {isLoading ? (
        <div className="absolute h-full w-full bg-yellow-300 bg-opacity-30 z-20 flex justify-center">
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
      <div className="bg-white h-3/4 w-3/4 place-self-center rounded-xl shadow shadow-slate-300 px-10 py-10 relative">
        <button
          className="absolute z-20 left-2 top-2"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowRoundBack size={25} />
        </button>
        <form
          className="w-full h-full flex flex-col gap-10"
          //   onSubmit={(e) => handleUpdateData(e)}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col md:flex-row gap-4 h-auto overflow-auto">
            <div className="w-1/2 flex justify-center flex-col place-self-center">
              <input
                type="file"
                hidden
                accept="image/*"
                id="fileInput"
                multiple={false}
                onChange={(e) => handleFileChange(e)}
              />

              {file && file.url && (
                <img
                  src={file.url}
                  alt="Uploaded_image"
                  width={300}
                  height={300}
                  className="place-self-center"
                />
              )}

              {editingImage ? (
                <button
                  className="place-self-center border px-2 bg-gray-200 rounded font-medium"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Upload Image
                </button>
              ) : null}
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-10">
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Document Title
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                    <MdOutlineTitle />
                  </span>
                  <input
                    type="title"
                    id="title"
                    className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  "
                    placeholder="Document Title Here"
                    required
                    value={title}
                    disabled={!editingText}
                    onChange={handleTitleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Document Description
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                    <MdDescription />
                  </span>
                  <input
                    type="description"
                    id="description"
                    className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  "
                    placeholder="Document Title Here"
                    required
                    value={description}
                    disabled={!editingText}
                    onChange={handleDescriptionChange}
                  />
                </div>
              </div>

              <div className="h-full flex justify-center gap-5">
                {editingImage ? (
                  <div className="flex flex-col place-self-center">
                    <button
                      className="place-self-center border w-28 h-16 flex flex-col justify-center bg-green-500 bg-opacity-50 rounded"
                      onClick={(e) => handleOnSaveImage(e)}
                    >
                      <div className="text-center w-full">Save</div>
                    </button>
                    <button
                      className="place-self-center border w-28 h-16 flex flex-col justify-center bg-red-500 bg-opacity-50 rounded"
                      onClick={handleCancelEditingImage}
                    >
                      <div className="text-center w-full">Cancel</div>
                    </button>
                  </div>
                ) : (
                  <button
                    className="place-self-center border w-28 h-32 flex flex-col justify-center bg-yellow-500 bg-opacity-50 rounded"
                    onClick={handleSetEditingImage}
                  >
                    <div className="place-self-center">
                      <FaRegImage size={30} />
                    </div>
                    <div className="text-center w-full">Edit Image</div>
                  </button>
                )}
                {editingText ? (
                  <div className="flex flex-col place-self-center">
                    <button
                      className="place-self-center border w-28 h-16 flex flex-col justify-center bg-green-500 bg-opacity-50 rounded"
                      onClick={(e) => handleOnSaveText(e)}
                    >
                      <div className="text-center w-full">Save</div>
                    </button>
                    <button
                      className="place-self-center border w-28 h-16 flex flex-col justify-center bg-red-500 bg-opacity-50 rounded"
                      onClick={handleCancelEditingText}
                    >
                      <div className="text-center w-full">Cancel</div>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSetEditingText}
                    className="place-self-center border w-28 h-32 flex flex-col justify-center bg-orange-500 bg-opacity-50 rounded"
                  >
                    <div className="place-self-center">
                      <HiDocumentText size={30} />
                    </div>
                    <div className="text-center w-full">Edit Text</div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
