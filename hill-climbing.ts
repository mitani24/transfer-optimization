import {
  Office,
  Employee,
  Assignment,
  Combination,
  SolvedResult,
} from "./types.ts";
import { createCombination, createOriginalAssignments } from "./utils.ts";

export type Options = {
  maxCount?: number;
  maxRejectCount?: number;
};

const defaultOpitons: Required<Options> = {
  maxCount: 1000,
  maxRejectCount: 100,
};

export class HillClimbing {
  protected _offices: Office[];
  protected _employees: Employee[];
  protected _options: Required<Options>;

  protected _optimalCombination: Combination | null = null;

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
    this._hillClimbing();
    const end = Date.now();
    const elapsed = end - start;

    return {
      optimalResult: this._optimalCombination!,
      elapsed,
    };
  }

  protected _initialize() {
    this._optimalCombination = createCombination(
      this._offices,
      this._employees,
      createOriginalAssignments(this._employees)
    );
  }

  protected _hillClimbing() {
    let count = 0;
    let adoptCount = 0;
    let consecutiveRejectCount = 0;
    while (
      count < this._options.maxCount &&
      consecutiveRejectCount < this._options.maxRejectCount
    ) {
      const nextAssignments = this._createNextAssignments();
      const nextCombination = createCombination(
        this._offices,
        this._employees,
        nextAssignments
      );

      const isAdopted =
        !this._optimalCombination ||
        nextCombination.error < this._optimalCombination.error;

      if (isAdopted) {
        this._optimalCombination = nextCombination;
        consecutiveRejectCount = 0;
        adoptCount++;
      } else {
        consecutiveRejectCount++;
      }
      count++;
    }
    console.log(
      `採用率: ${(adoptCount / count).toFixed(2)} (${adoptCount}/${count})`
    );
  }

  protected _createNextAssignments(): Assignment[] {
    const prevAssignments = this._optimalCombination!.assignments;
    const nextAssignments: Assignment[] = [...prevAssignments];

    const randomIndex = Math.floor(Math.random() * nextAssignments.length);
    const { officeId, employeeId } = nextAssignments[randomIndex];

    const nextOfficeCandidates = this._offices.filter((o) => o.id !== officeId);
    const randomOfficeIndex = Math.floor(
      Math.random() * nextOfficeCandidates.length
    );
    const nextOffice = nextOfficeCandidates[randomOfficeIndex];

    nextAssignments[randomIndex] = {
      officeId: nextOffice.id,
      employeeId,
    };

    return nextAssignments;
  }
}
