// loop backwards through blocks (days) starting at depeg event.
export const loop_blocks = async (
  callback: (height: number) => void = () => {},
  days: number = 30,
  start_height: number = 7544910,
  days_interval: number = 13130
) => {
  let height: number = start_height;

  for (let i = 0; i < days; i++) {
    await callback(height);
    height -= days_interval;
  }
};
