import {useState} from "react";

export function useMyRef<T>(initValue: T | null) {
  return useState({current: initValue})[0];
}
