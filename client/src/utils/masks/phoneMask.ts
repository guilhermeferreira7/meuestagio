// (11) 11111-1111
export const phoneMask = (value: string) => {
  if (!value) return value;
  return value
    .replace(/\D+/g, "") // não deixa ser digitado nenhuma letra
    .replace(/(\d{2})(\d)/, "($1) $2") // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1"); // captura os dois últimos 2 números, com um - antes dos dois números
};
