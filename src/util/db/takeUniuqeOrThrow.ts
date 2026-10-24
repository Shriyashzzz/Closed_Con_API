export const takeUniqueOrThrow = <T>(values: T[]): T | undefined => {
  if (values.length == 0) {
    throw new Error(`DNE`);
  }
  if (values.length !== 1) {
    throw new Error(
      `Expected 1 row of ${values[0]}, found ${values.length} instead`,
    );
  }
  return values[0];
};
