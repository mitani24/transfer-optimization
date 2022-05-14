import { Office, Employee } from "./types.ts";
import { randomOfficeName, randomEmployeeName } from "./dummy.ts";

export const transferCountThreshold = 4;

const randomGaussian = (mean: number, stddev: number): number => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const w = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return w * stddev + mean;
};

export const createCondition = (
  officeNum: number,
  employeeNum: number
): { offices: Office[]; employees: Employee[] } => {
  const calcEmployeeCost = () => Math.floor(randomGaussian(35, 10));

  const offices: Office[] = [...Array(officeNum)]
    .map((_, i) => {
      return {
        id: i,
        name: randomOfficeName(),
        budget: Math.floor((calcEmployeeCost() * employeeNum) / officeNum),
      };
    })
    .sort((a, b) => b.budget - a.budget);

  const employees: Employee[] = [...Array(employeeNum)]
    .map((_, i) => {
      return {
        id: i,
        name: randomEmployeeName(),
        cost: calcEmployeeCost(),
        officeId: Math.floor(Math.random() * officeNum),
      };
    })
    .sort((a, b) => b.cost - a.cost);

  return { offices, employees };
};
