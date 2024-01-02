import Nav from "../components/nav";
import { MdOutlineMail, MdKey, MdKeyboardBackspace } from "react-icons/md";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { GiWarPick } from "react-icons/gi";

const LogIn = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pleaseVerify, setPleaseVerify] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(90);

  const handleSetSignup = () => setIsLogin(false);
  const handleCancelSignUp = () => setIsLogin(true);

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleInputChange = (field, value) => {
    setUserCredentials((prevUserData) => ({
      ...prevUserData,
      [field]: value,
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSendEmailVerification = async () => {
    await sendEmailVerification(user);

    setIsButtonDisabled(true);
    setTimer(90);

    const intervalId = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
      setIsButtonDisabled(false);
    }, 90000);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      if (userCredentials.password !== confirmPassword) {
        // throw new Error("Passwords do not match");
        return alert("Passwords do not match");
      }

      if (userCredentials.password.length > 6) {
        return alert("Passwords must be atleast 6 characters");
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        userCredentials.email,
        userCredentials.password
      );

      if (result.user) {
        await setDoc(doc(db, "users", result.user.uid), {
          email: userCredentials.email,
        });
        setUser(result.user);
        await sendEmailVerification(result.user);
        setIsLoading(false);
        setIsButtonDisabled(true);
        setTimer(90);

        const intervalId = setInterval(() => {
          setTimer((timer) => timer - 1);
        }, 1000);

        setTimeout(() => {
          clearInterval(intervalId);
          setIsButtonDisabled(false);
        }, 90000);
      }

      setIsVerifying(true);
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Email is already in use");
          break;
        default:
          console.log(error);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        userCredentials.email,
        userCredentials.password
      );

      if (credential.user && !credential.user.emailVerified) {
        setIsLoading(false);
        setUser(credential.user);
        await sendEmailVerification(credential.user);
        setPleaseVerify(true);
        setIsButtonDisabled(true);
        setTimer(90);

        const intervalId = setInterval(() => {
          setTimer((timer) => timer - 1);
        }, 1000);

        setTimeout(() => {
          clearInterval(intervalId);
          setIsButtonDisabled(false);
        }, 90000);
        return;
      }

      navigate("/user-profile");

      setIsLoading(false);
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          alert("Invalid email");
          break;
        case "auth/user-not-found":
          alert("No user found with this email");
          break;
        case "auth/wrong-password":
          alert("Wrong password");
          break;
        case "auth/invalid-credential":
          alert("Invalid credentials");
          break;
        default:
          console.log(error);
      }
    }
  };

  useEffect(() => {
    try {
      if (isAuthenticated) {
        navigate("/user-profile");
      }
    } catch (error) {
      console.log(error);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-[100vh] flex flex-col">
      {isLoading ? (
        <div className="absolute h-[100vh] w-full bg-yellow-200 bg-opacity-70 flex justify-center z-20">
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

      {isVerifying ? (
        <div className="absolute h-[100vh] w-full bg-yellow-200 bg-opacity-70 flex justify-center z-20">
          <div className="place-self-center flex flex-col bg-white justify-center rounded-xl h-3/4 w-3/4 py-10 px-5 gap-3">
            <div className="text-4xl font-bold place-self-center">
              We've sent an email for verification!!
            </div>
            <div className="place-self-center text-lg font-medium">
              Please check your inbox
            </div>
            {isButtonDisabled ? (
              <span className="place-self-center">
                Resend Email in {timer} seconds
              </span>
            ) : (
              <button
                className="place-self-center shadow px-3 rounded-md bg-yellow-500 text-white"
                onClick={handleSendEmailVerification}
                disabled={isButtonDisabled}
              >
                Resend Email
              </button>
            )}
          </div>
        </div>
      ) : null}
      {pleaseVerify ? (
        <div className="absolute h-[100vh] w-full bg-yellow-200 bg-opacity-70 flex justify-center z-20">
          <div className="place-self-center flex flex-col bg-white justify-center rounded-xl h-3/4 w-3/4 py-10 px-5 gap-3">
            <div className="text-4xl font-bold place-self-center">
              Account not verified! Please verify first your email.
            </div>
            <div className="place-self-center text-lg font-medium">
              We've sent email verification
            </div>
            {isButtonDisabled ? (
              <span className="place-self-center">
                Resend Email in {timer} seconds
              </span>
            ) : (
              <button
                className="place-self-center shadow px-3 rounded-md bg-yellow-500 text-white"
                onClick={handleSendEmailVerification}
                disabled={isButtonDisabled}
              >
                Resend Email
              </button>
            )}
          </div>
        </div>
      ) : null}
      <div className="h-auto">
        <Nav />
      </div>
      <div className="border-black flex h-full">
        <div className="relative w-1/2 bg-mineSite bg-cover">
          <div className="absolute bg-black bg-opacity-50 h-full w-full px-10 py-36 flex flex-col justify-center">
            <div className="text-5xl font-bold text-white leading-normal place-self-center">
              MineTrace: Ethical Mining Transparency Platform
            </div>
          </div>
        </div>
        <div className="relative w-1/2 bg-mineSite2 bg-cover">
          <div className="absolute h-full w-full bg-black bg-opacity-20 flex justify-center">
            <div className="relative w-3/4 h-3/4 place-self-center bg-gray-400 rounded-xl bg-opacity-50 px-5 py-10">
              <div className="text-white text-3xl font-semibold text-center mb-10">
                {isLogin ? "~Log In~" : "~Sign Up~"}
              </div>

              {/* <div className="flex justify-center">
                <button onClick={signInWithGoogle}>
                  <FaGoogle size={25} />
                </button>
              </div> */}

              {isLogin ? (
                <form
                  className="max-w-sm mx-auto flex flex-col gap-5"
                  onSubmit={handleLogin}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Email
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                        <MdOutlineMail color="gray" />
                      </span>
                      <input
                        type="email"
                        id="email"
                        className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  "
                        placeholder="user@email.com"
                        required
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        value={userCredentials.email}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Password
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                        <MdKey color="gray" />
                      </span>
                      <input
                        type="password"
                        id="password"
                        className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  "
                        placeholder="*******"
                        required
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        value={userCredentials.password}
                      />
                    </div>
                  </div>

                  <button
                    className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded place-self-center"
                    type="submit"
                  >
                    Log In
                  </button>

                  <div className="place-self-end text-white text-sm font-medium">
                    No account?
                    <span
                      className="ml-1 hover:cursor-pointer hover:underline hover:text-yellow-200 duration-100"
                      onClick={handleSetSignup}
                    >
                      Click here!
                    </span>
                  </div>
                </form>
              ) : (
                <form
                  className="max-w-sm mx-auto flex flex-col gap-2"
                  onSubmit={handleSignUp}
                >
                  <div
                    className="absolute left-4 top-4 hover:cursor-pointer"
                    onClick={handleCancelSignUp}
                  >
                    <MdKeyboardBackspace color="white" size={25} />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Email
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                        <MdOutlineMail color="gray" />
                      </span>
                      <input
                        type="email"
                        id="email"
                        className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  "
                        placeholder="user@email.com"
                        required
                        value={userCredentials.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Password
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                        <MdKey color="gray" />
                      </span>
                      <input
                        type="password"
                        id="password"
                        className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  "
                        placeholder="*******"
                        required
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        value={userCredentials.password}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="confirm_password"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Confirm Password
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                        <MdKey color="gray" />
                      </span>
                      <input
                        type="password"
                        id="confirm_password"
                        className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  "
                        placeholder="*******"
                        required
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                      />
                    </div>
                  </div>

                  <button
                    className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded place-self-center"
                    type="submit"
                  >
                    Sign Up
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
