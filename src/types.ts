import z from "zod";

export const SettlementSchema = z.object({
  comment: z.string().optional(),
  amount: z.coerce.number(),
  stage: z.union([
    z.literal("submitted"),
    z.literal("approved"),
    z.literal("rejected"),
  ]),
});
export type Settlement = z.infer<typeof SettlementSchema>;

export const PartySchema = z.union([z.literal("partyA"), z.literal("partyB")]);
export type Party = z.infer<typeof PartySchema>;

export const RespondSchema = z.union([
  z.literal("approve"),
  z.literal("reject"),
]);
export type Respond = z.infer<typeof RespondSchema>;
