export const CartoonBox = () => {
  const borderWidth = 50;
  const borderStyle: React.CSSProperties = {
    borderWidth: `${borderWidth}px`,
    borderStyle: "solid",
    borderImageSource: "url('/cartoon-frame.png')",
    borderImageSlice: 60,
    borderImageRepeat: "stretch",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={borderStyle}>
      <img
        src="/cartoon-paper.png"
        alt=""
        role="presentation"
        style={{
          position: "absolute",
          inset: 20,
          objectFit: "cover",
          height: "calc(100% - 40px)",
          width: "calc(100% - 40px)",
          zIndex: 0,
        }}
      />

    </div>
  );
};
