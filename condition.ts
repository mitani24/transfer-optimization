import { Office, Employee } from "./types.ts";

export const transferCountThreshold = 4;

export const offices: Office[] = [
  { id: 0, name: "渋谷", budget: 212 },
  { id: 1, name: "新宿", budget: 203 },
  { id: 2, name: "池袋", budget: 194 },
  { id: 3, name: "青山", budget: 185 },
  { id: 4, name: "六本木", budget: 176 },
].sort((a, b) => b.budget - a.budget);

export const employees: Employee[] = [
  { id: 0, name: "安藤", cost: 39, officeId: 0 },
  { id: 1, name: "佐藤", cost: 36, officeId: 1 },
  { id: 2, name: "鈴木", cost: 32, officeId: 2 },
  { id: 3, name: "山本", cost: 27, officeId: 3 },
  { id: 4, name: "渡辺", cost: 23, officeId: 4 },
  { id: 5, name: "清水", cost: 26, officeId: 0 },
  { id: 6, name: "松田", cost: 32, officeId: 1 },
  { id: 7, name: "山里", cost: 19, officeId: 2 },
  { id: 8, name: "箕輪", cost: 34, officeId: 3 },
  { id: 9, name: "高岸", cost: 45, officeId: 4 },
  { id: 10, name: "西田", cost: 35, officeId: 0 },
  { id: 11, name: "山内", cost: 31, officeId: 1 },
  { id: 12, name: "五条", cost: 29, officeId: 2 },
  { id: 13, name: "米田", cost: 44, officeId: 3 },
  { id: 14, name: "峯岡", cost: 33, officeId: 4 },
  { id: 15, name: "種田", cost: 38, officeId: 0 },
  { id: 16, name: "波留", cost: 23, officeId: 1 },
  { id: 17, name: "染井", cost: 20, officeId: 2 },
  { id: 18, name: "二宮", cost: 25, officeId: 3 },
  { id: 19, name: "久石", cost: 27, officeId: 4 },
  { id: 20, name: "吉岡", cost: 34, officeId: 0 },
  { id: 21, name: "北沢", cost: 45, officeId: 1 },
  { id: 22, name: "滝口", cost: 42, officeId: 2 },
  { id: 23, name: "与謝", cost: 27, officeId: 3 },
  { id: 24, name: "牛田", cost: 35, officeId: 4 },
  { id: 25, name: "安西", cost: 30, officeId: 0 },
  { id: 26, name: "井上", cost: 20, officeId: 1 },
  { id: 27, name: "上原", cost: 24, officeId: 2 },
  { id: 28, name: "江口", cost: 34, officeId: 3 },
  { id: 29, name: "押尾", cost: 36, officeId: 4 },
].sort((a, b) => b.cost - a.cost);
