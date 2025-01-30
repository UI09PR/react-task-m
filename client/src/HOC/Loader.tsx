export default function Loader({ type }: { type: "global" | "mini" }): JSX.Element {
  if (type === "global")
    return (
      <div
        v-if="loading"
        className="fixed w-full h-full text-white z-[1000] left-0 top-0 flex-center bg-[#000] opacity-[0.8]"
      >
        <div className="rotating-object w-[15vw] h-[15vw] rounded-[50%] border-r-4 border-b-4"></div>
      </div>
    );

  return <div className="rotating-object w-6 h-6 rounded-[50%] border-r-4 border-b-4"></div>;
}
