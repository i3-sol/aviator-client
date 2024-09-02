export const generateRandomString = (num: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const displayName = (name: string) => {
  name = name || "Hidden";
  return name?.slice(0, 1) + "***" + name?.slice(-1);
};

export const binaryToFloat = (binary: string) => {
  const [integerPart, fractionalPart] = binary.split('.');
  let integerDecimal = parseInt(integerPart, 2);
  let fractionalDecimal = 0;
  if (fractionalPart) {
    for (let i = 0; i < fractionalPart.length; i++) {
      fractionalDecimal += parseInt(fractionalPart[i], 2) * Math.pow(2, -(i + 1));
    }
  }
  return Number(integerDecimal + fractionalDecimal);
}