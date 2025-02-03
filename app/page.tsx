import Image from "next/image";
import Controlers from "./components/controlers";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Controlers />
    </div>
  );
}
