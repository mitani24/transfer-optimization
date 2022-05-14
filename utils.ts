import { Office, Employee, Assignment } from "./types.ts";

type OfficeResult = {
  office: Office;
  employees: Employee[];
  cost: number;
};

// とある割当における店舗の人件費を計算する
export const getOfficeResults = (
  offices: Office[],
  employees: Employee[],
  assignments: Assignment[]
): OfficeResult[] => {
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

// 人件費計算済みの店舗データから人件費の誤差を計算する
const calcErrorFromOfficeResults = (officeResults: OfficeResult[]): number => {
  return officeResults.reduce((acc, result) => {
    return acc + Math.pow(result.cost - result.office.budget, 2);
  }, 0);
};

// 人件費の誤差を計算する
export const calcError = (
  offices: Office[],
  employees: Employee[],
  assingments: Assignment[]
): number => {
  const officeResults = getOfficeResults(offices, employees, assingments);
  return calcErrorFromOfficeResults(officeResults);
};

// 割当結果を表示する
export const printAssignments = (
  offices: Office[],
  employees: Employee[],
  assignments: Assignment[]
): void => {
  const officeResults = getOfficeResults(offices, employees, assignments);
  const error = calcErrorFromOfficeResults(officeResults);
  const errorAverage = Math.sqrt(error / offices.length);
  const transferCount = assignments.filter((a) => {
    const employee = employees.find((e) => e.id === a.employeeId)!;
    return employee.officeId !== a.officeId;
  }).length;

  let str = "";
  str += `- (平均誤差: ${errorAverage.toFixed(1)}, 異動数: ${transferCount})\n`;

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

export const printOriginalAssignment = (
  offices: Office[],
  employees: Employee[]
): void => {
  const assignments: Assignment[] = employees.map((e) => {
    return {
      employeeId: e.id,
      officeId: e.officeId,
    };
  });
  printAssignments(offices, employees, assignments);
};
