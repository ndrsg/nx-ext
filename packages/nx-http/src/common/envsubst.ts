export function envSubst(input: Record<string, unknown>, envVars: Record<string, string>): Record<string, unknown>
export function envSubst(input: string, envVars: Record<string, string>): string
export function envSubst(input: string | Record<string, unknown>, envVars: Record<string, string>): string | Record<string, unknown>
export function envSubst(input: string | Record<string, unknown>, envVars: Record<string, string>): string | Record<string, unknown> {
  const regex = /\${\w+}|\$\w+/gm;
  
  const objectInput = typeof input === "object";
  let output = objectInput ? JSON.stringify(input) : input;
  output = output.replace(regex, (str) => {
    const variable = str.replace(/[${}]/g, '');
    return envVars[variable] || str;
  })
  

  return objectInput ? JSON.parse(output) : output;
}