function Digit({ index, opacity = 1.0 }: { index: number; opacity: number }) {
  return (
    <div className="digit">
      <span style={{ color: `rgba(0, 0, 0, ${opacity})` }}>{index}</span>
    </div>
  );
}

export default Digit;
