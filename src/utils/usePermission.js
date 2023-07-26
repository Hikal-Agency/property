import { useStateContext } from "../context/ContextProvider";

const usePermission = () => {
  const { permissions } = useStateContext();

  return { hasPermission: (key) => permissions?.includes(key?.toLowerCase()) };
};

export default usePermission;
