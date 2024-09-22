export function hasAccess(funcStr: string, allMarks: string[]) {
  if (funcStr === undefined || allMarks === undefined) {
    throw new Error('参数不全');
  }
  const str = allMarks.find((e) => e === funcStr);
  if (str) {
    return true;
  }
  return false;
}
