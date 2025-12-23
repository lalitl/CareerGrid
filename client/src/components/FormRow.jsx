const FormRow = ({ type, name, value, defaultValue, label, onChange }) => {
  
  return (
    <div className="form-row">
      <label htmlFor="name" className="form-label">
        {label || name}
      </label>
      <input
        type={type}
        name={name}
        // value={value || ""}
        onChange={onChange}
        defaultValue={defaultValue || ""}
        required
        id={name}
        className="form-input"
      />
    </div>
  );
};
export default FormRow;
