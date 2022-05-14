import { createCondition } from "./condition.ts";
import { printAssignments, printOriginalAssignment } from "./utils.ts";
import { DFS } from "./search.ts";

const { offices, employees } = createCondition(6, 10);

const dfs = new DFS(offices, employees, {
  useBranchAndBound: true,
  maxTransferCount: 0,
});

const solved = dfs.solve();

// 異動前の割当を表示する
printOriginalAssignment(offices, employees);

// 結果を表示する
console.log(`経過時間: ${solved.elapsed}ms\n`);
printAssignments(offices, employees, solved.optimalResult.assignments);
