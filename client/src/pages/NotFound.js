import Nav from "../components/nav";
import { PacmanLoader } from "react-spinners";

export default function NotFound() {
  return (
    <div className="h-[100vh] flex flex-col">
      <div className="h-auto">
        <Nav />
      </div>
      <div className="flex flex-col lg:flex-row justify-center gap-10 h-full bg-yellow-100">
        <div className="w-full flex flex-col justify-center pl-24 lg:pl-48 pr-24 gap-10">
          <div className="flex flex-col gap-3">
            <div className="text-4xl font-bold">So Sorry!</div>
            <div className="text-3xl font-bold">
              The page you are looking for cannot be found
            </div>
          </div>

          <div>
            <div className="text-xl font-medium">Possible Reasons:</div>
            <ul className="list-disc text-base">
              <li>The Address may have been typed incorrectly;</li>
              <li>It may be broken or outdated link.</li>
            </ul>
          </div>
        </div>
        <div className="w-full flex pl-32 justify-start">
          <PacmanLoader
            color="#ffbd24"
            className="place-self-center"
            size={100}
          />
        </div>
      </div>
    </div>
  );
}
