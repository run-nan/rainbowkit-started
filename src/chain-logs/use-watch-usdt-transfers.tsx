import { useWatchContractEvent } from "wagmi";
import { USDT_ABI, USDT_CA } from "../constants/usdt";
import { App, Descriptions, Typography } from "antd";

export const useWatchUsdtTransfers = () => {
  const { notification } = App.useApp();
  useWatchContractEvent({
    address: USDT_CA,
    abi: USDT_ABI,
    eventName: "Transfer",
    onLogs(logs) {
      logs.slice(0, 3).forEach((log) => {
        notification.open({
          message: (
            <Descriptions size="small" title="USDT Transfer" column={1}>
              <Descriptions.Item label="from">
                <Typography.Text ellipsis copyable>
                  {log.args.from}
                </Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="to">
                <Typography.Text ellipsis copyable>
                  {log.args.to}
                </Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="amount">
                ${Number(log.args.value) / 10 ** 6}
              </Descriptions.Item>
            </Descriptions>
          ),
        });
      });
    },
  });
};
