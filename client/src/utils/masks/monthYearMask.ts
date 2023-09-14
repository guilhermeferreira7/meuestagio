export const monthYearMask = (value: string) => {
  const valueFormated = value
    .replace(/\D+/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1");

  const month = Number(valueFormated.split("/")[0]);
  const year = Number(valueFormated.split("/")[1]);

  if (month > 12 || month < 1) {
    return valueFormated.replace(/\D+/g, "").replace(/(\d{2})(\d)/, "12");
  }

  if (valueFormated.length > 6) {
    if (year > 2023) {
      return `${month}/2023`;
    } else if (year < 1900) {
      return `${month}/1900`;
    }
  }

  return valueFormated;
};
