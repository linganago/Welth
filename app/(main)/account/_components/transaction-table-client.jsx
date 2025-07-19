"use client";

import dynamic from "next/dynamic";
import { BarLoader } from "react-spinners";

const TransactionTable = dynamic(() => import("./transaction-table"), {
  ssr: false,
  loading: () => <BarLoader className="mt-4" width="100%" color="#9333ea" />,
});

export default function TransactionTableClient({ transactions }) {
  return <TransactionTable transactions={transactions} />;
}
