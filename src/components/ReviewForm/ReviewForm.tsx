import { view } from "ezmodel/react";
import { useReviewForm } from "./useReviewForm";

const SettlementInfo = view(() => {
  const { amount, stage, approve, reject, form } = useReviewForm();

  if (!stage || stage === "approved" || stage !== "submitted") {
    return <div>No settlement</div>;
  }
  return (
    <div>
      <h2 className="pb-2 text-lg">Amount: {amount}</h2>
      <div className="pb-2">
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Leave the comment"
          {...form.register("comment")}
        />
      </div>
      <button
        onClick={approve}
        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Approve
      </button>
      <button
        onClick={reject}
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      >
        Reject
      </button>
    </div>
  );
});

export const ReviewForm = view(() => {
  return <SettlementInfo />;
});
