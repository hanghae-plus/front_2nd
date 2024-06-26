import { useState } from 'react'


export const useMyRef = ((initValue) => {
  const ref = { current: initValue };
  return () => ref;
})();