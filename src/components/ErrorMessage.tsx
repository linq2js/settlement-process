import { view } from "ezmodel/react";

export type ErrorMessageProps = { message?: string };

export const ErrorMessage = view((props) => {
  return <div className="text-red-500 pt-2">{props.message}</div>;
});
