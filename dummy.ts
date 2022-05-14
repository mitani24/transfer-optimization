import { Gimei } from "https://esm.sh/type-gimei";

export const randomEmployeeName = (): string => {
  const name = Gimei.randomName();
  return name.last.kanji();
};

export const randomOfficeName = (): string => {
  const address = Gimei.randomAddress();
  return `${address.town.kanji()}店`;
};
