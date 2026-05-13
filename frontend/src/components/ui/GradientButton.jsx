function GradientButton({ as: Component = "button", children, className = "", isLoading = false, ...props }) {
  return (
    <Component className={`gradient-button ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? "Please wait..." : children}
    </Component>
  );
}

export default GradientButton;
