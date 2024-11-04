import { ReactNode, useCallback } from "react";
import { App } from "antd";

export const useConfirm = () => {
  const { modal } = App.useApp();
  return useCallback(
    (content: ReactNode) => {
      return new Promise((resolve) => {
        modal.confirm({
          content,
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
    },
    [modal]
  );
};
