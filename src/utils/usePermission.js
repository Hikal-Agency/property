import { useStateContext } from "../context/ContextProvider";

const usePermission = () => {
  const { permits } = useStateContext();
  console.log(permits);

  return {
    hasPermission: (key, isRoute = false) => {
      
      let userPermissions = [];
      
      if (isRoute) {
        userPermissions = permits
        ?.split(",")
        ?.map((p) => `/${p}`.replaceAll(" ", "").trim());
      } else {
        if (permits?.length === 0) {
          return false;
        }
        userPermissions = permits
          ?.split(",")
          ?.map((p) => p.replaceAll(" ", "").trim());
      }

      const isPermitted = userPermissions?.some((permission) =>
        key?.includes(permission)
      );
      return isPermitted;
    },
  };
};

export default usePermission;
