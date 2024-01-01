import Nav from "../../components/nav";

export default function About() {
  return (
    <div className="h-[100vh] flex flex-col">
      <div className="h-auto">
        <Nav />
      </div>
      <div className="flex h-full justify-around py-10 flex-col gap-5">
        <div className="text-6xl font-bold place-self-center">About Us</div>
        <div className="w-3/4 place-self-center text-justify">
          Welcome to <span className="font-bold text-lg">MineTrace</span> a
          revolutionary initiative conceived by two visionary students from
          Caraga State University. At MineTrace, we embark on a groundbreaking
          journey to harness the immense power of blockchain technology, aiming
          to reshape the landscape of the mining industry with an unwavering
          commitment to transparency and sustainability in ore production. Our
          mission is to pave the way for a new era in mining, where trust and
          accountability reign supreme. By leveraging blockchain, we empower
          stakeholders with a secure and decentralized platform that ensures
          every step of the ore production process is transparent, traceable,
          and verifiable. MineTrace seeks to foster a culture of openness and
          ethical mining practices, thereby fostering a sustainable future for
          the mining industry. As passionate advocates for innovation, our team
          is dedicated to addressing the challenges faced by the mining sector.
          Through cutting-edge technology and a fervent belief in the potential
          of blockchain, MineTrace aspires to redefine industry standards and
          inspire a positive change that extends beyond borders. Join us in this
          transformative journey towards a mining industry characterized by
          integrity, accountability, and a commitment to environmental and
          social responsibility. Together, let's build a future where the power
          of blockchain unlocks the true potential of transparent and
          sustainable ore production at MineTrace.
        </div>
        <div className="place-self-center  flex flex-col w-full">
          <div className="text-center text-4xl font-bold">Meet The Team</div>
          <div className="w-3/4 place-self-center flex justify-center mt-4">
            <div className="flex w-1/2 justify-center">
              <div className="flex flex-col w-3/4 text-right font-medium py-2">
                <div>Alfredo Jr. F. Valledor</div>
                <div>BS Mining Engineering</div>
                <div>alfredovalledor@gmail.com</div>
              </div>
              <div className="w-20 h-20 m-auto rounded-full border shadow-md flex justify-center bg-alfredo bg-cover "></div>
            </div>
            <div className="flex w-1/2 justify-center">
              <div className="w-20 h-20 m-auto rounded-full border shadow-md flex justify-center bg-alfredo2nd bg-cover"></div>
              <div className="flex flex-col w-3/4 text-left font-medium py-2">
                <div>Rey P. Manzo</div>
                <div>BS Mining Engineering</div>
                <div>reymanzo000@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
