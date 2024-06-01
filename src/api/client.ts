import { alter, model } from "ezmodel";
import axios from "axios";
import { Respond, Settlement } from "../types";

const POLLING_INTERVAL = 500;

/**
 * define client business logic
 */
export const client = model({
  async fetchSettlement() {
    const res = await axios.get("/api/status");
    return res.data as Settlement | undefined;
  },
  get settlement(): Promise<Settlement | undefined> {
    return this.fetchSettlement();
  },
  /**
   * do polling for every 500ms to sync latest settlement info
   * @returns
   */
  pooling() {
    const timer = setInterval(async () => {
      const nextSettlement = await this.fetchSettlement();
      alter(this, { settlement: () => nextSettlement });
    }, POLLING_INTERVAL);

    return () => {
      clearInterval(timer);
    };
  },
  async respond(type: Respond, comment?: string) {
    await axios.post("/api/respond", { comment, response: type });
  },
  async submit(amount: number) {
    await axios.post("/api/submit", { amount });
  },
});
