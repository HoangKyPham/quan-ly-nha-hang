import ms, { type StringValue } from "ms";

const DURATION_REGEX = /^\d+(\.\d+)?\s*(ms|s|m|h|d|w|y)$/i;

export const parseDuration = (value: unknown, envName: string): number => {
  if (typeof value !== "string") {
    throw new Error(
      `${envName} must be a string duration like \"15m\" or \"7d\".`,
    );
  }

  const normalized = value.trim();
  if (!DURATION_REGEX.test(normalized)) {
    throw new Error(
      `${envName} has invalid duration format: \"${value}\". Use values like \"15m\", \"1h\", \"7d\".`,
    );
  }

  const result = ms(normalized as StringValue);
  if (typeof result !== "number" || Number.isNaN(result)) {
    throw new Error(`${envName} could not be parsed by ms: \"${value}\".`);
  }

  return result;
};
