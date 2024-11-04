import { useEffect } from "react";
import { useImmer } from "use-immer";

// 用LocalStorage模拟DB
export const MockDB = {
  set: (key: string, value: unknown) => {
    localStorage.setItem(
      `mock-db.${key}`,
      JSON.stringify(value, (_key, value) => {
        if (typeof value === "bigint") {
          return `$bigInt$${value.toString()}`;
        }
        return value;
      })
    );
  },
  get: (key: string) => {
    const value = localStorage.getItem(`mock-db.${key}`);
    return value
      ? JSON.parse(value, (_key, value) => {
          if (typeof value === "string" && value.startsWith("$bigInt$")) {
            return BigInt(value.slice("$bigInt$".length));
          }
          return value;
        })
      : null;
  },
};

export const useMockDBData = <T>(key: string, defaultValue: T) => {
  const [data, setData] = useImmer<T>(MockDB.get(key) ?? defaultValue);
  useEffect(() => {
    MockDB.set(key, data);
  }, [data, key]);
  return [data, setData] as const;
};
