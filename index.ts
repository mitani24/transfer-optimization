import { createCondition } from "./condition.ts";
import { printOriginalAssignment, printSolvedResult } from "./utils.ts";
import { DFS } from "./search.ts";
import { HillClimbing } from "./hill-climbing.ts";
import { SelectiveHillClimbing } from "./selective-hill-climbing.ts";

const n = 10;
const { offices, employees } = createCondition(80 * n, 1300 * n);
const isDisplayDetails = false;

// 異動前の割当を表示する
printOriginalAssignment(offices, employees, isDisplayDetails);

// // 深さ優先探索
// const dfs = new DFS(offices, employees, {
//   useBranchAndBound: true,
//   maxTransferCount: 5,
// });
// printSolvedResult(offices, employees, dfs.solve(), isDisplayDetails);

// // 山登り法
// const hillClimbing = new HillClimbing(offices, employees, {
//   maxCount: 10000,
//   maxRejectCount: 100,
// });
// printSolvedResult(offices, employees, hillClimbing.solve(), isDisplayDetails);

// 選択的山登り法
const SHC = new SelectiveHillClimbing(offices, employees, {
  maxCount: 10000,
  maxRejectCount: 100,
});
printSolvedResult(offices, employees, SHC.solve(), isDisplayDetails);
