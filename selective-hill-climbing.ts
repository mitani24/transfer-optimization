import { Office, Employee } from "./types.ts";
import { HillClimbing, Options, TemporaryResult } from "./hill-climbing.ts";

type OfficeResult = TemporaryResult["offices"][number];

type OfficeCandidate = {
  office: OfficeResult;
  probabilitiy: number;
  isOverIdealCost: boolean;
};

export class SelectiveHillClimbing extends HillClimbing {
  protected _idealDiff: number;

  constructor(offices: Office[], employees: Employee[], options: Options = {}) {
    super(offices, employees, options);

    const sumOfCost = employees.reduce((acc, e) => acc + e.cost, 0);
    const sumOfBudget = offices.reduce((acc, o) => acc + o.budget, 0);
    this._idealDiff = (sumOfCost - sumOfBudget) / offices.length;
  }

  protected _calcNextTarnsfer(): {
    fromEmployee: Employee;
    fromOffice: OfficeResult;
    toOffice: OfficeResult;
  } {
    const officeCandidates = this._temporaryResult!.offices.map((o) => {
      const idealCost = o.budget + this._idealDiff;
      const diff = o.cost - idealCost;
      return {
        office: o,
        probabilitiy: Math.abs(diff),
        isOverIdealCost: diff >= 0,
      };
    });

    const fromOffice = this._selectOffice(
      officeCandidates.filter(
        (o) => o.isOverIdealCost && o.office.employees.length
      )
    );
    const toOffice = this._selectOffice(
      officeCandidates.filter((o) => !o.isOverIdealCost)
    );
    const fromEmployee = this._randomItem(fromOffice.employees);

    return {
      fromEmployee,
      fromOffice,
      toOffice,
    };
  }

  protected _selectOffice(officeCandidates: OfficeCandidate[]): OfficeResult {
    const sum = officeCandidates.reduce((acc, o) => acc + o.probabilitiy, 0);
    let v = Math.random();
    let selectedIndex = officeCandidates.length - 1;

    for (let i = 0; i < officeCandidates.length; i++) {
      if (v < officeCandidates[i].probabilitiy / sum) {
        selectedIndex = i;
        break;
      }
      v -= officeCandidates[i].probabilitiy / sum;
    }
    return officeCandidates[selectedIndex].office;
  }
}
