import { ReactNode, createContext, useReducer } from "react";
import { size } from "@material-tailwind/react/types/components/avatar";

// -------------------------------------------------------------------------------------------

interface IInitalState {
  dialogSize: size;
}

interface IAction {
  type: string;
  payload: string | number | object | null;
}

interface IProps {
  children: ReactNode;
}

interface IHandlers {
  [key: string]: Function,
}

// -------------------------------------------------------------------------------------------

const initialState: IInitalState = {
  dialogSize: 'xxl'
}

const handlers: IHandlers = {
  SET_DIALOG_SIZE: (state: object, action: IAction) => {
    return {
      ...state,
      dialogSize: action.payload
    }
  }
}

const reducer = (state: object, action: IAction) => handlers[action.type] ? handlers[action.type](state, action) : state;

// -------------------------------------------------------------------------------------------

const DialogSizeContext = createContext({
  ...initialState,
  setDialogSizeAct: (_dialogSize: size) => Promise.resolve(),
});

const DialogSizeProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setDialogSizeAct = (_dialogSize: size) => {
    dispatch({
      type: 'SET_DIALOG_SIZE',
      payload: _dialogSize
    })
  }

  return (
    <DialogSizeContext.Provider value={{ ...state, setDialogSizeAct }}>
      {children}
    </DialogSizeContext.Provider>
  )
}

export { DialogSizeContext, DialogSizeProvider }