import * as React from "react";
import PopupLayout from "../layout/PopupLayout";

export const PopupLayoutContext = React.createContext<HTMLElement | null>(null);

export interface PopupLayoutContainerProps {}

const PopupLayoutContainer: React.FC<React.PropsWithChildren<
  PopupLayoutContainerProps
>> = ({ children }) => {
  const layoutRef = React.useRef<HTMLElement | null>(null);
  const [layoutElement, setLayoutElement] = React.useState<HTMLElement | null>(
    () => layoutRef.current
  );

  return (
    <PopupLayoutContext.Provider value={layoutElement}>
      {children}
      <PopupLayout ref={(ref) => setLayoutElement(ref)} />
    </PopupLayoutContext.Provider>
  );
};

export default PopupLayoutContainer;
