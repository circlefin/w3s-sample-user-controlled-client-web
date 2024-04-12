import { ArrowLeftIcon } from "@heroicons/react/16/solid";

import { IconButton, Typography } from "@mui/joy";

export const BackButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <div className="flex items-center gap-1">
      <IconButton onClick={onClick}>
        <ArrowLeftIcon className="text-gray-500" width={20} />
      </IconButton>
      <Typography fontWeight={600} level="body-md">
        {children}
      </Typography>
    </div>
  );
};
