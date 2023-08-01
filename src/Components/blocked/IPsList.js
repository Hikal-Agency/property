import IPCard from "./IPCard";
import { useStateContext } from "../../context/ContextProvider";

const IPsList = ({ ips, heading, isRequest, fetchBlockedIPs, isRejected }) => {
  const { currentMode } = useStateContext();
  return (
    <>
      <h1
        className={`text-2xl border-l-[4px]  ml-1 pl-1 mb-5 mt-4 font-bold ${
          currentMode === "dark"
            ? "text-white border-white"
            : "text-main-red-color font-bold border-main-red-color"
        }`}
      >
        ● {heading}
      </h1>
      <div className="flex flex-wrap">
        {ips?.length > 0 ? (
          [
            ips?.map((ip) => {
              if (ip?.byIP) {
                return (
                  <IPCard isRejected={isRejected} fetchBlockedIPs={fetchBlockedIPs} isRequest={isRequest} ip={ip} key={ip?.id} />
                );
              }
            }),
          ]
        ) : (
          <p style={{ color: "red" }}>Nothing to show!</p>
        )}
      </div>
    </>
  );
};

export default IPsList;
