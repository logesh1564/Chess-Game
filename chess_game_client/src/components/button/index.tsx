import { classNames } from "../../utils/common";
import "./button.css";

interface ButtonProps {
  onClick?: () => void;
  children: JSX.Element | string;
  type?: BUTTON_TYPES;
  disabled?: boolean;
  nativeType?: BUTTON_NATIVE_TYPE;
}

enum BUTTON_TYPES {
  PRIMARY,
  SECONDARY,
}

export enum BUTTON_NATIVE_TYPE {
  SUBMIT = "submit",
  RESET = "reset",
  DEFAULT = "button",
}

export const Button = ({
  children,
  type = BUTTON_TYPES.PRIMARY,
  disabled = false,
  nativeType = BUTTON_NATIVE_TYPE.DEFAULT,
  onClick,
}: ButtonProps) => {
  return (
    <div className="lc-button-container">
      <button
        className={classNames({
          "lc-button-type-primary": type === BUTTON_TYPES.PRIMARY,
        })}
        disabled={disabled}
        onClick={() => onClick && onClick()}
        type={nativeType}
      >
        <div className="lc-button-front">{children}</div>
      </button>
    </div>
  );
};
