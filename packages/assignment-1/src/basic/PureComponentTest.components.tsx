import { repeatBarked, repeatMeow } from "./UseMemoTest.utils.ts";

type TCryingProps = {
  crying: number;
}

export function Dog({ crying }: TCryingProps) {
  return (
    <p data-testid="dog">강아지 "{repeatBarked(crying)}"</p>
  );
}

export function Cat({ crying }: TCryingProps) {
  return (
    <p data-testid="cat">고양이 "{repeatMeow(crying)}"</p>
  );
}
