import Restricted from "../Pages/Restricted";
import { useStateContext } from "../context/ContextProvider";
import Loader from "../Components/Loader";

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
        const isPermissionGiven = userPermissions?.some((permission) =>
          key?.includes(permission)
        );

         if (permits?.length > 0) {
           if (isPermissionGiven) {
          return {
            isPermitted: true,
          };
        }
            return {
              isPermitted: false,
              element: <Restricted />,
            };
          } else {
            return {
              isPermitted: false,
              element: <Loader/>,
            };
          }
      } else {
        if (permits?.length === 0) {
          return false;
        }
        userPermissions = permits
          ?.split(",")
          ?.map((p) => p.replaceAll(" ", "").trim());
        return userPermissions?.some(
          (permission) => key.toLowerCase() === permission.toLowerCase()
        );
      }
    },
  };
};

export default usePermission;
