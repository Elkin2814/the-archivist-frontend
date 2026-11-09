import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import LeadersLayout from './pages/leaders/LeadersLayout.jsx'
import LeadersIndex from './pages/leaders/LeadersIndex.jsx'
import LeaderDetail from './pages/leaders/LeaderDetail.jsx'
import LeaderOverview from './pages/leaders/LeaderOverview.jsx'
import LeaderMatchups from './pages/leaders/LeaderMatchups.jsx'
import LeaderBuilds from './pages/leaders/LeaderBuilds.jsx'
import LeaderStrategy from './pages/leaders/LeaderStrategy.jsx'
import PlayersSearch from './pages/players/PlayersSearch.jsx'
import PlayerProfile from './pages/players/PlayerProfile.jsx'
import PlayerOverview from './pages/players/PlayerOverview.jsx'
import PlayerHistory from './pages/players/PlayerHistory.jsx'
import RankingsLayout, { RankingsTop, RankingsDistribution, RankingsRecords } from './pages/rankings/RankingsPages.jsx'
import StatsLayout, { StatsLeaders, StatsMaps, StatsUnits, StatsModes } from './pages/stats/StatsPages.jsx'
import SynergyPage from './pages/SynergyPage.jsx'
import GuidesPage from './pages/GuidesPage.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="leaders" element={<LeadersLayout />}>
          <Route index element={<LeadersIndex />} />
          <Route path=":leaderKey" element={<LeaderDetail />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<LeaderOverview />} />
            <Route path="matchups" element={<LeaderMatchups />} />
            <Route path="builds" element={<LeaderBuilds />} />
            <Route path="strategy" element={<LeaderStrategy />} />
          </Route>
        </Route>

        <Route path="players" element={<PlayersSearch />} />
        <Route path="players/:gamertag" element={<PlayerProfile />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<PlayerOverview />} />
          <Route path="history" element={<PlayerHistory />} />
        </Route>

        <Route path="rankings" element={<RankingsLayout />}>
          <Route index element={<Navigate to="top" replace />} />
          <Route path="top" element={<RankingsTop />} />
          <Route path="distribution" element={<RankingsDistribution />} />
          <Route path="records" element={<RankingsRecords />} />
        </Route>

        <Route path="stats" element={<StatsLayout />}>
          <Route index element={<Navigate to="leaders" replace />} />
          <Route path="leaders" element={<StatsLeaders />} />
          <Route path="maps" element={<StatsMaps />} />
          <Route path="units" element={<StatsUnits />} />
          <Route path="modes" element={<StatsModes />} />
        </Route>

        <Route path="synergy" element={<SynergyPage />} />
        <Route path="guides" element={<GuidesPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
