export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refreshToken: "/auth/refresh-token",
    logout: "/auth/logout",
    verifyEmail: (token) => `/auth/verify-email/${token}`,
    forgotPassword: "/auth/forgot-password",
    resetPassword: (token) => `/auth/reset-password/${token}`,
    me: "/auth/me",
  },
  polls:{
    create: "/polls",
    myPolls: "/polls/my-polls",
    byId: (pollId)=> `/polls/${pollId}`,
    publishResults: (pollId)=> `/polls/${pollId}/publish-results`,
    question: (pollId)=> `/polls/${pollId}/question`,
    publicPoll: (shareCode)=> `/public/polls/${shareCode}`,
    vote: "/votes",
    analytics: (analyticsCode)=> `/public/analytics/${analyticsCode}`,
  }
};
