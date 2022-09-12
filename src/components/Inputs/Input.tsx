export const Input = (props: {
  label: string;
  placeholder: string;
  rightIcon?: JSX.Element | string;
}) => {
  return (
    <>
      <label className="label">
        <span className="label-text">{props.label}</span>
      </label>
      <label className="input-group">
        <input
          type="text"
          placeholder={props.placeholder}
          className="input input-bordered"
        />
        <span>{props.rightIcon}</span>
      </label>
    </>
  );
};
