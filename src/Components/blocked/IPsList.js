import IPCard from "./IPCard";
import { useStateContext } from "../../context/ContextProvider";


const IPsList = ({ ips, heading, isRequest, fetchBlockedIPs, isRejected }) => {
  const { currentMode } = useStateContext();


  return (
    <>
    <div>
    </div>
      <div className="flex flex-wrap">
        {ips?.length > 0 ? (
          [
            ips?.map((ip) => {
              if (ip?.byIP) {
                return (
                  <IPCard
                    isRejected={isRejected}
                    fetchBlockedIPs={fetchBlockedIPs}
                    isRequest={isRequest}
                    ip={ip}
                    key={ip?.id}
                  />
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
