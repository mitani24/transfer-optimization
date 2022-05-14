import {
  Office,
  Employee,
  Assignment,
  Combination,
  SolvedResult,
} from "./types.ts";
import { calcError, getOfficeResults } from "./utils.ts";

export type Options = {
  useBranchAndBound?: boolean;
  maxTransferCount?: number;
};

const defaultOpitons: Required<Options> = {
  useBranchAndBound: true,
  maxTransferCount: 3,
};

export class DFS {
  private _offices: Office[];
  private _employees: Employee[];
  private _options: Required<Options>;
  private _sumOfCost: number;
  private _sumOfBudget: number;
  private _idealDiff: number;

  private _optimalCombination: Combination | null = null;
  private _combinations: Combination[] = [];
  private _unassignedEmployees: Employee[] = [];

  constructor(offices: Office[], employees: Employee[], options: Options = {}) {
    this._offices = [...offices];
    this._employees = [...employees];
    this._options = {
      ...defaultOpitons,
      ...options,
    };

    this._sumOfCost = employees.reduce((acc, e) => acc + e.cost, 0);
    this._sumOfBudget = offices.reduce((acc, o) => acc + o.budget, 0);
    this._idealDiff = (this._sumOfCost - this._sumOfBudget) / employees.length;
  }

  solve(): SolvedResult {
    this._initialize();

    const start = Date.now();
    this._dfs([], this._unassignedEmployees);
    const end = Date.now();
    const elapsed = end - start;

    return {
      optimalResult: this._optimalCombination!,
      elapsed,
    };
  }

  private _initialize() {
    this._optimalCombination = null;
    this._combinations = [];
    this._unassignedEmployees = [...this._employees];
  }

  private _dfs(
    assignments: Assignment[],
    unassignedEmployees: Employee[],
    transferCount = 0
  ) {
    if (unassignedEmployees.length === 0) {
      const error = calcError(this._offices, this._employees, assignments);
      const combination = { error, assignments, transferCount };
      if (
        this._optimalCombination == null ||
        combination.error < this._optimalCombination.error
      ) {
        this._optimalCombination = combination;
      }
      this._combinations.push(combination);
      return;
    }

    // 緩和問題の最適解が既に見つかっている最良解よりも悪い場合は以降の探索を中断する
    if (
      this._options.useBranchAndBound &&
      this._optimalCombination &&
      this._optimalCombination.error < this._calcRelaxationError(assignments)
    ) {
      return;
    }

    // 次の探索の準備をする
    const employees = [...unassignedEmployees];
    const employee = employees.shift()!;

    // 分枝を探索する
    this._offices.forEach((office) => {
      // 異動数上限を超える場合は以降の探索を中断する
      const isTransferred = employee.officeId !== office.id;
      const newTransferCount = transferCount + (isTransferred ? 1 : 0);
      if (
        this._options.maxTransferCount &&
        newTransferCount > this._options.maxTransferCount
      ) {
        return;
      }

      const assignment: Assignment = {
        employeeId: employee.id,
        officeId: office.id,
      };

      // 次の深さの分枝を探索する
      this._dfs([...assignments, assignment], employees, newTransferCount);
    });
  }

  private _calcRelaxationError(assignments: Assignment[]): number {
    const overOfficeResults = getOfficeResults(
      this._offices,
      this._employees,
      assignments
    ).filter(({ office, cost }) => {
      const idealCost = office.budget + this._idealDiff;
      return cost > idealCost;
    });

    const sumOfOverCost = overOfficeResults.reduce(
      (acc, { cost }) => acc + cost,
      0
    );
    const sumOfOverBudget = overOfficeResults.reduce(
      (acc, { office }) => acc + office.budget,
      0
    );

    const sumOfUnderCost = this._sumOfCost - sumOfOverCost;
    const sumOfUnderBudget = this._sumOfBudget - sumOfOverBudget;
    const underOfficeNum = this._offices.length - overOfficeResults.length;

    const underError =
      Math.pow(sumOfUnderCost - sumOfUnderBudget, 2) / underOfficeNum;
    const overError = overOfficeResults.reduce(
      (acc, { office, cost }) => acc + Math.pow(cost - office.budget, 2),
      0
    );

    return underError + overError;
  }
}
