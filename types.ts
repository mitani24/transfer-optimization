export type Office = {
  id: number;
  name: string;
  budget: number;
};

export type Employee = {
  id: number;
  name: string;
  cost: number;
  officeId: number;
};

export type Assignment = {
  employeeId: number;
  officeId: number;
};

export type Combination = {
  error: number;
  transferCount: number;
  assignments: Assignment[];
};

export type SolvedResult = {
  optimalResult: Combination;
  elapsed: number;
};
