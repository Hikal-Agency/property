import { DoubleBubble } from 'react-spinner-animated';
import 'react-spinner-animated/dist/index.css';

const Loader = () => {
  return (
    <>
      <div className="w-full h-[80vh] flex items-center justify-center">
       {/* <DoubleBubble text="Loading.." width="130px" height="130px"/> */}
          <img
          height={320}
          style={{position: "relative", bottom: 60}}
          width={350}
          src={"/assets/loading/hikalloading.gif"}
          alt=""
        />
      </div>
    </>
  );
};

export default Loader;
