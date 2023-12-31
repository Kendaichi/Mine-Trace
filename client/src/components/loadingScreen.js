import { GiWarPick } from "react-icons/gi";

export default function LoadingScreen() {
  return (
    <div className="h-[100vh] w-full bg-yellow-200 flex justify-center">
      <div className="place-self-center flex flex-col">
        <GiWarPick
          size={100}
          className="place-self-center animate-bounce"
          color="#ff630f"
        />
        <div className="font-medium text-lg text-center">Loading...</div>
      </div>
    </div>
  );
}
