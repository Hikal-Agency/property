import { useStateContext } from "../context/ContextProvider";

const usePermission = () => {
  const { permits } = useStateContext();
  console.log(permits);

  return {
    hasPermission: (key) => {
      const userPermissions = permits
        ?.split(",")
        ?.map((p) => `/${p}`.replaceAll(" ", "").trim());
      const isPermitted = userPermissions?.some((permission) =>
        key?.includes(permission)
      );
      console.log(key)
      return isPermitted;
    },
  };
};

export default usePermission;
