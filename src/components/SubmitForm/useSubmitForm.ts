import { SettlementSchema } from "../../types";
import { client } from "../../api/client";
import { useStable } from "ezmodel/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FormDataSchema = z.object({ amount: SettlementSchema.shape.amount });
type FormData = z.infer<typeof FormDataSchema>;

const defaultValues: FormData = { amount: 0 };

export const useSubmitForm = () => {
  const form = useForm<FormData>({
    defaultValues,
    resolver: zodResolver(FormDataSchema),
  });
  const { onValid } = useStable({
    async onValid() {
      await client.submit(form.getValues().amount);
      alert("Your settlement has been submitted");
    },
  });

  return {
    /**
     * form utils
     */
    form,
    onSubmit: form.handleSubmit(onValid),
  };
};
