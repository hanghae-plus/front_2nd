import { ComponentProps, memo } from "react";
import { callMeow, callBark } from "./UseCallbackTest.utils.tsx";

export const BarkButton = memo(({ onClick }: ComponentProps<'button'>) => {
  callBark();
  return (
    <button data-testid="bark" onClick={onClick}>멍멍</button>
  );
})

export const MeowButton = memo(({ onClick }: ComponentProps<'button'>) => {
  callMeow();
  return (
    <button data-testid="meow" onClick={onClick}>야옹</button>
  );
})
