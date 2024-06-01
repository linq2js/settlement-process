import { useSubmitForm } from "./useSubmitForm";
import { view } from "ezmodel/react";
import { loadable, wait } from "ezmodel";
import { client } from "../../api/client";
import { ErrorMessage } from "../ErrorMessage";

const SubmitFormInternal = view(() => {
  const { onSubmit, form } = useSubmitForm();
  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={form.formState.isLoading}>
        <div className="pb-2">
          <input
            type="text"
            {...form.register("amount")}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        {form.formState.errors.amount?.message && (
          <div style={{ color: "red" }}>
            {form.formState.errors.amount?.message}
          </div>
        )}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </fieldset>
    </form>
  );
});

const SettlementInfo = view(() => {
  const statement = wait(client.settlement);
  if (!statement?.stage || statement.stage === "submitted") {
    return <></>;
  }
  if (statement.stage === "approved") {
    return (
      <div className="text-green-500">Your settlement has been approved</div>
    );
  }
  return (
    <ErrorMessage
      message={`Your settlement has been ${statement.stage}. ${
        statement.comment && `Reason: ${statement.comment}`
      }`}
    />
  );
});

export const SubmitForm = view(() => {
  const { data } = loadable(client.settlement);
  const isApproved = data?.stage !== "approved";

  return (
    <>
      {isApproved && <SubmitFormInternal />}
      <SettlementInfo />
    </>
  );
});
