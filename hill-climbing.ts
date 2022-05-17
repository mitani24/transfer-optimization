import { Office, Employee, Assignment, SolvedResult } from "./types.ts";

export type Options = {
  maxCount?: number;
  maxRejectCount?: number;
};

const defaultOpitons: Required<Options> = {
  maxCount: 1000,
  maxRejectCount: 100,
};

export type TemporaryResult = {
  error: number;
  transferCount: number;
  offices: {
    id: number;
    budget: number;
    cost: number;
    employees: Employee[];
  }[];
};

export class HillClimbing {
  protected _offices: Office[];
  protected _employees: Employee[];
  protected _options: Required<Options>;

  protected _temporaryResult: TemporaryResult | null = null;

  constructor(offices: Office[], employees: Employee[], options: Options = {}) {
    this._offices = [...offices];
    this._employees = [...employees];
    this._options = {
      ...defaultOpitons,
      ...options,
    };
  }

  solve(): SolvedResult {
    this._initialize();

    const start = Date.now();
    const { count, adoptCount } = this._hillClimbing();
    const end = Date.now();
    const elapsed = end - start;
    const adoptRatio = adoptCount / count;

    console.log(`採用率: ${adoptRatio.toFixed(3)} (${adoptCount}/${count})`);

    const assignments: Assignment[] = this._temporaryResult!.offices.flatMap(
      (o) => {
        return o.employees.map((e) => {
          return {
            employeeId: e.id,
            officeId: o.id,
          };
        });
      }
    );

    return {
      optimalResult: {
        error: this._temporaryResult!.error,
        transferCount: this._temporaryResult!.transferCount,
        assignments,
      },
      elapsed,
    };
  }

  protected _initialize() {
    const tmpOffices = this._offices.map((o) => {
      const employees = this._employees.filter((e) => e.officeId === o.id);
      const cost = employees.reduce((acc, e) => acc + e.cost, 0);
      return {
        id: o.id,
        budget: o.budget,
        cost,
        employees,
      };
    });
    this._temporaryResult = {
      error: tmpOffices.reduce(
        (acc, o) => acc + Math.pow(o.cost - o.budget, 2),
        0
      ),
      transferCount: 0,
      offices: tmpOffices,
    };
  }

  protected _hillClimbing(): { count: number; adoptCount: number } {
    let count = 0;
    let adoptCount = 0;
    let consecutiveRejectCount = 0;

    while (
      count < this._options.maxCount &&
      consecutiveRejectCount < this._options.maxRejectCount
    ) {
      const nextResult = this._calcNextResult();
      const isAdopted = nextResult.error < this._temporaryResult!.error;

      if (isAdopted) {
        this._temporaryResult = nextResult;
        consecutiveRejectCount = 0;
        adoptCount++;
      } else {
        consecutiveRejectCount++;
      }
      count++;
    }

    return { count, adoptCount };
  }

  protected _calcNextResult(): TemporaryResult {
    const { fromEmployee, fromOffice, toOffice } = this._calcNextTarnsfer();

    // 誤差や人件費の変化を計算する
    const fromOfficePrevError = Math.pow(
      fromOffice.cost - fromOffice.budget,
      2
    );
    const toOfficePrevError = Math.pow(toOffice.cost - toOffice.budget, 2);
    const fromOfficeNextCost = fromOffice.cost - fromEmployee.cost;
    const toOfficeNextCost = toOffice.cost + fromEmployee.cost;
    const fromOfficeNextError = Math.pow(
      fromOfficeNextCost - fromOffice.budget,
      2
    );
    const toOficeNextError = Math.pow(toOfficeNextCost - toOffice.budget, 2);
    const nextError =
      this._temporaryResult!.error -
      (fromOfficePrevError + toOfficePrevError) +
      (fromOfficeNextError + toOficeNextError);

    const transferCountUp = fromOffice.id === fromEmployee.officeId ? 1 : 0;

    return {
      error: nextError,
      transferCount: this._temporaryResult!.transferCount + transferCountUp,
      offices: this._temporaryResult!.offices.map((o) => {
        if (o.id === fromOffice.id) {
          return {
            ...o,
            cost: fromOfficeNextCost,
            employees: o.employees.filter((e) => e.id !== fromEmployee.id),
          };
        }
        if (o.id === toOffice.id) {
          return {
            ...o,
            cost: toOfficeNextCost,
            employees: [...o.employees, fromEmployee],
          };
        }
        return o;
      }),
    };
  }

  protected _calcNextTarnsfer(): {
    fromEmployee: Employee;
    fromOffice: TemporaryResult["offices"][number];
    toOffice: TemporaryResult["offices"][number];
  } {
    // 異動する従業員をランダムに選択する
    const fromEmployeeCandidates = this._temporaryResult!.offices.flatMap(
      (o) => o.employees
    );
    const fromEmployee = this._randomItem(fromEmployeeCandidates);
    const fromOffice = this._temporaryResult!.offices.find((o) => {
      return o.employees.some((e) => e.id === fromEmployee.id);
    })!;
    // 異動先の店舗をランダムに選択する
    const toOfficeCandidates = this._temporaryResult!.offices.filter((o) => {
      return o.id !== fromOffice.id && o.id !== fromEmployee.officeId;
    });
    const toOffice = this._randomItem(toOfficeCandidates);

    return {
      fromEmployee,
      fromOffice,
      toOffice,
    };
  }

  protected _randomItem<T>(items: T[]) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }
}
