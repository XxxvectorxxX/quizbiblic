export type UserRole = "admin" | "supervisor" | "user"
export type UserStatus = "active" | "banned" | "suspended" | "penalized"
export type AgeGroup = "kids" | "teens" | "young_adults" | "adults"
export type Denomination = "universal" | "baptist" | "pentecostal" | "catholic" | "presbyterian" | "methodist" | "adventist"
export type Difficulty = "easy" | "medium" | "hard"
export type QuestionType = "multiple_choice"
export type TournamentStatus = "upcoming" | "in_progress" | "finished" | "cancelled"
export type MatchStatus = "scheduled" | "in_progress" | "finished"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  church_id: string | null
  age_group: AgeGroup
  denomination: Denomination
  avatar_url: string | null
  xp: number
  total_correct: number
  total_wrong: number
  total_quizzes: number
  created_at: string
}

export interface Church {
  id: string
  name: string
  denomination: Denomination
  city: string
  state: string
  total_members: number
  total_points: number
  tournaments_participated: number
  created_at: string
}

export interface Tournament {
  id: string
  name: string
  description: string
  status: TournamentStatus
  start_date: string
  end_date: string | null
  age_group: AgeGroup
  denomination: Denomination
  team_size: number
  answer_time: number
  total_teams: number
  created_by: string
  created_at: string
}

export interface Team {
  id: string
  name: string
  tournament_id: string
  church_id: string
  church_name: string
  members: TeamMember[]
  points: number
  wins: number
  losses: number
}

export interface TeamMember {
  id: string
  user_id: string
  name: string
  role: "captain" | "player"
}

export interface Match {
  id: string
  tournament_id: string
  round: string
  team_a: { id: string; name: string; score: number }
  team_b: { id: string; name: string; score: number }
  status: MatchStatus
  scheduled_at: string
  winner_id: string | null
}

export interface Question {
  id: string
  text: string
  options: { label: string; text: string }[]
  correct_option: string
  bible_reference: string
  difficulty: Difficulty
  age_group: AgeGroup
  denomination: Denomination
  type: QuestionType
  tags: string[]
  times_used: number
  times_correct: number
  created_by: string
  created_at: string
}

export interface QuizSession {
  id: string
  user_id: string
  questions: Question[]
  answers: QuizAnswer[]
  current_index: number
  score: number
  total_correct: number
  total_wrong: number
  difficulty: Difficulty
  age_group: AgeGroup
  denomination: Denomination
  started_at: string
  finished_at: string | null
}

export interface QuizAnswer {
  question_id: string
  selected_option: string
  is_correct: boolean
  time_taken: number
}

export interface Penalty {
  id: string
  user_id: string
  user_name: string
  type: "ban" | "suspension" | "warning"
  reason: string
  applied_by: string
  applied_at: string
  expires_at: string | null
}

export interface Permission {
  role: UserRole
  module: string
  actions: { view: boolean; create: boolean; edit: boolean; delete: boolean }
}

export interface ActivityLog {
  id: string
  user_name: string
  action: string
  target: string
  timestamp: string
}

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  kids: "Crianças (7-11)",
  teens: "Adolescentes (12-17)",
  young_adults: "Jovens (18-30)",
  adults: "Adultos (31+)",
}

export const DENOMINATION_LABELS: Record<Denomination, string> = {
  universal: "Universal (Todas)",
  baptist: "Batista",
  pentecostal: "Pentecostal",
  catholic: "Católica",
  presbyterian: "Presbiteriana",
  methodist: "Metodista",
  adventist: "Adventista",
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Média",
  hard: "Difícil",
}

export const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  upcoming: "Em Breve",
  in_progress: "Em Andamento",
  finished: "Finalizado",
  cancelled: "Cancelado",
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  supervisor: "Supervisor",
  user: "Usuário",
}
