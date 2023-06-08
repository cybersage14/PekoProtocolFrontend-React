import { ReactNode } from "react";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import useDialogSize from "../../hooks/useDialogSize";
import { IPropsOfComponent } from "../../utils/interfaces";
import { Icon } from "@iconify/react";
import TextIconButton from "../buttons/TextIconButton";

interface IProps extends IPropsOfComponent {
  title: string | ReactNode;
  visible: boolean;
  setVisible: Function;
}

export default function CustomDialog({ title = '', visible, setVisible, children }: IProps) {
  const { dialogSize } = useDialogSize()

  const closeDialog = () => {
    setVisible(false)
  }

  const handleVisible = () => {
    setVisible(!visible)
  }

  return (
    <Dialog size={dialogSize} open={visible} handler={handleVisible} className="bg-gray-900">
      <DialogHeader className="justify-between bg-[#111111] rounded-t-md text-gray-100">
        <h5>{title}</h5>
        <TextIconButton onClick={closeDialog}>
          <Icon icon="akar-icons:cross" className="text-xl" />
        </TextIconButton>
      </DialogHeader>
      <DialogBody>
        {children}
      </DialogBody>
    </Dialog>
  )
}