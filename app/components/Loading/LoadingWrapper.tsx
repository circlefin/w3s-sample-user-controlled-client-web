import { ReactNode } from "react";
import { Box, CircularProgress } from "@mui/joy";

interface LoadingWrapper {
  isLoading: boolean;
  children: ReactNode;
}

export const LoadingWrapper: React.FC<LoadingWrapper> = ({
  isLoading,
  children,
}) => {
  return (
    <>
      {isLoading ? (
        <Box className="grid justify-center items-center mt-16">
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </>
  );
};
