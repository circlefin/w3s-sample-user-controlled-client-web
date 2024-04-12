"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import Button, { ButtonProps } from "@mui/joy/Button";
import { CheckIcon } from "@heroicons/react/16/solid";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

import { IconButton } from "@mui/joy";

interface CopyButtonProps {
  copyValue: string;
  copyLabel?: string;
  variant?: ButtonProps['variant'];
}

const COPY_CLIPBOARD_RESET_INTERVAL = 3000;
export const CopyButton: React.FC<CopyButtonProps> = ({
  copyLabel,
  copyValue,
  variant = 'plain',
}) => {
  const [copied, setCopied] = useState(false);
  const setTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear the interval when the component unmounts
    return () => {
      if (setTimerRef.current) {
        clearTimeout(setTimerRef.current);
      }
    };
  }, []);

  const handleCopyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(copyValue);
    setCopied(true);
    if (setTimerRef.current) {
      clearTimeout(setTimerRef.current);
    }
    setTimerRef.current = setTimeout(() => {
      setCopied(false);
    }, COPY_CLIPBOARD_RESET_INTERVAL);
  }, [copyValue]);

  return copyLabel ? (
    <Button
      endDecorator={
        copied ? <CheckIcon width={20} /> : <DocumentDuplicateIcon width={20} />
      }
      onClick={handleCopyToClipboard}
      variant={variant}
      className="py-0 text-sm w-full"
    >
      {copied ? "Copied" : <span className="truncate">{copyLabel}</span>}
    </Button>
  ) : (
    <IconButton onClick={handleCopyToClipboard}>
      {copied ? <CheckIcon width={20} /> : <DocumentDuplicateIcon width={20} />}
    </IconButton>
  );
};
