import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useState } from "react";
import { db, storage } from "../../config/firebase";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { GiWarPick } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function AddCompliance() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { userData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const newFile = {
        file: "",
        url: "",
      };
      newFile.file = event.target.files[0];
      newFile.url = URL.createObjectURL(event.target.files[0]);
      setFile(newFile);
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

  const handleUpdateData = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;

    if (uid) {
      const compliancesColRef = collection(db, "users", uid, "compliances");

      const docRef = await addDoc(compliancesColRef, {
        documentTitle: title,
        documentDescription: description,
      });

      const documentId = docRef.id;

      const downloadUrl = await uploadFile(documentId);

      await updateDoc(docRef, {
        documentID: documentId,
        documentURL: downloadUrl,
      });

      alert("Data Updated");
      setFile(null);
      setTitle("");
      setDescription("");
      setIsLoading(false);
    } else {
      console.log("No user is logged in.");
    }
  };

  const uploadFile = async (documentId) => {
    if (!file || !file.file) {
      alert("No Image selected");
    } else {
      const fileObj = file;
      const fileFirestore = ref(
        storage,
        `userDocuments/${userData.email}/userCompliances/${documentId}`
      );
      await uploadBytes(fileFirestore, fileObj.file, {
        contentType: fileObj.file.type,
      });
      const downloadUrl = await getDownloadURL(fileFirestore);
      alert(`Image with title "${title}" uploaded`);
      return downloadUrl;
    }
  };

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
          onSubmit={(e) => handleUpdateData(e)}
        >
          <div>
            <div class="flex items-center justify-center w-full relative">
              <label
                for="dropzone-file"
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100 "
              >
                {file && file.url !== "" ? null : (
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 ">
                      <span class="font-semibold">Click to upload images</span>{" "}
                      or drag and drop
                    </p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  multiple={false}
                  accept="image/*"
                  class="hidden"
                  required
                  onChange={handleFileChange}
                />
                {file && file.url && (
                  <img
                    src={file.url}
                    alt="Uploaded_image"
                    width={190}
                    height={190}
                    className="absolute"
                  />
                )}
              </label>
            </div>
          </div>

          <input
            type="text"
            value={title}
            placeholder="Compliance Title"
            className="h-1/2 px-1 rounded shadow"
            onChange={handleTitleChange}
            required
          />
          <input
            type="text"
            value={description}
            placeholder="Description"
            className="h-1/2 px-1 rounded shadow"
            onChange={handleDescriptionChange}
            required
          />
          <button
            className="place-self-end px-3 bg-green-300 rounded text-lg"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
