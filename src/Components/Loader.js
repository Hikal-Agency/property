import React from "react";

const Loader = () => {
  return (
    <>
      <div className="w-full h-full flex space-x-2 items-center justify-center">
        <img
          // unoptimized={true}
          height={350}
          width={350}
          src={"/assets/loading/hikalloading.gif"}
          alt=""
          // className="h-[200px] w-[200px] object-cover"
        />
      </div>
      {/* <div className="h-screen w-screen overflow-hidden flex space-x-2 items-center justify-center">
      <CircularProgress /><h1>Loading</h1>
    </div> */}
    </>
  );
};

export default Loader;
