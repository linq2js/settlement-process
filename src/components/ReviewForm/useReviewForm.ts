import { wait } from "ezmodel";
import { client } from "../../api/client";
import { useStable } from "ezmodel/react";
import { SettlementSchema } from "../../types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const FormDataSchema = z.object({ comment: SettlementSchema.shape.comment });
type FormData = z.infer<typeof FormDataSchema>;

const defaultValues: FormData = { comment: "" };

export const useReviewForm = () => {
  const settlement = wait(client.settlement);
  const form = useForm<FormData>({
    defaultValues,
    resolver: zodResolver(FormDataSchema),
  });

  const callbacks = useStable({
    async approve() {
      await client.respond("approve", form.getValues().comment);
    },
    async reject() {
      await client.respond("reject", form.getValues().comment);
    },
  });

  return {
    amount: settlement?.amount,
    stage: settlement?.stage,
    form,
    ...callbacks,
  };
};
