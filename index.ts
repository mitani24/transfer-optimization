import { Employee, Assignment } from "./types.ts";
import { transferCountThreshold, offices, employees } from "./condition.ts";
import { calcError, printAssignments, getOfficeResults } from "./utils.ts";

type Result = {
  error: number;
  transferCount: number;
  assignments: Assignment[];
};

// 事前計算
const sumOfCost = employees.reduce((acc, e) => acc + e.cost, 0);
const sumOfBudget = offices.reduce((acc, o) => acc + o.budget, 0);
const idealDiff = (sumOfCost - sumOfBudget) / employees.length;

// 緩和問題の最適解を計算する
const calcBestError = (assignments: Assignment[]): number => {
  const overOfficeResults = getOfficeResults(assignments).filter(
    ({ office, cost }) => {
      const idealCost = office.budget + idealDiff;
      return cost > idealCost;
    }
  );

  const sumOfOverCost = overOfficeResults.reduce(
    (acc, { cost }) => acc + cost,
    0
  );
  const sumOfOverBudget = overOfficeResults.reduce(
    (acc, { office }) => acc + office.budget,
    0
  );

  const sumOfUnderCost = sumOfCost - sumOfOverCost;
  const sumOfUnderBudget = sumOfBudget - sumOfOverBudget;
  const underOfficeNum = offices.length - overOfficeResults.length;

  const underError =
    Math.pow(sumOfUnderCost - sumOfUnderBudget, 2) / underOfficeNum;
  const overError = overOfficeResults.reduce(
    (acc, { office, cost }) => acc + Math.pow(cost - office.budget, 2),
    0
  );

  return underError + overError;
};

// 初期値を設定する
let bestResult: Result | null = null;
const results: Result[] = [];
const unassignedEmployees: Employee[] = [...employees];
let branchCount = 0;
let boundCount = 0;

// 深さ優先探索で最適解を探す
const dfs = (
  assignments: Assignment[],
  unassignedEmployees: Employee[],
  transferCount = 0
) => {
  branchCount++;

  if (unassignedEmployees.length === 0) {
    const error = calcError(assignments);
    const result = { error, assignments, transferCount };
    if (bestResult == null || result.error < bestResult.error) {
      bestResult = result;
    }
    results.push(result);
    return;
  }

  // 緩和問題の最適解が既に見つかっている最良解よりも悪い場合は以降の探索を中断する
  if (bestResult && bestResult.error < calcBestError(assignments)) {
    boundCount++;
    return;
  }

  // 次の探索の準備をする
  const employees = [...unassignedEmployees];
  const employee = employees.shift();
  if (!employee) {
    return;
  }

  // 分枝を探索する
  offices.forEach((office) => {
    // 異動数が超過している場合は以降の探索を中断する
    const isTransferred = employee.officeId !== office.id;
    const newTransferCount = transferCount + (isTransferred ? 1 : 0);
    if (newTransferCount > transferCountThreshold) {
      return;
    }

    const assignment: Assignment = {
      employeeId: employee.id,
      officeId: office.id,
    };
    // 次の深さの分枝を探索する
    dfs([...assignments, assignment], employees, newTransferCount);
  });
};

console.time();
dfs([], unassignedEmployees);
console.timeEnd();

// 結果を出力する
console.log(`予算と実績の差: ${sumOfCost - sumOfBudget}`);
console.log(`分枝数: ${branchCount}`);
console.log(`限定数: ${boundCount}`);
console.log(`解の数: ${results.length}`);
printAssignments(bestResult!.assignments);
