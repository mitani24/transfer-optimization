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
