import { employees, Employee } from "./employee.ts";
import { offices, Office } from "./office.ts";
import { Assignment } from "./assignment.ts";

type OfficeResult = {
  office: Office;
  employees: Employee[];
  cost: number;
};

export const getOfficeResults = (assignments: Assignment[]): OfficeResult[] => {
  return offices.map((office) => {
    const members = assignments
      .filter((a) => a.officeId === office.id)
      .map((a) => employees.find((e) => e.id === a.employeeId)!);
    const cost = members.reduce((acc, e) => acc + e.cost, 0);

    return {
      office,
      employees: members,
      cost,
    };
  });
};

const calcErrorFromOfficeResults = (officeResults: OfficeResult[]): number => {
  return officeResults.reduce((acc, result) => {
    return acc + Math.pow(result.cost - result.office.budget, 2);
  }, 0);
};

export const calcError = (assingments: Assignment[]): number => {
  const officeResults = getOfficeResults(assingments);
  return calcErrorFromOfficeResults(officeResults);
};

export const printAssignments = (assignments: Assignment[]) => {
  const officeResults = getOfficeResults(assignments);
  const error = calcErrorFromOfficeResults(officeResults);
  const transferCount = assignments.filter((a) => {
    const employee = employees.find((e) => e.id === a.employeeId)!;
    return employee.officeId !== a.officeId;
  }).length;

  let str = "";
  str += `- (誤差: ${error}, 異動数: ${transferCount})\n`;

  officeResults.forEach(({ office, employees, cost }) => {
    str += `  - ${office.name} (予算: ${office.budget}, 実績: ${cost})\n`;
    employees.forEach((employee) => {
      let suffix = "";
      const isTransferred = employee.officeId !== office.id;
      if (isTransferred) {
        const from = offices.find((o) => o.id === employee.officeId)!;
        suffix += ` from ${from.name}`;
      }
      str += `    - ${employee.name} (月給: ${employee.cost})${suffix}\n`;
    });
  });

  console.log(str);
};
