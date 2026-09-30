interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface UserStats {
  name: string;
  login: string;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalRepos: number;
  contributedTo: number;
}

export interface LanguageStat {
  name: string;
  color: string;
  size: number;
  percentage: number;
}

export interface StreakStats {
  totalContributions: number;
  currentStreak: {
    count: number;
    start: string;
    end: string;
  };
  longestStreak: {
    count: number;
    start: string;
    end: string;
  };
  firstContributionDate: string;
}

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

async function fetchGitHubGraphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not defined.');
  }

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      'Content-Type': 'application/json',
      'User-Agent': 'github-readme-stats-custom',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 }, // 1 hora de cache no Next.js
  });

  if (!response.ok) {
    throw new Error(`GitHub API HTTP error: ${response.status} ${response.statusText}`);
  }

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(`GitHub GraphQL error: ${json.errors[0].message}`);
  }

  if (!json.data) {
    throw new Error('No data received from GitHub API.');
  }

  return json.data;
}

const USER_DATA_QUERY = `
query userInfo($login: String!) {
  user(login: $login) {
    name
    login
    createdAt
    repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
      totalCount
    }
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoryContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        name
        stargazerCount
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}
`;

interface RawUserQuery {
  user: {
    name: string | null;
    login: string;
    createdAt: string;
    repositoriesContributedTo: { totalCount: number };
    contributionsCollection: {
      totalCommitContributions: number;
      restrictedContributionsCount: number;
      totalPullRequestContributions: number;
      totalIssueContributions: number;
      totalRepositoryContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            contributionCount: number;
            date: string;
          }>;
        }>;
      };
    };
    repositories: {
      totalCount: number;
      nodes: Array<{
        name: string;
        stargazerCount: number;
        languages: {
          edges: Array<{
            size: number;
            node: {
              name: string;
              color: string | null;
            };
          }>;
        };
      }>;
    };
  } | null;
}

export async function getGitHubStats(username: string): Promise<{
  stats: UserStats;
  languages: LanguageStat[];
  streak: StreakStats;
  weeks: Array<{ contributionDays: Array<{ date: string; count: number }> }>;
}> {
  const data = await fetchGitHubGraphQL<RawUserQuery>(USER_DATA_QUERY, { login: username });

  if (!data.user) {
    throw new Error(`User "${username}" not found.`);
  }

  const u = data.user;
  const weeks = u.contributionsCollection.contributionCalendar.weeks.map((w) => ({
    contributionDays: w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
    })),
  }));

  // 1. General Stats
  const totalStars = u.repositories.nodes.reduce((acc, repo) => acc + repo.stargazerCount, 0);
  const totalCommits =
    u.contributionsCollection.totalCommitContributions +
    u.contributionsCollection.restrictedContributionsCount;
  const totalPRs = u.contributionsCollection.totalPullRequestContributions;
  const totalIssues = u.contributionsCollection.totalIssueContributions;
  const totalRepos = u.repositories.totalCount;
  const contributedTo = u.repositoriesContributedTo.totalCount;

  const stats: UserStats = {
    name: u.name || u.login,
    login: u.login,
    totalStars,
    totalCommits,
    totalPRs,
    totalIssues,
    totalRepos,
    contributedTo,
  };

  // 2. Languages Stats
  const langMap = new Map<string, { size: number; color: string }>();
  let totalLangSize = 0;

  for (const repo of u.repositories.nodes) {
    for (const edge of repo.languages.edges) {
      const name = edge.node.name;
      const color = edge.node.color || '#fabd2f';
      const size = edge.size;

      totalLangSize += size;
      const current = langMap.get(name);
      if (current) {
        current.size += size;
      } else {
        langMap.set(name, { size, color });
      }
    }
  }

  const languages: LanguageStat[] = Array.from(langMap.entries())
    .map(([name, info]) => ({
      name,
      color: info.color,
      size: info.size,
      percentage: totalLangSize > 0 ? (info.size / totalLangSize) * 100 : 0,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 6);

  // 3. Streak Stats
  const allDays: Array<{ date: string; count: number }> = [];
  for (const week of u.contributionsCollection.contributionCalendar.weeks) {
    for (const day of week.contributionDays) {
      allDays.push({ date: day.date, count: day.contributionCount });
    }
  }

  allDays.sort((a, b) => a.date.localeCompare(b.date));

  let longestStreakCount = 0;
  let longestStreakStart = '';
  let longestStreakEnd = '';

  let tempStreakCount = 0;
  let tempStreakStart = '';

  for (let i = 0; i < allDays.length; i++) {
    const day = allDays[i];
    if (day.count > 0) {
      if (tempStreakCount === 0) {
        tempStreakStart = day.date;
      }
      tempStreakCount++;
      if (tempStreakCount > longestStreakCount) {
        longestStreakCount = tempStreakCount;
        longestStreakStart = tempStreakStart;
        longestStreakEnd = day.date;
      }
    } else {
      tempStreakCount = 0;
    }
  }

  // Current Streak Calculation
  let currentStreakCount = 0;
  let currentStreakStart = '';
  let currentStreakEnd = '';

  // Get index from the end
  const todayStr = new Date().toISOString().split('T')[0];
  let checkIdx = allDays.length - 1;

  // Se o último dia registrado não tiver contribuição mas for hoje, verificamos se ontem teve
  if (checkIdx >= 0 && allDays[checkIdx].count === 0 && allDays[checkIdx].date === todayStr) {
    checkIdx--; // Tolera ainda não ter commitado hoje
  }

  while (checkIdx >= 0 && allDays[checkIdx].count > 0) {
    if (currentStreakCount === 0) {
      currentStreakEnd = allDays[checkIdx].date;
    }
    currentStreakStart = allDays[checkIdx].date;
    currentStreakCount++;
    checkIdx--;
  }

  const streak: StreakStats = {
    totalContributions: u.contributionsCollection.contributionCalendar.totalContributions,
    currentStreak: {
      count: currentStreakCount,
      start: currentStreakStart || todayStr,
      end: currentStreakEnd || todayStr,
    },
    longestStreak: {
      count: longestStreakCount,
      start: longestStreakStart || todayStr,
      end: longestStreakEnd || todayStr,
    },
    firstContributionDate: u.createdAt.split('T')[0],
  };

  return { stats, languages, streak, weeks };
}
