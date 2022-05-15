import { createCondition } from "./condition.ts";
import { printOriginalAssignment, printSolvedResult } from "./utils.ts";
import { DFS } from "./search.ts";
import { HillClimbing } from "./hill-climbing.ts";

const { offices, employees } = createCondition(3, 18);
const isDisplayDetails = true;

// 異動前の割当を表示する
printOriginalAssignment(offices, employees, isDisplayDetails);

// 深さ優先探索
const dfs = new DFS(offices, employees, {
  useBranchAndBound: true,
  maxTransferCount: 5,
});
printSolvedResult(offices, employees, dfs.solve(), isDisplayDetails);

// 山登り法
const hillClimbing = new HillClimbing(offices, employees, {
  maxCount: 10000,
  maxRejectCount: 100,
});
printSolvedResult(offices, employees, hillClimbing.solve(), isDisplayDetails);
