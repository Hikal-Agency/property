import { DoubleBubble } from 'react-spinner-animated';
import 'react-spinner-animated/dist/index.css';

const Loader = () => {
  return (
    <>
      <div className="w-full h-[80vh] flex items-center justify-center">
       <DoubleBubble text="Loading.." width="130px" height="130px"/>
      </div>
      {/* <div className="h-screen w-screen overflow-hidden flex space-x-2 items-center justify-center">
      <CircularProgress /><h1>Loading</h1>
    </div> */}
    </>
  );
};

export default Loader;
