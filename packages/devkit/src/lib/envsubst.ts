export function envSubst<T extends string | object>(input: T, envVars: Record<string, string>): T {  
  const regex = /\${\w+}|\$\w+/gm;
  const objectInput = typeof input === "object";
  let output = objectInput ? JSON.stringify(input) : input.toString();
  output = output.replace(regex, (str) => {
    const variable = str.replace(/[${}]/g, '');
    return envVars[variable] || str;
  })
  

  return objectInput ? JSON.parse(output) : output;
}

export function envSubstValues<T>(input: T, envVars: Record<string, string>): T
export function envSubstValues<T>(input: T[], envVars: Record<string, string>): T[]
export function envSubstValues<T>(input: T | T[], envVars: Record<string, string>): T | T[] {
  if (Array.isArray(input)) {
    return input.map(_ele => envSubstValues(_ele, envVars));
  }
  if (typeof input === "object") {
    return Object.entries(input)
      .reduce((accu, [key, value]) => ({
        ...accu,
        [key]: envSubstValues(value, envVars)
      }), {} as T)
  }
  if (typeof input === "string") {
    return envSubst(input, envVars);
  }
  return input;
}