import { createServer } from "miragejs";
import { RespondSchema, Settlement, SettlementSchema } from "../types";
import { ZodType, z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromJSON = <T extends ZodType<any, any, any>>(type: T) =>
  z
    .string()
    .transform((value) => {
      return JSON.parse(value);
    })
    .pipe(type) as T;

const SubmitPayloadVal = fromJSON(
  z.object({ amount: SettlementSchema.shape.amount })
);

const RespondPayloadVal = fromJSON(
  z.object({
    comment: SettlementSchema.shape.comment,
    response: RespondSchema,
  })
);

let currentSettlement: Settlement | undefined;

createServer({
  routes() {
    this.post("/api/submit", async (_schema, request) => {
      const { amount } = SubmitPayloadVal.parse(request.requestBody);
      if (currentSettlement?.stage == "approved") {
        throw new Error("The settlement is approved. No changes can be made.");
      }
      currentSettlement = { stage: "submitted", amount };
    });

    this.get("/api/status", async () => currentSettlement);

    this.post("/api/respond", async (_schema, request) => {
      if (!currentSettlement) {
        throw new Error("No settlement submitted");
      }
      if (currentSettlement.stage == "approved") {
        throw new Error("The settlement is approved. No changes can be made.");
      }

      const { response, comment } = RespondPayloadVal.parse(
        request.requestBody
      );

      currentSettlement = {
        amount: currentSettlement.amount,
        comment,
        stage: response === "approve" ? "approved" : "rejected",
      };
    });
  },
});
