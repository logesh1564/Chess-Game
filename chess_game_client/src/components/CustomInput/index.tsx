import "./input.css";

interface TextInputProps {
  onChange: (data: string) => void;
  value?: string;
  placeHolder?: string;
  type?: INPUT_TYPES;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  fullWidth?: boolean;
}

export enum INPUT_TYPES {
  TEXT = "text",
  PASSWORD = "password",
}

export const CustomInput = ({
  onChange,
  value = "",
  type = INPUT_TYPES.TEXT,
  placeHolder,
  iconLeft,
  iconRight,
  fullWidth,
}: TextInputProps): JSX.Element => {
  const onChangeHandler = (e: { target: { value: string } }): void => {
    onChange && onChange(e.target.value);
  };
  return (
    <div
      className={"lc-input-container"}
      style={{ width: fullWidth ? "100%" : 320 }}
    >
      {Boolean(iconLeft) && iconLeft}
      <input
        className="lc-input"
        style={{ width: "100%" }}
        type={type}
        onChange={onChangeHandler}
        value={value}
        placeholder={placeHolder}
      />
      {Boolean(iconRight) && iconRight}
    </div>
  );
};
