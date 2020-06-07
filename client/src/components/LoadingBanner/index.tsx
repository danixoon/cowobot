import * as React from "react";
import "./styles.scss";
import { mergeProps } from "../../utils";
import Loader from "../Loader";

interface LoadingBannerProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  isLoading: boolean;
}

const LoadingBanner: React.FC<LoadingBannerProps> = (
  props: LoadingBannerProps
) => {
  const { isLoading } = props;
  return isLoading ? (
    // <div className="loading-banner__container">
    <div className="loading-banner__background">
      <Loader />
    </div>
  ) : (
    // </div>
    <></>
  );
};

export default LoadingBanner;
