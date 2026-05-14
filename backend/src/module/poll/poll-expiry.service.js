import { Poll } from "./poll.model.js";

const getExpiredActivePollFilter = () => ({
  status: "active",
  pollEndTime: { $ne: null, $lte: new Date() },
});

const expireActivePolls = async () => {
  return Poll.updateMany(getExpiredActivePollFilter(), {
    $set: { status: "ended" },
  });
};

const expirePollIfNeeded = async (poll) => {
  if (
    poll?.status === "active" &&
    poll.pollEndTime &&
    poll.pollEndTime.getTime() <= Date.now()
  ) {
    poll.status = "ended";
    await poll.save();
  }

  return poll;
};

export { expireActivePolls, expirePollIfNeeded };
