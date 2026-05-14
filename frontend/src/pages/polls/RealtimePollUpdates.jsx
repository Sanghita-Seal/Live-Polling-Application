import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageWrapper from "../../components/layout/PageWrapper.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import GradientButton from "../../components/ui/GradientButton.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { pollService } from "../../features/polls/polls.service.js";
import { authStorage } from "../../features/auth/auth.storage.js";
import { getErrorMessage } from "../../utils/errorHandler.js";
import { formatDateTime } from "../../utils/poll.utils.js";

const COLORS = ["#29d3a8", "#7aa7ff", "#ffd166", "#ff7b7b"];

function getSocketUrl() {
  const configuredUrl = import.meta.env.VITE_SOCKET_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (apiBaseUrl?.startsWith("http")) {
    return apiBaseUrl.replace(/\/api\/?$/, "");
  }

  return "http://localhost:8080";
}

function RealtimePollUpdates() {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const totalOptions = useMemo(
    () => questions.reduce((sum, question) => sum + question.options.length, 0),
    [questions],
  );

  const loadAnalytics = useCallback(
    async () => {
      try {
        const response = await pollService.getRealtimeAnalytics(pollId);
        setPoll(response.data?.poll || null);
        setQuestions(response.data?.questions || []);
        setLastUpdatedAt(new Date());
      } catch (err) {
        setError(getErrorMessage(err, "Realtime analytics could not be loaded"));
      } finally {
        setIsLoading(false);
      }
    },
    [pollId],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadAnalytics();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAnalytics]);

  useEffect(() => {
    const socket = io(getSocketUrl(), {
      withCredentials: true,
      auth: {
        token: authStorage.getAccessToken(),
      },
    });

    socket.on("connect", () => {
      setIsConnected(true);
      setHasJoinedRoom(false);
      socket.emit("join-poll-room", pollId);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setHasJoinedRoom(false);
    });

    socket.on("poll-room-joined", () => {
      setHasJoinedRoom(true);
      setError("");
    });

    socket.on("poll-vote-updated", (analytics) => {
      setPoll(analytics.poll || null);
      setQuestions(analytics.questions || []);
      setLastUpdatedAt(new Date());
    });

    socket.on("poll-room-error", (message) => {
      setHasJoinedRoom(false);
      setError(message);
    });

    return () => {
      socket.emit("leave-poll-room", pollId);
      socket.disconnect();
    };
  }, [pollId]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadAnalytics();
    }, 2500);

    return () => window.clearInterval(intervalId);
  }, [loadAnalytics]);

  if (isLoading) {
    return <LoadingSpinner label="Loading realtime updates" />;
  }

  return (
    <PageWrapper>
      <main className="dashboard-main narrow-main">
        <GlassCard>
          <div className="builder-header">
            <div>
              <p className="eyebrow">Realtime updates</p>
              <div className="poll-title-line">
                <h1>{poll?.pollName || "Poll analytics"}</h1>
                <StatusBadge status={poll?.status} />
              </div>
              <p>{poll?.pollDescription}</p>
              <div className="poll-meta">
                <span>{poll?.totalVotes || 0} votes</span>
                <span>{poll?.totalParticipants || 0} participants</span>
                <span>{questions.length} questions</span>
                <span>{totalOptions} options</span>
                <span>{hasJoinedRoom ? "Live connected" : isConnected ? "Joining live room" : "Reconnecting"}</span>
                <span>Updated {lastUpdatedAt ? formatDateTime(lastUpdatedAt) : "Not yet"}</span>
              </div>
            </div>
            <GradientButton as={Link} to={`/polls/${pollId}/builder`} className="small-button">
              Manage poll
            </GradientButton>
          </div>
        </GlassCard>

        {error ? <p className="form-error">{error}</p> : null}

        <section className="stats-grid">
          <GlassCard>
            <p className="stat-label">Total votes</p>
            <strong>{poll?.totalVotes || 0}</strong>
          </GlassCard>
          <GlassCard>
            <p className="stat-label">Participants</p>
            <strong>{poll?.totalParticipants || 0}</strong>
          </GlassCard>
          <GlassCard>
            <p className="stat-label">Connection</p>
            <strong>{hasJoinedRoom ? "Live" : isConnected ? "Joining" : "Offline"}</strong>
          </GlassCard>
        </section>

        {questions.map((question) => {
          const chartData = question.options.map((option) => ({
            name: option.text,
            votes: option.votes || 0,
          }));
          const total = chartData.reduce((sum, option) => sum + option.votes, 0);

          return (
            <GlassCard key={question.id}>
              <div className="card-heading">
                <div>
                  <p className="eyebrow">{question.isRequired === false ? "Optional" : "Mandatory"}</p>
                  <h2>
                    {question.questionNumber}. {question.question}
                  </h2>
                </div>
                <span>{total} votes</span>
              </div>

              <div className="realtime-chart-grid">
                <div className="chart-panel">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                      <XAxis dataKey="name" stroke="#93a4ba" />
                      <YAxis allowDecimals={false} stroke="#93a4ba" />
                      <Tooltip />
                      <Bar dataKey="votes" fill="#29d3a8" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-panel">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={chartData} dataKey="votes" nameKey="name" outerRadius={92} label>
                        {chartData.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </main>
    </PageWrapper>
  );
}

export default RealtimePollUpdates;
