import { ComponentProps, memo } from "react";



type CryingBtnProps = {
  cryingType: string;
  callbackFunc: Function;
}
interface CombinedCryingBtnProps extends CryingBtnProps, ComponentProps<'button'> {}

export const CryingButton = memo(({cryingType, callbackFunc, onClick }: CombinedCryingBtnProps) => {
  callbackFunc();
  return (
      <button data-testid={cryingType} onClick={onClick}>{cryingType === "meow" ? "야옹" : "멍멍"}</button>
  );
})



type CryingProps = {
  cryingType: string;
  count: number;
  text: string;
}

export const CryingCount = memo(({ cryingType, count, text  }: CryingProps) => {
  return (
      <p data-testid={cryingType}>{`${text}Count`} {count}</p>
  );
})