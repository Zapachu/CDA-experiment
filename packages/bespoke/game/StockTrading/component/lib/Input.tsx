import * as React from "react";
import * as style from "./style.scss";

const Input: React.SFC<PropType> = ({
  value,
  placeholder,
  onChange,
  onPlus,
  onMinus,
  disabled = false,
  style: propStyle
}) => {
  return (
    <div className={style.input} style={propStyle}>
      <label>{placeholder}</label>
      <div className={style.inputComp}>
        {onMinus ? <span onClick={() => onMinus(+value || 0)}>-</span> : null}
        <input
          value={value}
          onChange={e => onChange(e.target.value, e)}
          placeholder={placeholder}
          disabled={disabled}
        />
        {onPlus ? <span onClick={() => onPlus(+value || 0)}>+</span> : null}
      </div>
    </div>
  );
};

interface PropType {
  value: number | string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (val: number | string, event: React.ChangeEvent) => void;
  onPlus?: (val: number) => void;
  onMinus?: (val: number) => void;
  style?: object;
}

export default Input;
