import { useStateContext } from "../context/ContextProvider";

const usePermission = () => {
  const { User } = useStateContext();

  return {
    hasPermission: (key) => {
      const userPermissions = User?.permissions
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
