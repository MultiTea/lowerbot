// src/config/environment.ts
/** Environment variable utilities with type safety **/

export const getEnvVar = (key: string, defaultVal?: string): string => {
    const value = Deno.env.get(key);
    if (!value) {
      if (defaultVal !== undefined) {
        return defaultVal;
      }
      throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
  };
  
  export const getEnvVarAsNumber = (key: string, defaultVal?: number): number => {
    const value = Deno.env.get(key);
    if (!value) {
      if (defaultVal !== undefined) {
        return defaultVal;
      }
      throw new Error(`Environment variable ${key} is not set`);
    }
    const numValue = Number(value);
    if (isNaN(numValue)) {
      throw new Error(`Environment variable ${key} is not a valid number`);
    }
    return numValue;
  };
  
  export const getEnvVarAsBoolean = (key: string, defaultVal?: boolean): boolean => {
    const value = Deno.env.get(key);
    if (!value) {
      if (defaultVal !== undefined) {
        return defaultVal;
      }
      throw new Error(`Environment variable ${key} is not set`);
    }
    return value.toLowerCase() === 'true';
  };