export const generateInventoryId = (): string => {
  return crypto.randomUUID();
};

export const generateSku = (): string => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `PRD-${randomNumber}`;
};
