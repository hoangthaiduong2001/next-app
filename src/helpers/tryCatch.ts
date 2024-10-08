export const tryCatchFunc = (
  f: any,
  defaultValue: any,
  ...args: any
): typeof f => {
  let result;
  try {
    result = f(...args);
  } catch {
    result = defaultValue;
  }
  return result;
};
