"use client";

import { useEffect, useMemo, useState } from "react";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/lib/firebase";
import PollResults from "@/components/polls/PollResults";

export default function PollBox({ poll }) {
  const pollId = poll?.id || "";

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [options, setOptions] = useState([]);
  const [voted, setVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingVote, setCheckingVote] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!poll) return;

    const normalizedOptions = Array.isArray(poll.options)
      ? poll.options.map((option) => ({
          label: option.label || "",
          votes: Number(option.votes || 0),
        }))
      : [];

    setOptions(normalizedOptions);
  }, [poll]);

  useEffect(() => {
    const checkUserVote = async () => {
      try {
        setCheckingVote(true);

        const auth = getAuth();
        const user = auth.currentUser;

        if (!pollId || !user?.uid) {
          setCheckingVote(false);
          return;
        }

        const voteRef = doc(db, "polls", pollId, "votes", user.uid);
        const voteSnapshot = await getDoc(voteRef);

        if (voteSnapshot.exists()) {
          const voteData = voteSnapshot.data();
          setVoted(true);
          setUserVote(voteData);
          setSelectedOptionIndex(Number(voteData.optionIndex));
        }
      } catch (error) {
        console.error("checkUserVote error:", error);
        setMessage("Could not check your previous vote.");
      } finally {
        setCheckingVote(false);
      }
    };

    checkUserVote();
  }, [pollId]);

  const totalVotes = useMemo(() => {
    return options.reduce(
      (total, option) => total + Number(option.votes || 0),
      0
    );
  }, [options]);

  const pollWithResults = {
    ...poll,
    options,
    totalVotes,
  };

  const handleVote = async () => {
    setMessage("");

    if (!pollId) {
      setMessage("Poll ID is missing.");
      return;
    }

    if (selectedOptionIndex === null) {
      setMessage("Please select an option.");
      return;
    }

    if (voted || loading) return;

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user?.uid) {
      setMessage("Please login to vote.");
      return;
    }

    try {
      setLoading(true);

      const pollRef = doc(db, "polls", pollId);
      const voteRef = doc(db, "polls", pollId, "votes", user.uid);

      let finalOptions = [];
      let finalVote = null;

      await runTransaction(db, async (transaction) => {
        const pollSnapshot = await transaction.get(pollRef);
        const voteSnapshot = await transaction.get(voteRef);

        if (!pollSnapshot.exists()) {
          throw new Error("Poll not found.");
        }

        if (voteSnapshot.exists()) {
          throw new Error("You have already voted.");
        }

        const pollData = pollSnapshot.data();

        const currentOptions = Array.isArray(pollData.options)
          ? pollData.options.map((option) => ({
              label: option.label || "",
              votes: Number(option.votes || 0),
            }))
          : [];

        const selectedOption = currentOptions[selectedOptionIndex];

        if (!selectedOption) {
          throw new Error("Invalid poll option.");
        }

        const updatedOptions = currentOptions.map((option, index) => {
          if (index === selectedOptionIndex) {
            return {
              ...option,
              votes: Number(option.votes || 0) + 1,
            };
          }

          return {
            ...option,
            votes: Number(option.votes || 0),
          };
        });

        const currentTotalVotes = Number(pollData.totalVotes || 0);

        transaction.update(pollRef, {
          options: updatedOptions,
          totalVotes: currentTotalVotes + 1,
          updatedAt: serverTimestamp(),
        });

        const votePayload = {
          userId: user.uid,
          userEmail: user.email || "",
          optionIndex: selectedOptionIndex,
          optionLabel: selectedOption.label,
          votedAt: serverTimestamp(),
        };

        transaction.set(voteRef, votePayload);

        finalOptions = updatedOptions;
        finalVote = {
          userId: user.uid,
          userEmail: user.email || "",
          optionIndex: selectedOptionIndex,
          optionLabel: selectedOption.label,
        };
      });

      setOptions(finalOptions);
      setUserVote(finalVote);
      setVoted(true);
      setMessage("Thank you for voting.");
    } catch (error) {
      console.error("Poll vote failed:", error);
      setMessage(error.message || "Failed to submit your vote.");
    } finally {
      setLoading(false);
    }
  };

  if (!poll || poll.status !== "active") {
    return null;
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Reader Poll
        </p>

        <h3 className="mt-2 text-xl font-semibold text-slate-900">
          {poll.question || "What do you think about this issue?"}
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-600">
          Cast your vote and see the result percentage.
        </p>
      </div>

      {!voted && (
        <>
          <div className="space-y-3">
            {options.map((option, index) => {
              const isSelected = selectedOptionIndex === index;

              return (
                <button
                  key={`${option.label}-${index}`}
                  type="button"
                  disabled={loading || checkingVote}
                  onClick={() => setSelectedOptionIndex(index)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                    isSelected
                      ? "border-amber-300 bg-amber-50 text-amber-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  } disabled:cursor-not-allowed`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleVote}
              disabled={selectedOptionIndex === null || loading || checkingVote}
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {checkingVote
                ? "Checking..."
                : loading
                ? "Submitting..."
                : "Submit Vote"}
            </button>
          </div>
        </>
      )}

      {message && (
        <p className="mt-4 text-sm font-medium text-slate-600">{message}</p>
      )}

      {voted && (
        <>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">
              You voted:{" "}
              <span className="font-semibold text-slate-900">
                {userVote?.optionLabel ||
                  options[selectedOptionIndex]?.label ||
                  "Selected option"}
              </span>
            </p>
          </div>

          <PollResults poll={pollWithResults} />
        </>
      )}
    </section>
  );
}