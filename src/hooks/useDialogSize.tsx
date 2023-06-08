import { useContext } from 'react';
import { DialogSizeContext } from '../contexts/DialogSizeContext';

const useDialogSize = () => useContext(DialogSizeContext);

export default useDialogSize;