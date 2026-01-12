import { useState } from "react";

const useDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const toggle = () => setOpen((state) => !state);
  return { open, toggle };
};
export default useDialog;
