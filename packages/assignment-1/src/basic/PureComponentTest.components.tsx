import { useMemo } from "react";
import { repeatBarked, repeatMeow } from "./UseMemoTest.utils.ts";

type TCryingProps = {
  crying: number;
};

export function Dog({ crying }: TCryingProps) {
  const repeatedBarked = useMemo(() => repeatBarked(crying), [crying]);

  return <p data-testid="dog">강아지 "{repeatedBarked}"</p>;
}

export function Cat({ crying }: TCryingProps) {
  const repeatedMeow = useMemo(() => repeatMeow(crying), [crying]);

  return <p data-testid="cat">고양이 "{repeatedMeow}"</p>;
}
