import { IEnumToArray } from './constants'

export enum identityGroup {
  admin = 1,
  sales = 2
}

export enum accountType {
  admin = 'x',
  dealer = 'd'
}

export enum PointType {
  NotSpecified = 0,
  Deposit = 1,
  Withdraw = -1,
  Bet = -2,
  Payout = 2,
  CancelBet = 3,
  CancelPayout = -3,
}

export enum DrawerMode {
  View = '詳情',
  Copy = '複製',
  Edit = '編輯',
  Create = '新增'
}

export enum NumberTransfer {
  一 = 1,
  二 = 2,
  三 = 3,
  四 = 4,
  五 = 5,
  六 = 6,
  七 = 7,
  八 = 8,
  九 = 9,
  十 = 10,
  十一 = 11,
  十二 = 12,
  十三 = 13,
  十四 = 14,
  十五 = 15,
  十六 = 16
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EnumToArray(o: any): IEnumToArray[] {
  return Object.entries(o)
    .filter((x) => typeof x[1] === 'number')
    .map((value) => ({ id: value[1] as number, name: value[0] }))
}

export const jiraTicketOptions: IEnumToArray[] = EnumToArray(identityGroup)
