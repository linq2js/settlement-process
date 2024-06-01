import { view } from "ezmodel/react";
import ApproveForm from "../components/ReviewForm";

const PartyBPage = view(() => {
  return (
    <div>
      <div className="text-xl dark:text-white">Party B</div>
      <ApproveForm />
    </div>
  );
});

export default PartyBPage;
