import { view } from "ezmodel/react";
import SubmitForm from "../components/SubmitForm";

const PartyAPage = view(() => {
  return (
    <div>
      <div className="text-xl dark:text-white">Party A</div>
      <SubmitForm />
    </div>
  );
});

export default PartyAPage;
